import { motion } from "framer-motion";
import FloatingParticles from "./FloatingParticles";


function AnimatedBackground() {
  return (
    <>
      {/* Background */}
      <div className="absolute inset-0 bg-[#050505]" />

      {/* Animated Gradient */}
      <motion.div
        className="
          absolute
          -top-96
          -left-96
          w-[1200px]
          h-[1200px]
          rounded-full
          blur-[220px]
          opacity-30
        "
        style={{
          background:
            "radial-gradient(circle,#D4AF37 0%,transparent 70%)",
        }}
        animate={{
          x: [0, 150, -80, 0],
          y: [0, -120, 120, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Second Glow */}
      <motion.div
        className="
          absolute
          bottom-[-500px]
          right-[-400px]
          w-[1000px]
          h-[1000px]
          rounded-full
          blur-[180px]
          opacity-10
        "
        style={{
          background:
            "radial-gradient(circle,#F4D56B 0%,transparent 70%)",
        }}
        animate={{
          x: [0, -120, 80, 0],
          y: [0, 100, -100, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Golden Light Sweep */}

<motion.div
  initial={{
    x: "-130%",
    rotate: -25,
    opacity: 0,
  }}
  animate={{
    x: "180%",
    opacity: [0, 0.08, 0.14, 0.08, 0],
  }}
  transition={{
    duration: 3,
    delay: 0.8,
    ease: "easeInOut",
  }}
  className="
    absolute
    top-[-20%]
    left-0
    w-[45vw]
    h-[160vh]
    pointer-events-none
    blur-[80px]
  "
  style={{
    background:
      "linear-gradient(to right, transparent 0%, rgba(212,175,55,0.7) 50%, transparent 100%)",
  }}
/>
<FloatingParticles />
    </>
    
  );
}

export default AnimatedBackground;