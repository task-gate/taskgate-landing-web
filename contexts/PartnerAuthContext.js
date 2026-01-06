"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/utils/firebase";

const PartnerAuthContext = createContext({});

export const usePartnerAuth = () => useContext(PartnerAuthContext);

export function PartnerAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [partnerData, setPartnerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        // Fetch partner data from Firestore
        if (db) {
          try {
            const partnerRef = doc(db, "partners", firebaseUser.uid);
            const partnerSnap = await getDoc(partnerRef);

            if (partnerSnap.exists()) {
              setPartnerData(partnerSnap.data());
            } else {
              setPartnerData(null);
            }
          } catch (error) {
            console.error("Error fetching partner data:", error);
            setPartnerData(null);
          }
        }
      } else {
        setUser(null);
        setPartnerData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    if (auth) {
      await signOut(auth);
      setUser(null);
      setPartnerData(null);
    }
  };

  return (
    <PartnerAuthContext.Provider
      value={{
        user,
        partnerData,
        loading,
        logout,
        isAuthenticated: !!user && !!partnerData,
        providerId: partnerData?.provider_id || null,
      }}
    >
      {children}
    </PartnerAuthContext.Provider>
  );
}
