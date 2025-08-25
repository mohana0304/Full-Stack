const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Middleware for protected routes
function authMiddleware(req, res, next) {
  if (!req.cookies.user) return res.redirect('/login');
  next();
}

// Signup
router.get('/signup', (req, res) => res.render('signup'));

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPwd = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ name, email, password: hashedPwd });
    res.cookie('user', user._id, { httpOnly: true });
    res.redirect('/dashboard');
  } catch (err) {
    res.send('Error: ' + err.message);
  }
});

// Login
router.get('/login', (req, res) => res.render('login'));

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.send('Invalid credentials');
  }
  res.cookie('user', user._id, { httpOnly: true });
  res.redirect('/dashboard');
});

// Dashboard
router.get('/dashboard', authMiddleware, async (req, res) => {
  const user = await User.findById(req.cookies.user);
  res.render('dashboard', { user });
});

// Logout
router.get('/logout', (req, res) => {
  res.clearCookie('user');
  res.redirect('/login');
});

module.exports = router;
