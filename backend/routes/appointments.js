const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { requireAdmin } = require('../middleware/auth');

router.post('/', (req, res) => {
  const { patient_name, phone, email, doctor_id, appointment_date, message } = req.body;

  if (!patient_name || !phone || !email || !doctor_id || !appointment_date)
    return res.status(400).json({ success: false, message: 'All required fields must be filled' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return res.status(400).json({ success: false, message: 'Invalid email address' });

  const phoneRegex = /^[0-9]{10,15}$/;
  if (!phoneRegex.test(phone.replace(/[\s\-\+]/g, '')))
    return res.status(400).json({ success: false, message: 'Invalid phone number' });

  const doctor = db.prepare('SELECT id FROM doctors WHERE id = ?').get(doctor_id);
  if (!doctor) return res.status(400).json({ success: false, message: 'Selected doctor not found' });

  const today = new Date().toISOString().split('T')[0];
  if (appointment_date < today)
    return res.status(400).json({ success: false, message: 'Appointment date cannot be in the past' });

  const result = db.prepare(
    'INSERT INTO appointments (patient_name, phone, email, doctor_id, appointment_date, message) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(patient_name, phone, email, doctor_id, appointment_date, message || '');

  res.json({
    success: true,
    message: 'Appointment booked successfully! We will contact you soon.',
    id: result.lastInsertRowid
  });
});

router.get('/', requireAdmin, (req, res) => {
  const appointments = db.prepare(`
    SELECT a.*, d.name as doctor_name, d.specialization
    FROM appointments a
    LEFT JOIN doctors d ON a.doctor_id = d.id
    ORDER BY a.created_at DESC
  `).all();
  res.json({ success: true, appointments });
});

router.patch('/:id/status', requireAdmin, (req, res) => {
  const { status } = req.body;
  if (!['pending', 'confirmed', 'cancelled'].includes(status))
    return res.status(400).json({ success: false, message: 'Invalid status' });

  db.prepare('UPDATE appointments SET status=? WHERE id=?').run(status, req.params.id);
  res.json({ success: true, message: 'Status updated' });
});

router.delete('/:id', requireAdmin, (req, res) => {
  const appt = db.prepare('SELECT id FROM appointments WHERE id = ?').get(req.params.id);
  if (!appt) return res.status(404).json({ success: false, message: 'Appointment not found' });

  db.prepare('DELETE FROM appointments WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Appointment deleted' });
});

router.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message)
    return res.status(400).json({ success: false, message: 'All fields are required' });

  db.prepare('INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)').run(name, email, subject, message);
  res.json({ success: true, message: 'Message sent! We will get back to you within 24 hours.' });
});

module.exports = router;