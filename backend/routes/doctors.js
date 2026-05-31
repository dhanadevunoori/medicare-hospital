const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { requireAdmin } = require('../middleware/auth');

router.get('/', (req, res) => {
  const doctors = db.prepare('SELECT * FROM doctors ORDER BY name').all();
  res.json({ success: true, doctors });
});

router.get('/:id', (req, res) => {
  const doctor = db.prepare('SELECT * FROM doctors WHERE id = ?').get(req.params.id);
  if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
  res.json({ success: true, doctor });
});

router.post('/', requireAdmin, (req, res) => {
  const { name, specialization, available_days, bio } = req.body;
  if (!name || !specialization || !available_days)
    return res.status(400).json({ success: false, message: 'Name, specialization and available days are required' });

  const result = db.prepare(
    'INSERT INTO doctors (name, specialization, available_days, bio) VALUES (?, ?, ?, ?)'
  ).run(name, specialization, available_days, bio || '');

  res.json({ success: true, message: 'Doctor added successfully', id: result.lastInsertRowid });
});

router.put('/:id', requireAdmin, (req, res) => {
  const { name, specialization, available_days, bio } = req.body;
  const doctor = db.prepare('SELECT id FROM doctors WHERE id = ?').get(req.params.id);
  if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

  db.prepare(
    'UPDATE doctors SET name=?, specialization=?, available_days=?, bio=? WHERE id=?'
  ).run(name, specialization, available_days, bio || '', req.params.id);

  res.json({ success: true, message: 'Doctor updated successfully' });
});

router.delete('/:id', requireAdmin, (req, res) => {
  const doctor = db.prepare('SELECT id FROM doctors WHERE id = ?').get(req.params.id);
  if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

  db.prepare('DELETE FROM doctors WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Doctor deleted successfully' });
});

module.exports = router;