/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.jsx'; // make sure extension is correct
import toast from 'react-hot-toast';

const SellerLogin = () => {
  const navigate = useNavigate();
  const { isSeller, setIsSeller, axios } = useAppContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // If already logged in as seller, redirect immediately
  useEffect(() => {
    if (isSeller) {
      navigate('/seller');
    }
  }, [isSeller, navigate]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const { data } = await axios.post('/api/seller/login', { email, password });

      if (data.success) {
        setIsSeller(true); // Set seller logged in status
        
        navigate('/seller'); // Redirect after successful login
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Server error');
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex items-center min-h-screen text-sm text-gray-600">
      <div className="flex flex-col items-start gap-5 p-8 m-auto border border-gray-200 rounded-lg shadow-xl min-w-80 sm:min-w-88">
        <p className="m-auto text-2xl font-medium">
          <span className="text-primary">Seller</span> Login
        </p>

        <div className="w-full">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-2 mt-1 border border-gray-200 rounded outline-primary"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="w-full">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full p-2 mt-1 border border-gray-200 rounded outline-primary"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="w-full py-2 text-white rounded-md cursor-pointer bg-primary">
          Login
        </button>
      </div>
    </form>
  );
};

export default SellerLogin;
