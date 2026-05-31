const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db/database');

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.json({ success: false, message: 'Username and password required' });

  const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get(username);
  if (!admin) return res.json({ success: false, message: 'Invalid credentials' });

  const valid = bcrypt.compareSync(password, admin.password);
  if (!valid) return res.json({ success: false, message: 'Invalid credentials' });

  req.session.adminId = admin.id;
  req.session.adminUsername = admin.username;
  res.json({ success: true, message: 'Login successful' });
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true, message: 'Logged out' });
});

router.get('/check', (req, res) => {
  if (req.session && req.session.adminId) {
    res.json({ success: true, username: req.session.adminUsername });
  } else {
    res.json({ success: false });
  }
});

router.get('/stats', require('../middleware/auth').requireAdmin, (req, res) => {
  const totalDoctors = db.prepare('SELECT COUNT(*) as count FROM doctors').get().count;
  const totalAppointments = db.prepare('SELECT COUNT(*) as count FROM appointments').get().count;
  const pendingAppointments = db.prepare("SELECT COUNT(*) as count FROM appointments WHERE status='pending'").get().count;
  const totalContacts = db.prepare('SELECT COUNT(*) as count FROM contacts').get().count;
  res.json({ success: true, totalDoctors, totalAppointments, pendingAppointments, totalContacts });
});

module.exports = router;