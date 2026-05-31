const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../database.sqlite');
const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS doctors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    specialization TEXT NOT NULL,
    available_days TEXT NOT NULL,
    image TEXT DEFAULT 'default-doctor.jpg',
    bio TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS appointments (
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
  );

  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

const adminExists = db.prepare('SELECT id FROM admins WHERE username = ?').get('admin');
if (!adminExists) {
  const hash = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO admins (username, password) VALUES (?, ?)').run('admin', hash);
  console.log('✅ Admin user created: admin / admin123');
}

const doctorCount = db.prepare('SELECT COUNT(*) as count FROM doctors').get();
if (doctorCount.count === 0) {
  const insertDoctor = db.prepare(
    'INSERT INTO doctors (name, specialization, available_days, bio) VALUES (?, ?, ?, ?)'
  );
  const doctors = [
    ['Dr. Aisha Sharma', 'Cardiologist', 'Monday, Wednesday, Friday', 'Senior Cardiologist with 15+ years of experience in interventional cardiology.'],
    ['Dr. Rajiv Mehta', 'Neurologist', 'Tuesday, Thursday, Saturday', 'Expert in neurological disorders and brain health with advanced training from AIIMS.'],
    ['Dr. Priya Nair', 'Pediatrician', 'Monday, Tuesday, Wednesday, Thursday', 'Compassionate pediatrician specializing in child development and preventive care.'],
    ['Dr. Suresh Patel', 'Orthopedic Surgeon', 'Wednesday, Friday, Saturday', 'Orthopedic specialist with expertise in joint replacement and sports injuries.'],
    ['Dr. Meena Iyer', 'Dermatologist', 'Monday, Thursday, Friday', 'Board-certified dermatologist specializing in skin disorders, cosmetic treatments.'],
    ['Dr. Arjun Reddy', 'General Physician', 'Monday, Tuesday, Wednesday, Thursday, Friday', 'General practice physician focused on preventive medicine and chronic disease management.'],
  ];
  doctors.forEach(d => insertDoctor.run(...d));
  console.log('✅ Sample doctors seeded');
}

module.exports = db;