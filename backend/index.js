const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { format, addDays } = require('date-fns');

const app = express();
app.use(cors());
app.use(bodyParser.json());

function parseText(rawText) {
  const text = (rawText || '').toLowerCase();
  const today = new Date();

  let dueDate = format(today, 'yyyy-MM-dd');
  let subject = 'General';
  let priority = 'medium';
  let title = (rawText || '').trim();

  const subjects = [
    'math', 'history', 'science', 'english', 'biology', 'chemistry', 'physics', 'art', 'music', 'coding', 'programming', 'cs', 'spanish'
  ];
  for (const sub of subjects) {
    if (text.includes(sub)) {
      subject = sub === 'cs' ? 'CS' : sub.charAt(0).toUpperCase() + sub.slice(1);
      break;
    }
  }

  if (text.includes('tomorrow')) {
    dueDate = format(addDays(today, 1), 'yyyy-MM-dd');
  } else if (text.includes('next week')) {
    dueDate = format(addDays(today, 7), 'yyyy-MM-dd');
  } else if (text.includes('in 2 days') || text.includes('2 days from now')) {
    dueDate = format(addDays(today, 2), 'yyyy-MM-dd');
  } else if (text.includes('in 3 days')) {
    dueDate = format(addDays(today, 3), 'yyyy-MM-dd');
  } else if (text.includes('yesterday') || text.includes('last active')) {
    dueDate = format(addDays(today, -1), 'yyyy-MM-dd');
  }

  if (text.includes('urgent') || text.includes('important') || text.includes('high') || text.includes('asap')) {
    priority = 'high';
  } else if (text.includes('low') || text.includes('easy') || text.includes('minor') || text.includes('chill')) {
    priority = 'low';
  }

  if (title.length > 50) {
    title = title.substring(0, 47) + '...';
  }

  return {
    title,
    subject,
    dueDate,
    priority,
    status: 'pending'
  };
}

app.get('/api', (req, res) => {
  res.json({ status: 'ok', message: 'Backend running' });
});

app.post('/api/parse-task', (req, res) => {
  const { text } = req.body || {};
  if (!text) return res.status(400).json({ error: 'Missing text in request body' });
  const parsed = parseText(text);
  res.json(parsed);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
