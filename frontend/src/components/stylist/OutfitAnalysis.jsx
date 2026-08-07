import { motion } from "framer-motion";

function OutfitAnalysis() {
  const scores = [
    { title: "Colour Match", score: 5 },
    { title: "Fit", score: 4 },
    { title: "Occasion", score: 5 },
    { title: "Trend Score", score: 4 },
    { title: "Versatility", score: 5 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .5 }}
      className="mt-12"
    >
      <div className="bg-[#111] border border-[#222] rounded-3xl p-8">

        {/* Header */}

        <div className="flex items-center justify-between flex-wrap gap-6">

          <div>

            <h2 className="text-3xl font-semibold text-white">
              ✨ Outfit Analysis
            </h2>

            <p className="mt-3 text-[#A8A8A8]">
              Here's what your Personal Stylist thinks.
            </p>

          </div>

          <div className="text-center">

            <div className="text-6xl font-bold text-[#D4AF37]">

              92%

            </div>

            <p className="text-[#999] mt-2">

              Overall Style Score

            </p>

          </div>

        </div>

        {/* Ratings */}

        <div className="mt-14 grid md:grid-cols-2 gap-8">

          {scores.map((item) => (

            <div
              key={item.title}
              className="flex justify-between items-center"
            >

              <span className="text-[#DDD]">

                {item.title}

              </span>

              <span className="text-[#D4AF37] text-xl">

                {"★".repeat(item.score)}

                {"☆".repeat(5 - item.score)}

              </span>

            </div>

          ))}

        </div>

        {/* Divider */}

        <div className="h-px bg-[#222] my-12" />

        {/* Strengths */}

        <h3 className="text-2xl font-semibold">

          👍 Strengths

        </h3>

        <div className="mt-6 space-y-4 text-[#BDBDBD]">

          <p>✓ Excellent colour combination.</p>

          <p>✓ Outfit feels balanced and modern.</p>

          <p>✓ Great choice for smart casual occasions.</p>

        </div>

        {/* Improvements */}

        <h3 className="text-2xl font-semibold mt-12">

          💡 Improve It Further

        </h3>

        <div className="mt-6 space-y-4 text-[#BDBDBD]">

          <p>• Add white sneakers for contrast.</p>

          <p>• A silver watch will elevate the outfit.</p>

          <p>• Slightly roll the sleeves for a cleaner silhouette.</p>

        </div>

      </div>
    </motion.div>
  );
}

export default OutfitAnalysis;