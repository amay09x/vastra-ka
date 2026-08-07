import { motion } from "framer-motion";

const categories = [
  {
    icon: "👕",
    title: "Men",
    desc: "Shirts, T-Shirts, Jeans & More",
  },
  {
    icon: "👗",
    title: "Women",
    desc: "Dresses, Tops & Fashion",
  },
  {
    icon: "👟",
    title: "Shoes",
    desc: "Sneakers, Boots & Sandals",
  },
  {
    icon: "🧥",
    title: "Outerwear",
    desc: "Jackets, Hoodies & Coats",
  },
  {
    icon: "👜",
    title: "Accessories",
    desc: "Bags, Belts & Wallets",
  },
  {
    icon: "⌚",
    title: "Watches",
    desc: "Luxury & Casual Watches",
  },
  {
    icon: "🕶️",
    title: "Sunglasses",
    desc: "Classic & Modern Styles",
  },
  {
    icon: "💍",
    title: "Jewellery",
    desc: "Chains, Rings & Bracelets",
  },
];

function Categories() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#050505] text-white"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-28 pb-20">

        <span className="uppercase tracking-widest text-[#D4AF37] font-semibold">
          Categories
        </span>

        <h1 className="text-5xl font-semibold mt-5">

          Shop by Category

        </h1>

        <p className="mt-6 text-[#A8A8A8] max-w-xl leading-8">

          Browse fashion categories or let your Personal Stylist
          recommend the perfect outfit for you.

        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">

          {categories.map((item) => (

            <motion.div
              whileHover={{
                y: -8,
                scale: 1.02,
              }}
              key={item.title}
              className="
                bg-[#111]
                border
                border-[#222]
                rounded-3xl
                p-8
                cursor-pointer
                hover:border-[#D4AF37]
                transition
              "
            >

              <div className="text-5xl">

                {item.icon}

              </div>

              <h2 className="mt-8 text-2xl font-semibold">

                {item.title}

              </h2>

              <p className="mt-4 text-[#999] leading-7">

                {item.desc}

              </p>

            </motion.div>

          ))}

        </div>

      </div>
    </motion.section>
  );
}

export default Categories;