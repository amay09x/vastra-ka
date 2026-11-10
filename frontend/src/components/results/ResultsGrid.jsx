import { ChevronDown, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import ResultCard from "./ResultCard";
const INITIAL_VISIBLE = 8;
const LOAD_MORE_COUNT = 8;

function ResultsGrid({
  products = [],
  userRequest = "",
}) {
  const [visibleCount, setVisibleCount] =
    useState(INITIAL_VISIBLE);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [products]);

  if (!products.length) {
    return null;
  }

  const visibleProducts =
    products.slice(0, visibleCount);

  const remaining =
    Math.max(products.length - visibleCount, 0);

  return (
    <div className="mt-7 w-full">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          mb-5
          flex
          items-end
          justify-between
          gap-4
        "
      >
        <div>

          <div
            className="
              flex
              items-center
              gap-2
              text-[10px]
              font-bold
              uppercase
              tracking-[0.22em]
              text-[#D4AF37]
            "
          >
            <ShoppingBag size={14} />
            VASTRA SHOP
          </div>

          <h2
            className="
              mt-1.5
              text-xl
              font-semibold
              text-[#F0ECE4]
            "
          >
            Shop the Look
          </h2>

        </div>

        <span
          className="
            text-xs
            text-[#69665F]
          "
        >
          {products.length} products
        </span>

      </div>

      {/* =====================================================
          PRODUCT GRID
      ===================================================== */}

      <div
        className="
          grid
          grid-cols-1
          gap-5
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
        "
      >
        {visibleProducts.map((product, index) => (
          <motion.div
            key={
              product?.product_id ||
              `${product?.title || "product"}-${index}`
            }
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.3,
              delay: index * 0.03,
            }}
            className="h-full"
          >
            <ResultCard
              product={product}
              userRequest={userRequest}
            />
          </motion.div>
        ))}
      </div>

      {/* =====================================================
          SEE MORE
      ===================================================== */}

      {remaining > 0 && (
        <div
          className="
            mt-7
            flex
            justify-center
          "
        >
          <button
            type="button"
            onClick={() => {
              setVisibleCount((current) =>
                Math.min(
                  current + LOAD_MORE_COUNT,
                  products.length
                )
              );
            }}
            className="
              group
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-white/[0.09]
              bg-white/[0.02]
              px-6
              py-3
              text-xs
              font-semibold
              tracking-[0.06em]
              text-[#C8C3BA]
              transition-all
              hover:border-[#D4AF37]/40
              hover:bg-[#D4AF37]/[0.06]
              hover:text-[#D4AF37]
            "
          >
            See More

            <span
              className="
                text-[#67635C]
                group-hover:text-[#D4AF37]/70
              "
            >
              +{remaining}
            </span>

            <ChevronDown
              size={14}
              className="
                transition-transform
                duration-300
                group-hover:translate-y-0.5
              "
            />
          </button>
        </div>
      )}

    </div>
  );
}

export default ResultsGrid;
