import {
  Search,
  Sparkles,
  Mic,
  Camera,
  Loader2,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

function AISearch({ onSearch }) {
  
  const placeholders = [
  "Ask anything...",
  "Need an outfit under ₹3000",
  "Black oversized hoodie",
  "Wedding outfit for men",
  "Old money aesthetic",
  "Outfit for a concert",
];
const handleSearch = () => {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) return;

  setLoading(true);

  onSearch(trimmedQuery);

  setTimeout(() => {
    setLoading(false);
  }, 3000);
};


const [placeholder, setPlaceholder] = useState("");
const [index, setIndex] = useState(0);
const [deleting, setDeleting] = useState(false);
const [query, setQuery] = useState("");
const [loading, setLoading] = useState(false);
const [searched, setSearched] = useState(false);
const [submittedQuery, setSubmittedQuery] = useState("");

useEffect(() => {
  const current = placeholders[index];

  let timeout;

  if (!deleting) {

    // typing
    if (placeholder.length < current.length) {
      timeout = setTimeout(() => {
        setPlaceholder(current.slice(0, placeholder.length + 1));
      }, 60);
    }

    // finished typing
    else {

      // wait while cursor blinks
      timeout = setTimeout(() => {
        setDeleting(true);
      }, 2400);

    }

  } else {

    // delete faster than typing
    if (placeholder.length > 0) {

      timeout = setTimeout(() => {
        setPlaceholder(current.slice(0, placeholder.length - 1));
      }, 18);

    }

    else {

      setDeleting(false);
      setIndex((prev) => (prev + 1) % placeholders.length);

    }

  }

  return () => clearTimeout(timeout);

}, [placeholder, deleting, index]);
  return (
    <div className="mt-16">

      <div
        className="
        bg-[#0E0E0E]
        border
        border-[#242424]
        rounded-2xl
        px-6
        py-5
        flex
        items-center
        gap-4
        hover:border-[#D4AF37]
hover:shadow-[0_0_35px_rgba(212,175,55,.12)]
transition-all
duration-500
      "
      >
        <Sparkles
          size={22}
          className="
text-[#D4AF37]
animate-pulse
"
        />

        <div className="relative flex-1">

  <input
  type="text"
  value={query}
  onChange={(e) => setQuery(e.target.value)}
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
    text-lg
    text-white
    placeholder-transparent
    relative
    z-10
  "
/>


{query === "" && (
  <div
    className="
      absolute
      left-0
      top-1/2
      -translate-y-1/2
      pointer-events-none
      text-[#707070]
      text-lg
      flex
      items-center
      gap-1
    "
  >
    {placeholder}

    <span className="cursor-blink text-[#D4AF37]">
    
      |
    </span>

  </div>
)}
</div>
  

        <Camera
          size={22}
          className="
cursor-pointer
transition-all
duration-300
hover:text-[#D4AF37]
hover:scale-110
"
        />

        <Mic
          size={22}
          className="
cursor-pointer
transition-all
duration-300
hover:text-[#D4AF37]
hover:scale-110
"
        />

       <motion.button
  onClick={handleSearch}
  whileHover={{
    scale: 1.08,
    rotate: 6,
  }}
  whileTap={{
    scale: 0.94,
  }}
  className="
    w-12
    h-12
    rounded-full
    bg-[#D4AF37]
    flex
    items-center
    justify-center
    overflow-hidden
  "
>
  <AnimatePresence mode="wait">

    {loading ? (

      <motion.div
        key="loader"
        initial={{ opacity: 0, scale: .5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
      >
        <Loader2
          size={20}
          color="black"
          className="animate-spin"
        />
      </motion.div>

    ) : (

      <motion.div
        key="search"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Search color="black" size={20} />
      </motion.div>

    )}

  </AnimatePresence>

</motion.button>

      </div>

    </div>
  );
}

export default AISearch;