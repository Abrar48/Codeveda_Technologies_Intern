const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'my_jwt_secret_key_123';

app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'taskmanager',
  password: '12345',
  port: 5432,
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
    req.user = user;
    next();
  });
};

// 1. User Registration route
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
      [username, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
  } catch (err) {
    res.status(400).json({ error: 'Username already exists or database error.' });
  }
});

// 2. User Login route
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const userQuery = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userQuery.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const user = userQuery.rows[0];

    // Check hashed password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Protected Dashboard route
app.get('/api/dashboard', authenticateToken, (req, res) => {
  res.json({ message: `Welcome to your protected profile, ${req.user.username}!` });
});

app.listen(PORT, () => {
  console.log(`Auth backend running on http://localhost:${PORT}`);
});