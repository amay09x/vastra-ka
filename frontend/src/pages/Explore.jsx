import { motion } from "framer-motion";

const collections = [
  "Old Money",
  "Minimalist",
  "Streetwear",
  "Smart Casual",
  "Business",
  "Wedding",
  "Vacation",
  "Luxury",
];

const occasions = [
  "College",
  "Office",
  "Interview",
  "Date Night",
  "Party",
  "Wedding",
];

function Explore() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#050505] text-white"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-28 pb-20">

        <span className="uppercase tracking-widest text-[#D4AF37] font-semibold">
          Explore
        </span>

        <h1 className="text-5xl font-semibold mt-5">
          Discover Fashion
        </h1>

        <p className="mt-6 text-[#999] max-w-xl leading-8">
          Explore AI-curated collections, trending styles
          and outfit inspiration for every occasion.
        </p>
        {/* Trending This Week */}

<div className="mt-20">

  <div className="flex items-center justify-between">

    <h2 className="text-3xl font-semibold">
      🔥 Trending This Week
    </h2>

    <button className="text-[#D4AF37] hover:underline">
      View All
    </button>

  </div>

  <div className="flex gap-8 overflow-x-auto mt-10 pb-3">

    {[
      "Old Money",
      "Quiet Luxury",
      "Summer Linen",
      "Streetwear",
      "Monochrome",
    ].map((item) => (

      <motion.div
        whileHover={{
          y: -8,
          scale: 1.03,
        }}
        key={item}
        className="
          min-w-[320px]
          h-[420px]
          rounded-3xl
          bg-[#111]
          border
          border-[#222]
          overflow-hidden
          cursor-pointer
          hover:border-[#D4AF37]
          transition
        "
      >

        {/* Placeholder Image */}

        <div className="h-[320px] bg-[#1A1A1A]" />

        <div className="p-6">

          <span className="text-[#D4AF37] text-sm">

            Trending

          </span>

          <h3 className="mt-3 text-2xl font-semibold">

            {item}

          </h3>

          <p className="mt-2 text-[#999]">

            Curated by VASTRA AI

          </p>

        </div>

      </motion.div>

    ))}

  </div>

</div>

        {/* AI Collections */}

        <div className="mt-20">

          <h2 className="text-3xl font-semibold">

            ✨ AI Collections

          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">

           {[
  {
    title: "Old Money",
    subtitle: "218 Looks",
  },
  {
    title: "Minimalist",
    subtitle: "185 Looks",
  },
  {
    title: "Streetwear",
    subtitle: "264 Looks",
  },
  {
    title: "Smart Casual",
    subtitle: "197 Looks",
  },
  {
    title: "Business",
    subtitle: "143 Looks",
  },
  {
    title: "Wedding",
    subtitle: "98 Looks",
  },
  {
    title: "Vacation",
    subtitle: "172 Looks",
  },
  {
    title: "Luxury",
    subtitle: "81 Looks",
  },
].map((item) => (

  <motion.div
    whileHover={{
      y: -8,
      scale: 1.03,
    }}
    key={item.title}
    className="
      overflow-hidden
      rounded-3xl
      border
      border-[#222]
      bg-[#111]
      cursor-pointer
      hover:border-[#D4AF37]
      transition
    "
  >

    {/* Placeholder Image */}

    <div className="h-56 bg-[#1A1A1A]" />

    <div className="p-6">

      <span className="text-[#D4AF37] text-sm uppercase tracking-wider">

        AI Collection

      </span>

      <h3 className="mt-3 text-2xl font-semibold">

        {item.title}

      </h3>

      <p className="mt-2 text-[#888]">

        {item.subtitle}

      </p>

    </div>

  </motion.div>

))}

          </div>

        </div>

        {/* Occasions */}

        <div className="mt-24">

          <h2 className="text-3xl font-semibold">

            🎯 Shop by Occasion

          </h2>

          <div className="flex flex-wrap gap-5 mt-10">

            {occasions.map((item) => (

              <button
                key={item}
                className="
                  px-8
                  py-4
                  rounded-full
                  bg-[#111]
                  border
                  border-[#222]
                  hover:border-[#D4AF37]
                  hover:text-[#D4AF37]
                  transition
                "
              >

                {item}

              </button>

            ))}

          </div>

        </div>
        {/* Seasonal Picks */}

<div className="mt-24">

  <div className="flex items-center justify-between">

    <h2 className="text-3xl font-semibold">

      🌤 Seasonal Picks

    </h2>

    <button className="text-[#D4AF37] hover:underline">

      Explore Seasons

    </button>

  </div>

  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">

    {[
      {
        title: "Summer",
        subtitle: "Lightweight & Breathable",
      },
      {
        title: "Monsoon",
        subtitle: "Water Resistant Essentials",
      },
      {
        title: "Winter",
        subtitle: "Warm & Layered Looks",
      },
      {
        title: "Festive",
        subtitle: "Celebrate in Style",
      },
    ].map((item) => (

      <motion.div
        key={item.title}
        whileHover={{
          y: -8,
          scale: 1.03,
        }}
        className="
          overflow-hidden
          rounded-3xl
          border
          border-[#222]
          bg-[#111]
          cursor-pointer
          hover:border-[#D4AF37]
          transition
        "
      >

        <div className="h-56 bg-[#1A1A1A]" />

        <div className="p-6">

          <h3 className="text-2xl font-semibold">

            {item.title}

          </h3>

          <p className="mt-3 text-[#888]">

            {item.subtitle}

          </p>

        </div>

      </motion.div>

    ))}

  </div>

</div>
{/* Editor's Choice */}

<div className="mt-24 mb-10">

  <div
    className="
      rounded-[36px]
      overflow-hidden
      border
      border-[#222]
      bg-[#111]
    "
  >

    <div className="h-[420px] bg-[#1A1A1A]" />

    <div className="p-10">

      <span className="text-[#D4AF37] uppercase tracking-widest text-sm">

        ⭐ Editor's Choice

      </span>

      <h2 className="text-4xl font-semibold mt-5">

        The Modern Minimalist Collection

      </h2>

      <p className="mt-6 text-[#999] max-w-2xl leading-8">

        A carefully curated collection of timeless pieces
        designed for effortless everyday style. Clean silhouettes,
        premium fabrics and versatile combinations chosen by VASTRA.

      </p>

      <button
        className="
          mt-10
          bg-[#D4AF37]
          text-black
          px-8
          py-4
          rounded-2xl
          font-semibold
          hover:scale-105
          transition
        "
      >

        Explore Collection

      </button>

    </div>

  </div>

</div>

      </div>
    </motion.section>
  );
}

export default Explore;