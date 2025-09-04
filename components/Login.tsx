import React, { useState } from 'react';
import { useLugha } from '../hooks/useLugha';

const EmailFormView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { login } = useLugha();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 6;
  const canSubmit = isEmailValid && isPasswordValid && !isLoading;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Create a user name from the email
      const name = email.split('@')[0]
        .replace(/[._-]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      login(name || 'User');
    }, 1500);
  };

  return (
    <>
      <div className="flex justify-start w-full mb-4">
        <button onClick={onBack} className="flex items-center text-slate-600 hover:text-slate-900 font-semibold p-2 -ml-2 rounded-lg hover:bg-slate-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
        </button>
      </div>
      <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">{isSignUp ? 'Create an account' : 'Sign in with Email'}</h2>
      <p className="text-center text-slate-500 mb-6">{isSignUp ? 'Start your language journey today.' : 'Welcome back!'}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
            <input
            id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
            />
            {!isEmailValid && email.length > 0 && <p className="text-red-500 text-xs mt-1">Please enter a valid email address.</p>}
        </div>
        <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
            id="password" name="password" type="password" autoComplete={isSignUp ? "new-password" : "current-password"} required value={password} onChange={(e) => setPassword(e.target.value)}
            className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
            />
            {!isPasswordValid && password.length > 0 && <p className="text-red-500 text-xs mt-1">Password must be at least 6 characters.</p>}
        </div>
        
        <div className="pt-2">
            <button type="submit" disabled={!canSubmit} className="w-full flex items-center justify-center py-3 px-4 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed transform hover:scale-[1.02]">
            {isLoading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
            {isLoading ? (isSignUp ? 'Creating account...' : 'Signing in...') : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
        </div>
      </form>
      
      {!isSignUp && (
          <div className="text-sm text-center mt-5">
              <button className="font-medium text-blue-600 hover:text-blue-500">Forgot your password?</button>
          </div>
      )}

      <div className="relative flex py-5 items-center">
        <div className="flex-grow border-t border-slate-200"></div>
        <span className="flex-shrink mx-4 text-slate-500 text-sm">{isSignUp ? 'Already have an account?' : "Don't have an account?"}</span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>

      <button onClick={() => setIsSignUp(!isSignUp)} className="w-full py-3 px-4 bg-slate-600 text-white rounded-lg shadow-md hover:bg-slate-700 transition-all duration-300 font-bold transform hover:scale-[1.02]">
        {isSignUp ? 'Sign In' : 'Create an Account'}
      </button>
    </>
  );
};


const MainLoginView: React.FC<{ onEmailClick: () => void }> = ({ onEmailClick }) => {
  const { login, loginAsGuest } = useLugha();
  
  const handleGoogleLogin = () => {
    login('Google User');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center text-slate-800">Get Started</h2>
      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center py-3 px-4 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 transition-colors duration-300 transform hover:scale-[1.02]"
        aria-label="Sign in with Google"
      >
        <svg className="w-6 h-6 mr-3" viewBox="0 0 48 48" aria-hidden="true">
           <path fill="#4285F4" d="M24 9.5c3.2 0 6.1 1.1 8.4 3.2l6.5-6.5C34.6 2.3 29.5 0 24 0 14.9 0 7.3 5.4 3 13.5l7.9 6.2C12.9 13.5 18 9.5 24 9.5z"></path>
           <path fill="#34A853" d="M46.5 24c0-1.6-.1-3.2-.4-4.7H24v9h12.8c-.5 2.9-2.2 5.4-4.8 7.1l7.3 5.7c4.3-4 6.9-9.8 6.9-16.1z"></path>
           <path fill="#FBBC05" d="M10.9 28.2c-.3-.9-.5-1.9-.5-2.9s.2-2 .5-2.9l-7.9-6.2C.9 19.3 0 21.6 0 24s.9 4.7 2.5 6.9l8.4-5.7z"></path>
           <path fill="#EA4335" d="M24 48c5.5 0 10.6-1.8 14.4-4.9l-7.3-5.7c-1.8 1.2-4.1 1.9-6.8 1.9-5.9 0-11-4-13.1-9.6l-7.9 6.2C7.3 42.6 14.9 48 24 48z"></path>
           <path fill="none" d="M0 0h48v48H0z"></path>
        </svg>
        <span className="font-semibold text-slate-700">Sign in with Google</span>
      </button>

      <button
        onClick={onEmailClick}
        className="w-full flex items-center justify-center py-3 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 font-bold transform hover:scale-[1.02]"
        aria-label="Sign in with Email"
      >
         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span className="font-semibold">Sign in with Email</span>
      </button>

      <div className="relative flex py-3 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-4 text-slate-500 text-sm font-medium">OR</span>
          <div className="flex-grow border-t border-slate-200"></div>
      </div>

      <button
        onClick={loginAsGuest}
        className="w-full py-3 px-4 bg-slate-600 text-white rounded-lg shadow-md hover:bg-slate-700 transition-all duration-300 font-bold transform hover:scale-[1.02]"
        aria-label="Continue as Guest"
      >
        <span className="font-semibold">Continue as Guest</span>
      </button>
    </div>
  );
};


const Login: React.FC = () => {
  const [view, setView] = useState<'main' | 'email'>('main');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold text-slate-800 mb-2 tracking-tighter">Lugha Learner</h1>
        <p className="text-xl text-slate-600">Your journey to learning Kenyan languages starts here.</p>
      </div>

      <div className="w-full max-w-sm p-8 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200">
        {view === 'main' ? (
            <MainLoginView onEmailClick={() => setView('email')} />
        ) : (
            <EmailFormView onBack={() => setView('main')} />
        )}
      </div>
    </div>
  );
};

export default Login;