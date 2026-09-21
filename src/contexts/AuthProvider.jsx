import React, { useEffect, useState, useRef } from 'react';
import { AuthContext } from './AuthContext';
import { auth } from '../firebase/firebase.config';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import useAxios from '../hooks/useAxios';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [coins, setCoins] = useState(0);

  const isGoogleSigningIn = useRef(false);
  const axiosInstance = useAxios();
  const provider = new GoogleAuthProvider();

  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => {
    setUser(null);
    setRole(null);
    return signOut(auth);
  };



  const GoogleSignIn = async () => {
    isGoogleSigningIn.current = true;
    try {
      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;
      if (googleUser?.email) {
        try {
          const res = await axiosInstance.get(`/api/users/${googleUser.email}`);
          if (res.data) {
            setUser(prev => ({ ...prev, ...res.data }));
            setRole(res.data.role);
            setCoins(res.data.coins);
          }
        } catch (err) {
          if (err.response && err.response.status === 404) {
            const newUser = {
              uid: googleUser.uid,
              name: googleUser.displayName || 'Google User',
              email: googleUser.email,
              photo: googleUser.photoURL || '',
              role: 'worker',
              coins: 10,
              createdAt: new Date().toISOString(),
            };
            try {
              await axiosInstance.post('/api/users', newUser);
              setUser(prev => ({ ...prev, ...newUser }));
              setRole('worker');
              setCoins(10);
            } catch (createErr) {
              console.error('Google user creation in DB failed:', createErr);
            }
          }
        }
      }
      return result;
    } finally {
      isGoogleSigningIn.current = false;
    }
  };

  const updateUserCoins = async (explicitCoins) => {
    if (typeof explicitCoins === 'number') {
      setUser(prev => ({ ...prev, coins: explicitCoins }));
      setCoins(explicitCoins);
      return;
    }
    if (!user?.email) return;
    try {
      const res = await axiosInstance.get(`/api/user/coins?email=${user?.email}`);
      const updatedCoin = res.data?.coin ?? 0;
      setUser(prev => ({ ...prev, coins: updatedCoin }));
      setCoins(updatedCoin);
    } catch (error) {
      console.error('Failed to update coins', error);
    }
  };



  const fetchUser = async () => {
    if (!user?.email) return;
    try {
      const res = await axiosInstance.get(`/api/users/${user.email}`);
      const dbUser = res.data;
      setUser(prev => ({
        ...prev,
        ...dbUser,
        name: dbUser.name,
        photo: dbUser.photo,
        displayName: dbUser.name,
        photoURL: dbUser.photo,
      }));
      setCoins(dbUser.coins || 0);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  const updateUserProfileState = (name, photo) => {
    setUser(prev => prev ? ({
      ...prev,
      name: name || prev.name,
      photo: photo || prev.photo,
      displayName: name || prev.displayName,
      photoURL: photo || prev.photoURL,
    }) : prev);
  };

  useEffect(() => {
    fetchUser();
  }, [user?.email]);


  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);

      if (currentUser?.email) {
        try {
           const idToken = await currentUser.getIdToken();

          const res = await axiosInstance.get(`/api/users/${currentUser.email}`);

          if (res.status === 200) {
            const dbUser = res.data;

            const mergedUser = {
              uid: currentUser.uid,
              email: currentUser.email,
              name: dbUser.name || currentUser.displayName || "User",
              photo: dbUser.photo || currentUser.photoURL || "",
              role: dbUser.role,
              coins: dbUser.coins,
              idToken: idToken,
            };

            setUser(mergedUser);
            setRole(dbUser.role);
            setCoins(dbUser.coins);
            console.log("Merged User:", mergedUser);
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            // User does not exist in DB (deleted by admin) → log out immediately (unless currently signing in via Google)
            if (!isGoogleSigningIn.current) {
              console.warn('User deleted from DB. Signing out from Firebase Auth.');
              try {
                await signOut(auth);
              } catch (signOutErr) {
                console.warn('Sign out error:', signOutErr);
              }
              setUser(null);
              setRole(null);
              setCoins(0);
            }
          } else {
            console.error('Fetch user error:', error.message);
          }
        }
      } else {
        setRole(null);
        setCoins(0);
      }

      setLoading(false);
    });

    return () => unSubscribe();
  }, []);

  const authInfo = {
    signIn,
    createUser,
    user,
    setUser,
    role,
    loading,
    setLoading,
    logOut,
    errorMessage,
    setErrorMessage,
    GoogleSignIn,
    isAdmin: role === 'admin',
    isWorker: role === 'worker',
    coins,
    setCoins,
    updateUserCoins,
    fetchUser,
    updateUserProfileState
  };

  return (
    <AuthContext value={authInfo}>
      {children}
    </AuthContext>
  );
};

export default AuthProvider;



