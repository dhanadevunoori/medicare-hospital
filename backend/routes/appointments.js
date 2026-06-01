const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { requireAdmin } = require('../middleware/auth');

router.post('/', async (req, res) => {
  const { patient_name, phone, email, doctor_id, appointment_date, message } = req.body;
  if (!patient_name || !phone || !email || !doctor_id || !appointment_date)
    return res.status(400).json({ success: false, message: 'All required fields must be filled' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return res.status(400).json({ success: false, message: 'Invalid email address' });

  const today = new Date().toISOString().split('T')[0];
  if (appointment_date < today)
    return res.status(400).json({ success: false, message: 'Appointment date cannot be in the past' });

  try {
    const result = await db.asyncRun(
      'INSERT INTO appointments (patient_name, phone, email, doctor_id, appointment_date, message) VALUES (?, ?, ?, ?, ?, ?)',
      [patient_name, phone, email, doctor_id, appointment_date, message || '']
    );
    res.json({ success: true, message: 'Appointment booked successfully! We will contact you soon.', id: result.lastID });
  } catch(e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/', requireAdmin, async (req, res) => {
  try {
    const appointments = await db.asyncAll(`
      SELECT a.*, d.name as doctor_name, d.specialization
      FROM appointments a
      LEFT JOIN doctors d ON a.doctor_id = d.id
      ORDER BY a.created_at DESC
    `);
    res.json({ success: true, appointments });
  } catch(e) { res.status(500).json({ success: false, message: e.message }); }
});

router.patch('/:id/status', requireAdmin, async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'confirmed', 'cancelled'].includes(status))
    return res.status(400).json({ success: false, message: 'Invalid status' });
  try {
    await db.asyncRun('UPDATE appointments SET status=? WHERE id=?', [status, req.params.id]);
    res.json({ success: true, message: 'Status updated' });
  } catch(e) { res.status(500).json({ success: false, message: e.message }); }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await db.asyncRun('DELETE FROM appointments WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Appointment deleted' });
  } catch(e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message)
    return res.status(400).json({ success: false, message: 'All fields are required' });
  try {
    await db.asyncRun('INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name, email, subject, message]);
    res.json({ success: true, message: 'Message sent! We will get back to you within 24 hours.' });
  } catch(e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;