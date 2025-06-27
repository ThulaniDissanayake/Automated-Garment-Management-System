import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import the hook

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();  // Initialize the navigation function

  // Predefined username and password combinations
  const predefinedCredentials = [
    { username: 'minosh@alpha.lk', password: 'minosh12', link: '/employee/home' },  // Corrected link
    { username: 'savinda@alpha.lk', password: 'savinda12', link: '/funds/home' },
    { username: 'isuri@alpha.lk', password: 'isuri12', link: '/design/home' },
    { username: 'deneth@alpha.lk', password: 'deneth12', link: '/inventory/home' },
    { username: 'isini@alpha.lk', password: 'isini12', link: '/customers/home' },
    { username: 'thulani@alpha.lk', password: 'thulani12', link: '/transport/home' },
    { username: 'navindu@alpha.lk', password: 'navindu12', link: '/discounts/home' },
    { username: 'amandi@alpha.lk', password: 'amandi12', link: '/suppliers/home' },
  ];

  // Handle form submit
  const handleLogin = (e) => {
    e.preventDefault();

    // Validate credentials using switch-case
    let found = false;
    predefinedCredentials.forEach((user) => {
      if (username === user.username && password === user.password) {
        alert('Login successful!');
        navigate(user.link);  // Navigate to the unique route for each user
        found = true;
      }
    });

    if (!found) {
      setErrorMessage('Invalid username or password.');
    }
  };

  return (
    <>
      <header>
        <h1 className="text-3xl font-bold company-name">Alpha Apparels PVT LTD</h1>
      </header>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Makes sure it's centered vertically and horizontally
        backgroundColor: '#f4f4f4' // Light background color for the entire page
      }}>
        <div style={{
          padding: '40px',
          backgroundColor: '#add8e6', // Changed to light blue
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          width: '300px', // Fixed width for the form
          textAlign: 'center'
        }}>
          <h2 style={{ marginBottom: '20px' }}>Login Page</h2>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{
                  padding: '10px',
                  width: '100%',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  boxSizing: 'border-box' // Ensures padding and width are handled consistently
                }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  padding: '10px',
                  width: '100%',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;