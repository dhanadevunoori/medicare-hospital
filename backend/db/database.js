const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../database.sqlite');
const db = new sqlite3.Database(DB_PATH);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS doctors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    specialization TEXT NOT NULL,
    available_days TEXT NOT NULL,
    image TEXT DEFAULT 'default-doctor.jpg',
    bio TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    doctor_id INTEGER NOT NULL,
    appointment_date TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Seed admin
  db.get('SELECT id FROM admins WHERE username = ?', ['admin'], (err, row) => {
    if (!row) {
      const hash = bcrypt.hashSync('admin123', 10);
      db.run('INSERT INTO admins (username, password) VALUES (?, ?)', ['admin', hash]);
      console.log('✅ Admin user created');
    }
  });

  // Seed doctors
  db.get('SELECT COUNT(*) as count FROM doctors', [], (err, row) => {
    if (row && row.count === 0) {
      const doctors = [
        ['Dr. Aisha Sharma', 'Cardiologist', 'Monday, Wednesday, Friday', 'Senior Cardiologist with 15+ years of experience.'],
        ['Dr. Rajiv Mehta', 'Neurologist', 'Tuesday, Thursday, Saturday', 'Expert in neurological disorders.'],
        ['Dr. Priya Nair', 'Pediatrician', 'Monday, Tuesday, Wednesday, Thursday', 'Compassionate pediatrician.'],
        ['Dr. Suresh Patel', 'Orthopedic Surgeon', 'Wednesday, Friday, Saturday', 'Orthopedic specialist.'],
        ['Dr. Meena Iyer', 'Dermatologist', 'Monday, Thursday, Friday', 'Board-certified dermatologist.'],
        ['Dr. Arjun Reddy', 'General Physician', 'Monday, Tuesday, Wednesday, Thursday, Friday', 'General practice physician.'],
      ];
      const stmt = db.prepare('INSERT INTO doctors (name, specialization, available_days, bio) VALUES (?, ?, ?, ?)');
      doctors.forEach(d => stmt.run(...d));
      stmt.finalize();
      console.log('✅ Sample doctors seeded');
    }
  });
});

// Helper: promisify db methods
db.asyncGet = (sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => err ? reject(err) : resolve(row));
});
db.asyncAll = (sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
});
db.asyncRun = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function(err) { err ? reject(err) : resolve({ lastID: this.lastID, changes: this.changes }); });
});

module.exports = db;