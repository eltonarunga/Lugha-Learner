
import React from 'react';
import { useLugha } from '../hooks/useLugha';

const Login: React.FC = () => {
  const { loginAsGuest } = useLugha();

  // Mock login functions
  const handleGoogleLogin = () => {
    console.log('Login with Google clicked (mocked)');
    loginAsGuest(); // For MVP, all logins act as guest login
  };

  const handleEmailLogin = () => {
    console.log('Login with Email clicked (mocked)');
    loginAsGuest(); // For MVP, all logins act as guest login
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-slate-800 mb-2">Lugha Learner</h1>
        <p className="text-xl text-slate-600">Your journey to learning Kenyan languages starts here.</p>
      </div>

      <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-lg space-y-4">
        <h2 className="text-2xl font-bold text-center text-slate-700">Get Started</h2>
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center py-3 px-4 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-100 transition-colors duration-300"
          aria-label="Sign in with Google"
        >
          <svg className="w-6 h-6 mr-3" viewBox="0 0 48 48" aria-hidden="true">
             <path fill="#4285F4" d="M24 9.5c3.2 0 6.1 1.1 8.4 3.2l6.5-6.5C34.6 2.3 29.5 0 24 0 14.9 0 7.3 5.4 3 13.5l7.9 6.2C12.9 13.5 18 9.5 24 9.5z"></path>
             <path fill="#34A853" d="M46.5 24c0-1.6-.1-3.2-.4-4.7H24v9h12.8c-.5 2.9-2.2 5.4-4.8 7.1l7.3 5.7c4.3-4 6.9-9.8 6.9-16.1z"></path>
             <path fill="#FBBC05" d="M10.9 28.2c-.3-.9-.5-1.9-.5-2.9s.2-2 .5-2.9l-7.9-6.2C.9 19.3 0 21.6 0 24s.9 4.7 2.5 6.9l8.4-5.7z"></path>
             <path fill="#EA4335" d="M24 48c5.5 0 10.6-1.8 14.4-4.9l-7.3-5.7c-1.8 1.2-4.1 1.9-6.8 1.9-5.9 0-11-4-13.1-9.6l-7.9 6.2C7.3 42.6 14.9 48 24 48z"></path>
             <path fill="none" d="M0 0h48v48H0z"></path>
          </svg>
          <span className="font-semibold text-slate-600">Sign in with Google</span>
        </button>

        <button
          onClick={handleEmailLogin}
          className="w-full flex items-center justify-center py-3 px-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
          aria-label="Sign in with Email"
        >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="font-semibold">Sign in with Email</span>
        </button>

        <div className="relative flex py-3 items-center">
            <div className="flex-grow border-t border-slate-300"></div>
            <span className="flex-shrink mx-4 text-slate-500">OR</span>
            <div className="flex-grow border-t border-slate-300"></div>
        </div>

        <button
          onClick={loginAsGuest}
          className="w-full py-3 px-4 bg-slate-600 text-white rounded-lg shadow-md hover:bg-slate-700 transition-colors duration-300"
          aria-label="Continue as Guest"
        >
          <span className="font-semibold">Continue as Guest</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
