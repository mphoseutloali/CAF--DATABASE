import React, { useState } from 'react';

function LoginForm({ login, registerUser }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (credentials.username && credentials.password) {
      if (isRegistering) {
        registerUser(credentials);
        setMessage('Registration successful! You can now log in.');
        setCredentials({ username: '', password: '' });
        setTimeout(() => {
          setIsRegistering(false); // Switch to login view after a short delay
        }, 2000); // 2 seconds delay
      } else {
        login(credentials);
      }
    } else {
      setMessage('Please fill in all fields.');
    }
  };

  return (
    <div>
      <h2>{isRegistering ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          required
        />
        <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
        <button type="button" onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Already have an account? Login' : 'Don\'t have an account? Register'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default LoginForm;
