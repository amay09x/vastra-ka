import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";

import HeroLogo from "../brand/HeroLogo";
import AISearch from "./AISearch";
import SuggestionChips from "./SuggestionChips";

function LandingHero({ onSearch }) {
 return (
  <motion.section
    className="relative bg-[#050505] min-h-screen overflow-hidden"
    initial={{ opacity: 1 }}
    animate={{ opacity: 1 }}
    exit={{
      opacity: 0,
      scale: 0.985,
      filter: "blur(8px)",
    }}
    transition={{
      duration: 0.8,
      ease: "easeInOut",
    }}
  >

      {/* Gold Glow */}

      <div className="absolute top-0 right-[-250px] h-[900px] w-[900px] rounded-full bg-[#D4AF37]/10 blur-[180px]" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-24 lg:pt-32">

        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16 items-center">

          {/* LEFT */}

          <motion.div
  className="max-w-xl"
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{
    opacity: 0,
    y: -40,
  }}
  transition={{
    duration: 0.7,
    ease: "easeInOut",
  }}
>

            <h1 className="text-4xl lg:text-5xl font-semibold leading-[1.08] tracking-[-0.03em]">
  Your Personal

  <span className="block mt-2 text-[#D4AF37]">
    AI Stylist.
  </span>
</h1>

            <p className="mt-6 max-w-md text-lg leading-8 text-[#A8A8A8]">
  Describe your style, budget or occasion.
  <br />
  VASTRA finds complete outfits you'll love.
</p>

            {/* Buttons */}

           

          

            {/* Search */}

            <div className="mt-10 max-w-lg">

              <AISearch onSearch={onSearch} />

            </div>

            {/* Chips */}

            <AnimatePresence>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: .4 }}
                className="mt-8"
              >

                <SuggestionChips />
                <motion.button
  whileHover={{ x: 5 }}
  transition={{ duration: 0.2 }}
  className="
    mt-6
    flex
    items-center
    gap-2
    text-sm
    text-[#A8A8A8]
    hover:text-[#D4AF37]
    transition-colors
    group
  "
>
  <span className="text-[#D4AF37]">✨</span>

  <span>
    See how <span className="text-[#D4AF37]">VASTRA</span> works
  </span>

  <ArrowRight
    size={16}
    className="group-hover:translate-x-1 transition-transform"
  />
</motion.button>

              </motion.div>

            </AnimatePresence>

          </motion.div>

          {/* RIGHT */}

          <motion.div
  className="flex justify-center lg:justify-end -mt-10 lg:-mt-6"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{
    opacity: 0,
    scale: 0.92,
  }}
  transition={{
    duration: 0.7,
    ease: "easeInOut",
  }}
>
            <HeroLogo />

          </motion.div>

        </div>

      </div>

    </motion.section>
  );
}

export default LandingHero;