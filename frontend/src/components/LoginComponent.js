import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, loginWithGoogle } from '../redux/actions/authActions';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleGoogleSuccess = (credentialResponse) => {
    dispatch(loginWithGoogle(credentialResponse.credential));
    navigate('/');
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
  };

  return (
    <>
      <div className="login-container">
        <h2 className="login-title">Login With Google</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="mb-6">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} useOneTap />
        </div>
      </div>
      <style>
        {`
          .login-container {
              max-width: 400px;
              margin: 50px auto;
              padding: 25px;
              background: white;
              border-radius: 10px;
              box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
              text-align: center;
              transition: transform 0.2s, box-shadow 0.2s;
          }

          .login-container:hover {
              transform: scale(1.02);
              box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
          }

          .login-title {
              font-size: 26px;
              font-weight: bold;
              margin-bottom: 20px;
              color: #333;
          }

          .error-message {
              margin-bottom: 15px;
              padding: 10px;
              background: #ffe5e5;
              color: #d9534f;
              border-radius: 5px;
              font-size: 14px;
              font-weight: 500;
          }

          .or-divider {
              position: relative;
              margin: 20px 0;
              text-align: center;
          }

          .or-divider hr {
              border: none;
              height: 1px;
              background: #ccc;
              margin: 0;
          }

          .or-divider span {
              position: absolute;
              top: -10px;
              left: 50%;
              transform: translateX(-50%);
              background: white;
              padding: 0 12px;
              color: #666;
              font-size: 14px;
              font-weight: 500;
          }

          .input-field {
              width: 100%;
              padding: 12px;
              margin: 12px 0;
              border: 1px solid #bbb;
              border-radius: 6px;
              font-size: 16px;
              transition: border-color 0.3s ease-in-out, box-shadow 0.2s;
          }

          .input-field:focus {
              border-color: #007bff;
              outline: none;
              box-shadow: 0 0 6px rgba(0, 123, 255, 0.2);
          }

          .submit-btn {
              width: 100%;
              padding: 12px;
              background: #007bff;
              color: white;
              border: none;
              border-radius: 6px;
              font-size: 16px;
              font-weight: 600;
              cursor: pointer;
              transition: background 0.3s ease-in-out, transform 0.2s;
          }

          .submit-btn:hover {
              background: #0056b3;
              transform: translateY(-2px);
          }

          @media (max-width: 480px) {
              .login-container {
                  width: 90%;
                  padding: 20px;
              }
          }

        `}
      </style>
    </>
  );
};

export default LoginForm;
