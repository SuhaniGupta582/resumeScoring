const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'suhani1704',
  database: 'job_portal'
});

db.connect(err => {
  if (err) {
    console.error('MySQL Connection Error:', err);
    return;
  }
  console.log('MySQL Connected');
});

module.exports = db;