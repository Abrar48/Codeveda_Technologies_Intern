const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Set up database connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'taskmanager',
  password: '12345', 
  port: 5432,
});

// Test database connection
pool.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
  } else {
    console.log('Connected to PostgreSQL successfully');
  }
});

// GET: fetch all tasks
app.get('/api/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: create a task
app.post('/api/items', async (req, res) => {
  try {
    const { title } = req.body;
    const result = await pool.query(
      'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
      [title]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: update an existing task
app.put('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    await pool.query('UPDATE tasks SET title = $1 WHERE id = $2', [title, id]);
    res.json({ message: 'Task updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: remove a task
app.delete('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});