import { Heart } from "lucide-react";

function EmptyWishlist() {
  return (
    <div
      className="
        bg-[#111]
        border
        border-[#222]
        rounded-3xl
        py-24
        px-8
        text-center
      "
    >
      <div
        className="
          w-20
          h-20
          mx-auto
          rounded-full
          bg-[#181818]
          flex
          items-center
          justify-center
        "
      >
        <Heart
          size={36}
          color="#D4AF37"
        />
      </div>

      <h2 className="mt-8 text-3xl font-semibold">

  Your Wishlist is Empty

</h2>

<p className="mt-4 text-[#888] text-lg">

  Discover pieces worth saving.

</p>

      <button
        className="
          mt-10
          px-8
          py-4
          rounded-xl
          bg-[#D4AF37]
          text-black
          font-semibold
          hover:scale-105
          transition
        "
      >
        Explore Products
      </button>

    </div>
  );
}

export default EmptyWishlist;