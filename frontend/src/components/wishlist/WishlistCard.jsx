import { Heart, Star, Eye } from "lucide-react";

function WishlistCard({ product }) {
  return (
    <div
      className="
        bg-[#111]
        border
        border-[#222]
        rounded-3xl
        overflow-hidden
        hover:border-[#D4AF37]
        transition-all
        duration-300
      "
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-72 object-cover"
      />

      <div className="p-6">

        <p className="text-sm text-[#D4AF37]">
          {product.brand}
        </p>

        <h3 className="text-xl font-semibold mt-2">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mt-5">

          <p className="font-semibold text-lg">
            ₹{product.price}
          </p>

          <div className="flex items-center gap-1">

            <Star
              size={16}
              fill="#D4AF37"
              color="#D4AF37"
            />

            {product.rating}

          </div>

        </div>

        <div className="flex gap-3 mt-8">

          <button
            className="
              flex-1
              bg-[#D4AF37]
              text-black
              py-3
              rounded-xl
              font-medium
              flex
              items-center
              justify-center
              gap-2
            "
          >
            <Eye size={18} />

            View Product

          </button>

          <button
            className="
              p-3
              border
              border-[#333]
              rounded-xl
              hover:border-red-500
              transition
            "
          >
            <Heart
              size={20}
              fill="#ef4444"
              color="#ef4444"
            />
          </button>

        </div>

      </div>

    </div>
  );
}

export default WishlistCard;