import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  ImagePlus,
  Sparkles,
  ShoppingBag,
  BookOpen,
  X,
  Upload,
  Check,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_CHAT_PROMPTS = {
  analyze:
    "I want VASTRA to analyze my outfit. I have uploaded my outfit photo. Please use the image to understand the outfit, then tell me what is working, what could be improved, which colours suit the combination, and how I can improve my overall style. Be practical and natural for an Indian lifestyle.",
  complete:
    "I want VASTRA to complete and improve my look. I have uploaded my outfit photo. Check the outfit for mismatched colours, pieces that do not work together, proportions, footwear, accessories and overall balance. Tell me what to keep, what to change, what to remove if necessary, and what I could add to make the look better. Be practical and honest.",
  wardrobe:
    "I want VASTRA to style my wardrobe from the clothing photos I uploaded. Identify the pieces I have, group them sensibly, and create useful outfit combinations from what I already own. Avoid telling me to buy new clothes unless there is a genuine gap.",
  tips:
    "I want practical fashion tips from VASTRA. Help me improve my everyday dressing, colours, fit, outfit combinations, accessories and styling for an Indian lifestyle. Ask only useful questions and keep the advice natural and practical.",
};

const TOOL_CONFIG = {
  analyze: {
    number: "01",
    title: "Analyze My Outfit",
    eyebrow: "OUTFIT ANALYSIS",
    subtitle:
      "Upload your outfit and let VASTRA look at the colours, fit, balance and overall styling.",
    uploadTitle: "Upload Your Outfit",
    uploadDescription:
      "Choose one clear photo showing the outfit you want VASTRA to analyse.",
    button: "Analyze With VASTRA",
    icon: Camera,
    multiple: false,
    acceptText: "JPG · PNG · WEBP",
  },
  complete: {
    number: "02",
    title: "Complete & Improve My Look",
    eyebrow: "LOOK IMPROVEMENT",
    subtitle:
      "Show VASTRA your look and find out what to keep, change, remove or add.",
    uploadTitle: "Upload Your Look",
    uploadDescription:
      "Upload the outfit you are wearing or planning to wear.",
    button: "Check & Improve My Look",
    icon: Sparkles,
    multiple: false,
    acceptText: "JPG · PNG · WEBP",
  },
  wardrobe: {
    number: "03",
    title: "Style My Wardrobe",
    eyebrow: "WARDROBE STYLING",
    subtitle:
      "Upload your clothes and let VASTRA build combinations from what you already own.",
    uploadTitle: "Upload Your Clothes",
    uploadDescription:
      "Select multiple clothing photos at once — shirts, T-shirts, jeans, trousers, shoes, jackets and more.",
    button: "Style My Wardrobe",
    icon: ShoppingBag,
    multiple: true,
    acceptText: "MULTIPLE PHOTOS",
  },
  tips: {
    number: "04",
    title: "Fashion Tips",
    eyebrow: "FASHION ADVICE",
    subtitle:
      "Ask VASTRA about anything you want to improve in the way you dress.",
    uploadTitle: "Start With A Question",
    uploadDescription:
      "Tell VASTRA what you are dressing for or what you want to improve.",
    button: "Ask VASTRA",
    icon: BookOpen,
    multiple: false,
    acceptText: "PERSONALISED ADVICE",
  },
};

const compressImage = (file, maxSize = 1000, quality = 0.78) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Could not read image."));

    reader.onload = () => {
      const img = new Image();

      img.onerror = () => reject(new Error("Could not load image."));

      img.onload = () => {
        const scale = Math.min(
          1,
          maxSize / Math.max(img.width, img.height)
        );

        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));

        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Could not process image."));
          return;
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        resolve(
          canvas.toDataURL("image/jpeg", quality)
        );
      };

      img.src = reader.result;
    };

    reader.readAsDataURL(file);
  });

