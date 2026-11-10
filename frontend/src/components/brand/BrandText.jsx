import { motion } from "framer-motion";

function BrandText() {
  return (
    <div className="mt-10">

      <motion.h1
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="
          text-7xl
          font-bold
          tracking-[14px]
          text-[#D4AF37]
        "
      >
        VASTRA
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="
          mt-6
          text-xl
          text-white/80
        "
      >
        Style Curated For You
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8 }}
        className="
          mt-2
          text-[#D4AF37]
        "
      >
        Luxury Meets Intelligence
      </motion.p>

    </div>
  );
}

export default BrandText;