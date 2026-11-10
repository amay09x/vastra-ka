import {
  Heart,
  Sparkles,
  Star,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function ResultCard({ product, userRequest = "" }) {
  const navigate = useNavigate();

  // ============================================================
  // PRODUCT DATA
  // ============================================================

  const image =
    product?.thumbnail ||
    product?.image ||
    product?.images?.[0] ||
    "";

  const name =
    product?.title ||
    product?.name ||
    "Fashion Product";

  const price = product?.price ?? "";

  const rating = product?.rating;

  const reviews =
    product?.review_count ??
    product?.reviews ??
    "";

  const score =
    typeof product?.score === "number"
      ? product.score
      : null;

  const aiPick = Boolean(product?.ai_pick);

  const store =
    product?.source ||
    product?.brand ||
    "";

  const productId = product?.product_id;

  // ============================================================
  // PRICE HELPER
  // ============================================================

  const getPrice = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "";
    }

    if (typeof value === "object") {
      return (
        value.raw ??
        value.extracted_value ??
        value.value ??
        value.current ??
        ""
      );
    }

    return value;
  };

  const safePrice = getPrice(price);

  // ============================================================
  // OPEN PRODUCT DETAILS
  // ============================================================

  const openDetails = () => {
    if (!productId) {
      console.warn(
        "VASTRA: product_id is missing. Product details cannot be opened."
      );
      return;
    }

    // Save product so ProductDetails can recover it after refresh.
    try {
      sessionStorage.setItem(
        `vastra-product-${productId}`,
        JSON.stringify({
          product,
          userRequest,
        })
      );
    } catch (error) {
      console.warn(
        "VASTRA: Could not save product session.",
        error
      );
    }

    navigate(`/product/${productId}`, {
      state: {
        product,
        userRequest,
      },
    });
  };

  // ============================================================
  // CARD
  // ============================================================

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 18,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        y: -5,
      }}
      transition={{
        duration: 0.3,
      }}
      onClick={openDetails}
      onKeyDown={(event) => {
        if (
          (event.key === "Enter" ||
            event.key === " ") &&
          productId
        ) {
          event.preventDefault();
          openDetails();
        }
      }}
      role={productId ? "button" : undefined}
      tabIndex={productId ? 0 : undefined}
      className="
        group
        flex
        h-full
        cursor-pointer
        flex-col
        overflow-hidden
        rounded-3xl
        border
        border-white/[0.07]
        bg-[#111111]
        shadow-[0_16px_45px_rgba(0,0,0,.24)]
        transition-all
        duration-300
        hover:border-[#D4AF37]/45
        hover:shadow-[0_20px_55px_rgba(212,175,55,.10)]
        focus:outline-none
        focus:ring-1
        focus:ring-[#D4AF37]/50
      "
    >

      {/* ========================================================
          IMAGE
      ======================================================== */}

      <div className="relative overflow-hidden bg-[#171717]">

        {image ? (
          <img
            src={image}
            alt={name}
            loading="lazy"
            decoding="async"
            className="
              aspect-[4/5]
              w-full
              object-cover
              object-center
              transition-transform
              duration-500
              group-hover:scale-[1.045]
            "
            onError={(event) => {
              event.currentTarget.style.display =
                "none";
            }}
          />
        ) : (
          <div
            className="
              flex
              aspect-[4/5]
              w-full
              items-center
              justify-center
              text-sm
              text-white/25
            "
          >
            No image available
          </div>
        )}

        {/* Image gradient */}

        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            h-24
            bg-gradient-to-t
            from-black/70
            via-black/15
            to-transparent
          "
        />

        {/* ======================================================
            VASTRA PICK
        ====================================================== */}

        {aiPick && (
          <div
            className="
              absolute
              left-3
              top-3
              inline-flex
              items-center
              gap-1.5
              rounded-full
              border
              border-[#D4AF37]/30
              bg-black/70
              px-3
              py-1.5
              text-[10px]
              font-semibold
              tracking-[0.11em]
              text-[#D4AF37]
              backdrop-blur-md
            "
          >
            <Sparkles size={11} />
            VASTRA PICK
          </div>
        )}

        {/* ======================================================
            WISHLIST
        ====================================================== */}

        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          className="
            absolute
            right-3
            top-3
            grid
            h-9
            w-9
            place-items-center
            rounded-full
            border
            border-white/10
            bg-black/60
            text-white/80
            backdrop-blur-md
            transition
            hover:border-[#D4AF37]/45
            hover:text-[#D4AF37]
          "
        >
          <Heart
            size={17}
            strokeWidth={1.8}
          />
        </button>

        {/* ======================================================
            STORE LABEL
            Information only — NOT a direct store link
        ====================================================== */}

        {store && (
          <div
            className="
              absolute
              bottom-3
              left-3
              rounded-full
              bg-black/70
              px-3
              py-1.5
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.12em]
              text-white/75
              backdrop-blur-md
            "
          >
            {store}
          </div>
        )}

      </div>

      {/* ========================================================
          CONTENT
      ======================================================== */}

      <div className="flex flex-1 flex-col p-5">

        {/* ======================================================
            RATING
        ====================================================== */}

        <div className="flex items-center justify-between gap-3">

          <div className="flex items-center gap-1.5 text-xs">

            <Star
              size={14}
              fill="#D4AF37"
              color="#D4AF37"
            />

            {rating !== null &&
            rating !== undefined &&
            rating !== "" ? (
              <span className="text-[#E5E0D6]">
                {rating}
              </span>
            ) : (
              <span className="text-[#777]">
                No rating
              </span>
            )}

            {reviews !== null &&
              reviews !== undefined &&
              reviews !== "" && (
                <span className="text-[#66625C]">
                  · {reviews} reviews
                </span>
              )}

          </div>

          {product?.rank && (
            <span className="text-[10px] text-[#65615A]">
              #{product.rank}
            </span>
          )}

        </div>

        {/* ======================================================
            PRODUCT NAME
        ====================================================== */}

        <h3
          className="
            mt-3
            min-h-[50px]
            line-clamp-2
            text-[15px]
            font-semibold
            leading-6
            text-[#F1ECE3]
          "
        >
          {name}
        </h3>

        {/* ======================================================
            PRICE
        ====================================================== */}

        {safePrice && (
          <div className="mt-3">

            <span className="text-[22px] font-bold text-white">
              {typeof safePrice === "number"
                ? `₹${safePrice}`
                : safePrice}
            </span>

          </div>
        )}

        {/* ======================================================
            VASTRA SCORE
        ====================================================== */}

        {score !== null && (
          <div
            className="
              mt-4
              rounded-2xl
              border
              border-[#D4AF37]/15
              bg-[#D4AF37]/[0.035]
              p-3.5
            "
          >

            <div className="flex items-center justify-between">

              <div
                className="
                  flex
                  items-center
                  gap-1.5
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.14em]
                  text-[#D4AF37]
                "
              >
                <Sparkles size={11} />
                VASTRA SCORE
              </div>

              <span className="text-sm font-bold text-[#E9D57E]">
                {score}/100
              </span>

            </div>

            <div
              className="
                mt-2
                h-1.5
                overflow-hidden
                rounded-full
                bg-white/[0.07]
              "
            >
              <div
                className="
                  h-full
                  rounded-full
                  bg-gradient-to-r
                  from-[#8E731A]
                  via-[#D4AF37]
                  to-[#F0D66C]
                "
                style={{
                  width: `${Math.min(
                    Math.max(score, 0),
                    100
                  )}%`,
                }}
              />
            </div>

          </div>
        )}

        {/* ======================================================
            VIEW DETAILS
        ====================================================== */}

        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            openDetails();
          }}
          disabled={!productId}
          className="
            mt-4
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#D4AF37]
            py-3
            text-sm
            font-semibold
            text-black
            transition-all
            hover:scale-[1.015]
            hover:bg-[#E5C95A]
            active:scale-[0.98]
            disabled:cursor-not-allowed
            disabled:opacity-40
            disabled:hover:scale-100
          "
        >
          VIEW DETAILS
          <ArrowRight size={15} />
        </button>

      </div>

    </motion.article>
  );
}

export default ResultCard;