import { ArrowLeft, Star } from "lucide-react";
import { motion } from "framer-motion";

function ProductDetails({ product, onBack }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      className="min-h-screen bg-[#050505] text-white"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">

        {/* Back */}

        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#A8A8A8] hover:text-[#D4AF37] transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Top Section */}

        <div className="grid lg:grid-cols-2 gap-16 mt-10">

          {/* Image */}

          <div>

            <img
              src={product.image}
              alt={product.name}
              className="w-full rounded-3xl object-cover"
            />

          </div>

          {/* Product Info */}

          <div>

            <p className="uppercase tracking-[0.25em] text-[#888]">
              {product.brand}
            </p>

            <h1 className="text-4xl font-semibold mt-3">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mt-6">

              <Star
                size={18}
                fill="#D4AF37"
                color="#D4AF37"
              />

              <span>{product.rating}</span>

              <span className="text-[#777]">
                ({product.reviews} Reviews)
              </span>

            </div>

            <div className="mt-6 flex items-center gap-4">

              <span className="text-3xl font-bold">
                ₹{product.price}
              </span>

              <span className="line-through text-[#777]">
                ₹{product.originalPrice}
              </span>

              <span className="text-green-400 font-semibold">
                {product.discount}% OFF
              </span>

            </div>

            <div className="mt-6 inline-flex bg-[#D4AF37]/10 text-[#D4AF37] px-4 py-2 rounded-full">
              ✨ {product.aiMatch}% AI Match
            </div>
            {/* Sizes */}

<div className="mt-8">

  <p className="text-[#A8A8A8] text-sm mb-4">
    Available Sizes
  </p>

  <div className="flex gap-3">

    <button className="w-12 h-12 rounded-xl border border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37] font-semibold">
      S
    </button>

    <button className="w-12 h-12 rounded-xl border border-[#333] hover:border-[#D4AF37] transition">
      M
    </button>

    <button className="w-12 h-12 rounded-xl border border-[#333] hover:border-[#D4AF37] transition">
      L
    </button>

    <button className="w-12 h-12 rounded-xl border border-[#333] hover:border-[#D4AF37] transition">
      XL
    </button>

  </div>

</div>
{/* Buy Now */}

<button
  className="
    mt-8
    w-full
    bg-[#D4AF37]
    text-black
    py-4
    rounded-2xl
    font-semibold
    text-lg
    hover:scale-[1.02]
    active:scale-[0.98]
    transition-all
  "
>
  🛒 Buy Now
</button>

          </div>

        </div>

        {/* AI Recommendation */}

        <div
          className="
            mt-12
            rounded-3xl
            border
            border-[#222]
            bg-[#111]
            p-8
          "
        >

          <div className="flex items-center gap-2">

            <span className="text-2xl">✨</span>

            <h2 className="text-2xl font-semibold">
              Why VASTRA picked this for you
            </h2>

          </div>

          <p
            className="
              mt-6
              text-[#B8B8B8]
              leading-8
              text-[16px]
            "
          >
            This oversized linen shirt perfectly matches your minimalist
            style and is ideal for casual everyday wear.

            <br /><br />

            The premium linen fabric is lightweight, breathable, and keeps
            you comfortable throughout the day.

            <br /><br />

            Priced at ₹2,199, it fits comfortably within your ₹3,000 budget
            while offering excellent value and strong customer ratings.
          </p>

        </div>

        {/* Pros & Cons */}

        <div
          className="
            mt-8
            rounded-3xl
            border
            border-[#222]
            bg-[#111]
            p-8
          "
        >

          <div className="grid md:grid-cols-2 gap-12">

            {/* Pros */}

            <div>

              <div className="flex items-center gap-3">

                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 font-bold">
                  ✓
                </div>

                <h2 className="text-2xl font-semibold">
                  Pros
                </h2>

              </div>

              <div className="mt-6 space-y-4">

                <div className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span>Premium Linen Fabric</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span>Lightweight & Breathable</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span>Easy to Style</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span>Highly Rated by Buyers</span>
                </div>

              </div>

            </div>

            {/* Cons */}

            <div>

              <div className="flex items-center gap-3">

                <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-400 font-bold">
                  !
                </div>

                <h2 className="text-2xl font-semibold">
                  Cons
                </h2>

              </div>

              <div className="mt-6 space-y-4">

                <div className="flex items-center gap-3">
                  <span className="text-yellow-400">•</span>
                  <span>Wrinkles More Easily</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-yellow-400">•</span>
                  <span>Oversized Fit</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-yellow-400">•</span>
                  <span>Gentle Wash Recommended</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-yellow-400">•</span>
                  <span>Limited Colour Options</span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
      {/* Complete the Look */}

<div
  className="
    mt-8
    rounded-3xl
    border
    border-[#222]
    bg-[#111]
    p-8
  "
>
  <h2 className="text-2xl font-semibold mb-8">
    ✨ Complete the Look with
  </h2>

  <div
    className="
      flex
      gap-6
      overflow-x-auto
      pb-2
      scrollbar-hide
    "
  >

    {/* Card 1 */}

    <div
      className="
        min-w-[220px]
        bg-[#181818]
        rounded-2xl
        overflow-hidden
        border
        border-[#252525]
        hover:border-[#D4AF37]
        transition
        cursor-pointer
      "
    >

      <div className="h-56 bg-[#242424]"></div>

      <div className="p-4">

        <p className="text-xs uppercase tracking-widest text-[#777]">
          ZARA
        </p>

        <h3 className="mt-2 font-semibold">
          Black Cargo Pants
        </h3>

        <p className="mt-3 text-[#D4AF37] font-semibold">
          ₹1,899
        </p>

      </div>

    </div>

    {/* Card 2 */}

    <div className="min-w-[220px] bg-[#181818] rounded-2xl overflow-hidden border border-[#252525] hover:border-[#D4AF37] transition cursor-pointer">

      <div className="h-56 bg-[#242424]"></div>

      <div className="p-4">

        <p className="text-xs uppercase tracking-widest text-[#777]">
          NIKE
        </p>

        <h3 className="mt-2 font-semibold">
          White Sneakers
        </h3>

        <p className="mt-3 text-[#D4AF37] font-semibold">
          ₹2,499
        </p>

      </div>

    </div>

    {/* Card 3 */}

    <div className="min-w-[220px] bg-[#181818] rounded-2xl overflow-hidden border border-[#252525] hover:border-[#D4AF37] transition cursor-pointer">

      <div className="h-56 bg-[#242424]"></div>

      <div className="p-4">

        <p className="text-xs uppercase tracking-widest text-[#777]">
          TITAN
        </p>

        <h3 className="mt-2 font-semibold">
          Silver Watch
        </h3>

        <p className="mt-3 text-[#D4AF37] font-semibold">
          ₹2,999
        </p>

      </div>

    </div>

    {/* Card 4 */}

    <div className="min-w-[220px] bg-[#181818] rounded-2xl overflow-hidden border border-[#252525] hover:border-[#D4AF37] transition cursor-pointer">

      <div className="h-56 bg-[#242424]"></div>

      <div className="p-4">

        <p className="text-xs uppercase tracking-widest text-[#777]">
          RAY-BAN
        </p>

        <h3 className="mt-2 font-semibold">
          Black Sunglasses
        </h3>

        <p className="mt-3 text-[#D4AF37] font-semibold">
          ₹3,299
        </p>

      </div>

    </div>

  </div>
</div>
{/* Customer Reviews */}

<div
  className="
    mt-8
    rounded-3xl
    border
    border-[#222]
    bg-[#111]
    p-8
  "
>

  <h2 className="text-2xl font-semibold">
    ⭐ Customer Reviews
  </h2>

  <div className="mt-8 space-y-5">

    {/* Review 1 */}

    <div className="rounded-2xl border border-[#222] bg-[#181818] p-6">

      <div className="flex justify-between items-center">

        <span className="text-[#D4AF37] text-lg">
          ★★★★★
        </span>

        <span className="text-[#888]">
          5.0
        </span>

      </div>

      <p className="mt-4 text-[#B8B8B8] leading-7">

        "The fabric feels premium and exactly as described.
        Perfect fit for everyday wear and looks even better
        in person."

      </p>

      <p className="mt-5 text-sm text-[#777]">

        — Rahul Sharma

      </p>

    </div>

    {/* Review 2 */}

    <div className="rounded-2xl border border-[#222] bg-[#181818] p-6">

      <div className="flex justify-between items-center">

        <span className="text-[#D4AF37] text-lg">
          ★★★★☆
        </span>

        <span className="text-[#888]">
          4.0
        </span>

      </div>

      <p className="mt-4 text-[#B8B8B8] leading-7">

        "Very comfortable and stylish. The oversized fit
        looks great, though it wrinkles a little."

      </p>

      <p className="mt-5 text-sm text-[#777]">

        — Aman Verma

      </p>

    </div>

    {/* Review 3 */}

    <div className="rounded-2xl border border-[#222] bg-[#181818] p-6">

      <div className="flex justify-between items-center">

        <span className="text-[#D4AF37] text-lg">
          ★★★★★
        </span>

        <span className="text-[#888]">
          5.0
        </span>

      </div>

      <p className="mt-4 text-[#B8B8B8] leading-7">

        "Excellent value for money. Lightweight, breathable
        and easy to pair with almost anything."

      </p>

      <p className="mt-5 text-sm text-[#777]">

        — Priyansh Singh

      </p>

    </div>

  </div>

</div>
{/* You May Also Like */}

<div
  className="
    mt-8
    mb-12
    rounded-3xl
    border
    border-[#222]
    bg-[#111]
    p-8
  "
>

  <h2 className="text-2xl font-semibold mb-8">

    ✨ You May Also Like

  </h2>

  <div
    className="
      flex
      gap-6
      overflow-x-auto
      pb-2
      scrollbar-hide
    "
  >

    {/* Card 1 */}

    <div
      className="
        min-w-[220px]
        bg-[#181818]
        rounded-2xl
        overflow-hidden
        border
        border-[#252525]
        hover:border-[#D4AF37]
        transition
        cursor-pointer
      "
    >

      <div className="h-56 bg-[#242424]"></div>

      <div className="p-4">

        <p className="text-xs uppercase tracking-widest text-[#777]">

          H&M

        </p>

        <h3 className="mt-2 font-semibold">

          Oversized Cotton Shirt

        </h3>

        <p className="mt-3 text-[#D4AF37] font-semibold">

          ₹1,999

        </p>

      </div>

    </div>

    {/* Card 2 */}

    <div className="min-w-[220px] bg-[#181818] rounded-2xl overflow-hidden border border-[#252525] hover:border-[#D4AF37] transition cursor-pointer">

      <div className="h-56 bg-[#242424]"></div>

      <div className="p-4">

        <p className="text-xs uppercase tracking-widest text-[#777]">

          SNITCH

        </p>

        <h3 className="mt-2 font-semibold">

          Relaxed Fit Shirt

        </h3>

        <p className="mt-3 text-[#D4AF37] font-semibold">

          ₹1,799

        </p>

      </div>

    </div>

    {/* Card 3 */}

    <div className="min-w-[220px] bg-[#181818] rounded-2xl overflow-hidden border border-[#252525] hover:border-[#D4AF37] transition cursor-pointer">

      <div className="h-56 bg-[#242424]"></div>

      <div className="p-4">

        <p className="text-xs uppercase tracking-widest text-[#777]">

          ZARA

        </p>

        <h3 className="mt-2 font-semibold">

          Linen Blend Shirt

        </h3>

        <p className="mt-3 text-[#D4AF37] font-semibold">

          ₹2,399

        </p>

      </div>

    </div>

    {/* Card 4 */}

    <div className="min-w-[220px] bg-[#181818] rounded-2xl overflow-hidden border border-[#252525] hover:border-[#D4AF37] transition cursor-pointer">

      <div className="h-56 bg-[#242424]"></div>

      <div className="p-4">

        <p className="text-xs uppercase tracking-widest text-[#777]">

          UNIQLO

        </p>

        <h3 className="mt-2 font-semibold">

          Casual Linen Shirt

        </h3>

        <p className="mt-3 text-[#D4AF37] font-semibold">

          ₹2,299

        </p>

      </div>

    </div>

  </div>

</div>


    </motion.section>
  );
}

export default ProductDetails;