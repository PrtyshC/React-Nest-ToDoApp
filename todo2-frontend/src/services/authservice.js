// services/authService.js

import {jwtDecode as jwt_decode} from 'jwt-decode';

const API_URL = 'http://localhost:4000';  

// Login function to authenticate and get the JWT token
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      // Store JWT token in local storage
      localStorage.setItem('access_token', data.access_token);
      return true; // Successful login
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    console.error(error);
    return false;  // Login failed
  }
};

// Function to decode the JWT token
export const decodeToken = () => {
  const token = localStorage.getItem('access_token');
  if (token) {
    return jwt_decode(token);  // Decode the JWT token
  }
  return null;
};

// Function to check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('access_token');
  if (token) {
    const decodedToken = jwt_decode(token);
    const isExpired = decodedToken.exp * 1000 < Date.now();  // Check token expiry
    return !isExpired;
  }
  return false;
};

// Function to logout
export const logout = () => {
  localStorage.removeItem('access_token');
};
