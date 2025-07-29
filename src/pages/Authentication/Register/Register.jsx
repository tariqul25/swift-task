import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../contexts/AuthContext';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAxios from '../../../hooks/useAxios';

const imgbbApiKey = import.meta.env.VITE_API_KEY; 
const imgbbUploadUrl = `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`;

const Register = () => {
  const { createUser, GoogleSignIn, setErrorMessage, errorMessage } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const axiosInstance = useAxios();

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const role = formData.get('role');
    const imageFile = formData.get('photo');

    try {
      let photoUrl = null;

      if (imageFile && imageFile.size > 0) {
        const imageData = new FormData();
        imageData.append('image', imageFile);

        const imgbbRes = await fetch(imgbbUploadUrl, {
          method: 'POST',
          body: imageData,
        });

        const imgbbData = await imgbbRes.json();
        if (imgbbData.success) {
          photoUrl = imgbbData.data.url;
        } else {
          throw new Error('Failed to upload image');
        }
      }

      const result = await createUser(email, password);
      const createdUser = result.user;

      const userPayload = {
        uid: createdUser.uid,
        name,
        email,
        photoUrl,
        role,
        coins: Number(role === 'worker' ? 10 : 50),
      };

      await axiosInstance.post(`/api/users`, userPayload);

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
      console.error('Registration Error:', error);
      setErrorMessage(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
  try {
    const result = await GoogleSignIn();
    const signedInUser = result.user;

    if (!signedInUser.email || !signedInUser.uid) {
      throw new Error('Google user info is incomplete');
    }

    // 🔍 Check if user already exists in DB
    const existingRes = await axiosInstance.get(`/api/users/${signedInUser.email}`);
    const userExists = existingRes.data;

    if (userExists) {
      // User exists: Don't override anything
      Swal.fire({
        icon: 'success',
        title: 'Signed in with Google',
        toast: true,
        position: 'top',
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      // New user: Create with default role 'worker' & coins
      const userPayload = {
        uid: signedInUser.uid,
        name: signedInUser.displayName || 'No Name',
        email: signedInUser.email,
        photoUrl: signedInUser.photoURL || null,
        role: 'worker',
        coins: 10,
      };

      await axiosInstance.post(`/api/users`, userPayload);

      Swal.fire({
        icon: 'success',
        title: 'Signed in with Google & Registered',
        toast: true,
        position: 'top',
        timer: 1500,
        showConfirmButton: false,
      });
    }

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

          <label className="label">Photo (upload)</label>
          <input type="file" name="photo" className="file-input w-full" accept="image/*" />

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
