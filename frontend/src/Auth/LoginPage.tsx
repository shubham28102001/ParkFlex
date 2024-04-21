/* Author: Jay Rana */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthStore from "../stores/useAuthStore";
import axios from "axios";
import LoginImage from "../assets/images/Login.jpg";

// Validates email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Functional component
const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setToken, setUser } = useAuthStore((state) => ({
    setToken: state.setToken,
    setUser: state.setUser,
  }));
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      return; 
    }

    const loadingToast = toast.loading('Logging in...');

    try {
      const response = await axios.post('auth/login', {
        email,
        password,
      });
      
      toast.dismiss(loadingToast);
      setToken(response.data.token);
      setUser(response.data.user);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {

      toast.dismiss(loadingToast);
      if (axios.isAxiosError(error) && error.response) {
        
        if (error.response.status === 400) {
          toast.error('Incorrect email or password.');
        } else {
          
          toast.error('An error occurred. Please try again later.');
        }
      }
    }
    
  };

  // Handler for navigation links
  const handleNavigate = (path: string) => {
    return (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.preventDefault();
      navigate(path);
    };
  };

  // Render Login page
  return (
    <div className='flex flex-col md:flex-row min-h-screen bg-gray-100'>
      <div className='md:flex-1 flex justify-center items-center bg-blue-500'>
        <img
          src={LoginImage}
          alt='ParkFlex'
          className='w-full h-full object-cover'
        />
      </div>
      <div className='md:flex-1 flex justify-center items-center'>
        <form
          onSubmit={handleLogin}
          className='space-y-6 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg'
        >
          <h2 className='text-center font-bold text-xl mb-4'>
            Welcome to ParkFlex
          </h2>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter Email Address'
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            required
          />
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Enter Password'
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
            required
          />
          <div className='flex items-center justify-between'>
            <button
              type='submit'
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full'
            >
              Log In
            </button>
          </div>
          <div className='text-center'>
            <a
              onClick={handleNavigate("/forgetpassword")}
              className='inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800'
              href='/forgot-password'
            >
              Forgot Password?
            </a>
            <p className='text-sm text-gray-600 mt-4'>
              Need an Account?{" "}
              <a
                onClick={handleNavigate("/register")}
                className='text-blue-500 hover:text-blue-800'
                href='/register'
              >
                Create an account
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
