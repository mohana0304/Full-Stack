require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const path = require('path');
const User = require('./models/User');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected ✅'));

// Middleware to protect routes
function isAuthenticated(req, res, next) {
  if (req.cookies.username) {
    next();
  } else {
    res.redirect('/login');
  }
}

app.get('/', isAuthenticated, (req, res) => {
  res.render('home', { user: req.cookies.username });
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ username, email, password: hashedPassword });
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await bcrypt.compare(password, user.password)) {
    res.cookie('username', user.username);
    res.redirect('/');
  } else {
    res.send('Invalid credentials');
  }
});

app.get('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/login');
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
