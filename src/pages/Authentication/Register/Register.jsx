import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../contexts/AuthContext';
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

    setErrorMessage('');

    const passRegex = /(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passRegex.test(password)) {
      return setErrorMessage('Password must include at least 1 lowercase, 1 uppercase, and be at least 6 characters.');
    }

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
        coins: role === 'worker' ? 10 : 50,
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

      const existingRes = await axiosInstance.get(`/api/users/${signedInUser.email}`);
      const userExists = existingRes.data;

      if (userExists) {
        Swal.fire({
          icon: 'success',
          title: 'Signed in with Google',
          toast: true,
          position: 'top',
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
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
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center">Create Account</h2>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="label font-medium">Full Name</label>
            <input type="text" name="name" className="input input-bordered w-full" placeholder="Your Name" required />
          </div>

          <div>
            <label className="label font-medium">Email</label>
            <input type="email" name="email" className="input input-bordered w-full" placeholder="Your Email" required />
          </div>

          <div>
            <label className="label font-medium">Upload Photo</label>
            <input type="file" name="photo" className="file-input file-input-bordered w-full" accept="image/*" />
          </div>

          <div>
            <label className="label font-medium">Password</label>
            <input type="password" name="password" className="input input-bordered w-full" placeholder="Password" required />
          </div>

          <div>
            <label className="label font-medium">Select Role</label>
            <select name="role" className="select select-bordered w-full" required>
              <option value="">-- Choose Role --</option>
              <option value="worker">Worker</option>
              <option value="buyer">Buyer</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-full">Register</button>
        </form>

        {errorMessage && (
          <div className="text-red-500 text-sm text-center">{errorMessage}</div>
        )}

        <div className="divider">OR</div>

        <button onClick={handleGoogleSignIn} className="btn btn-outline w-full">
          Sign in with Google
        </button>

        <p className="text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

