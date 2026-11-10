import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styleDiscoveryData from "../data/styleDiscoveryData";
import ResultsGrid from "../components/results/ResultsGrid";

const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000";

function extractProducts(data) {
  const payload = data?.response ?? data;

  if (Array.isArray(payload?.products)) {
    return payload.products;
  }

  if (typeof payload === "string") {
    try {
      const parsed = JSON.parse(payload);

      if (Array.isArray(parsed?.products)) {
        return parsed.products;
      }
    } catch {
      // Ignore invalid string payload.
    }
  }

  return [];
}

function SearchResults() {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const type = searchParams.get("type");
  const style = searchParams.get("style");

  const selectedLookIndexRaw =
    searchParams.get("look");

  const selectedLookIndex =
    selectedLookIndexRaw !== null
      ? Number(selectedLookIndexRaw)
      : null;

  const [gender, setGender] = useState(
    searchParams.get("gender") || "men"
  );

  const [aiQuery, setAiQuery] =
    useState("");

  const [products, setProducts] =
    useState([]);

  const [loadingProducts, setLoadingProducts] =
    useState(false);

  const [productError, setProductError] =
    useState("");

  // ============================================================
  // STYLE DATA
  // ============================================================

  const styleData = {
    minimal: {
      type: "style",
      name: "Minimal",
      subtitle:
        "Clean, refined looks with nothing unnecessary.",
      image: "/images/styles/minimal.jpg",
      items: [
        "Clean-cut top",
        "Neutral trousers",
        "Minimal sneakers",
        "Subtle accessories",
      ],
    },

    casual: {
      type: "style",
      name: "Casual",
      subtitle:
        "Relaxed pieces for effortless everyday style.",
      image: "/images/styles/casual.jpg",
      items: [
        "Relaxed shirt",
        "Comfortable trousers",
        "Everyday sneakers",
        "Simple accessories",
      ],
    },

    street: {
      type: "style",
      name: "Street",
      subtitle:
        "Expressive layers with a modern edge.",
      image: "/images/styles/street.jpg",
      items: [
        "Statement top",
        "Relaxed-fit trousers",
        "Street sneakers",
        "Layered accessories",
      ],
    },

    partywear: {
      type: "style",
      name: "Party Wear",
      subtitle:
        "Made to stand out when the night begins.",
      image: "/images/styles/party.jpg",
      items: [
        "Statement shirt",
        "Tailored trousers",
        "Chelsea boots",
        "Minimal watch",
      ],
    },

    party: {
      type: "stylist",
      name: "Party",
      subtitle:
        "A look made to stand out tonight.",
      image:
        "/images/stylist/partywear.jpg",
      items: [
        "Wine-red shirt",
        "Black tailored trousers",
        "Chelsea boots",
        "Minimal steel watch",
      ],
    },

    everyday: {
      type: "stylist",
      name: "Everyday",
      subtitle:
        "Effortless style for your day.",
      image:
        "/images/stylist/everyday.jpg",
      items: [
        "Black polo",
        "Beige trousers",
        "White sneakers",
        "Minimal accessories",
      ],
    },

    college: {
      type: "stylist",
      name: "College",
      subtitle:
        "Comfortable, clean and campus-ready.",
      image:
        "/images/stylist/college.jpg",
      items: [
        "Black shirt",
        "White trousers",
        "White sneakers",
        "Minimal watch",
      ],
    },

    closet: {
      type: "stylist",
      name: "Your Closet",
      subtitle:
        "A look built around what you already own.",
      image:
        "/images/stylist/closet.jpg",
      items: [
        "Your existing pieces",
        "Matched colors",
        "Balanced proportions",
        "Finishing accessories",
      ],
    },
  };

  // ============================================================
  // CURRENT DISCOVERY PAGE
  // ============================================================

  const discovery =
    styleDiscoveryData[style];

  const outfits = discovery
    ? discovery[gender] || []
    : [];

  // ============================================================
  // SELECTED LOOK
  // ============================================================

  const selectedLook = useMemo(() => {
    if (
      selectedLookIndex === null ||
      Number.isNaN(selectedLookIndex)
    ) {
      return null;
    }

    return outfits[selectedLookIndex] || null;
  }, [
    outfits,
    selectedLookIndex,
  ]);

  // ============================================================
  // CHANGE GENDER
  // ============================================================

  const handleGenderChange = (nextGender) => {
    setGender(nextGender);

    setProducts([]);
    setProductError("");

    setSearchParams({
      type: "style",
      style,
      gender: nextGender,
    });
  };

  // ============================================================
  // OPEN LOOK
  // ============================================================

  const openLook = (index) => {
    setProducts([]);
    setProductError("");

    setSearchParams({
      type: "style",
      style,
      gender,
      look: String(index),
    });
  };

  // ============================================================
  // SEARCH PRODUCTS FOR SELECTED LOOK
  // ============================================================

  useEffect(() => {
    if (
      type !== "style" ||
      !selectedLook ||
      selectedLookIndex === null
    ) {
      return;
    }

    let cancelled = false;

    const searchProductsForLook =
      async () => {
        setLoadingProducts(true);
        setProductError("");
        setProducts([]);

        /*
         * IMPORTANT:
         *
         * We deliberately DO NOT tell the search system
         * to copy the exact colours from the card.
         *
         * The card image is the visual reference.
         *
         * The product search should instead understand:
         * - selected look
         * - style
         * - silhouette
         * - garment types
         * - occasion
         * - gender
         *
         * Then it can return different compatible colours.
         */

        const lookTitle =
          selectedLook.title ||
          "Selected Look";

        const lookDescription =
          selectedLook.description ||
          "";

        const lookItems =
          Array.isArray(selectedLook.items)
            ? selectedLook.items.join(", ")
            : "";

        const prompt = `
Find products for the selected VASTRA fashion look.

IMPORTANT SEARCH RULES:

1. The selected look image is the visual reference and MUST be represented separately as the first featured look.

2. Search for REAL purchasable fashion products related to the selected look.

3. DO NOT restrict the search to the exact colours visible in the reference image.

4. Preserve the overall fashion direction, silhouette, garment types, styling level and occasion of the selected look.

5. Different compatible colours are encouraged.
   For example, if the reference look is black and white, suitable results may also include navy, cream, beige, grey, olive, brown or other compatible colours.

6. Do not return 15 copies of the same visual outfit.

7. Give variety across:
   - tops
   - bottoms
   - footwear
   - layering pieces
   - accessories
   when appropriate for this look.

8. Keep every product appropriate for the selected gender.

9. Keep the products visually and stylistically connected to the selected look.

10. Return as many relevant products as possible, up to 15 products.

SELECTED LOOK:
${lookTitle}

LOOK DESCRIPTION:
${lookDescription}

LOOK PIECES:
${lookItems}

STYLE:
${discovery?.name || style}

GENDER:
${gender}

The user wants products inspired by this look, NOT products with the exact same colour palette.
`;

        try {
          console.log(
            "VASTRA LOOK SEARCH:",
            {
              style,
              gender,
              selectedLookIndex,
              selectedLook,
            }
          );

          const response =
            await fetch(
              `${API_URL}/chat`,
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json",

                  Accept:
                    "application/json",
                },

                body: JSON.stringify({
                  message: prompt,

                  history: [],
                }),
              }
            );

          const raw =
            await response.text();

          let data;

          try {
            data = JSON.parse(raw);
          } catch {
            throw new Error(
              "Backend returned invalid JSON."
            );
          }

          if (!response.ok) {
            throw new Error(
              data?.detail ||
                data?.error ||
                data?.message ||
                `Product search failed (${response.status})`
            );
          }

          const foundProducts =
            extractProducts(data);

          if (cancelled) {
            return;
          }

          /*
           * We want EXACTLY the structure:
           *
           * #1  Selected card image
           * #2-#16 real products
           *
           * The selected card is NOT treated as a
           * purchasable product.
           */

          setProducts(
            foundProducts.slice(0, 15)
          );

        } catch (error) {
          console.error(
            "VASTRA look product search error:",
            error
          );

          if (!cancelled) {
            setProductError(
              error.message ||
                "Could not load products for this look."
            );
          }

        } finally {
          if (!cancelled) {
            setLoadingProducts(false);
          }
        }
      };

    searchProductsForLook();

    return () => {
      cancelled = true;
    };
  }, [
    type,
    style,
    gender,
    selectedLookIndex,
    selectedLook,
    discovery?.name,
  ]);

  // ============================================================
  // AI INPUT
  // ============================================================

  const handleAiSubmit = (event) => {
    event.preventDefault();

    const query =
      aiQuery.trim();

    if (!query) {
      return;
    }

    console.log(
      "VASTRA AI:",
      query
    );

    setAiQuery("");
  };

  // ============================================================
  // INVALID STYLE
  // ============================================================

  if (
    type === "style" &&
    !discovery
  ) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Style not found.
      </div>
    );
  }

  // ============================================================
  // ============================================================
  // SELECTED LOOK → PRODUCTS PAGE
  // ============================================================
  // ============================================================

  if (
    type === "style" &&
    selectedLook
  ) {
    return (
      <main className="min-h-screen bg-[#090909] text-white">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <section className="px-6 pt-16 lg:px-16">

          <div className="mx-auto max-w-7xl">

            <p className="text-[10px] uppercase tracking-[0.35em] text-[#D4AF37]/70">
              VASTRA LOOK
            </p>

            <h1 className="mt-5 text-4xl font-light tracking-[-0.04em] md:text-6xl">
              {selectedLook.title}
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-white/45">
              {selectedLook.description ||
                `Products inspired by the ${discovery.name.toLowerCase()} style of this look.`}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">

              <span className="rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/[0.06] px-4 py-2 text-xs uppercase tracking-[0.14em] text-[#D4AF37]">
                {gender === "men"
                  ? "Men"
                  : "Women"}
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-white/50">
                {discovery.name}
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-white/50">
                16 results
              </span>

            </div>

          </div>

        </section>

        {/* ======================================================
            SELECTED LOOK + PRODUCT SEARCH
        ====================================================== */}

        <section className="px-6 py-14 lg:px-16">

          <div className="mx-auto max-w-7xl">

            {/* ==================================================
                SELECTED CARD IMAGE
            ================================================== */}

            <div
              className="
                overflow-hidden
                rounded-[32px]
                border
                border-[#D4AF37]/20
                bg-[#111111]
                shadow-[0_20px_70px_rgba(212,175,55,.08)]
              "
            >

              <div className="grid lg:grid-cols-[0.9fr_1.1fr]">

                {/* IMAGE */}

                <div className="relative min-h-[520px]">

                  <img
                    src={selectedLook.image}
                    alt={selectedLook.title}
                    className="
                      absolute
                      inset-0
                      h-full
                      w-full
                      object-cover
                    "
                  />

                  <div
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black/80
                      via-black/10
                      to-transparent
                    "
                  />

                  <div className="absolute bottom-8 left-8">

                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">
                      SELECTED LOOK
                    </p>

                    <h2 className="mt-2 text-3xl font-medium">
                      {selectedLook.title}
                    </h2>

                  </div>

                </div>

                {/* DESCRIPTION */}

                <div className="flex flex-col justify-center p-8 lg:p-12">

                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]/70">
                    SHOP THE STYLE
                  </p>

                  <h2 className="mt-4 text-3xl font-light">
                    Inspired by the look.
                  </h2>

                  <p className="mt-5 max-w-xl text-sm leading-7 text-white/45">
                    VASTRA uses this look as the
                    reference, then finds real products
                    that follow the same overall style,
                    proportions and outfit direction.
                  </p>

                  <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.025] p-5">

                    <p className="text-[10px] uppercase tracking-[0.25em] text-white/30">
                      SEARCH DIRECTION
                    </p>

                    <p className="mt-3 text-sm leading-6 text-white/65">
                      Same style direction, varied
                      colours and compatible pieces.
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* ==================================================
                PRODUCTS
            ================================================== */}

            <div className="mt-16">

              <div className="mb-8 flex items-end justify-between">

                <div>

                  <p className="text-[10px] uppercase tracking-[0.35em] text-[#D4AF37]/70">
                    VASTRA SHOP
                  </p>

                  <h2 className="mt-3 text-3xl font-light">
                    16 products for this look
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
                    The selected look is included as
                    the reference above. The products
                    below are real search results inspired
                    by its style rather than limited to
                    the exact colours in the image.
                  </p>

                </div>

              </div>

              {/* LOADING */}

              {loadingProducts && (

                <div className="rounded-3xl border border-white/10 bg-[#111111] p-12 text-center">

                  <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-[#D4AF37]" />

                  <p className="mt-5 text-sm text-white/50">
                    VASTRA is finding products for this look...
                  </p>

                </div>

              )}

              {/* ERROR */}

              {!loadingProducts &&
                productError && (

                  <div className="rounded-3xl border border-red-900/50 bg-red-950/20 p-8">

                    <p className="text-red-400">
                      {productError}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        window.location.reload()
                      }
                      className="
                        mt-5
                        rounded-full
                        bg-[#D4AF37]
                        px-6
                        py-3
                        text-sm
                        font-semibold
                        text-black
                      "
                    >
                      Try Again
                    </button>

                  </div>

                )}

              {/* RESULTS */}

              {!loadingProducts &&
                !productError &&
                products.length > 0 && (

                  <div>

                    {/* EXACT SELECTED CARD IS ALWAYS #1 */}

                    <div className="mb-6">

                      <div
                        className="
                          group
                          overflow-hidden
                          rounded-3xl
                          border
                          border-[#D4AF37]/35
                          bg-[#111111]
                          shadow-[0_20px_60px_rgba(212,175,55,.08)]
                        "
                      >

                        <div className="relative overflow-hidden">

                          <img
                            src={selectedLook.image}
                            alt={selectedLook.title}
                            className="
                              aspect-[4/5]
                              w-full
                              object-cover
                              transition-transform
                              duration-500
                              group-hover:scale-[1.025]
                            "
                          />

                          <div
                            className="
                              absolute
                              left-4
                              top-4
                              rounded-full
                              border
                              border-[#D4AF37]/40
                              bg-black/75
                              px-3
                              py-2
                              text-[10px]
                              font-semibold
                              uppercase
                              tracking-[0.14em]
                              text-[#D4AF37]
                              backdrop-blur-md
                            "
                          >
                            ✦ SELECTED LOOK
                          </div>

                        </div>

                        <div className="p-5">

                          <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]/70">
                            #1 REFERENCE LOOK
                          </p>

                          <h3 className="mt-3 text-lg font-semibold">
                            {selectedLook.title}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-white/40">
                            The exact look you selected.
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* REAL PRODUCTS #2–#16 */}

                    <div>

                      <p className="mb-5 text-[10px] uppercase tracking-[0.25em] text-white/30">
                        REAL PRODUCTS
                      </p>

                      <ResultsGrid
                        products={products.slice(0, 15)}
                        userRequest={`${selectedLook.title} ${discovery.name} ${gender}`}
                      />

                    </div>

                  </div>

                )}

              {/* NO RESULTS */}

              {!loadingProducts &&
                !productError &&
                products.length === 0 && (

                  <div className="rounded-3xl border border-white/10 bg-[#111111] p-12 text-center">

                    <p className="text-white/50">
                      VASTRA couldn't find enough products
                      for this look right now.
                    </p>

                  </div>

                )}

            </div>

          </div>

        </section>

      </main>
    );
  }

  // ============================================================
  // ============================================================
  // NORMAL STYLE DISCOVERY PAGE
  // ============================================================
  // ============================================================

  if (type === "style") {

    return (
      <main className="min-h-screen bg-[#090909] text-white">

        {/* HEADER */}

        <section className="px-6 pt-16 lg:px-16">

          <div className="mx-auto max-w-7xl">

            <p className="text-[10px] uppercase tracking-[0.35em] text-[#D4AF37]/70">
              STYLE DISCOVERY
            </p>

            <h1 className="mt-5 text-5xl font-light tracking-[-0.04em] md:text-7xl">
              {discovery.name.toUpperCase()} LOOKS.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-white/45 md:text-lg">
              {discovery.subtitle}
            </p>

            {/* GENDER */}

            <div className="mt-10 flex gap-2">

              <button
                onClick={() =>
                  handleGenderChange("men")
                }
                className={`
                  rounded-full
                  px-6
                  py-3
                  text-sm
                  transition-all
                  duration-300
                  ${
                    gender === "men"
                      ? "bg-[#D4AF37] text-black"
                      : "border border-white/10 bg-white/[0.04] text-white/50 hover:text-white"
                  }
                `}
              >
                Men
              </button>

              <button
                onClick={() =>
                  handleGenderChange("women")
                }
                className={`
                  rounded-full
                  px-6
                  py-3
                  text-sm
                  transition-all
                  duration-300
                  ${
                    gender === "women"
                      ? "bg-[#D4AF37] text-black"
                      : "border border-white/10 bg-white/[0.04] text-white/50 hover:text-white"
                  }
                `}
              >
                Women
              </button>

            </div>

          </div>

        </section>

        {/* LOOK CARDS */}

        <section className="px-6 py-16 lg:px-16">

          <div className="mx-auto max-w-7xl">

            <div className="mb-8 flex items-end justify-between">

              <div>

                <p className="text-sm text-white/40">
                  CURATED FOR YOU
                </p>

                <h2 className="mt-2 text-2xl font-medium">
                  {gender === "men"
                    ? "Men's"
                    : "Women's"}{" "}
                  {discovery.name} Looks
                </h2>

              </div>

              <span className="text-xs text-white/25">
                {outfits.length} looks
              </span>

            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

              {outfits.map(
                (outfit, index) => (

                  <button
                    type="button"
                    key={`${outfit.title}-${index}`}
                    onClick={() =>
                      openLook(index)
                    }
                    className="
                      group
                      overflow-hidden
                      rounded-[28px]
                      border
                      border-white/10
                      bg-white/[0.035]
                      text-left
                      transition-all
                      duration-500
                      hover:-translate-y-3
                      hover:border-[#D4AF37]/40
                      hover:shadow-[0_20px_60px_rgba(212,175,55,0.10)]
                    "
                  >

                    <div className="h-[420px] overflow-hidden">

                      <img
                        src={outfit.image}
                        alt={outfit.title}
                        className="
                          h-full
                          w-full
                          object-cover
                          transition-transform
                          duration-700
                          group-hover:scale-105
                        "
                      />

                    </div>

                    <div className="p-6">

                      <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]/60">
                        LOOK 0{index + 1}
                      </p>

                      <h3 className="mt-3 text-xl font-medium">
                        {outfit.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-white/40">
                        {outfit.description}
                      </p>

                      <div className="mt-5 text-xs uppercase tracking-[0.2em] text-[#D4AF37]/70">
                        Shop this look →
                      </div>

                    </div>

                  </button>

                )
              )}

              {/* EXPLORE MORE */}

              <div
                className="
                  group
                  relative
                  flex
                  min-h-[420px]
                  cursor-pointer
                  flex-col
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-[28px]
                  border
                  border-white/10
                  bg-white/[0.025]
                  text-center
                  transition-all
                  duration-500
                  hover:-translate-y-3
                  hover:border-[#D4AF37]/40
                  hover:bg-white/[0.045]
                  hover:shadow-[0_20px_60px_rgba(212,175,55,0.08)]
                "
              >

                <div
                  className="
                    absolute
                    h-40
                    w-40
                    rounded-full
                    bg-[#D4AF37]/10
                    blur-[70px]
                    transition-all
                    duration-700
                    group-hover:bg-[#D4AF37]/20
                    group-hover:scale-125
                  "
                />

                <div
                  className="
                    relative
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#D4AF37]/30
                    bg-[#D4AF37]/5
                    text-2xl
                    text-[#D4AF37]
                  "
                >
                  +
                </div>

                <p className="relative mt-8 text-[10px] uppercase tracking-[0.35em] text-[#D4AF37]/70">
                  DISCOVER MORE
                </p>

                <h3 className="relative mt-3 text-2xl font-medium">
                  Explore More
                </h3>

                <p className="relative mt-3 max-w-[220px] text-sm leading-6 text-white/40">
                  Discover more{" "}
                  {discovery.name.toLowerCase()}{" "}
                  outfits and find the looks that
                  feel like you.
                </p>

                <div className="relative mt-7 text-lg text-white/40">
                  →
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* AI RECOMMENDATION */}

        <section className="px-6 pb-20 lg:px-16">

          <div
            className="
              mx-auto
              max-w-7xl
              rounded-[30px]
              border
              border-white/10
              bg-white/[0.035]
              p-8
              backdrop-blur-xl
              lg:p-10
            "
          >

            <p className="text-[10px] uppercase tracking-[0.35em] text-[#D4AF37]/70">
              VASTRA AI RECOMMENDS
            </p>

            <h2 className="mt-4 text-3xl font-light">
              Make the style your own.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/45">
              Ask VASTRA to adjust colors, change
              individual pieces, make the outfit more
              casual, or find a version that works with
              what you already own.
            </p>

            <form
              onSubmit={handleAiSubmit}
              className="
                mt-8
                flex
                h-[64px]
                items-center
                rounded-full
                border
                border-white/10
                bg-black/20
                px-3
              "
            >

              <span className="ml-2 text-[#D4AF37]">
                ✦
              </span>

              <input
                type="text"
                value={aiQuery}
                onChange={(event) =>
                  setAiQuery(
                    event.target.value
                  )
                }
                placeholder={`Ask VASTRA about ${discovery.name} style...`}
                className="
                  h-full
                  flex-1
                  bg-transparent
                  px-5
                  text-sm
                  text-white
                  outline-none
                  placeholder:text-white/25
                "
              />

              <button
                type="submit"
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  bg-[#D4AF37]
                  text-black
                  transition
                  hover:bg-white
                "
              >
                →
              </button>

            </form>

          </div>

        </section>

      </main>
    );
  }

  // ============================================================
  // EXISTING STYLIST FALLBACK PAGE
  // ============================================================

  const currentStyle =
    styleData[style] || {
      name: "Your Style",
      subtitle:
        "A look curated by VASTRA.",
      image:
        "/images/stylist/everyday.jpg",
      items: [
        "Top",
        "Bottom",
        "Shoes",
        "Accessories",
      ],
    };

  return (
    <main className="min-h-screen bg-[#090909] text-white">

      <header className="px-6 pt-10 lg:px-16">

        <div className="mx-auto max-w-7xl">

          <p className="text-[10px] uppercase tracking-[0.35em] text-[#D4AF37]/70">
            VASTRA AI STYLIST
          </p>

          <h1 className="mt-5 text-5xl font-light tracking-[-0.04em] md:text-7xl">
            YOUR LOOK.
          </h1>

          <p className="mt-3 text-lg text-white/45">
            {currentStyle.name} ·{" "}
            {currentStyle.subtitle}
          </p>

        </div>

      </header>

      <section className="px-6 py-16 lg:px-16">

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-[1.25fr_0.75fr]">

          <div
            className="
              relative
              min-h-[600px]
              overflow-hidden
              rounded-[32px]
              border
              border-white/10
              bg-white/[0.03]
            "
          >

            <img
              src={currentStyle.image}
              alt={`${currentStyle.name} outfit`}
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
              "
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />

            <div className="absolute bottom-8 left-8">

              <p className="text-[10px] uppercase tracking-[0.35em] text-white/50">
                CURATED BY VASTRA
              </p>

              <h2 className="mt-2 text-3xl font-medium">
                {currentStyle.name} Look
              </h2>

            </div>

          </div>

          <div
            className="
              rounded-[32px]
              border
              border-white/10
              bg-white/[0.035]
              p-8
              backdrop-blur-xl
              lg:p-10
            "
          >

            <p className="text-[10px] uppercase tracking-[0.35em] text-[#D4AF37]/70">
              THE LOOK
            </p>

            <h2 className="mt-4 text-3xl font-light">
              Why it works
            </h2>

            <p className="mt-5 leading-7 text-white/45">
              VASTRA combines the right pieces,
              proportions and details to create a look
              that fits the occasion without feeling
              overdone.
            </p>

            <div className="mt-10 border-t border-white/10">

              {currentStyle.items.map(
                (item, index) => (

                  <div
                    key={item}
                    className="
                      flex
                      items-center
                      justify-between
                      border-b
                      border-white/10
                      py-5
                    "
                  >

                    <div className="flex items-center gap-4">

                      <span className="text-xs text-[#D4AF37]/60">
                        0{index + 1}
                      </span>

                      <span className="text-sm text-white/75">
                        {item}
                      </span>

                    </div>

                    <span className="text-white/20">
                      →
                    </span>

                  </div>

                )
              )}

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default SearchResults;