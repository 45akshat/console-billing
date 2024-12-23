const jwt = require('jsonwebtoken');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoie1widXNlcklkXCI6XCJiZTU0OWY5OC0xN2RmLTQ5YWEtYWNhOS02ZTM5NzE1N2YzOGFcIixcInRpbWVzdGFtcFwiOlwiMjAyNC0xMi0yNCAwNDowMjoyN1wiLFwiYWN0aW9uXCI6XCJDaGVjay1PdXRcIn0iLCJpYXQiOjE3MzQ5OTMxNDd9.fqbS5JHALrJzZoYnRfMZjwX_8tSWLM3Ol0xUwpHmUGI';
const secretKey = 'secret_key_123';

try {
  const decoded = jwt.verify(token, secretKey);
  console.log('Decoded JWT:', decoded);
} catch (err) {
  console.error('Invalid token:', err.message);
}

