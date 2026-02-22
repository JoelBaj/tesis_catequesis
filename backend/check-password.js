const mysql = require('mysql2/promise');

async function checkPassword() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'catequesis'
  });

  try {
    const [rows] = await connection.execute(
      'SELECT id, username, password FROM user WHERE username = ?',
      ['admin']
    );
    
    if (rows.length > 0) {
      console.log('Admin user found:');
      console.log('Username:', rows[0].username);
      console.log('Password stored in DB:', rows[0].password);
      console.log('Password length:', rows[0].password ? rows[0].password.length : 0);
    } else {
      console.log('No admin user found');
    }
  } finally {
    await connection.end();
  }
}

checkPassword().catch(console.error);
