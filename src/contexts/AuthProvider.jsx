import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { auth } from '../firebase/firebase.config';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from 'firebase/auth';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [coins,setCoins]=useState(0)

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

  const provider = new GoogleAuthProvider();

  const GoogleSignIn = () => {
    return signInWithPopup(auth, provider);
  };


  const updateUserCoins = (newCoinValue) => {
  setUser(prev => ({ ...prev, coins: newCoinValue }));
};


  //  Firebase user change hole MongoDB theke role fetch kora
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      setUser(currentUser);
      console.log(currentUser);

      if (currentUser?.email) {
        try {
          const res = await fetch(`https://swift-tasks-zeta.vercel.app/api/users/${currentUser?.email}`);
          const data = await res.json();
          console.log(data);

          if (res.ok && data?.role && data?.coins) {
            setRole(data.role);
            setCoins(data?.coins)
          } else {
            setRole(null);
          }
        } catch (err) {
          console.error('Failed to fetch role:', err.message);
          setRole(null);
        }
      } else {
        setRole(null);
      }

      setLoading(false);
    });

    return () => {
      unSubscribe();
    };
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
    updateUserCoins
  };

  return (
    <AuthContext value={authInfo}>
      {children}
    </AuthContext>
  );
};

export default AuthProvider;
