import { useState } from "react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";

function LoginCard() {
  const [mousePosition, setMousePosition] = useState({
    x: 50,
    y: 50,
  });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMousePosition({ x, y });
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 80,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        delay: 3.2,
        duration: 0.8,
      }}
      onMouseMove={handleMouseMove}
      className="
        relative
        overflow-hidden
        w-full
        max-w-[430px]
        rounded-[30px]
        border
        border-white/10
        bg-white/5
        backdrop-blur-2xl
        p-10
        shadow-[0_0_40px_rgba(212,175,55,0.08)]
      "
    >
      {/* =========================================
          CURSOR-REACTIVE GOLD LIGHT
          ========================================= */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          rounded-[30px]
          transition-[background] duration-75
        "
        style={{
          background: `
            radial-gradient(
              circle 180px at ${mousePosition.x}% ${mousePosition.y}%,
              rgba(212,175,55,0.13),
              rgba(212,175,55,0.045) 38%,
              transparent 72%
            )
          `,
        }}
      />

      {/* =========================================
          SUBTLE GLASS REFLECTION
          ========================================= */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-20
        "
        style={{
          background: `
            linear-gradient(
              115deg,
              transparent 20%,
              rgba(255,255,255,0.08) 45%,
              transparent 65%
            )
          `,
          transform: `translateX(${(mousePosition.x - 50) * 0.08}%)`,
        }}
      />

      {/* =========================================
          CARD CONTENT
          ========================================= */}

      <div className="relative z-10">

        <h2 className="text-3xl font-semibold text-white">
          Welcome Back
        </h2>

        <p className="text-white/60 mt-2 mb-8">
          Continue your luxury shopping journey.
        </p>

        {/* Google */}

        <button
          className="
            w-full
            h-14
            rounded-xl
            bg-white
            flex
            items-center
            justify-center
            gap-3
            font-medium
            hover:scale-[1.02]
            transition
          "
        >
          <FcGoogle size={22} />
          Continue with Google
        </button>

        {/* OR */}

        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-white/10" />

          <span className="text-white/40 text-sm">
            OR
          </span>

          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Email */}

        <input
          type="email"
          placeholder="Email Address"
          className="
            w-full
            h-14
            rounded-xl
            bg-[#111]
            border
            border-white/10
            px-5
            text-white
            outline-none
            mb-5
            transition
            focus:border-[#D4AF37]/50
            focus:shadow-[0_0_20px_rgba(212,175,55,0.08)]
          "
        />

        {/* Password */}

        <input
          type="password"
          placeholder="Password"
          className="
            w-full
            h-14
            rounded-xl
            bg-[#111]
            border
            border-white/10
            px-5
            text-white
            outline-none
            transition
            focus:border-[#D4AF37]/50
            focus:shadow-[0_0_20px_rgba(212,175,55,0.08)]
          "
        />

        {/* Enter */}

        <button
          className="
            w-full
            h-14
            mt-8
            rounded-xl
            bg-[#D4AF37]
            text-black
            font-semibold
            hover:scale-[1.02]
            hover:shadow-[0_0_25px_rgba(212,175,55,0.18)]
            transition
          "
        >
          Enter VASTRA
        </button>

        {/* Bottom links */}

        <div className="flex justify-between mt-8 text-sm">

          <button
            className="
              text-white/60
              hover:text-[#D4AF37]
              transition
            "
          >
            Forgot Password?
          </button>

          <button
            className="
              text-[#D4AF37]
              hover:text-[#F6D978]
              transition
            "
          >
            Create Account
          </button>

        </div>

      </div>
    </motion.div>
  );
}

export default LoginCard;