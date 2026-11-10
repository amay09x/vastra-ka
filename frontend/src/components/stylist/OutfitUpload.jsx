import { Upload } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PENDING_FLOW_KEY = "vastra-pending-stylist-flow";
const CHAT_SESSION_KEY = "vastra-chat-session";
const STYLIST_RETURN_KEY = "vastra-stylist-return-path";
const STYLIST_FLOW_ID_KEY = "vastra-stylist-flow-id";

function OutfitUpload({
  image,
  onImageSelect,
  tool = "analyze",
}) {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toolPrompts = {
    analyze:
      "I uploaded my outfit photo. Please analyse it and tell me what is working, what I can improve, which colours suit the combination, and how I can improve my overall style.",

    complete:
      "I uploaded my look. Please check what is working, what is mismatching, what I should keep, change or remove, and what I could add to make the outfit look better.",

    wardrobe:
      "I uploaded my wardrobe photos. Please identify what I have and create useful outfit combinations from the clothes I already own.",
  };

  const handleReset = () => {
    setFile(null);
    setError("");

    if (onImageSelect) {
      onImageSelect(null);
    }

    try {
      sessionStorage.removeItem(PENDING_FLOW_KEY);
    } catch {
      // Ignore storage errors.
    }
  };

  const fileToDataUrl = (selectedFile) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);

      reader.onerror = () =>
        reject(new Error("Could not read the selected image."));

      reader.readAsDataURL(selectedFile);
    });
  };

  const handleChange = async (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    // IMPORTANT:
    // A new image must replace the previous image completely.
    setFile(selectedFile);
    setError("");

    const imageUrl = URL.createObjectURL(selectedFile);

    if (onImageSelect) {
      onImageSelect(imageUrl);
    }
  };

  const handleSendToVastra = async () => {
    if (!file) {
      setError("Please upload an outfit image first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Convert the NEW file to a persistent data URL.
      const imageData = await fileToDataUrl(file);

      // IMPORTANT:
      // Remove EVERYTHING from the previous visual/chat flow.
      sessionStorage.removeItem(PENDING_FLOW_KEY);
      sessionStorage.removeItem(CHAT_SESSION_KEY);

      // Give every upload a unique flow ID.
      const flowId =
        `${tool}-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`;

      // Save where Chat must return.
      sessionStorage.setItem(
        STYLIST_RETURN_KEY,
        `/stylist?action=${tool}`
      );

      sessionStorage.setItem(
        STYLIST_FLOW_ID_KEY,
        flowId
      );

      // Store ONLY the current image.
      sessionStorage.setItem(
        PENDING_FLOW_KEY,
        JSON.stringify({
          id: flowId,
          tool,
          images: [imageData],
          createdAt: Date.now(),
        })
      );

      // Open VASTRA Chat.
      navigate(
        `/chat?from=${encodeURIComponent(
          `/stylist?action=${tool}`
        )}&flow=${encodeURIComponent(flowId)}`
      );

    } catch (err) {
      console.error(
        "VASTRA → Could not prepare image:",
        err
      );

      setError(
        err.message ||
          "Could not prepare the image. Please try again."
      );

      setLoading(false);
    }
  };

  return (
    <div className="mt-16">

      <h2 className="text-3xl font-semibold text-white mb-8">
        📸 Outfit Analysis
      </h2>

      {/* ================================
          UPLOAD
      ================================= */}

      {!image && (
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
      )}

      {/* ================================
          PREVIEW
      ================================= */}

      {image && (
        <div className="grid lg:grid-cols-2 gap-10">

          <div>
            <img
              src={image}
              alt="Uploaded outfit"
              className="
                w-full
                rounded-3xl
                object-cover
                border
                border-[#222]
              "
            />
          </div>

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

            <h3 className="text-3xl font-semibold text-white">
              Ready to Style
            </h3>

            <p className="mt-5 text-[#A8A8A8] leading-8">
              Your new outfit photo is ready.
              Send it to VASTRA and the AI stylist
              will review this exact image.
            </p>

            <button
              type="button"
              onClick={handleSendToVastra}
              disabled={loading}
              className="
                mt-10
                bg-[#D4AF37]
                text-black
                py-4
                rounded-2xl
                font-semibold
                hover:scale-105
                transition
                disabled:opacity-60
              "
            >
              {loading
                ? "✨ Sending to VASTRA..."
                : "✨ Check & Improve My Look"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="
                mt-4
                border
                border-[#333]
                text-white
                py-3
                rounded-2xl
                hover:border-[#D4AF37]
                transition
                disabled:opacity-50
              "
            >
              Upload Different Photo
            </button>

            {error && (
              <div
                className="
                  mt-6
                  p-4
                  rounded-2xl
                  border
                  border-red-900
                  bg-red-950/30
                "
              >
                <p className="text-red-400">
                  ❌ {error}
                </p>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

export default OutfitUpload;