function ImageUploadPanel({
  config,
  images,
  onFiles,
  onRemove,
  onContinue,
  loading,
}) {
  const inputRef = useRef(null);
  const Icon = config.icon;

  const hasImages = images.length > 0;

  return (
    <div className="overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.025] backdrop-blur-xl">
      <div className="relative min-h-[650px] overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.09),transparent_42%)]" />

        <div className="pointer-events-none absolute -right-28 -top-24 h-[420px] w-[420px] rounded-full border border-[#D4AF37]/10" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-[320px] w-[320px] rounded-full bg-[#D4AF37]/[0.025] blur-3xl" />

        <div className="relative flex min-h-[650px] flex-col p-7 md:p-10 lg:p-12">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
                <Icon size={14} />
                {config.eyebrow}
              </div>

              <h2 className="mt-5 max-w-xl text-3xl font-medium tracking-[-0.03em] text-white md:text-4xl">
                {config.uploadTitle}
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-white/45 md:text-base">
                {config.uploadDescription}
              </p>
            </div>

            <div className="hidden rounded-full border border-white/10 bg-black/20 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/35 md:block">
              {config.acceptText}
            </div>
          </div>

          {config.title === "Fashion Tips" ? (
            <div className="mt-auto">
              <div className="rounded-[28px] border border-white/10 bg-[#0B0B0B]/75 p-6 md:p-8">
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    "How can I dress better for college?",
                    "How do I style a white shirt?",
                    "What colours work well together?",
                    "How can I make a simple outfit stand out?",
                  ].map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => onContinue(prompt)}
                      className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] px-4 py-4 text-left text-sm text-white/65 transition hover:-translate-y-0.5 hover:border-[#D4AF37]/35 hover:bg-[#D4AF37]/[0.04] hover:text-white"
                    >
                      <span>{prompt}</span>
                      <ArrowRight
                        size={15}
                        className="mt-3 text-white/20 transition group-hover:translate-x-1 group-hover:text-[#D4AF37]"
                      />
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => onContinue("")}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#e2c75d]"
                >
                  ASK YOUR OWN QUESTION
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className={`group mt-auto flex min-h-[350px] w-full flex-col items-center justify-center rounded-[28px] border border-dashed transition-all duration-300 ${
                  hasImages
                    ? "border-[#D4AF37]/25 bg-black/20"
                    : "border-white/[0.13] bg-black/10 hover:border-[#D4AF37]/35 hover:bg-[#D4AF37]/[0.025]"
                }`}
              >
                {!hasImages ? (
                  <>
                    <div className="grid h-16 w-16 place-items-center rounded-full border border-[#D4AF37]/35 bg-[#D4AF37]/[0.07] text-[#D4AF37] transition group-hover:scale-105 group-hover:bg-[#D4AF37]/10">
                      <ImagePlus size={28} strokeWidth={1.6} />
                    </div>

                    <div className="mt-6 text-xl font-semibold text-white">
                      {config.multiple
                        ? "Add Your Wardrobe Photos"
                        : "Upload Your Outfit"}
                    </div>

                    <p className="mt-2 max-w-md text-center text-sm leading-6 text-white/35">
                      {config.multiple
                        ? "Select multiple photos together. You can add more afterwards too."
                        : "Use a clear photo where the outfit is easy to see."}
                    </p>

                    <div className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-black">
                      <Upload size={15} />
                      {config.multiple ? "ADD PHOTOS" : "UPLOAD IMAGE"}
                    </div>
                  </>
                ) : (
                  <div className="w-full px-5 py-6">
                    <div className="flex flex-wrap justify-center gap-4">
                      {images.map((src, index) => (
                        <div
                          key={`${src.slice(-30)}-${index}`}
                          className="group relative h-44 w-36 overflow-hidden rounded-2xl border border-white/10 bg-[#111] shadow-[0_12px_35px_rgba(0,0,0,.28)]"
                        >
                          <img
                            src={src}
                            alt={`Uploaded item ${index + 1}`}
                            className="h-full w-full object-cover"
                          />

                          <button
                            type="button"
                            aria-label={`Remove image ${index + 1}`}
                            onClick={(event) => {
                              event.stopPropagation();
                              onRemove(index);
                            }}
                            className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/65 text-white/80 backdrop-blur-sm transition hover:bg-black hover:text-white"
                          >
                            <X size={15} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          inputRef.current?.click();
                        }}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-xs font-semibold text-white/65 transition hover:border-[#D4AF37]/35 hover:text-white"
                      >
                        <ImagePlus size={14} />
                        {config.multiple ? "ADD MORE" : "CHANGE IMAGE"}
                      </button>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onContinue();
                        }}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#e2c75d] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {loading ? "PREPARING..." : config.button}
                        <ArrowRight size={15} />
                      </button>
                    </div>

                    <div className="mt-4 text-center text-xs text-white/25">
                      {images.length} {images.length === 1 ? "photo" : "photos"} selected
                    </div>
                  </div>
                )}
              </button>

              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple={config.multiple}
                onChange={onFiles}
                className="hidden"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StylistTool() {
  const navigate = useNavigate();
  const { tool } = useParams();

  const config = TOOL_CONFIG[tool] || TOOL_CONFIG.analyze;

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");

  useEffect(() => {
    setImages([]);
    setLoading(false);
    setQuestion("");
  }, [tool]);

  const normalizedTool = useMemo(
    () => (TOOL_CONFIG[tool] ? tool : "analyze"),
    [tool]
  );

  const handleFiles = async (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      return;
    }

    const incoming = config.multiple
      ? files.slice(0, 12)
      : files.slice(0, 1);

    try {
      const prepared = [];

      for (const file of incoming) {
        if (!file.type.startsWith("image/")) {
          continue;
        }

        prepared.push(await compressImage(file));
      }

      setImages((current) =>
        config.multiple
          ? [...current, ...prepared].slice(0, 12)
          : prepared
      );
    } catch (error) {
      console.error("VASTRA → image preparation failed:", error);
    } finally {
      event.target.value = "";
    }
  };

  const removeImage = (index) => {
    setImages((current) =>
      current.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const openChat = (customPrompt = "") => {
    const prompt =
      customPrompt?.trim() ||
      API_CHAT_PROMPTS[normalizedTool];

    try {
      sessionStorage.setItem(
        "vastra-pending-stylist-flow",
        JSON.stringify({
          tool: normalizedTool,
          images,
          createdAt: Date.now(),
        })
      );
    } catch (error) {
      console.warn(
        "VASTRA → Could not preserve uploaded images for Chat:",
        error
      );
    }

    navigate(
      `/chat?prompt=${encodeURIComponent(prompt)}`
    );
  };

  const handlePrimaryAction = async () => {
    if (normalizedTool === "tips") {
      openChat(question);
      return;
    }

    if (!images.length) {
      return;
    }

    setLoading(true);

    // The image is kept in sessionStorage so the Chat page can
    // consume it in the next step without putting it in the URL.
    openChat();
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] px-5 py-20 text-white lg:px-10">
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -right-52 top-24 h-[650px] w-[650px] rounded-full border border-[#D4AF37]/10" />
        <div className="absolute right-[-120px] top-[180px] h-[360px] w-[560px] rotate-[-28deg] rounded-[50%] border border-[#D4AF37]/10" />
        <div className="absolute -left-56 bottom-10 h-[480px] w-[480px] rounded-full bg-[#D4AF37]/[0.02] blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-10 flex items-center justify-between gap-5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-sm text-white/65 transition hover:border-[#D4AF37]/35 hover:text-white"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="rounded-full border border-white/[0.08] bg-white/[0.02] px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.25em] text-white/30">
            {config.number} / 04
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="max-w-4xl"
        >
          <div className="flex items-center gap-3">
            <span className="h-px w-9 bg-[#D4AF37]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-white/40">
              {config.eyebrow}
            </span>
          </div>

          <h1 className="mt-6 text-5xl font-medium uppercase leading-[0.92] tracking-[-0.045em] md:text-7xl lg:text-[6.8rem]">
            {config.title}
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-7 text-white/45 md:text-lg">
            {config.subtitle}
          </p>
        </motion.div>

        {normalizedTool === "tips" ? (
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-14 max-w-5xl"
          >
            <div className="rounded-[34px] border border-white/10 bg-white/[0.025] p-7 backdrop-blur-xl md:p-10">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
                <BookOpen size={14} />
                ASK VASTRA
              </div>

              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="For example: How can I style a white shirt for college?"
                rows={5}
                className="mt-6 w-full resize-none rounded-[24px] border border-white/[0.08] bg-[#0a0a0a] p-5 text-base leading-7 text-white outline-none transition placeholder:text-white/20 focus:border-[#D4AF37]/35"
              />

              <button
                type="button"
                onClick={handlePrimaryAction}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-[#e2c75d]"
              >
                ASK VASTRA
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="mt-14"
          >
            <ImageUploadPanel
              config={config}
              images={images}
              onFiles={handleFiles}
              onRemove={removeImage}
              onContinue={handlePrimaryAction}
              loading={loading}
            />
          </motion.div>
        )}

        {normalizedTool === "wardrobe" && (
          <div className="mt-6 flex items-center gap-3 text-xs text-white/30">
            <Check size={14} className="text-[#D4AF37]" />
            You can upload up to 12 photos in one go.
          </div>
        )}
      </div>
    </main>
  );
}
