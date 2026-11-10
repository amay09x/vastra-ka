import { motion } from "framer-motion";

export default function HeroLogo() {
  // Hanger paths
  const hookPath = `
    M655,268
    C645,220 660,175 700,150
    C730,130 770,128 800,138
    C850,155 880,195 880,245
    C880,295 845,330 800,335
    L778,335
    L774,400
    L768,430
  `;

  const leftArmPath = `
    M768,430
    C730,430 705,450 680,480
    C620,545 560,585 480,620
    C400,655 320,690 270,730
    C235,758 220,768 222,782
    C224,796 245,800 262,788
  `;

  const rightArmPath = `
    M768,430
    C806,430 831,450 856,480
    C916,545 976,585 1056,620
    C1136,655 1216,690 1266,730
    C1301,758 1316,768 1314,782
    C1312,796 1291,800 1274,788
  `;

  // Reusable animation transition
  const drawTransition = (delay = 0, duration = 1.2) => ({
    pathLength: {
      delay,
      duration,
      ease: [0.65, 0, 0.35, 1],
    },
    opacity: {
      delay,
      duration: 0.2,
    },
  });

  return (
    <motion.svg
      viewBox="0 0 1536 1024"
      xmlns="http://www.w3.org/2000/svg"
      className="vastra-hanger"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <defs>
        {/* Soft restrained luxury glow */}
        <filter
          id="glowSoft"
          x="-100%"
          y="-100%"
          width="300%"
          height="300%"
        >
          <feGaussianBlur
            stdDeviation="12"
            result="blur"
          />

          <feMerge>
            <feMergeNode in="blur" />
          </feMerge>
        </filter>

        {/* Subtle bright core */}
        <filter
          id="glowCore"
          x="-100%"
          y="-100%"
          width="300%"
          height="300%"
        >
          <feGaussianBlur
            stdDeviation="2.5"
            result="blur"
          />

          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* =====================================================
          1. HOOK
          ===================================================== */}

      {/* Soft glow */}
      <motion.path
        d={hookPath}
        fill="none"
        stroke="#F6C84A"
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glowSoft)"
        initial={{
          pathLength: 0,
          opacity: 0,
        }}
        animate={{
          pathLength: 1,
          opacity: 0.18,
        }}
        transition={drawTransition(0, 1.25)}
      />

      {/* Main gold hook */}
      <motion.path
        d={hookPath}
        fill="none"
        stroke="#F6C84A"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{
          pathLength: 0,
          opacity: 0,
        }}
        animate={{
          pathLength: 1,
          opacity: 1,
        }}
        transition={{
          pathLength: {
            duration: 1.1,
            ease: [0.65, 0, 0.35, 1],
          },
          opacity: {
            duration: 0.2,
          },
        }}
      />

      {/* Bright core */}
      <motion.path
        d={hookPath}
        fill="none"
        stroke="#FFF8DC"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glowCore)"
        initial={{
          pathLength: 0,
          opacity: 0,
        }}
        animate={{
          pathLength: 1,
          opacity: 0.7,
        }}
        transition={drawTransition(0, 1.25)}
      />

      {/* =====================================================
          2. LEFT ARM
          ===================================================== */}

      {/* Left arm soft glow */}
      <motion.path
        d={leftArmPath}
        fill="none"
        stroke="#F6C84A"
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glowSoft)"
        initial={{
          pathLength: 0,
          opacity: 0,
        }}
        animate={{
          pathLength: 1,
          opacity: 0.18,
        }}
        transition={drawTransition(0.85, 1.25)}
      />

      {/* Left arm main gold line */}
      <motion.path
        d={leftArmPath}
        fill="none"
        stroke="#F6C84A"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{
          pathLength: 0,
          opacity: 0,
        }}
        animate={{
          pathLength: 1,
          opacity: 1,
        }}
        transition={drawTransition(0.85, 1.25)}
      />

      {/* Left arm bright core */}
      <motion.path
        d={leftArmPath}
        fill="none"
        stroke="#FFF8DC"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glowCore)"
        initial={{
          pathLength: 0,
          opacity: 0,
        }}
        animate={{
          pathLength: 1,
          opacity: 0.7,
        }}
        transition={drawTransition(0.85, 1.25)}
      />

      {/* =====================================================
          3. RIGHT ARM
          ===================================================== */}

      {/* Right arm soft glow */}
      <motion.path
        d={rightArmPath}
        fill="none"
        stroke="#F6C84A"
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glowSoft)"
        initial={{
          pathLength: 0,
          opacity: 0,
        }}
        animate={{
          pathLength: 1,
          opacity: 0.18,
        }}
        transition={drawTransition(0.95, 1.25)}
      />

      {/* Right arm main gold line */}
      <motion.path
        d={rightArmPath}
        fill="none"
        stroke="#F6C84A"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{
          pathLength: 0,
          opacity: 0,
        }}
        animate={{
          pathLength: 1,
          opacity: 1,
        }}
        transition={drawTransition(0.95, 1.25)}
      />

      {/* Right arm bright core */}
      <motion.path
        d={rightArmPath}
        fill="none"
        stroke="#FFF8DC"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glowCore)"
        initial={{
          pathLength: 0,
          opacity: 0,
        }}
        animate={{
          pathLength: 1,
          opacity: 0.7,
        }}
        transition={drawTransition(0.95, 1.25)}
      />
    </motion.svg>
  );
}