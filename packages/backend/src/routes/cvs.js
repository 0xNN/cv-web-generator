const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../db');
const { verifyToken } = require('../middleware/auth');
const { generatePDF } = require('../utils/pdfGenerator');

// Protect all routes under /api/cvs with JWT token validation
router.use(verifyToken);

/**
 * @route   POST /api/cvs
 * @desc    Create a new CV
 * @access  Private (Authenticated)
 */
router.post('/', async (req, res, next) => {
  try {
    const { title, template_id, data } = req.body;

    if (!title || !template_id || !data) {
      return res.status(400).json({ error: 'Please provide title, template_id, and data.' });
    }

    const id = crypto.randomUUID();
    const dataString = typeof data === 'object' ? JSON.stringify(data) : data;

    const insertSql = `
      INSERT INTO cvs (id, user_id, title, template_id, data)
      VALUES (
        ${db.escape(id)},
        ${db.escape(req.user.id)},
        ${db.escape(title.trim())},
        ${db.escape(template_id.trim())},
        ${db.escape(dataString)}
      )
    `;

    await db.query(insertSql);

    return res.status(201).json({
      message: 'CV created successfully.',
      cv: {
        id,
        user_id: req.user.id,
        title,
        template_id,
        data: typeof data === 'string' ? JSON.parse(data) : data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    });

  } catch (err) {
    next(err);
  }
});

/**
 * @route   GET /api/cvs
 * @desc    Get all CVs belonging to the authenticated user
 * @access  Private (Authenticated)
 */
router.get('/', async (req, res, next) => {
  try {
    const selectSql = `
      SELECT id, user_id, title, template_id, data, created_at, updated_at
      FROM cvs
      WHERE user_id = ${db.escape(req.user.id)}
      ORDER BY updated_at DESC
    `;

    const cvs = await db.query(selectSql);

    // Parse the data JSON string back into objects for response
    const parsedCvs = (cvs || []).map((cv) => {
      try {
        return {
          ...cv,
          data: JSON.parse(cv.data)
        };
      } catch (e) {
        return cv;
      }
    });

    return res.json(parsedCvs);

  } catch (err) {
    next(err);
  }
});

/**
 * @route   GET /api/cvs/:id
 * @desc    Get details of a single CV
 * @access  Private (Authenticated)
 */
router.get('/:id', async (req, res, next) => {
  try {
    const selectSql = `
      SELECT * FROM cvs
      WHERE id = ${db.escape(req.params.id)} AND user_id = ${db.escape(req.user.id)}
      LIMIT 1
    `;

    const cvs = await db.query(selectSql);

    if (!cvs || cvs.length === 0) {
      return res.status(404).json({ error: 'CV not found.' });
    }

    const cv = cvs[0];
    try {
      cv.data = JSON.parse(cv.data);
    } catch (e) {
      // Keep as string if parsing fails
    }

    return res.json(cv);

  } catch (err) {
    next(err);
  }
});

/**
 * @route   PUT /api/cvs/:id
 * @desc    Update a CV's title, template_id, or content
 * @access  Private (Authenticated)
 */
router.put('/:id', async (req, res, next) => {
  try {
    const { title, template_id, data } = req.body;

    if (!title || !template_id || !data) {
      return res.status(400).json({ error: 'Please provide title, template_id, and data.' });
    }

    // 1. Verify existence and ownership
    const checkSql = `
      SELECT id FROM cvs
      WHERE id = ${db.escape(req.params.id)} AND user_id = ${db.escape(req.user.id)}
      LIMIT 1
    `;
    const checkResult = await db.query(checkSql);

    if (!checkResult || checkResult.length === 0) {
      return res.status(404).json({ error: 'CV not found.' });
    }

    // 2. Perform the update
    const dataString = typeof data === 'object' ? JSON.stringify(data) : data;
    const updateSql = `
      UPDATE cvs
      SET
        title = ${db.escape(title.trim())},
        template_id = ${db.escape(template_id.trim())},
        data = ${db.escape(dataString)},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${db.escape(req.params.id)} AND user_id = ${db.escape(req.user.id)}
    `;

    await db.query(updateSql);

    return res.json({
      message: 'CV updated successfully.',
      cv: {
        id: req.params.id,
        user_id: req.user.id,
        title,
        template_id,
        data: typeof data === 'string' ? JSON.parse(data) : data,
        updated_at: new Date().toISOString()
      }
    });

  } catch (err) {
    next(err);
  }
});

/**
 * @route   DELETE /api/cvs/:id
 * @desc    Delete a CV
 * @access  Private (Authenticated)
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const checkSql = `
      SELECT id FROM cvs
      WHERE id = ${db.escape(req.params.id)} AND user_id = ${db.escape(req.user.id)}
      LIMIT 1
    `;
    const checkResult = await db.query(checkSql);

    if (!checkResult || checkResult.length === 0) {
      return res.status(404).json({ error: 'CV not found.' });
    }

    const deleteSql = `
      DELETE FROM cvs
      WHERE id = ${db.escape(req.params.id)} AND user_id = ${db.escape(req.user.id)}
    `;

    await db.query(deleteSql);

    return res.json({ message: 'CV deleted successfully.', id: req.params.id });

  } catch (err) {
    next(err);
  }
});

/**
 * @route   POST /api/cvs/:id/export-pdf
 * @desc    Export CV content as a PDF binary attachment download
 * @access  Private (Authenticated)
 */
router.post('/:id/export-pdf', async (req, res, next) => {
  try {
    const selectSql = `
      SELECT * FROM cvs
      WHERE id = ${db.escape(req.params.id)} AND user_id = ${db.escape(req.user.id)}
      LIMIT 1
    `;

    const cvs = await db.query(selectSql);

    if (!cvs || cvs.length === 0) {
      return res.status(404).json({ error: 'CV not found.' });
    }

    const cv = cvs[0];
    const safeFilename = cv.title.replace(/[^a-zA-Z0-9]/g, '_') || 'cv_export';

    // Set standard PDF download headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}.pdf"`);

    // Stream the generated PDF directly to the client
    generatePDF(cv, res);

  } catch (err) {
    next(err);
  }
});

module.exports = router;
