import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// ============================================================
// HELPERS
// ============================================================

function mapFirebaseError(code) {
  switch (code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Check your connection.";
    default:
      return "Something went wrong. Please try again.";
  }
}

// ============================================================
// COMPONENT
// ============================================================

function LoginCard() {
  const navigate = useNavigate();
  const { logIn, signUp } = useAuth();

  // ── UI state ─────────────────────────────────────────────
  const [mode, setMode]               = useState("login"); // "login" | "signup"
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");

  // ── Cursor-reactive highlight ─────────────────────────────
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  // ── Form submit ───────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        await logIn(email.trim(), password);
      } else {
        await signUp(email.trim(), password);
      }
      // On success, Firebase's onAuthStateChanged fires → user is set in context
      navigate("/");
    } catch (err) {
      setError(mapFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  // ── Mode toggle ───────────────────────────────────────────
  const toggleMode = () => {
    setMode((m) => (m === "login" ? "signup" : "login"));
    setError("");
    setEmail("");
    setPassword("");
  };

  // ── Render ────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 3.2, duration: 0.8 }}
      onMouseMove={handleMouseMove}
      className="
        relative overflow-hidden
        w-full max-w-[430px]
        rounded-[30px]
        border border-white/10
        bg-white/5 backdrop-blur-2xl
        p-10
        shadow-[0_0_40px_rgba(212,175,55,0.08)]
      "
    >
      {/* ── Cursor-reactive gold light ── */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[30px] transition-[background] duration-75"
        style={{
          background: `radial-gradient(
            circle 180px at ${mousePosition.x}% ${mousePosition.y}%,
            rgba(212,175,55,0.13),
            rgba(212,175,55,0.045) 38%,
            transparent 72%
          )`,
        }}
      />

      {/* ── Glass reflection ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background: `linear-gradient(
            115deg,
            transparent 20%,
            rgba(255,255,255,0.08) 45%,
            transparent 65%
          )`,
          transform: `translateX(${(mousePosition.x - 50) * 0.08}%)`,
        }}
      />

      {/* ── Card content ── */}
      <div className="relative z-10">

        {/* ── Coming Soon badge ── */}
        <div className="flex justify-center mb-6">
          <span
            className="
              inline-flex items-center gap-1.5
              px-4 py-1.5
              rounded-full
              border border-[#D4AF37]/40
              bg-[#D4AF37]/10
              text-[#D4AF37] text-xs font-semibold tracking-widest uppercase
              shadow-[0_0_18px_rgba(212,175,55,0.15)]
            "
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            Coming Soon
          </span>
        </div>

        {/* Title */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-3xl font-semibold text-white">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-white/60 mt-2 mb-8">
              {mode === "login"
                ? "Authentication is launching soon — stay tuned."
                : "Account creation is launching soon — stay tuned."}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Google button — disabled until auth launches */}
        <button
          type="button"
          disabled
          title="Authentication coming soon"
          className="
            w-full h-14 rounded-xl bg-white
            flex items-center justify-center gap-3
            font-medium opacity-40 cursor-not-allowed select-none
          "
        >
          <FcGoogle size={22} />
          Continue with Google
        </button>

        {/* OR divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/40 text-sm">OR</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>

          {/* Email */}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            autoComplete="email"
            required
            disabled
            className="
              w-full h-14 rounded-xl
              bg-[#111] border border-white/10
              px-5 text-white outline-none mb-4
              transition opacity-50 cursor-not-allowed
            "
          />

          {/* Password */}
          <div className="relative mb-5">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
              disabled
              className="
                w-full h-14 rounded-xl
                bg-[#111] border border-white/10
                px-5 pr-12 text-white outline-none
                transition opacity-50 cursor-not-allowed
              "
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="
                  flex items-start gap-2
                  bg-red-500/10 border border-red-500/20
                  text-red-400 text-sm
                  rounded-xl px-4 py-3 mb-4
                "
              >
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <button
            type="submit"
            disabled
            title="Authentication coming soon"
            className="
              w-full h-14 mt-2 rounded-xl
              bg-[#D4AF37] text-black font-semibold
              flex items-center justify-center gap-2
              opacity-50 cursor-not-allowed select-none
            "
          >
            {mode === "login" ? "Enter VASTRA" : "Create Account"}
          </button>

        </form>

        {/* Bottom links */}
        <div className="flex justify-between mt-8 text-sm">
          {mode === "login" && (
            <button className="text-white/60 hover:text-[#D4AF37] transition">
              Forgot Password?
            </button>
          )}

          <button
            onClick={toggleMode}
            className="text-[#D4AF37] hover:text-[#F6D978] transition ml-auto"
          >
            {mode === "login" ? "Create Account" : "Back to Login"}
          </button>
        </div>

      </div>
    </motion.div>
  );
}

export default LoginCard;
