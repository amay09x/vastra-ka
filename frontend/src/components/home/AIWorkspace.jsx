import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ResultsGrid from "../results/ResultsGrid";
import { stylistEngine } from "../../ai/stylistEngine";


function AIWorkspace({ userPrompt, searchResults = [] }) {
  const thinkingSteps = [
    "✨ Understanding your request...",
    "🧠 Thinking like your personal stylist...",
    "👔 Preparing the best recommendation...",
  ];

  const [thinkingIndex, setThinkingIndex] = useState(0);
  const [intent, setIntent] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    setThinkingIndex(0);

    // IMAGE SEARCH
    if (
      userPrompt &&
      typeof userPrompt === "object" &&
      userPrompt.type === "image"
    ) {
      setIntent("shopping");

      setResults(userPrompt.results || []);

      const interval = setInterval(() => {
        setThinkingIndex((prev) => {
          if (prev >= thinkingSteps.length - 1) {
            clearInterval(interval);
            return prev;
          }

          return prev + 1;
        });
      }, 900);

      return () => clearInterval(interval);
    }

    // NORMAL TEXT SEARCH
    if (typeof userPrompt === "string") {
      const response = stylistEngine(userPrompt);

      setIntent(response.intent);
      setResults([]);

      const interval = setInterval(() => {
        setThinkingIndex((prev) => {
          if (prev >= thinkingSteps.length - 1) {
            clearInterval(interval);
            return prev;
          }

          return prev + 1;
        });
      }, 900);

      return () => clearInterval(interval);
    }
  }, [userPrompt]);

  const isImageSearch =
    userPrompt &&
    typeof userPrompt === "object" &&
    userPrompt.type === "image";

  const textPrompt =
    typeof userPrompt === "string"
      ? userPrompt
      : userPrompt?.filename || "Image search";

  const advice = isImageSearch
    ? "I found some products that match the style of your uploaded image."
    : stylistEngine(userPrompt || "").advice;

  const formattedProducts = results.map((item) => ({
    image: item.thumbnail || item.image || "",
    brand: item.source || "VASTRA",
    name: item.title || "Fashion Item",
    price: item.price || "View Price",
    originalPrice: "",
    discount: "",
    rating: item.rating || "—",
    reviews: item.reviews || "",
    aiMatch: "94",
    aiReason: "Matched with your uploaded image.",
    source: item.source || "Online Store",
    link: item.link || "#",
  }));

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-28 pb-20"
    >
      <div className="max-w-6xl mx-auto px-6">

        {/* USER */}

        <div>
          <span className="text-[#D4AF37] font-semibold">
            You
          </span>

          <div className="mt-3 bg-[#111] border border-[#222] rounded-2xl p-5 text-white">
            {textPrompt}
          </div>
        </div>

        {/* AI */}

        <div className="mt-12">

          <h2 className="text-2xl font-semibold text-[#D4AF37]">
            ✨ VASTRA
          </h2>

          <motion.p
            key={thinkingIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 text-lg text-[#A8A8A8]"
          >
            {thinkingSteps[thinkingIndex]}
          </motion.p>

        </div>

        {/* RESULTS */}

        {thinkingIndex === thinkingSteps.length - 1 && (
          <>
            {/* AI ADVICE */}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-10 bg-[#111] border border-[#222] rounded-3xl p-7"
            >
              <p className="text-[#BDBDBD] leading-8">
                {advice}
              </p>
            </motion.div>

            {/* IMAGE SEARCH RESULTS */}

            {isImageSearch && formattedProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-14"
              >
                <h3 className="text-xl font-semibold text-white">
                  ✨ Similar Styles
                </h3>

                <p className="mt-2 text-[#888]">
                  Products found based on your uploaded image.
                </p>

                <ResultsGrid products={formattedProducts} />
              </motion.div>
            )}

            {/* NORMAL SHOPPING SEARCH */}

            {(intent === "shopping" || searchResults.length > 0) && (

  <motion.div
    initial={{ opacity: 0, y: 25 }}
    animate={{ opacity: 1, y: 0 }}
    className="mt-14"
  >

    <ResultsGrid products={searchResults} />

  </motion.div>

)}

            {/* FOLLOW UP */}

            {intent === "followUp" && (
              <div className="mt-10 bg-[#111] border border-[#222] rounded-3xl p-7">

                <h3 className="text-xl font-semibold text-white">
                  Tell me a little more
                </h3>

                <div className="mt-6 flex flex-wrap gap-4">

                  {["College", "Party", "Wedding", "Office"].map(
                    (option) => (
                      <button
                        key={option}
                        className="px-5 py-3 rounded-xl bg-[#1B1B1B] hover:bg-[#D4AF37] hover:text-black transition"
                      >
                        {option}
                      </button>
                    )
                  )}

                </div>
              </div>
            )}

            {/* PERSONAL STYLIST */}

            {intent === "personalStylist" && (
              <div className="mt-10 bg-[#111] border border-[#222] rounded-3xl p-7">

                <h3 className="text-xl font-semibold text-white">
                  ✨ Personal Stylist
                </h3>

                <p className="mt-4 text-[#A8A8A8]">
                  Upload your photo and I'll analyze your body type,
                  skin tone and outfit to give you personalized styling
                  recommendations.
                </p>

                <button className="mt-8 bg-[#D4AF37] text-black px-6 py-3 rounded-xl font-semibold">
                  Open Personal Stylist
                </button>

              </div>
            )}
          </>
        )}
      </div>
    </motion.section>
  );
}

export default AIWorkspace;