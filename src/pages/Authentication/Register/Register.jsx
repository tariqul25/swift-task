import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../contexts/AuthContext';
import axios from 'axios';

const Register = () => {
  const { createUser, GoogleSignIn, setErrorMessage, errorMessage } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();




  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const userData = Object.fromEntries(formData.entries());
    const { name, email, password, photoUrl, role } = userData;

    try {
      const result = await createUser(email, password);
      const createdUser = result.user;

      const userPayload = {
        uid: createdUser.uid,
        name,
        email,
        photoUrl: photoUrl || null,
        role,
        coins: Number(role === 'worker' ? 10 : 50), 
      };
      console.log(userPayload);

      // Save user to backend using axios
      await axios.post((`${import.meta.env.VITE_BACKEND_URL}/api/users`), userPayload);

      Swal.fire({
        icon: 'success',
        title: 'Registered successfully',
        toast: true,
        position: 'top',
        timer: 1500,
        showConfirmButton: false,
      });

      navigate(location?.state?.from?.pathname || '/');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  //  Google Sign In
  const handleGoogleSignIn = async () => {
  try {
    const result = await GoogleSignIn();
    const signedInUser = result.user;

    console.log('Google signed in user:', signedInUser);

    if (!signedInUser.email || !signedInUser.uid) {
      throw new Error('Google user info is incomplete');
    }

    // 1️⃣ Check if user already exists
    let role = 'worker';
    let coins = 10;
    console.log(typeof coins);

    coins = Number(coins);

    const userPayload = {
      uid: signedInUser.uid,
      name: signedInUser.displayName || 'No Name',
      email: signedInUser.email,
      photoUrl: signedInUser.photoURL || null,
      role,
      coins,
    };

    console.log('Sending userPayload to backend:', userPayload);

    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users`, userPayload);

    Swal.fire({
      icon: 'success',
      title: 'Signed in with Google',
      toast: true,
      position: 'top',
      timer: 1500,
      showConfirmButton: false,
    }); 

    navigate(location?.state?.from?.pathname || '/');
  } catch (error) {
    console.error('Google Sign In Error:', error.message);
    setErrorMessage(error.message);
  }
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

          <label className="label">Role</label>
          <select name="role" className="select select-bordered w-full" required>
            <option value="">Select Role</option>
            <option value="worker">Worker</option>
            <option value="buyer">Buyer</option>
          </select>

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

