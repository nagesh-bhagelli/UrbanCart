import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const api = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
};

async function authFetch(endpoint, method, body) {
  const res = await fetch(`${api.baseURL}${endpoint}`, {
    method,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Auth failed');
  return data.data;
}

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let userData;

      if (isSignup) {
        const { username, email, password } = formData;
        if (!username || !email || !password) throw new Error('All fields required');

        userData = await authFetch('/auth/signup', 'POST', { username, email, password });

        const user = userData.user || userData.data || userData;
        signup(user);

        navigate(user.role === 'admin' ? '/admin/dashboard' : '/');

      } else {
        const { username, password } = formData;
        if (!username || !password) throw new Error('Username and password required');

        userData = await authFetch('/auth/login', 'POST', { username, password });

        const user = userData.user || userData.data || userData;
        login(user);

        navigate(user.role === 'admin' ? '/admin/dashboard' : '/');
      }

    } catch (err) {
      setError(err.message || 'Auth failed');
    } finally {
      setLoading(false);
    }
  };



  const toggleMode = () => {
    setIsSignup(!isSignup);
    setFormData({ username: '', email: '', password: '' });
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        padding: '2rem',
        width: '100%',
        maxWidth: '28rem'
      }}>
        <h2 style={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '0.5rem',
          color: '#1f2937'
        }}>
          {isSignup ? 'Join UrbanCart' : 'Welcome Back to UrbanCart'}
        </h2>
        <p style={{
          textAlign: 'center',
          color: '#6b7280',
          marginBottom: '1.5rem'
        }}>
          {isSignup ? 'Create an account to get started' : 'Sign in to your account'}
        </p>

        {error && (
          <div style={{
            marginBottom: '1rem',
            padding: '0.75rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '0.375rem',
            color: '#dc2626',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.5rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                outline: 'none'
              }}
              placeholder="Enter username"
            />
          </div>

          {isSignup && (
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.5rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  outline: 'none'
                }}
                placeholder="Enter email"
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.5rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                outline: 'none'
              }}
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: 'linear-gradient(90deg, #4f46e5, #9333ea)',
              color: 'white',
              fontWeight: '600',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              opacity: loading ? 0.5 : 1
            }}
          >
            {loading ? 'Processing...' : isSignup ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: '#4b5563', fontSize: '0.875rem' }}>
            {isSignup ? 'Already have an account?' : "Don't have an account?"}
            {' '}
            <button
              type="button"
              onClick={toggleMode}
              style={{
                color: '#4f46e5',
                fontWeight: '600',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {isSignup ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
