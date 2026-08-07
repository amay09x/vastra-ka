import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ResultsGrid from "../results/ResultsGrid";
import { stylistEngine } from "../../ai/stylistEngine";
function AIWorkspace({ userPrompt }) {
  const thinkingSteps = [
    "✨ Understanding your request...",
    "🧠 Thinking like your personal stylist...",
    "👔 Preparing the best recommendation...",
  ];

  const [thinkingIndex, setThinkingIndex] = useState(0);
  const [intent, setIntent] = useState("");

  useEffect(() => {
    setThinkingIndex(0);

    const response = stylistEngine(userPrompt);

setIntent(response.intent);

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
  }, [userPrompt]);

 
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-28 pb-20"
    >
      <div className="max-w-6xl mx-auto px-6">

        {/* User */}

        <div>

          <span className="text-[#D4AF37] font-semibold">
            You
          </span>

          <div className="mt-3 bg-[#111] border border-[#222] rounded-2xl p-5 text-white">
            {userPrompt}
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

        {thinkingIndex === thinkingSteps.length - 1 && (

          <>
            {/* AI Advice */}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-10 bg-[#111] border border-[#222] rounded-3xl p-7"
            >

              <p className="text-[#BDBDBD] leading-8">
{stylistEngine(userPrompt).advice}</p>

            </motion.div>

            {/* Shopping */}

            {intent === "shopping" && (

              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-14"
              >

                <ResultsGrid />

              </motion.div>

            )}

            {/* Follow Up */}

            {intent === "followUp" && (

              <div className="mt-10 bg-[#111] border border-[#222] rounded-3xl p-7">

                <h3 className="text-xl font-semibold text-white">

                  Tell me a little more

                </h3>

                <div className="mt-6 flex flex-wrap gap-4">

                  <button className="px-5 py-3 rounded-xl bg-[#1B1B1B] hover:bg-[#D4AF37] hover:text-black transition">
                    College
                  </button>

                  <button className="px-5 py-3 rounded-xl bg-[#1B1B1B] hover:bg-[#D4AF37] hover:text-black transition">
                    Party
                  </button>

                  <button className="px-5 py-3 rounded-xl bg-[#1B1B1B] hover:bg-[#D4AF37] hover:text-black transition">
                    Wedding
                  </button>

                  <button className="px-5 py-3 rounded-xl bg-[#1B1B1B] hover:bg-[#D4AF37] hover:text-black transition">
                    Office
                  </button>

                </div>

              </div>

            )}

            {/* Personal Stylist */}

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