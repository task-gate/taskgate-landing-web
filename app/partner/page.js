"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Shield,
  AlertCircle,
  CheckCircle,
  Loader2,
  Mail,
  Lock,
  Building2,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  Check,
  X,
} from "lucide-react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/utils/firebase";
import { usePartnerAuth } from "@/contexts/PartnerAuthContext";

// Generate provider ID from app name
const generateProviderId = (appName) => {
  const sanitized = appName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .substring(0, 20);

  const uuid = Math.random().toString(36).substring(2, 8);
  return `${sanitized}_${uuid}`;
};

export default function PartnerPortal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, partnerData, loading, isAuthenticated, providerId } =
    usePartnerAuth();

  // Check for mode query param to default to register
  const initialMode =
    searchParams.get("mode") === "register" ? "register" : "login";
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [appName, setAppName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated && providerId) {
      router.push(`/partner/${providerId}/editor`);
    }
  }, [loading, isAuthenticated, providerId, router]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!appName.trim()) {
      setError("Please enter your app name");
      return;
    }

    if (appName.trim().length < 2) {
      setError("App name must be at least 2 characters");
      return;
    }

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one capital letter");
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setError("Password must contain at least one special character");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Generate provider ID
      const newProviderId = generateProviderId(appName);

      // Create partner document
      await setDoc(doc(db, "partners", user.uid), {
        uid: user.uid,
        email: user.email,
        app_name: appName.trim(),
        provider_id: newProviderId,
        status: "active",
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });

      setSuccess("Account created successfully! Redirecting...");

      // Redirect to editor
      setTimeout(() => {
        router.push(`/partner/${newProviderId}/editor`);
      }, 1500);
    } catch (err) {
      console.error("Registration error:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please login instead.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak. Please use at least 6 characters.");
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Fetch partner data to get provider ID
      const partnerRef = doc(db, "partners", user.uid);
      const partnerSnap = await getDoc(partnerRef);

      if (!partnerSnap.exists()) {
        setError("Partner account not found. Please register first.");
        return;
      }

      const data = partnerSnap.data();

      if (data.status !== "active") {
        setError("Your account is inactive. Please contact support.");
        return;
      }

      setSuccess("Login successful! Redirecting...");

      // Redirect to editor
      setTimeout(() => {
        router.push(`/partner/${data.provider_id}/editor`);
      }, 1000);
    } catch (err) {
      console.error("Login error:", err);
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email. Please register first.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later.");
      } else if (err.code === "auth/invalid-credential") {
        setError("Invalid email or password. Please try again.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--accent)] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto w-16 h-16 bg-gradient-to-br from-[var(--accent)] to-blue-600 rounded-2xl flex items-center justify-center mb-6"
          >
            <Shield className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">
            Partner Portal
          </h1>
          <p className="mt-2 text-[var(--foreground)] opacity-70">
            {mode === "login"
              ? "Sign in to manage your TaskGate integration"
              : "Create your partner account"}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex mb-6 bg-[var(--secondary-background)] rounded-lg p-1">
          <button
            onClick={() => {
              setMode("login");
              setError("");
              setSuccess("");
            }}
            className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              mode === "login"
                ? "bg-[var(--accent)] text-white"
                : "text-[var(--foreground)] hover:bg-[var(--background)]"
            }`}
          >
            <LogIn className="w-4 h-4" />
            Login
          </button>
          <button
            onClick={() => {
              setMode("register");
              setError("");
              setSuccess("");
            }}
            className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              mode === "register"
                ? "bg-[var(--accent)] text-white"
                : "text-[var(--foreground)] hover:bg-[var(--background)]"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Register
          </button>
        </div>

        {/* Form */}
        <motion.form
          key={mode}
          initial={{ opacity: 0, x: mode === "login" ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          onSubmit={mode === "login" ? handleLogin : handleRegister}
          className="bg-[var(--secondary-background)] rounded-xl p-6 border border-[var(--border-color)]"
        >
          {/* App Name (Register only) */}
          <AnimatePresence>
            {mode === "register" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4"
              >
                <label
                  htmlFor="appName"
                  className="block text-sm font-medium text-[var(--foreground)] mb-2"
                >
                  App Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground)] opacity-40" />
                  <input
                    type="text"
                    id="appName"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder="Your App Name"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                </div>
                <p className="mt-1.5 text-xs text-[var(--foreground)] opacity-50">
                  Your Provider ID will be auto-generated from this and cannot
                  be changed later.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[var(--foreground)] mb-2"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground)] opacity-40" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="partner@yourapp.com"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[var(--foreground)] mb-2"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground)] opacity-40" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-3 rounded-lg bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground)] opacity-40 hover:opacity-70"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {mode === "register" && password.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2">
                  {password.length >= 6 ? (
                    <Check className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-red-500" />
                  )}
                  <span
                    className={`text-xs ${
                      password.length >= 6 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    Minimum 6 characters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/[A-Z]/.test(password) ? (
                    <Check className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-red-500" />
                  )}
                  <span
                    className={`text-xs ${
                      /[A-Z]/.test(password) ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    One capital letter
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/[!@#$%^&*(),.?":{}|<>]/.test(password) ? (
                    <Check className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-red-500" />
                  )}
                  <span
                    className={`text-xs ${
                      /[!@#$%^&*(),.?":{}|<>]/.test(password)
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    One special character
                  </span>
                </div>
              </div>
            )}
            {mode === "register" && password.length === 0 && (
              <p className="mt-1 text-xs text-[var(--foreground)] opacity-50">
                Minimum 6 characters, one capital letter, one special character
              </p>
            )}
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-500">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Message */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5 text-green-500" />
                <p className="text-sm text-green-500">{success}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-6 rounded-lg bg-[var(--accent)] text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {mode === "login" ? "Signing in..." : "Creating account..."}
              </>
            ) : (
              <>
                {mode === "login" ? "Sign In" : "Create Account"}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-[var(--foreground)] opacity-60">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => setMode("register")}
                  className="text-[var(--accent)] hover:underline"
                >
                  Register now
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-[var(--accent)] hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
          <p className="mt-2 text-sm text-[var(--foreground)] opacity-60">
            Need help?{" "}
            <a
              href="mailto:partnerships@taskgate.co"
              className="text-[var(--accent)] hover:underline"
            >
              Contact us
            </a>
          </p>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 rounded-lg bg-[var(--secondary-background)] border border-[var(--border-color)]"
        >
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-[var(--accent)] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">
                Secure Partner Access
              </p>
              <p className="text-xs text-[var(--foreground)] opacity-60 mt-1">
                Your account is protected with Firebase Authentication. All data
                is encrypted and stored securely.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
