import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const { loginWithRedirect, isAuthenticated, logout, user } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = () => {
    loginWithRedirect({
      appState: { returnTo: '/home' }
    });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1533134486753-c833f0ed4866?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
    >
      <div className="bg-white bg-opacity-80 p-16 rounded-lg shadow-lg text-center text-black max-w-md mx-auto">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Reminder App</h1>
        
        {!isAuthenticated ? (
          <button
            onClick={handleLogin}
            className="bg-purple-600 text-white px-6 py-2 rounded-full font-semibold text-lg"
          >
            Get Started
          </button>
        ) : (
          <div>
            <p className="mb-4">Welcome back, {user?.name}!</p>
            <button
              onClick={() => logout({ returnTo: window.location.origin })}
              className="bg-purple-600 text-white px-6 py-2 rounded-full font-semibold text-lg"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage; 