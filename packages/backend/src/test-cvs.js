const assert = require('assert').strict;

async function runTests() {
  const BASE_URL = 'http://localhost:3000';
  console.log('Starting CV CRUD API Endpoints Tests...\n');

  let token = '';
  let userId = '';
  let cvId = '';

  const testEmail = `test_cv_user_${Date.now()}@example.com`;
  const testPassword = 'password123';
  const testName = 'CV Test User';

  // --- 1. Signup test ---
  console.log('Testing 1: POST /api/auth/signup');
  const signupRes = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: testPassword, name: testName })
  });

  assert.equal(signupRes.status, 201, `Signup should return 201, got ${signupRes.status}`);
  const signupData = await signupRes.json();
  assert.ok(signupData.token, 'Signup response should contain a JWT token');
  assert.ok(signupData.user, 'Signup response should contain user object');
  token = signupData.token;
  userId = signupData.user.id;
  console.log('✓ Signup test passed. User ID:', userId);

  // --- 2. Create CV (Unauthenticated) ---
  console.log('\nTesting 2: POST /api/cvs (Unauthenticated)');
  const unauthCreateRes = await fetch(`${BASE_URL}/api/cvs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'My Unauthenticated CV',
      template_id: 'tech-it',
      data: { personalInfo: { name: 'Hack' } }
    })
  });
  assert.equal(unauthCreateRes.status, 401, `Unauthenticated CV creation should return 401, got ${unauthCreateRes.status}`);
  console.log('✓ Unauthenticated restriction passed.');

  // --- 3. Create CV (Authenticated) ---
  console.log('\nTesting 3: POST /api/cvs (Authenticated)');
  const cvData = {
    personalInfo: {
      name: 'John Doe',
      title: 'Senior Full Stack Engineer',
      email: testEmail,
      phone: '+1 555-0199',
      address: 'San Francisco, CA',
      summary: 'Passionate software engineer with 5+ years of experience building scalable web apps.'
    },
    experience: [
      {
        role: 'Senior Software Engineer',
        company: 'WebTech Corp',
        duration: '2022 - Present',
        description: 'Led a team of 4 developers to rewrite the core API, increasing performance by 40%.'
      },
      {
        role: 'Software Engineer',
        company: 'DevSolutions Inc',
        duration: '2020 - 2022',
        description: 'Developed and maintained responsive React interfaces and Node.js backend endpoints.'
      }
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'State University',
        duration: '2016 - 2020',
        description: 'Graduated with Honors. Specialized in Software Engineering.'
      }
    ],
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'SQL', 'Git'],
    languages: ['English (Fluent)', 'Indonesian (Native)']
  };

  const createRes = await fetch(`${BASE_URL}/api/cvs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      title: 'My Software Engineering Resume',
      template_id: 'tech-it',
      data: cvData
    })
  });

  assert.equal(createRes.status, 201, `Authenticated CV creation should return 201, got ${createRes.status}`);
  const createResult = await createRes.json();
  assert.ok(createResult.cv, 'Create response should contain created CV');
  assert.ok(createResult.cv.id, 'Created CV should have a unique ID');
  assert.equal(createResult.cv.title, 'My Software Engineering Resume');
  assert.equal(createResult.cv.template_id, 'tech-it');
  cvId = createResult.cv.id;
  console.log('✓ Authenticated CV creation passed. CV ID:', cvId);

  // --- 4. List User's CVs ---
  console.log('\nTesting 4: GET /api/cvs (List User CVs)');
  const listRes = await fetch(`${BASE_URL}/api/cvs`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  assert.equal(listRes.status, 200, `List CVs should return 200, got ${listRes.status}`);
  const list = await listRes.json();
  assert.ok(Array.isArray(list), 'List response should be an array');
  assert.equal(list.length, 1, `List should contain exactly 1 CV, got ${list.length}`);
  assert.equal(list[0].id, cvId);
  console.log('✓ List CVs passed. Items returned:', list.length);

  // --- 5. Get Single CV details ---
  console.log('\nTesting 5: GET /api/cvs/:id (Single CV details)');
  const getRes = await fetch(`${BASE_URL}/api/cvs/${cvId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  assert.equal(getRes.status, 200, `Get single CV should return 200, got ${getRes.status}`);
  const retrievedCv = await getRes.json();
  assert.equal(retrievedCv.id, cvId);
  assert.equal(retrievedCv.title, 'My Software Engineering Resume');
  assert.deepEqual(retrievedCv.data, cvData);
  console.log('✓ Get single CV details passed.');

  // --- 6. Update CV ---
  console.log('\nTesting 6: PUT /api/cvs/:id (Update CV)');
  const updatedCvData = {
    ...cvData,
    skills: [...cvData.skills, 'Docker', 'Kubernetes']
  };

  const updateRes = await fetch(`${BASE_URL}/api/cvs/${cvId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      title: 'My Updated Engineering Resume',
      template_id: 'classic-professional',
      data: updatedCvData
    })
  });

  assert.equal(updateRes.status, 200, `Update CV should return 200, got ${updateRes.status}`);
  const updateResult = await updateRes.json();
  assert.equal(updateResult.cv.title, 'My Updated Engineering Resume');
  assert.equal(updateResult.cv.template_id, 'classic-professional');
  assert.deepEqual(updateResult.cv.data, updatedCvData);

  // Verify DB updated
  const getUpdatedRes = await fetch(`${BASE_URL}/api/cvs/${cvId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const dbCv = await getUpdatedRes.json();
  assert.equal(dbCv.title, 'My Updated Engineering Resume');
  assert.equal(dbCv.template_id, 'classic-professional');
  assert.deepEqual(dbCv.data, updatedCvData);
  console.log('✓ Update CV passed.');

  // --- 7. Export CV to PDF ---
  console.log('\nTesting 7: POST /api/cvs/:id/export-pdf (PDF Generation)');
  const pdfRes = await fetch(`${BASE_URL}/api/cvs/${cvId}/export-pdf`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  assert.equal(pdfRes.status, 200, `Export PDF should return 200, got ${pdfRes.status}`);
  assert.equal(pdfRes.headers.get('content-type'), 'application/pdf', `Content type should be application/pdf, got ${pdfRes.headers.get('content-type')}`);
  assert.ok(pdfRes.headers.get('content-disposition').includes('attachment; filename='), 'Content-disposition should be attachment');

  const pdfBuffer = await pdfRes.arrayBuffer();
  const pdfHeader = Buffer.from(pdfBuffer).subarray(0, 4).toString();
  assert.equal(pdfHeader, '%PDF', 'PDF stream should start with PDF magic signature %PDF');
  console.log(`✓ Export PDF passed. PDF Size: ${pdfBuffer.byteLength} bytes.`);

  // --- 8. Delete CV ---
  console.log('\nTesting 8: DELETE /api/cvs/:id (Delete CV)');
  const deleteRes = await fetch(`${BASE_URL}/api/cvs/${cvId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  assert.equal(deleteRes.status, 200, `Delete CV should return 200, got ${deleteRes.status}`);
  
  // Verify CV is deleted (returns 404 now)
  const getDeletedRes = await fetch(`${BASE_URL}/api/cvs/${cvId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  assert.equal(getDeletedRes.status, 404, `Get deleted CV should return 404, got ${getDeletedRes.status}`);
  console.log('✓ Delete CV passed.');

  console.log('\n=========================================');
  console.log('ALL API ENDPOINT TESTS PASSED SUCCESSFULLY!');
  console.log('=========================================');
}

runTests().catch(err => {
  console.error('\n❌ TEST FAILED:');
  console.error(err);
  process.exit(1);
});
