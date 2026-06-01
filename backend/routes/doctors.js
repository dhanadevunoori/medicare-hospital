const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { requireAdmin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const doctors = await db.asyncAll('SELECT * FROM doctors ORDER BY name');
    res.json({ success: true, doctors });
  } catch(e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const doctor = await db.asyncGet('SELECT * FROM doctors WHERE id = ?', [req.params.id]);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, doctor });
  } catch(e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/', requireAdmin, async (req, res) => {
  const { name, specialization, available_days, bio } = req.body;
  if (!name || !specialization || !available_days)
    return res.status(400).json({ success: false, message: 'All fields required' });
  try {
    const result = await db.asyncRun(
      'INSERT INTO doctors (name, specialization, available_days, bio) VALUES (?, ?, ?, ?)',
      [name, specialization, available_days, bio || '']
    );
    res.json({ success: true, message: 'Doctor added', id: result.lastID });
  } catch(e) { res.status(500).json({ success: false, message: e.message }); }
});

router.put('/:id', requireAdmin, async (req, res) => {
  const { name, specialization, available_days, bio } = req.body;
  try {
    await db.asyncRun(
      'UPDATE doctors SET name=?, specialization=?, available_days=?, bio=? WHERE id=?',
      [name, specialization, available_days, bio || '', req.params.id]
    );
    res.json({ success: true, message: 'Doctor updated' });
  } catch(e) { res.status(500).json({ success: false, message: e.message }); }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await db.asyncRun('DELETE FROM doctors WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Doctor deleted' });
  } catch(e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;