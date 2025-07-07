const express = require('express');
const mongoose = require('mongoose');
const Student = require('./models/Student');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/studentdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// View All
app.get('/', async (req, res) => {
  const students = await Student.find();
  res.render('index', { students });
});

// Form to Add
app.get('/add', (req, res) => {
  res.render('add');
});

// Create
app.post('/add', async (req, res) => {
  await Student.create(req.body);
  res.redirect('/');
});

// Edit Form
app.get('/edit/:id', async (req, res) => {
  const student = await Student.findById(req.params.id);
  res.render('edit', { student });
});

// Update
app.post('/update/:id', async (req, res) => {
  await Student.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/');
});

// Delete
app.get('/delete/:id', async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

app.listen(5000, () => {
  console.log('Server running at http://localhost:5000');
});
