import React, { useEffect, useState } from 'react';
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



  const GoogleSignIn = () => {
    return signInWithPopup(auth, provider);
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
      setUser(res.data);
      setCoins(res.data.coins || 0);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
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
              name: currentUser.displayName || dbUser.name,
              photo: currentUser.photoURL || dbUser.photo,
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
            // User doesn't exist → insert full info to MongoDB
            const newUser = {
              uid: currentUser.uid,
              name: currentUser.displayName || "Unknown",
              email: currentUser.email,
              photo: currentUser.photoURL || "",
              role: "worker",
              coins: 10
            };
            try {
              const createRes = await axiosInstance.post('/api/users', newUser);
              if (createRes.status === 201 || createRes.status === 200) {
                const createdUser = createRes.data;
                setUser(newUser);
                setRole(createdUser.role);
                setCoins(createdUser.coins);
              }
            } catch (createError) {
              console.error('User creation failed:', createError);
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
    fetchUser
  };

  return (
    <AuthContext value={authInfo}>
      {children}
    </AuthContext>
  );
};

export default AuthProvider;



