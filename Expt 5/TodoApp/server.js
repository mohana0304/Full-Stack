const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const PORT = 5003;
const DATA_FILE = './data/todos.json';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Get all todos
app.get('/todos', (req, res) => {
  const data = fs.readFileSync(DATA_FILE);
  res.json(JSON.parse(data));
});

// Save todos
app.post('/todos', (req, res) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2));
  res.json({ status: 'Saved' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
