import { motion, AnimatePresence } from "framer-motion";

import AISearch from "./AISearch";
import SuggestionChips from "./SuggestionChips";

function LandingHero({ onSearch }) {
  return (
   
      <motion.section
  className="
    relative
    min-h-screen
    w-full
    overflow-hidden
    bg-[#050505]
  "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 0.985,
        filter: "blur(8px)",
      }}
      transition={{
        duration: 0.9,
        ease: "easeInOut",
      }}
    >

{/* ========================================
    VASTRA HERO VIDEO
    EXTENDED LEFT + RIGHT EDGE LOCKED
    TRUE SOFT LEFT FADE
======================================== */}

<div
  className="
    pointer-events-none
    absolute
    top-0
    bottom-0
    left-[0%]
    right-[-44%]
    z-0
    overflow-hidden
  "
>
  <video
    autoPlay
    muted
    loop
    playsInline
    className="absolute inset-0 h-full w-full object-cover"
   style={{
  objectPosition: "center center",
  transform: "scale(1.04)",

   }}
>
    <source
      src="/videos/VastraHomepage.mp4"
      type="video/mp4"
    />
  </video>
  {/* SOFT LEFT FADE — OVERLAPS VIDEO EDGE */}

<div
  className="
    pointer-events-none
    absolute
    inset-y-0
    left-0
    w-[58%]
    z-[1]
  "
  style={{
    background: `
      linear-gradient(
        90deg,
        #050505 0%,
        #050505 28%,
        rgba(5,5,5,0.98) 36%,
        rgba(5,5,5,0.90) 44%,
        rgba(5,5,5,0.72) 52%,
        rgba(5,5,5,0.50) 60%,
        rgba(5,5,5,0.30) 68%,
        rgba(5,5,5,0.14) 78%,
        rgba(5,5,5,0.05) 90%,
        transparent 100%
      )
    `,
  }}
/>
  {/* ONLY LEFT FADE */}
  <div
    className="
      pointer-events-none
      absolute
      inset-y-0
      left-0
      w-[70%]
      z-[1]
    "
    style={{
  background: `
    linear-gradient(
      90deg,
      #050505 0%,
      #050505 15%,
      rgba(5,5,5,0.98) 25%,
      rgba(5,5,5,0.90) 35%,
      rgba(5,5,5,0.72) 45%,
      rgba(5,5,5,0.50) 55%,
      rgba(5,5,5,0.30) 65%,
      rgba(5,5,5,0.14) 78%,
      rgba(5,5,5,0.04) 90%,
      transparent 100%
    )
  `,
}}
  />
</div>
 



      


      {/* ========================================
          HERO CONTENT
      ======================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-screen
          max-w-7xl
          items-center
          px-6
          pt-28
          pb-16
          lg:px-10
        "
      >

        <motion.div
          className="max-w-2xl"
          initial={{
            opacity: 0,
            y: 45,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
            delay: 0.35,
            ease: "easeOut",
          }}
        >

          {/* Small editorial label */}

          <div
            className="
              mb-7
              flex
              items-center
              gap-3
              text-[11px]
              font-medium
              uppercase
              tracking-[0.35em]
              text-white/45
            "
          >
            <span className="h-px w-8 bg-[#D4AF37]" />

            VASTRA · PERSONAL FASHION AI
          </div>


          {/* Main heading */}

          <h1
            className="
              body-font
              text-6xl
              font-medium
              uppercase
              leading-[0.88]
              tracking-[-0.045em]
              text-[#F7F3EA]
              sm:text-7xl
              lg:text-[6.5rem]
            "
          >

            <span className="block">
              YOUR
            </span>

            <span className="block">
              PERSONAL
            </span>

            <span
              className="
                brand-font
                block
                font-medium
                normal-case
                tracking-[-0.02em]
                text-[#D4AF37]
              "
            >
              AI STYLIST.
            </span>

          </h1>


          {/* Description */}

          <p
            className="
              mt-8
              max-w-lg
              text-base
              leading-7
              text-white/65
              sm:text-lg
            "
          >
            Tell VASTRA what you're looking for.
            <br />
            We'll build the look around you.
          </p>


          {/* AI SEARCH */}

          <div className="mt-9 max-w-xl">
            <AISearch onSearch={onSearch} />
          </div>


          {/* Suggestion Chips */}

          <AnimatePresence>
            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 1,
                duration: 0.5,
              }}
              className="mt-4"
            >
              <SuggestionChips />
            </motion.div>
          </AnimatePresence>


          {/* Editorial CTA */}

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 1.2,
              duration: 0.5,
            }}
            className="
              mt-7
              flex
              items-center
              gap-7
              text-sm
            "
          >

            <button
              className="
                text-[#D4AF37]
                transition-colors
                hover:text-[#E8C878]
              "
            >
              Ask VASTRA
              <span className="ml-2">→</span>
            </button>

            <button
              className="
                text-white/50
                transition-colors
                hover:text-white
              "
            >
              Explore the edit
              <span className="ml-2">↗</span>
            </button>

          </motion.div>

        </motion.div>

      </div>


      {/* ========================================
          SCROLL INDICATOR
      ======================================== */}

      <motion.div
        className="
          absolute
          bottom-8
          right-8
          z-20
          hidden
          flex-col
          items-center
          gap-3
          lg:flex
        "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 1.5,
          duration: 0.6,
        }}
      >

        <span
          className="
            text-[9px]
            uppercase
            tracking-[0.3em]
            text-white/35
            [writing-mode:vertical-rl]
          "
        >
          Scroll to discover
        </span>

        <span
          className="
            h-12
            w-px
            bg-gradient-to-b
            from-[#D4AF37]
            to-transparent
          "
        />

      </motion.div>

    </motion.section>
  );
}

export default LandingHero;