
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.get('/questions/:topic', (req, res) => {
  const topic = req.params.topic;
  const questions = JSON.parse(fs.readFileSync('questions.json'));
  res.json(questions[topic] || []);
  
});

app.post('/submit', (req, res) => {
  const { answers, topic } = req.body;
  const questions = JSON.parse(fs.readFileSync('questions.json'))[topic];
  let score = 0;
  answers.forEach((ans, i) => {
    if (questions[i].answer === ans) score++;
  });
  res.json({ score });
});

app.listen(5009, () => {
  console.log('Server running at http://localhost:5009');
});
