import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState('');
  const [editId, setEditId] = useState(null);

  const API_URL = 'http://localhost:5000/api/items';

  // Fetch all tasks from backend
  const fetchItems = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Add or update task
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (editId) {
      await fetch(`${API_URL}/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: text }),
      });
      setEditId(null);
    } else {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: text }),
      });
    }

    setText('');
    fetchItems();
  };

  // Start editing a task
  const startEdit = (item) => {
    setEditId(item.id);
    setText(item.title);
  };

  // Delete a task
  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchItems();
  };

  return (
    <div className="container">
      <h2>Task Manager (Full-Stack)</h2>

      <form onSubmit={handleSubmit} className="form-group">
        <input
          type="text"
          placeholder="Enter a task..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="btn primary-btn">
          {editId ? 'Update' : 'Add'}
        </button>
      </form>

      <ul className="item-list">
        {items.map((item) => (
          <li key={item.id} className="list-item">
            <span>{item.title}</span>
            <div className="btn-group">
              <button onClick={() => startEdit(item)} className="btn edit-btn">Edit</button>
              <button onClick={() => handleDelete(item.id)} className="btn delete-btn">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;