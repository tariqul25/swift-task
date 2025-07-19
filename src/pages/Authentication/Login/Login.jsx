import React, { use, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { AuthContext } from '../../../contexts/AuthContext';

const Signin = () => {
  const { signIn, GoogleSignIn } = use(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const handleGoogleSignIn = () => {
    GoogleSignIn().then(result => {
      console.log('sign in success');
      navigate(`${location.state ? location.state : '/'}`);
    }).catch(error => {
      console.log(error);
    });
  };

  const handleSignin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    setErrorMessage('');

    const passRegex = /(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (passRegex.test(password) === false) {
      return setErrorMessage('Password must be 1 lower case, 1 upper case and at least 6 characters');
    }

    signIn(email, password)
      .then((result) => {
        toast.success("Signed in Successfully");
        navigate(`${location.state ? location.state : '/'}`);
      })
      .catch((error) => {
        const errorMessage = error.message;
        setErrorMessage(errorMessage);
      });
  };



  return (
    <div className="card w-full max-w-sm mx-auto bg-base-300 py-10 px-8 my-8 rounded-xl ">
      <h1 className='text-3xl font-bold text-center'>Login</h1>
      <div className="card-body">
        <form onSubmit={handleSignin} className="">
          <label className="label">Email</label>
          <input type="email" name='email' className="input" placeholder="Email" />
          <label className="label">Password</label>
          <input type="password" name='password' className="input" placeholder="Password" />
          <div>
            <p className="link link-hover">Forgot password?</p>
          </div>
          <button type='submit' className="btn btn-neutral w-full mt-4">Login</button>
        </form>

        <p className='text-center font-bold text-xl'>Or</p>
        <button onClick={handleGoogleSignIn} className="btn bg-blue-400 text-black border-[#e5e5e5]">
          <svg aria-label="Google logo" className='rounded-full' width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <g>
              <path d="m0 0H512V512H0" fill="#fff"></path>
              <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path>
              <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path>
              <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path>
              <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path>
            </g>
          </svg>
          Login with Google
        </button>
        <p>New to this website? Please <Link to='/register' className='underline'>Register</Link> </p>
        {
          errorMessage && <p className='text-red-400 text-center'>{errorMessage}</p> 
        }
      </div>
    </div>
  );
};

export default Signin;
