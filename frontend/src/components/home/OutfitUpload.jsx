import { useRef, useState } from "react";
import { Upload, Image, Sparkles, X } from "lucide-react";

export default function OutfitUpload({
  onImageSelect,
  onAnalysisComplete,
}) {
  const fileInputRef = useRef(null);

  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    setError("");
    setSelectedFile(file);

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);

    if (onImageSelect) {
      onImageSelect(imageUrl);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError("Please select an outfit image first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("file", selectedFile);

      const response = await fetch(
        "http://127.0.0.1:8000/outfit-analysis",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail?.message ||
          data?.detail ||
          "Outfit analysis failed."
        );
      }

      console.log("OUTFIT ANALYSIS RESPONSE:");
      console.log(data);

      if (onAnalysisComplete) {
        onAnalysisComplete(data);
      }
    } catch (err) {
      console.error("Outfit analysis error:", err);

      setError(
        err.message || "Unable to analyze the outfit. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setSelectedFile(null);
    setError("");

    if (onImageSelect) {
      onImageSelect(null);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {!preview ? (
        <button
          type="button"
          onClick={handleUploadClick}
          className="
            w-full
            min-h-[260px]
            rounded-3xl
            border
            border-[#D4AF37]/30
            bg-white/[0.04]
            hover:bg-white/[0.07]
            transition-all
            duration-300
            flex
            flex-col
            items-center
            justify-center
            gap-5
            cursor-pointer
          "
        >
          <div
            className="
              w-20
              h-20
              rounded-full
              bg-[#D4AF37]/10
              border
              border-[#D4AF37]/30
              flex
              items-center
              justify-center
            "
          >
            <Upload
              size={32}
              className="text-[#D4AF37]"
            />
          </div>

          <div className="text-center">
            <h3 className="text-xl font-medium text-white">
              Upload Your Outfit
            </h3>

            <p className="mt-2 text-sm text-white/50">
              Upload a photo and let VASTRA analyze your look
            </p>

            <p className="mt-1 text-xs text-white/30">
              JPG, JPEG, PNG
            </p>
          </div>
        </button>
      ) : (
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-3xl border border-[#D4AF37]/30 bg-black/20">
            <img
              src={preview}
              alt="Selected outfit"
              className="
                w-full
                max-h-[500px]
                object-contain
                bg-black/30
              "
            />

            <button
              type="button"
              onClick={handleRemove}
              className="
                absolute
                top-4
                right-4
                w-10
                h-10
                rounded-full
                bg-black/70
                border
                border-white/20
                flex
                items-center
                justify-center
                hover:bg-black
                transition
              "
            >
              <X size={18} className="text-white" />
            </button>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleUploadClick}
              className="
                flex-1
                py-3
                rounded-xl
                border
                border-white/10
                bg-white/5
                text-white
                hover:bg-white/10
                transition
                flex
                items-center
                justify-center
                gap-2
              "
            >
              <Image size={18} />
              Change Image
            </button>

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={loading}
              className="
                flex-1
                py-3
                rounded-xl
                bg-[#D4AF37]
                text-black
                font-medium
                hover:bg-[#e0bd4d]
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
                flex
                items-center
                justify-center
                gap-2
              "
            >
              <Sparkles size={18} />

              {loading ? "Analyzing..." : "Analyze Outfit"}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-400">
            {error}
          </p>
        </div>
      )}
    </div>
  );
}