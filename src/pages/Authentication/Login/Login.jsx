import React, { use, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../../../contexts/AuthContext';

const Signin = () => {
  const { signIn, GoogleSignIn } = use(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const handleGoogleSignIn = () => {
    GoogleSignIn()
      .then(() => {
        toast.success("Signed in with Google!");
        navigate(location.state ? location.state : '/');
      })
      .catch(error => {
        setErrorMessage(error.message);
      });
  };

  const handleSignin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    setErrorMessage('');

    const passRegex = /(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passRegex.test(password)) {
      return setErrorMessage('Password must have 1 lowercase, 1 uppercase, and be at least 6 characters.');
    }

    signIn(email, password)
      .then(() => {
        toast.success("Signed in successfully");
        navigate(location.state ? location.state : '/');
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="w-full max-w-md bg-white dark:bg-base-300 rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Sign In</h2>
        <form onSubmit={handleSignin} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="text-right">
            <p className="text-sm link link-hover">Forgot password?</p>
          </div>
          <button type="submit" className="btn btn-neutral w-full">
            Sign In
          </button>
        </form>

        <div className="divider">OR</div>

        <button onClick={handleGoogleSignIn} className="btn w-full bg-white text-black border-gray-300 hover:bg-gray-100 shadow-sm">
         
          Sign in with Google
        </button>

        <p className="mt-4 text-center text-sm">
          New here? <Link to="/register" className="underline font-semibold">Register</Link>
        </p>

        {errorMessage && (
          <p className="mt-2 text-center text-red-500 text-sm">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default Signin;
