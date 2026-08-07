import { motion } from "framer-motion";
const suggestions = [
  "Summer outfit for men",
  "Oversized hoodie under ₹2000",
  "Best sneakers for daily use",
  "Ethnic wear for wedding",
  "Black cargos under ₹1500"
];
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.4,
    },
  },
};

const chipVariants = {
  hidden: {
    opacity: 0,
    y: 15,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};
function SuggestionChips() {
  return (
    <motion.div
  className="flex flex-wrap gap-3 mt-5"
  variants={containerVariants}
  initial="hidden"
  animate="show"
>

      {suggestions.map((item) => (

        <motion.button
  key={item}
  variants={chipVariants}
  whileHover={{
    y: -3,
    scale: 1.03,
  }}
  whileTap={{
    scale: 0.97,
  }}
  className="
    px-5
    py-2.5
    rounded-full
    bg-[#111]
    border
    border-[#222]
    text-sm
    transition-all
    duration-300
    hover:border-[#D4AF37]
    hover:text-[#D4AF37]
    hover:shadow-[0_0_15px_rgba(212,175,55,.15)]
  "
>
          {item}
        </motion.button>

      ))}

    </motion.div>
  );
}

export default SuggestionChips;