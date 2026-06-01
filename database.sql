-- MediCare Hospital Database Schema
-- Database: SQLite (compatible with MySQL/PostgreSQL)

-- Doctors Table
CREATE TABLE IF NOT EXISTS doctors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  available_days TEXT NOT NULL,
  bio TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Appointments Table
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

-- Admins Table
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

-- Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sample Doctors Data
INSERT INTO doctors (name, specialization, available_days, bio) VALUES
('Dr. Aisha Sharma', 'Cardiologist', 'Monday, Wednesday, Friday', 'Senior Cardiologist with 15+ years of experience.'),
('Dr. Rajiv Mehta', 'Neurologist', 'Tuesday, Thursday, Saturday', 'Expert in neurological disorders.'),
('Dr. Priya Nair', 'Pediatrician', 'Monday, Tuesday, Wednesday, Thursday', 'Compassionate pediatrician.'),
('Dr. Suresh Patel', 'Orthopedic Surgeon', 'Wednesday, Friday, Saturday', 'Orthopedic specialist.'),
('Dr. Meena Iyer', 'Dermatologist', 'Monday, Thursday, Friday', 'Board-certified dermatologist.'),
('Dr. Arjun Reddy', 'General Physician', 'Monday, Tuesday, Wednesday, Thursday, Friday', 'General practice physician.');

-- Default Admin (password: admin123 - bcrypt hashed in production)
INSERT INTO admins (username, password) VALUES
('admin', 'admin123');