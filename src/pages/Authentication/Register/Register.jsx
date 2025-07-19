import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../contexts/AuthContext';

const Register = () => {
  const { createUser, GoogleSignIn, setErrorMessage, errorMessage } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const user = Object.fromEntries(formData.entries());
    const { email, password, name, photoUrl } = user;

    setErrorMessage('');

    // Optional validation
    // const passRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    // if (name.length < 6) {
    //   return setErrorMessage('Name should be at least 6 characters');
    // }
    // if (!passRegEx.test(password)) {
    //   return setErrorMessage('Password must include lowercase, uppercase, special character, and be at least 8 characters long');
    // }

    createUser(email, password)
      .then((result) => {
        Swal.fire({
          icon: 'success',
          title: 'Signed up successfully',
          toast: true,
          position: 'top',
          timer: 1500,
          showConfirmButton: false,
        });
        navigate(location?.state?.from?.pathname || '/');
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  const handleGoogleSignIn = () => {
    GoogleSignIn()
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Signed in successfully',
          toast: true,
          position: 'top',
          timer: 1500,
          showConfirmButton: false,
        });
        navigate(location?.state?.from?.pathname || '/');
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  return (
    <div className="card w-full max-w-sm mx-auto shrink-0 py-10 bg-base-300 px-6 my-8">
      <h1 className="text-3xl font-bold text-center">Register</h1>
      <div className="card-body rounded-xl">
        <form onSubmit={handleRegister}>
          <label className="label">Name</label>
          <input type="text" name="name" className="input" placeholder="Name" required />
          
          <label className="label">Email</label>
          <input type="email" name="email" className="input" placeholder="Email" required />
          
          <label className="label">Photo URL</label>
          <input type="text" name="photoUrl" className="input py-2" placeholder="Photo URL" />
          
          <label className="label">Password</label>
          <input type="password" name="password" className="input" placeholder="Password" required />
          
          <button type="submit" className="btn btn-neutral w-full mt-4">Register</button>
        </form>

        <p className="text-start mt-2">
          Already have an account? <Link to="/login" className="underline">Login</Link>
        </p>

        {errorMessage && (
          <p className="text-red-400 text-center mt-2">{errorMessage}</p>
        )}

        <div className="divider">OR</div>

        <button onClick={handleGoogleSignIn} className="btn btn-outline w-full">
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Register;
