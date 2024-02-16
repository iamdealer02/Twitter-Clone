// WelcomePage.js
import React from 'react';
import './WelcomePage.css'; // Make sure to create this CSS file in the same directory

const WelcomePage = () => {
  return (
    <div className="welcome-container">
      <header className="welcome-header">
        <h1>Happening now</h1>
        <p>Join today.</p>
      </header>
      <div className="auth-actions">
        <button className="auth-button google">Sign in with Google</button>
        <button className="auth-button apple">Sign up with Apple</button>
        <hr className="divider"/>
        <button className="auth-button create">Create account</button>
      </div>
      <footer className="welcome-footer">
        <p>Already have an account? <a href="/signin">Sign in</a></p>
      </footer>
    </div>
  );
};

export default WelcomePage;
