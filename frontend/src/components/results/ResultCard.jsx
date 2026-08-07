import { Heart, ExternalLink, Star } from "lucide-react";
import { motion } from "framer-motion";

function ResultCard({
  image,
  brand,
  name,
  price,
  originalPrice,
  discount,
  rating,
  reviews,
  aiMatch,
  aiReason,
  source,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
      transition={{
        duration: 0.35,
      }}
      className="
      group
      bg-[#111111]
      rounded-3xl
      overflow-hidden
      border
      border-[#222]
      hover:border-[#D4AF37]
      hover:shadow-[0_0_30px_rgba(212,175,55,.15)]
      transition-all
      duration-300
    "
    >
      {/* Header */}

      <div className="flex justify-between items-center p-5">

        <button className="hover:text-[#D4AF37] transition">
          <Heart size={20} />
        </button>

        <button className="hover:text-[#D4AF37] transition">
          <ExternalLink size={20} />
        </button>

      </div>

      {/* Product Image */}

      <div className="overflow-hidden">

        <img
          src={image}
          alt={name}
          className="
          w-full
          aspect-[4/5]
          object-cover
          group-hover:scale-105
          transition-transform
          duration-500
        "
        />

      </div>

      {/* Content */}

      <div className="p-5">

        {/* Rating + AI */}

        <div className="flex justify-between items-center mb-4">

          <div className="flex items-center gap-1 text-sm">

            <Star
              size={15}
              fill="#D4AF37"
              color="#D4AF37"
            />

            <span>{rating}</span>

            <span className="text-[#888]">
              ({reviews})
            </span>

          </div>

          <span
            className="
            bg-[#D4AF37]/15
            text-[#D4AF37]
            text-xs
            font-semibold
            px-3
            py-1
            rounded-full
          "
          >
            ✨ {aiMatch}% Match
          </span>

        </div>

        {/* Brand */}

        <p className="text-xs uppercase tracking-widest text-[#888]">

          {brand}

        </p>

        {/* Name */}

        <h3
          className="
          mt-2
          text-lg
          font-semibold
          line-clamp-2
        "
        >
          {name}
        </h3>

        {/* Price */}

        <div className="flex items-center gap-3 mt-4">

          <span className="text-xl font-bold">

            ₹{price}

          </span>

          <span className="line-through text-[#777]">

            ₹{originalPrice}

          </span>

          <span className="text-green-400 font-semibold">

            {discount}% OFF

          </span>

        </div>

        {/* AI Reason */}

        <p
          className="
          mt-4
          text-sm
          text-[#B5B5B5]
          leading-6
          line-clamp-2
        "
        >
          {aiReason}
        </p>

        {/* Source */}

        <p className="mt-5 text-xs text-[#777]">

          Source: {source}

        </p>

        {/* Button */}

        <button
          className="
          mt-6
          w-full
          rounded-xl
          bg-[#D4AF37]
          text-black
          py-3
          font-semibold
          hover:scale-[1.02]
          active:scale-[.98]
          transition-all
        "
        >
          View Details →
        </button>

      </div>
    </motion.div>
  );
}

export default ResultCard;