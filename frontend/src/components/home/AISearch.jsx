import {
  Search,
  Sparkles,
  Mic,
  Camera,
  Loader2,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function AISearch({ onSearch }) {
  const imageInputRef = useRef(null);

  const placeholders = [
    "Ask anything...",
    "Need an outfit under ₹3000",
    "Black oversized hoodie",
    "Wedding outfit for men",
    "Old money aesthetic",
    "Outfit for a concert",
  ];

  const [placeholder, setPlaceholder] = useState("");
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // IMAGE SEARCH
  const handleImageSearch = async (event) => {
  const file = event.target.files?.[0];

  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    console.log("VASTRA: searching image...", file.name);

    const response = await fetch(
      "http://127.0.0.1:8000/image-search",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Image search failed: ${response.status}`);
    }

    const data = await response.json();

    console.log("VASTRA image search results:", data);

    if (onSearch) {
      onSearch({
        type: "image",
        imageUrl: data.image_url,
        filename: data.filename,
        results: data.results || [],
      });
    }

  } catch (error) {
    console.error("VASTRA image search failed:", error);
  }

  event.target.value = "";
};

  // TEXT SEARCH
  const handleSearch = () => {
  const trimmedQuery = query.trim();

  if (!trimmedQuery || loading) return;

  setLoading(true);

  onSearch(trimmedQuery);

  const handleSearch = () => {
  const trimmedQuery = query.trim();

  if (!trimmedQuery || loading) return;

  setLoading(true);

  onSearch(trimmedQuery);

  setLoading(false);
};
};
  // ANIMATED PLACEHOLDER
  useEffect(() => {
    const current = placeholders[index];
    let timeout;

    if (!deleting) {
      if (placeholder.length < current.length) {
        timeout = setTimeout(() => {
          setPlaceholder(
            current.slice(0, placeholder.length + 1)
          );
        }, 60);
      } else {
        timeout = setTimeout(() => {
          setDeleting(true);
        }, 2400);
      }
    } else {
      if (placeholder.length > 0) {
        timeout = setTimeout(() => {
          setPlaceholder(
            current.slice(0, placeholder.length - 1)
          );
        }, 18);
      } else {
        setDeleting(false);

        setIndex(
          (prev) =>
            (prev + 1) % placeholders.length
        );
      }
    }

    return () => clearTimeout(timeout);
  }, [placeholder, deleting, index]);

  return (
    <motion.div
      className="relative w-full max-w-[590px]"
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.7,
        delay: 0.35,
        ease: [0.2, 0.7, 0.2, 1],
      }}
    >
      {/* Search Bar */}

      <div
        className="
          relative
          h-[58px]
          w-full
          flex
          items-center
          gap-3
          px-4
          rounded-xl
          border
          border-white/[0.16]
          bg-black/25
          backdrop-blur-md
          transition-all
          duration-500
          hover:border-[#D4AF37]/50
          hover:bg-black/35
          focus-within:border-[#D4AF37]/60
          focus-within:shadow-[0_0_30px_rgba(212,175,55,0.08)]
        "
      >
        {/* Hidden Image Input */}

        <input
          ref={imageInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleImageSearch}
          className="hidden"
        />

        {/* AI Icon */}

        <Sparkles
          size={17}
          className="shrink-0 text-[#D4AF37]"
        />

        {/* Input */}

        <div className="relative flex-1 h-full flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
            className="
              w-full
              bg-transparent
              outline-none
              text-[14px]
              text-white
              placeholder-transparent
              relative
              z-10
            "
          />

          {/* Animated Placeholder */}

          {query === "" && (
            <div
              className="
                absolute
                inset-0
                flex
                items-center
                pointer-events-none
                text-[14px]
                text-white/40
              "
            >
              {placeholder}

              <span
                className="
                  ml-[1px]
                  text-[#D4AF37]
                  animate-pulse
                "
              >
                |
              </span>
            </div>
          )}
        </div>

        {/* CAMERA */}

        <button
          type="button"
          className="
            shrink-0
            text-white/45
            hover:text-white
            transition-all
            duration-300
            hover:scale-105
          "
          aria-label="Search by image"
          onClick={() =>
            imageInputRef.current?.click()
          }
        >
          <Camera size={18} />
        </button>

        {/* MICROPHONE */}

        <button
          type="button"
          className="
            shrink-0
            text-white/45
            hover:text-white
            transition-all
            duration-300
            hover:scale-105
          "
          aria-label="Voice search"
        >
          <Mic size={18} />
        </button>

        {/* SEARCH BUTTON */}

        <motion.button
          type="button"
          onClick={handleSearch}
          whileHover={{
            scale: 1.06,
          }}
          whileTap={{
            scale: 0.94,
          }}
          className="
            shrink-0
            w-9
            h-9
            rounded-full
            bg-[#D4AF37]
            text-black
            flex
            items-center
            justify-center
          "
          aria-label="Search"
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loader"
                initial={{
                  opacity: 0,
                  scale: 0.6,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                }}
              >
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              </motion.div>
            ) : (
              <motion.div
                key="search"
                initial={{
                  opacity: 0,
                  x: -3,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                }}
              >
                <Search size={17} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Small hint */}

      <div
        className="
          mt-3
          flex
          items-center
          gap-2
          text-[10px]
          tracking-[0.12em]
          uppercase
          text-white/25
        "
      >
        <span className="w-1 h-1 rounded-full bg-[#D4AF37]" />

        Describe it. VASTRA will style it.
      </div>
    </motion.div>
  );
}

export default AISearch;