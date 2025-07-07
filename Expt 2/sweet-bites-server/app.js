const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5001;

// View engine setup
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// GET: form page
app.get('/form', (req, res) => {
  res.render('form');
});

// POST: submit form
app.post('/submit', (req, res) => {
  const { name, dessert, rating } = req.body;
  const newEntry = { name, dessert, rating };

  fs.readFile('data.json', 'utf8', (err, data) => {
    let entries = [];

    if (!err && data) {
      try {
        entries = JSON.parse(data);
      } catch (e) {
        console.error("Invalid JSON, starting fresh.");
      }
    }

    entries.push(newEntry);

    fs.writeFile('data.json', JSON.stringify(entries, null, 2), err => {
      if (err) console.error(err);
      res.redirect('/data');
    });
  });
});

// GET: view data
app.get('/data', (req, res) => {
  fs.readFile('data.json', 'utf8', (err, data) => {
    let entries = [];

    if (!err && data) {
      try {
        entries = JSON.parse(data);
        console.log("Loaded entries:", entries); // ✅ This log
      } catch (e) {
        console.error("Invalid JSON.");
      }
    }

    res.render('data', { entries });
  });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
