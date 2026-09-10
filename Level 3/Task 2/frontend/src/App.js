import React, { useState } from 'react';
import './App.css';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [profileMsg, setProfileMsg] = useState('');

  const API_URL = 'http://localhost:5000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const endpoint = isLogin ? '/login' : '/register';

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || 'Operation failed');
        return;
      }

      if (isLogin) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setMessage('Login successful!');
      } else {
        setMessage('Registration successful! Please login.');
        setIsLogin(true);
      }
      setUsername('');
      setPassword('');
    } catch (err) {
      setMessage('Network error');
    }
  };

  const getProtectedData = async () => {
    try {
      const res = await fetch(`${API_URL}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProfileMsg(data.message || data.error);
    } catch (err) {
      setProfileMsg('Failed to fetch protected data');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setProfileMsg('');
    setMessage('Logged out.');
  };

  return (
    <div className="auth-container">
      <h2>{token ? 'Dashboard' : isLogin ? 'Login' : 'Register'}</h2>

      {message && <div className="alert-msg">{message}</div>}

      {!token ? (
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn submit-btn">
            {isLogin ? 'Login' : 'Register'}
          </button>
          <p className="toggle-text" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Don't have an account? Register" : 'Already registered? Login'}
          </p>
        </form>
      ) : (
        <div className="dashboard-content">
          <button onClick={getProtectedData} className="btn info-btn">
            Fetch Protected Profile
          </button>
          {profileMsg && <p className="secure-data">{profileMsg}</p>}
          <button onClick={handleLogout} className="btn logout-btn">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default App;