import { auth } from "../../firebase/config";
import { useState, useEffect, useContext, createContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import apiClient from "../../config/axiosInstance";

const authContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {

      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          setUser(firebaseUser);
          console.log(firebaseUser)
          setUserLoggedIn(true);
        } catch (error) {
          console.error("Error validating token:", error);
          setUser(null);
          setUserLoggedIn(false);
        }
      } else {
        setUser(null);
        setUserLoggedIn(false);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const value = {
    user,
    userLoggedIn,
    loading,
    role
  };

  return (
    <authContext.Provider value={value}>
      {!loading && children}
    </authContext.Provider>
  );
};

export function useAuth() {
  return useContext(authContext);
}