const PDFDocument = require('pdfkit');

/**
 * Generates a clean, professional PDF from CV data using PDFKit.
 * Supports different styles depending on the template_id.
 * 
 * @param {object} cv - The CV object from DB
 * @param {res} res - Express response object to pipe the PDF to
 */
function generatePDF(cv, res) {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
    bufferPages: true
  });

  // Pipe the PDF directly to the Express response stream
  doc.pipe(res);

  const data = typeof cv.data === 'string' ? JSON.parse(cv.data) : cv.data;
  const { personalInfo = {}, experience = [], education = [], skills = [], languages = [] } = data;

  // Choose colors based on template_id
  let primaryColor = '#1e293b'; // Slate 800
  let secondaryColor = '#475569'; // Slate 600
  let accentColor = '#3b82f6'; // Blue 500
  let fontTitle = 'Helvetica-Bold';
  let fontBody = 'Helvetica';

  if (cv.template_id === 'tech-it') {
    primaryColor = '#312e81'; // Indigo 900
    accentColor = '#4f46e5'; // Indigo 600
  } else if (cv.template_id === 'creative-design') {
    primaryColor = '#881337'; // Rose 900
    accentColor = '#db2777'; // Pink 600
  } else if (cv.template_id === 'corporate-finance') {
    primaryColor = '#0f172a'; // Slate 900
    accentColor = '#0d9488'; // Teal 600
    fontTitle = 'Times-Bold';
    fontBody = 'Times-Roman';
  } else if (cv.template_id === 'classic-professional') {
    primaryColor = '#111827'; // Gray 900
    accentColor = '#374151'; // Gray 700
    fontTitle = 'Times-Bold';
    fontBody = 'Times-Roman';
  }

  // --- HEADER SECTION ---
  const name = personalInfo.name || 'Your Name';
  const title = personalInfo.title || '';
  const email = personalInfo.email || '';
  const phone = personalInfo.phone || '';
  const address = personalInfo.address || '';

  doc.font(fontTitle).fontSize(26).fillColor(primaryColor).text(name.toUpperCase(), { align: 'center' });
  
  if (title) {
    doc.moveDown(0.2);
    doc.font(fontBody).fontSize(14).fillColor(accentColor).text(title, { align: 'center' });
  }

  // Contact Info Line
  doc.moveDown(0.4);
  const contactParts = [];
  if (email) contactParts.push(email);
  if (phone) contactParts.push(phone);
  if (address) contactParts.push(address);
  
  doc.font(fontBody).fontSize(9).fillColor(secondaryColor).text(contactParts.join('  |  '), { align: 'center' });

  // Draw an elegant divider line
  doc.moveDown(0.8);
  doc.strokeColor(accentColor).lineWidth(1.5).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
  doc.moveDown(1);

  // Helper function to draw section titles
  const drawSectionHeader = (titleText) => {
    doc.font(fontTitle).fontSize(14).fillColor(primaryColor).text(titleText.toUpperCase());
    doc.moveDown(0.2);
    doc.strokeColor(accentColor).lineWidth(1).moveTo(50, doc.y).lineTo(200, doc.y).stroke();
    doc.moveDown(0.6);
  };

  // --- SUMMARY ---
  const summary = personalInfo.summary || '';
  if (summary) {
    drawSectionHeader('Professional Summary');
    doc.font(fontBody).fontSize(10).fillColor('#334155').text(summary, {
      align: 'justify',
      lineGap: 3
    });
    doc.moveDown(1.5);
  }

  // --- EXPERIENCE ---
  if (experience && experience.length > 0) {
    drawSectionHeader('Work Experience');
    
    experience.forEach((exp) => {
      // Avoid page overflow nicely
      if (doc.y > 700) doc.addPage();

      doc.font(fontTitle).fontSize(11).fillColor('#1e293b').text(exp.role || 'Role');
      
      const companyAndDuration = [exp.company || '', exp.duration || ''].filter(Boolean).join('  •  ');
      doc.font(fontBody).fontSize(9).fillColor(accentColor).text(companyAndDuration);
      doc.moveDown(0.3);
      
      if (exp.description) {
        doc.font(fontBody).fontSize(9.5).fillColor('#475569').text(exp.description, {
          align: 'justify',
          lineGap: 2
        });
      }
      doc.moveDown(1);
    });
    doc.moveDown(0.5);
  }

  // --- EDUCATION ---
  if (education && education.length > 0) {
    if (doc.y > 680) doc.addPage();
    drawSectionHeader('Education');
    
    education.forEach((edu) => {
      if (doc.y > 700) doc.addPage();

      doc.font(fontTitle).fontSize(11).fillColor('#1e293b').text(edu.degree || 'Degree');
      const instAndDuration = [edu.institution || '', edu.duration || ''].filter(Boolean).join('  •  ');
      doc.font(fontBody).fontSize(9).fillColor(accentColor).text(instAndDuration);
      
      if (edu.description) {
        doc.moveDown(0.3);
        doc.font(fontBody).fontSize(9.5).fillColor('#475569').text(edu.description, {
          align: 'justify',
          lineGap: 2
        });
      }
      doc.moveDown(1);
    });
    doc.moveDown(0.5);
  }

  // --- SKILLS & LANGUAGES ---
  if ((skills && skills.length > 0) || (languages && languages.length > 0)) {
    if (doc.y > 680) doc.addPage();
    
    // Draw two-column layout for skills and languages if both exist
    const initialY = doc.y;
    
    if (skills && skills.length > 0) {
      doc.font(fontTitle).fontSize(14).fillColor(primaryColor).text('SKILLS', 50, initialY);
      doc.moveDown(0.2);
      doc.strokeColor(accentColor).lineWidth(1).moveTo(50, doc.y).lineTo(150, doc.y).stroke();
      doc.moveDown(0.6);
      
      const skillsText = Array.isArray(skills) ? skills.join(', ') : skills;
      doc.font(fontBody).fontSize(10).fillColor('#334155').text(skillsText, 50, doc.y, {
        width: languages && languages.length > 0 ? 230 : 495,
        lineGap: 3
      });
    }

    if (languages && languages.length > 0) {
      const colX = 310;
      doc.font(fontTitle).fontSize(14).fillColor(primaryColor).text('LANGUAGES', colX, initialY);
      doc.moveDown(0.2);
      doc.strokeColor(accentColor).lineWidth(1).moveTo(colX, doc.y).lineTo(colX + 100, doc.y).stroke();
      doc.moveDown(0.6);
      
      const langsText = Array.isArray(languages) ? languages.join(', ') : languages;
      doc.font(fontBody).fontSize(10).fillColor('#334155').text(langsText, colX, doc.y, {
        width: 235,
        lineGap: 3
      });
    }
  }

  // Finalize the document
  doc.end();
}

module.exports = {
  generatePDF
};
