import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../contexts/AuthContext';
import { updateProfile } from 'firebase/auth';
import useAxios from '../../../hooks/useAxios';
import { UserPlus, Coins, ShieldCheck, Sparkles } from 'lucide-react';
import { compressImageToBase64 } from '../../../utils/imageCompressor';
import { getFriendlyFirebaseErrorMessage } from '../../../utils/firebaseErrors';

const Register = () => {
  const { createUser, GoogleSignIn, setErrorMessage, errorMessage } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const axiosInstance = useAxios();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('worker');

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const imageFile = form.photo?.files?.[0];
    const selectedRole = role;

    setErrorMessage('');

    const passRegex = /(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passRegex.test(password)) {
      return setErrorMessage('Password must include at least 1 lowercase letter, 1 uppercase letter, and be at least 6 characters.');
    }

    setLoading(true);

    try {
      let photoUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face';

      if (imageFile && imageFile.size > 0) {
        try {
          photoUrl = await compressImageToBase64(imageFile, 350, 0.82);
        } catch (uploadErr) {
          console.warn('Image compression fallback:', uploadErr);
        }
      }

      const result = await createUser(email, password);

      const isStandardWebUrl =
        photoUrl &&
        !photoUrl.startsWith('data:') &&
        photoUrl.length < 2048;

      try {
        if (isStandardWebUrl) {
          await updateProfile(result.user, {
            displayName: name,
            photoURL: photoUrl,
          });
        } else {
          await updateProfile(result.user, {
            displayName: name,
          });
        }
      } catch (profileErr) {
        console.warn('Firebase Auth updateProfile warning:', profileErr);
        try {
          await updateProfile(result.user, { displayName: name });
        } catch (e) {
          // non-fatal
        }
      }

      const newUser = {
        uid: result.user.uid,
        name,
        email,
        photo: photoUrl,
        role: selectedRole,
        coins: selectedRole === 'buyer' ? 50 : 10,
        createdAt: new Date().toISOString(),
      };

      await axiosInstance.post('/api/users', newUser);

      Swal.fire({
        icon: 'success',
        title: 'Account Created Successfully!',
        text: `Welcome to SwiftTasks! You received ${newUser.coins} bonus coins.`,
        timer: 2000,
        showConfirmButton: false,
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Registration Error:', error);
      const friendlyMsg = getFriendlyFirebaseErrorMessage(error);
      setErrorMessage(friendlyMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    try {
      await GoogleSignIn();
      Swal.fire({
        icon: 'success',
        title: 'Signed in with Google!',
        timer: 1500,
        showConfirmButton: false,
      });
      navigate(location?.state?.from?.pathname || '/dashboard');
    } catch (error) {
      console.error('Google Sign In Error:', error);
      const friendlyMsg = getFriendlyFirebaseErrorMessage(error);
      setErrorMessage(friendlyMsg);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light flex items-center justify-center mx-auto mb-3">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Create Free Account
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Join the SwiftTasks workforce and start earning today
          </p>
        </div>

        {/* Bonus announcement */}
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
          <Coins className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>New Workers get 10 free coins; Buyers get 50 coins!</span>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g. John Doe"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Password *
            </label>
            <input
              type="password"
              name="password"
              placeholder="At least 6 chars (1 upper, 1 lower)"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Select Account Role *
            </label>
            <select
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              required
            >
              <option value="worker">Worker (Complete tasks & earn coins)</option>
              <option value="buyer">Buyer (Post tasks & hire workers)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Profile Photo (Optional)
            </label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
            />
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-lg shadow-primary/25 disabled:opacity-50 transition-all cursor-pointer"
          >
            {loading ? 'Registering Account...' : 'Create Account'}
          </button>
        </form>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
          <span className="bg-white dark:bg-slate-900 px-3 text-xs text-slate-400 uppercase">
            Or
          </span>
        </div>

        {/* Google Signup */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-colors flex items-center justify-center gap-3 cursor-pointer shadow-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Sign up with Google</span>
        </button>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-primary dark:text-primary-light hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
