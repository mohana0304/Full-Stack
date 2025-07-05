const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5001;

// View engine setup
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); // for styles.css

// Routes
app.get('/', (req, res) => {
  res.redirect('/form'); // Redirect to form page
});

app.get('/form', (req, res) => {
  console.log("Rendering form page"); // debug
  res.render('form');
});

app.post('/submit', (req, res) => {
  const newData = req.body;

  fs.readFile('data.json', 'utf8', (err, data) => {
    let entries = [];
    if (!err && data) {
      entries = JSON.parse(data);
    }

    entries.push(newData);

    fs.writeFile('data.json', JSON.stringify(entries, null, 2), (err) => {
      if (err) {
        console.error('Error writing data:', err);
        return res.status(500).send('Server Error');
      }
      res.redirect('/data');
    });
  });
});

app.get('/data', (req, res) => {
  fs.readFile('data.json', 'utf8', (err, data) => {
    let entries = [];
    if (!err && data) {
      try {
        entries = JSON.parse(data);
        console.log("Parsed entries:", entries);
      } catch (e) {
        console.error("Error parsing JSON:", e);
      }
    } else {
      console.error("Error reading file or empty file:", err);
    }

    // Make sure we are passing it correctly
    res.render('data', { entries });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
