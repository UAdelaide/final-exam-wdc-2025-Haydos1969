const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET all users (for admin/testing)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id, username, email, role FROM Users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST a new user (simple signup)
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const [result] = await db.query(`
      INSERT INTO Users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `, [username, email, password, role]);

    res.status(201).json({ message: 'User registered', user_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});


router.get('/dashboard', (req, res) => {
  // if the user is not logged in with a session, sends them back too the login page
  if (!req.session.user) {
    return res.status(401).sendFile('/public/index.html', { root: '.' });
  }
  // Checks the role of the user and responds with the respective dashboard
  if (req.session.user.role === "owner") {
    return res.status(200).sendFile('/public/owner-dashboard.html', { root: '.' });
  }
  if (req.session.user.role === "walker") {
    return res.status(200).sendFile('/public/walker-dashboard.html', { root: '.' });
  }
  return res.status(404).send("this should not have happened");
});

router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json(req.session.user);
});

// POST login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query(`
      SELECT user_id, username, email, role FROM Users
      WHERE username = ? AND password_hash = ?
    `, [username, password]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // creates a sessiion for the user if the login is successfull
    req.session.user = {
      id: rows[0].user_id,
      username: rows[0].username,
      role: rows[0].role
    };

    // Sends the user's account data
    res.status(200).json({ message: 'Login successful', user: rows[0] });

  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// logs the user out of their session
router.post('/logout', (req, res) => {
  // Ends the user session
  req.session.destroy();
  // clears the user's cookies
  res.clearCookie('connect.sid');

  res.json({ message: 'loggout successful' });
});


router.get('/dog-names', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT name FROM Dogs
      WHERE username = ? AND password_hash = ?
    `, [req.session.user.id]);
  }
  catch (error) {

  }
});

module.exports = router;
