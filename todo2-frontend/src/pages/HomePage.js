import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; 

const HomePage = () => {
  useEffect(() => {
    // Create particles dynamically when the component is mounted
    const particlesContainer = document.querySelector('.home-page');

    for (let i = 0; i < 30; i++) {  // Adjust number of particles as needed
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particlesContainer.appendChild(particle);
    }
  }, []);  // Empty dependency array ensures this runs only once when the component mounts

  return (
    <div className="home-page">
      <div className="background-animation"></div>
      <div className="home-container">
        <h1>Welcome to the To-Do App</h1>
        <p className="subtitle">Keep track of all your tasks, effortlessly</p>
        <p>
          Please <Link to="/login">Login</Link> or <Link to="/register">Register</Link> to continue.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
