import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form'; 
import './Register.css';

const Register = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [message, setMessage] = useState('');

  const onSubmit = async (data) => {
    // Email validation: check if the email ends with @nw18.com
    if (!data.email.endsWith('@nw18.com')) {
      setMessage('Invalid email address.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/auth/register', {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });

      if (response.status === 201) {
        setMessage('Registration Successful');
        reset(); // Reset form after successful registration
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        setMessage('User already exists');
      } else {
        setMessage('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="register-page">
      <div className="background-animation"></div>
      <div className="register-container">
        <h1>Register</h1>
        {message && <p className="register-message">{message}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>First Name</label>
            <input
              type="text"
              {...register('firstName', { required: 'First Name is required' })}
            />
            {errors.firstName && <p className="error-message">{errors.firstName.message}</p>}
          </div>
          <div>
            <label>Last Name</label>
            <input
              type="text"
              {...register('lastName', { required: 'Last Name is required' })}
            />
            {errors.lastName && <p className="error-message">{errors.lastName.message}</p>}
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@nw18\.com$/,
                  message: 'Invalid email address. Please use an @nw18.com email.',
                },
              })}
            />
            {errors.email && <p className="error-message">{errors.email.message}</p>}
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <p className="error-message">{errors.password.message}</p>}
          </div>
          <button type="submit">Register</button>
        </form>
        <div>
          <Link to="/">Home</Link> |
          <span> Already a user? </span>
          <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
