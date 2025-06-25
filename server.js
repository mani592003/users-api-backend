const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const DATA_FILE = 'users.json';

// Read users from file
function readUsers() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(data || '[]');
}

// Write users to file
function writeUsers(users) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
}

// GET all users
app.get('/api/users', (req, res) => {
  const users = readUsers();
  res.json(users);
});

// POST a new user
app.post('/api/users', (req, res) => {
  const users = readUsers();
  const newUser = { id: Date.now(), name: req.body.name };
  users.push(newUser);
  writeUsers(users);
  res.json({ message: 'User added', user: newUser });
});

// DELETE a user
// server.js (backend)
app.delete('/api/users/:id', (req, res) => {
  let users = readUsers();
  users = users.filter(user => user.id != req.params.id); // NOTE: != not ===
  writeUsers(users);
  res.json({ message: 'User deleted' });
});


app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
