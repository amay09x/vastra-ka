import { motion } from "framer-motion";

import WishlistCard from "../components/wishlist/WishlistCard";
import EmptyWishlist from "../components/wishlist/EmptyWishlist";

const products = [
  {
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800",
    brand: "ZARA",
    name: "Black Oversized Linen Shirt",
    price: "2199",
    rating: "4.8",
  },
  {
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800",
    brand: "H&M",
    name: "Relaxed Fit Cotton Tee",
    price: "999",
    rating: "4.6",
  },
  {
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800",
    brand: "UNIQLO",
    name: "Minimal Beige Jacket",
    price: "3499",
    rating: "4.9",
  },
];

function Wishlist() {

  const hasProducts = true;

  return (

    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#050505] text-white pt-28 pb-20"
    >

      <div className="max-w-7xl mx-auto px-6">

        <h1 className="text-5xl font-semibold">

          Wishlist

        </h1>

        <div className="mt-12 flex items-center justify-between">

          <h2 className="text-2xl font-semibold">

            Saved Products

          </h2>

          <span className="text-[#888]">

            {products.length} Items

          </span>

        </div>

        <div className="mt-10"></div>
        <div className="mt-10">
        </div>
                {hasProducts ? (

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

            {products.map((product, index) => (

              <WishlistCard
                key={index}
                product={product}
              />

            ))}

          </div>

        ) : (

          <EmptyWishlist />

        )}

      </div>

    </motion.section>

  );

}

export default Wishlist;