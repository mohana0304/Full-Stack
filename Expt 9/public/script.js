function loadQuestions() {
  const topic = document.getElementById('topicSelect').value;

  fetch(`/questions/${topic}`)
    .then(res => res.json())
    .then(data => {
      const quizDiv = document.getElementById('quiz-container');
      quizDiv.innerHTML = '';
      data.forEach((q, idx) => {
        const qDiv = document.createElement('div');
        qDiv.innerHTML = `<p>${q.question}</p>` +
          q.options.map(opt => `
            <label>
              <input type="radio" name="q${idx}" value="${opt}">${opt}
            </label><br>`).join('');
        quizDiv.appendChild(qDiv);
      });
      quizDiv.innerHTML += `<button onclick="submitAnswers(${JSON.stringify(data.length)}, '${topic}')">Submit</button>`;
    });
}

function submitAnswers(total, topic) {
  const answers = [];
  for (let i = 0; i < total; i++) {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    answers.push(selected ? selected.value : '');
  }

  fetch('/submit', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ answers, topic })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById('score').style.display = 'block';
      document.getElementById('score').innerHTML = `<h2>Your Score: ${data.score}/${total}</h2>`;
    });
}
