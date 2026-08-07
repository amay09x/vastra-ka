import { Upload } from "lucide-react";
import { useState } from "react";
import OutfitAnalysis from "./OutfitAnalysis";

function OutfitUpload({ image, onImageSelect }) {
   const [analyzed, setAnalyzed] = useState(false);
const [loading, setLoading] = useState(false);

const loadingSteps = [
  "📸 Detecting outfit...",
  "🎨 Analyzing colour harmony...",
  "👔 Checking outfit fit...",
  "💎 Matching accessories...",
  "🧠 Creating stylist recommendations..."
];

const [step, setStep] = useState(0);;
  const handleChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    onImageSelect(URL.createObjectURL(file));
  };

  return (
    <div className="mt-16">

      <h2 className="text-3xl font-semibold text-white mb-8">

        📸 Outfit Analysis

      </h2>

      {!image ? (

        <label
          className="
            border-2
            border-dashed
            border-[#333]
            rounded-3xl
            p-14
            flex
            flex-col
            items-center
            justify-center
            cursor-pointer
            hover:border-[#D4AF37]
            transition
          "
        >

          <Upload
            size={48}
            className="text-[#D4AF37]"
          />

          <h3 className="mt-6 text-2xl font-semibold text-white">

            Upload Your Outfit

          </h3>

          <p className="mt-3 text-[#999]">

            JPG, PNG or WEBP

          </p>

          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleChange}
          />

        </label>

      ) : (

        <div className="grid lg:grid-cols-2 gap-10">

          {/* Image */}

          <div>

            <img
              src={image}
              alt="Outfit"
              className="
                w-full
                rounded-3xl
                object-cover
                border
                border-[#222]
              "
            />

          </div>

          {/* Analyze */}

          <div
            className="
              rounded-3xl
              border
              border-[#222]
              bg-[#111]
              p-8
              flex
              flex-col
              justify-center
            "
          >

            <h3 className="text-3xl font-semibold">

              Ready to Analyze

            </h3>

            <p className="mt-5 text-[#A8A8A8] leading-8">

              Your outfit has been uploaded successfully.

              Click the button below and your Personal Stylist
              will analyze colours, fit, styling and matching
              accessories.

            </p>

           <button
  onClick={() => {
  setLoading(true);
  setStep(0);

  let current = 0;

  const interval = setInterval(() => {
    current++;

    if (current >= loadingSteps.length) {
      clearInterval(interval);

      setLoading(false);
      setAnalyzed(true);
    } else {
      setStep(current);
    }

  }, 800);
}}
  className="
    mt-10
    bg-[#D4AF37]
    text-black
    py-4
    rounded-2xl
    font-semibold
    hover:scale-105
    transition
  "
>
  ✨ Analyze Outfit
</button>
{loading && (

  <div className="mt-10 rounded-3xl border border-[#222] bg-[#111] p-8">

    <h3 className="text-xl font-semibold text-white">

      ✨ Personal Stylist

    </h3>

    <p className="mt-6 text-[#D4AF37] text-lg">

      {loadingSteps[step]}

    </p>

  </div>

)}

{analyzed && <OutfitAnalysis />}

          </div>

        </div>

      )}

    </div>
  );
}

export default OutfitUpload;