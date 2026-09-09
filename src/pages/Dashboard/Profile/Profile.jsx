import React, { useState, useEffect } from 'react';
import { updateProfile } from 'firebase/auth';
import { auth } from '../../../firebase/firebase.config';
import Swal from 'sweetalert2';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { compressImageToBase64 } from '../../../utils/imageCompressor';
import {
  User,
  Mail,
  Coins,
  Shield,
  Briefcase,
  Camera,
  CheckCircle2,
  Calendar,
  Lock,
  Upload,
  Save,
  Clock,
  Sparkles,
  ExternalLink,
  Edit3,
  X
} from 'lucide-react';

const Profile = () => {
  const { user, role, coins, updateUserProfileState, fetchUser } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [displayName, setDisplayName] = useState(user?.displayName || user?.name || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || user?.photo || '');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.photoURL || user?.photo || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    if (user?.displayName || user?.name) {
      setDisplayName(user.displayName || user.name);
    }
    const currentPhoto = user?.photoURL || user?.photo;
    if (currentPhoto) {
      setPhotoURL(currentPhoto);
      setPreviewUrl(currentPhoto);
    }
  }, [user]);

  // Fetch role-specific statistics
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user?.email) return;
      try {
        if (role === 'worker') {
          const res = await axiosSecure.get(`/api/worker-stats/${user.email}`);
          setUserStats(res.data);
        } else if (role === 'buyer') {
          const res = await axiosSecure.get(`/api/buyer-stats?email=${user.email}`).catch(() => null);
          if (res?.data) setUserStats(res.data);
        } else if (role === 'admin') {
          const res = await axiosSecure.get(`/api/admin/stats`).catch(() => null);
          if (res?.data) setUserStats(res.data);
        }
      } catch (err) {
        // non-blocking
      }
    };
    fetchUserStats();
  }, [user?.email, role]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      try {
        const compressedBase64 = await compressImageToBase64(file, 350, 0.82);
        setPreviewUrl(compressedBase64);
        setPhotoURL(compressedBase64);
      } catch (err) {
        setPreviewUrl(URL.createObjectURL(file));
      }
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user?.email) return;
    setIsSaving(true);

    try {
      let finalPhotoUrl = photoURL;

      // If a file was selected and not already compressed
      if (imageFile && (!finalPhotoUrl || !finalPhotoUrl.startsWith('data:image'))) {
        try {
          finalPhotoUrl = await compressImageToBase64(imageFile, 350, 0.82);
        } catch (imgErr) {
          console.warn('Image compression fallback:', imgErr);
        }
      }

      // 1. Update Firebase Auth Profile if logged in with Firebase
      if (auth?.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName,
          photoURL: finalPhotoUrl,
        });
      }

      // 2. Update MongoDB Backend Profile
      await axiosSecure.patch(`/api/users/profile/${user.email}`, {
        name: displayName,
        photo: finalPhotoUrl,
      });

      setPhotoURL(finalPhotoUrl);
      setPreviewUrl(finalPhotoUrl);

      // 3. Immediately update global client-side auth state
      if (typeof updateUserProfileState === 'function') {
        updateUserProfileState(displayName, finalPhotoUrl);
      }
      if (typeof fetchUser === 'function') {
        await fetchUser();
      }

      Swal.fire({
        icon: 'success',
        title: 'Profile Updated!',
        text: 'Your profile picture and details have been successfully saved.',
        timer: 2200,
        showConfirmButton: false,
      });

      setIsEditing(false);
      setImageFile(null);
    } catch (error) {
      console.error('Failed to update profile:', error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.response?.data?.message || error.message || 'Could not update profile. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getRoleBadge = () => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800';
      case 'buyer':
        return 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800';
      default:
        return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Cover Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 sm:p-10 text-white shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end gap-6">
          {/* Avatar with edit badge */}
          <div className="relative group">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={displayName || 'User'}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-white/30 shadow-2xl bg-slate-800"
              />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white font-black text-3xl flex items-center justify-center ring-4 ring-white/30 shadow-2xl">
                {(displayName || user?.email || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <button
              onClick={() => setIsEditing(true)}
              className="absolute bottom-0 right-0 p-2 rounded-xl bg-white text-slate-800 shadow-md hover:bg-slate-100 transition-transform active:scale-95 cursor-pointer"
              title="Change Photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* User Info */}
          <div className="text-center sm:text-left flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {displayName || 'SwiftTasks User'}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider border ${getRoleBadge()}`}>
                {role || 'Worker'}
              </span>
            </div>
            <p className="text-white/80 text-sm flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-4 h-4 text-white/70" />
              {user?.email}
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="bg-white/15 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-center flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-400/20 text-amber-300">
              <Coins className="w-6 h-6" />
            </div>
            <div className="text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 block">Coin Balance</span>
              <span className="text-xl font-black text-white">{Number(coins || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Edit / View Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Profile Details
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Update your personal account information and public profile.
                </p>
              </div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Profile
                </button>
              )}
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Display Name
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3 rounded-2xl text-sm transition-colors border ${
                    isEditing
                      ? 'bg-slate-50 dark:bg-slate-800 border-indigo-500/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500'
                      : 'bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-not-allowed'
                  }`}
                  required
                />
              </div>

              {/* Email (Read Only) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address (Primary Account)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-4 py-3 pl-10 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm cursor-not-allowed"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Email is tied to your login credentials and cannot be changed directly.</p>
              </div>

              {/* Photo Input (when editing) */}
              {isEditing && (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Change Profile Photo
                  </label>
                  
                  {/* File Upload */}
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer shadow-sm">
                      <Upload className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Choose Image File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    {imageFile && (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium truncate max-w-[200px] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {imageFile.name}
                      </span>
                    )}
                  </div>

                  {/* Or URL input */}
                  <div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Or paste direct Image URL:</span>
                    <input
                      type="url"
                      value={photoURL}
                      onChange={(e) => {
                        setPhotoURL(e.target.value);
                        setPreviewUrl(e.target.value);
                      }}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* Account Role */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block capitalize">
                      Account Type: {role || 'Worker'}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {role === 'admin'
                        ? 'Full administrative control over users, tasks & cashouts'
                        : role === 'buyer'
                        ? 'Can create tasks, hire workers, and review submissions'
                        : 'Can browse tasks, submit work, and earn coin rewards'}
                    </span>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase ${getRoleBadge()}`}>
                  Active
                </span>
              </div>

              {/* Actions */}
              {isEditing && (
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setImageFile(null);
                      setDisplayName(user?.displayName || user?.name || '');
                      setPreviewUrl(user?.photoURL || user?.photo || '');
                      setPhotoURL(user?.photoURL || user?.photo || '');
                    }}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving Changes...' : 'Save Profile'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Right Column: Activity / Quick Stats & Account Security */}
        <div className="space-y-6">
          {/* Activity / Performance Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Activity Overview
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Current Coins</span>
                <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5" />
                  {Number(coins || 0).toLocaleString()}
                </span>
              </div>

              {role === 'worker' && (
                <>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Submissions</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {userStats?.totalSubmissions || 0}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Pending Review</span>
                    <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                      {userStats?.pendingSubmissions || 0}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Earned</span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {userStats?.totalEarning || 0} coins
                    </span>
                  </div>
                </>
              )}

              {role === 'buyer' && (
                <>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Tasks Posted</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {userStats?.totalTasks ?? 'Active'}
                    </span>
                  </div>
                </>
              )}

              {role === 'admin' && (
                <>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Network Talent</span>
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      {userStats?.totalWorkers || 0} Workers
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Platform Tasks</span>
                    <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                      {userStats?.totalTasks || 0} Tasks
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Account Security Info */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-500" />
              Security & Auth Status
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Auth Provider</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                  {user?.providerData?.[0]?.providerId === 'google.com' ? 'Google Sign-In' : 'Email / Password'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Account Status</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>User Identifier</span>
                <span className="font-mono text-[10px] text-slate-400 truncate max-w-[120px]">
                  {user?.uid}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
