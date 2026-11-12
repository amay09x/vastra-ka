import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/auth";

// ============================================================
// CONTEXT
// ============================================================

const AuthContext = createContext(null);

// ============================================================
// PROVIDER
// ============================================================

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true); // true until Firebase resolves

  // ── Persist the session via Firebase's built-in listener ──
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);   // null when logged-out, User object when logged-in
      setLoading(false);
    });

    // Unsubscribe when the component unmounts
    return () => unsubscribe();
  }, []);

  // ── Auth helpers ──────────────────────────────────────────

  async function signUp(email, password) {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return credential.user;
  }

  async function logIn(email, password) {
    const credential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return credential.user;
  }

  async function logOut() {
    await signOut(auth);
  }

  // ── Get a fresh ID token (call before protected API requests) ──
  async function getIdToken() {
    if (!user) return null;
    return user.getIdToken(/* forceRefresh */ false);
  }

  // ── Context value ─────────────────────────────────────────

  // ── Derived guest-safe display name ───────────────────────
  const displayName = user?.displayName || user?.email || "Guest";
  const isGuest     = !user;

  const value = {
    user,         // Firebase User | null
    displayName,  // Always a safe string — "Guest" for unauthenticated visitors
    isGuest,      // true when no user is signed in
    loading,      // true until initial auth state is known
    signUp,
    logIn,
    logOut,
    getIdToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {/*
        Don't render the app tree at all until Firebase has resolved
        the initial session. This prevents a flash of the wrong UI.
      */}
      {!loading && children}
    </AuthContext.Provider>
  );
}

// ============================================================
// HOOK
// ============================================================

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
