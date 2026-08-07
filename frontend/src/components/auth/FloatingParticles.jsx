import { motion } from "framer-motion";

const particles = [...Array(28)];

function FloatingParticles() {
  return (
    <>
      {particles.map((_, index) => {
        const size = Math.random() * 5 + 2;
        const left = Math.random() * 100;
        const delay = Math.random() * 6;
        const duration = 12 + Math.random() * 10;

        return (
          <motion.div
            key={index}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              top: "110%",
              background: "#D4AF37",
              opacity: 0.18,
              filter: "blur(1px)",
            }}
            animate={{
              y: [-1200],
              x: [0, 30, -20, 10, 0],
              opacity: [0, 0.2, 0.35, 0.2, 0],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              repeat: Infinity,
              duration,
              delay,
              ease: "linear",
            }}
          />
        );
      })}
    </>
  );
}

export default FloatingParticles;