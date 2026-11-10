import { motion } from "framer-motion";
import {
  Menu,
  Send,
  ArrowLeft,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import HistorySidebar from "../components/stylist/HistorySidebar";
import OutfitUpload from "../components/stylist/OutfitUpload";

function PersonalStylist() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const stylistAction =
    searchParams.get("action") || null;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);


  useEffect(() => {
  if (!stylistAction) {
    return;
  }

  if (
    stylistAction === "analyze" ||
    stylistAction === "complete" ||
    stylistAction === "wardrobe"
  ) {
    setTimeout(() => {
      document
        .getElementById("upload-section")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    }, 100);
  }
}, [stylistAction]);

  // =========================================================
  // QUICK ACTIONS
  // =========================================================

  const quickActions = [
    {
      icon: "📸",
      title: "Analyze My Outfit",
      prompt: "Analyze my outfit.",
    },
    {
      icon: "👔",
      title: "Build an Outfit",
      prompt: "Build me an outfit.",
    },
    {
      icon: "🎨",
      title: "Find My Best Colours",
      prompt: "Find the best colours for me.",
    },
    {
      icon: "✨",
      title: "Improve My Style",
      prompt: "Help me improve my style.",
    },
    {
      icon: "👟",
      title: "Complete My Look",
      prompt: "Complete my outfit.",
    },
    {
      icon: "📖",
      title: "Fashion Tips",
      prompt: "Teach me fashion.",
    },
  ];

  // =========================================================
  // BUILD OUTFIT OPTIONS
  // =========================================================

  const buildOutfitOptions = [
    {
      icon: "💍",
      title: "Wedding",
      prompt:
        "I want to build an outfit for a wedding. Help me create a polished look based on the wedding type, dress code, venue, time of day, weather, my personal style, budget, and what I already own. Ask only the important questions you need before recommending specific pieces.",
    },

    {
      icon: "🎓",
      title: "College",
      prompt:
        "I want to build a college outfit. Help me create a stylish and comfortable look based on my personal style, college setting or activity, weather, budget, and what I already own. Ask a few relevant questions first, then recommend suitable pieces that work well together.",
    },

    {
      icon: "☀️",
      title: "Casual",
      prompt:
        "I want to build a casual everyday outfit. Help me create a comfortable but well-styled look based on where I’m going, the weather, my personal style, budget, and the clothes I already own. Ask only for details that are necessary before recommending the outfit.",
    },

    {
      icon: "🎉",
      title: "Party / Date",
      prompt:
        "I want to build an outfit for a party or date. Help me create a stylish look that matches the occasion, venue, time, weather, my personal style, and budget. Consider what I already own and ask the important questions first before recommending the outfit.",
    },

    {
      icon: "✨",
      title: "Custom",
      prompt:
        "I want to build a custom outfit. I’ll tell you what I’m looking for, and you should help me create a complete look around it. Consider the occasion, weather, personal style, colours, wardrobe, fit, and budget. Ask follow-up questions only when the missing information would actually change your recommendation.",
    },
  ];

  // =========================================================
  // COLOUR OPTIONS
  // =========================================================

  const colourOptions = [
    {
      icon: "👕",
      title: "Clothes",
      prompt:
        "Help me find the best colours for my clothes. Ask me about my skin tone, undertone, hair colour, eye colour, personal style and the colours I usually wear, then recommend colours that suit me.",
    },

    {
      icon: "👚",
      title: "My Wardrobe",
      prompt:
        "Help me choose the best colours from my wardrobe. Ask me what clothes and colours I already own, then tell me which combinations will suit me best.",
    },

    {
      icon: "🎨",
      title: "Full Colour Palette",
      prompt:
        "Find my complete personal colour palette. Ask me about my skin tone, undertone, hair colour, eye colour, personal style, weather and common occasions, then recommend my best colours.",
    },

    {
      icon: "👔",
      title: "Outfit Colours",
      prompt:
        "Help me choose the best colours for an outfit. Ask me about the occasion, weather, clothes I have and my preferred style, then recommend colour combinations that work well together.",
    },

    {
      icon: "💇",
      title: "Hair / Overall Colours",
      prompt:
        "Help me find colours that work best with my hair and overall appearance. Ask me about my hair colour, skin tone, undertone and personal style, then recommend suitable colours.",
    },

    {
      icon: "✨",
      title: "Complete Palette",
      prompt:
        "Help me find my complete colour palette for clothes and overall styling. Ask me follow-up questions about my skin tone, undertone, hair, eyes, personal style, weather and occasions before giving recommendations.",
    },
  ];

  // =========================================================
  // OPEN CHAT WITH PROMPT
  // =========================================================

  const openVastraChat = (chatPrompt) => {
    if (!chatPrompt?.trim()) {
      return;
    }

    navigate(
      `/chat?prompt=${encodeURIComponent(chatPrompt.trim())}`
    );
  };

  // =========================================================
  // ASK BAR
  // =========================================================

  const handleAsk = () => {
    const currentPrompt = prompt.trim();

    if (!currentPrompt || loading) {
      return;
    }

    // Send free-text request directly to VASTRA Chat
    openVastraChat(currentPrompt);
  };

  // =========================================================
  // QUICK ACTION HANDLER
  // =========================================================

  const handleQuickAction = (item) => {
    // ------------------------------------------
    // ANALYZE MY OUTFIT
    // ------------------------------------------

    if (item.title === "Analyze My Outfit") {
      const uploadSection =
        document.getElementById("upload-section");

      if (uploadSection) {
        uploadSection.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }

      return;
    }

    // ------------------------------------------
    // BUILD AN OUTFIT
    // ------------------------------------------

    if (item.title === "Build an Outfit") {
      setActiveMenu("build");
      return;
    }

    // ------------------------------------------
    // FIND MY BEST COLOURS
    // ------------------------------------------

    if (item.title === "Find My Best Colours") {
      setActiveMenu("colours");
      return;
    }

    // ------------------------------------------
    // EVERYTHING ELSE → VASTRA CHAT
    // ------------------------------------------

    openVastraChat(item.prompt);
  };

  // =========================================================
  // SUB OPTION HANDLER
  // =========================================================

  const handleSubOption = (option) => {
    openVastraChat(option.prompt);
  };

  // =========================================================
  // IMAGE SELECT
  // =========================================================

  const handleImageSelect = (selectedImage) => {
    setImage(selectedImage);
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#050505] text-white"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-28 pb-20">

        {/* =====================================================
            MAIN LAYOUT
        ====================================================== */}

        <div className="flex items-start gap-8">

          {/* =================================================
              HISTORY SIDEBAR
          ================================================= */}

          {sidebarOpen && <HistorySidebar />}

          {/* =================================================
              MAIN CONTENT
          ================================================= */}

          <div className="flex-1 min-w-0">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex items-center gap-4">

              <button
                onClick={() =>
                  setSidebarOpen(!sidebarOpen)
                }
                className="
                  flex
                  items-center
                  gap-3
                  px-5
                  py-3
                  rounded-xl
                  border
                  border-[#222]
                  hover:border-[#D4AF37]
                  transition-all
                  duration-300
                "
              >
                <Menu size={20} />

                <span className="font-medium">
                  History
                </span>
              </button>

              <div>

                <p
                  className="
                    uppercase
                    tracking-[0.25em]
                    text-[#D4AF37]
                    text-sm
                  "
                >
                  ✨ Personal Stylist
                </p>

                <h1
                  className="
                    text-4xl
                    font-semibold
                    mt-2
                  "
                >
                  Let&apos;s style your perfect look.
                </h1>

              </div>

            </div>

            {/* =================================================
                SEARCH / ASK
            ================================================= */}

            <div className="mt-10">

              <div
                className="
                  flex
                  bg-[#111]
                  border
                  border-[#222]
                  rounded-2xl
                  overflow-hidden
                  focus-within:border-[#D4AF37]
                  transition-all
                "
              >

                <input
                  type="text"
                  value={prompt}
                  onChange={(e) =>
                    setPrompt(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAsk();
                    }
                  }}
                  placeholder="Ask your Personal Stylist..."
                  className="
                    flex-1
                    bg-transparent
                    px-6
                    py-5
                    outline-none
                    text-white
                    placeholder:text-[#777]
                  "
                />

                <button
                  onClick={handleAsk}
                  disabled={loading}
                  className="
                    px-8
                    bg-[#D4AF37]
                    text-black
                    font-semibold
                    flex
                    items-center
                    gap-2
                    hover:bg-[#E8C878]
                    transition
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                  "
                >
                  <Send size={18} />
                  Ask
                </button>

              </div>

            </div>

            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

            {!activeMenu && (

              <div
                className="
                  mt-16
                  bg-[#111]
                  border
                  border-[#222]
                  rounded-3xl
                  p-8
                "
              >

                <h2 className="text-2xl font-semibold">
                  Choose how you&apos;d like to get styled
                </h2>

                <div
                  className="
                    grid
                    md:grid-cols-2
                    xl:grid-cols-3
                    gap-6
                    mt-8
                  "
                >

                  {quickActions.map((item) => (

                    <motion.div
                      key={item.title}
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.2 }}
                      onClick={() =>
                        handleQuickAction(item)
                      }
                      className="
                        bg-[#161616]
                        border
                        border-[#222]
                        rounded-3xl
                        p-6
                        cursor-pointer
                        hover:border-[#D4AF37]
                        transition
                      "
                    >

                      <div className="text-4xl">
                        {item.icon}
                      </div>

                      <h3 className="mt-5 text-xl font-semibold">
                        {item.title}
                      </h3>

                      <p className="mt-3 text-[#999] leading-7">
                        Click to instantly start a conversation
                        with your stylist.
                      </p>

                      <div
                        className="
                          mt-6
                          flex
                          items-center
                          text-[#D4AF37]
                          font-medium
                        "
                      >
                        Try Now

                        <span className="ml-2 text-lg">
                          →
                        </span>
                      </div>

                    </motion.div>

                  ))}

                </div>

              </div>

            )}

            {/* =================================================
                BUILD OUTFIT OPTIONS
            ================================================= */}

            {activeMenu === "build" && (

              <div
                className="
                  mt-16
                  bg-[#111]
                  border
                  border-[#222]
                  rounded-3xl
                  p-8
                "
              >

                <button
                  onClick={() => setActiveMenu(null)}
                  className="
                    flex
                    items-center
                    gap-2
                    text-[#999]
                    hover:text-white
                    transition
                    mb-8
                  "
                >
                  <ArrowLeft size={18} />
                  Back
                </button>

                <p className="text-[#D4AF37] text-sm uppercase tracking-[0.2em]">
                  Build an Outfit
                </p>

                <h2 className="text-3xl font-semibold mt-2">
                  What are you dressing for?
                </h2>

                <p className="mt-3 text-[#888]">
                  Choose an occasion and VASTRA will continue
                  the styling conversation with you.
                </p>

                <div
                  className="
                    grid
                    sm:grid-cols-2
                    lg:grid-cols-3
                    gap-5
                    mt-8
                  "
                >

                  {buildOutfitOptions.map((option) => (

                    <motion.button
                      key={option.title}
                      type="button"
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        handleSubOption(option)
                      }
                      className="
                        text-left
                        bg-[#161616]
                        border
                        border-[#222]
                        rounded-3xl
                        p-6
                        hover:border-[#D4AF37]
                        transition
                        cursor-pointer
                      "
                    >

                      <div className="text-3xl">
                        {option.icon}
                      </div>

                      <h3 className="mt-5 text-xl font-semibold">
                        {option.title}
                      </h3>

                      <p className="mt-2 text-[#777]">
                        Start styling →
                      </p>

                    </motion.button>

                  ))}

                </div>

              </div>

            )}

            {/* =================================================
                COLOUR OPTIONS
            ================================================= */}

            {activeMenu === "colours" && (

              <div
                className="
                  mt-16
                  bg-[#111]
                  border
                  border-[#222]
                  rounded-3xl
                  p-8
                "
              >

                <button
                  onClick={() => setActiveMenu(null)}
                  className="
                    flex
                    items-center
                    gap-2
                    text-[#999]
                    hover:text-white
                    transition
                    mb-8
                  "
                >
                  <ArrowLeft size={18} />
                  Back
                </button>

                <p className="text-[#D4AF37] text-sm uppercase tracking-[0.2em]">
                  Find My Best Colours
                </p>

                <h2 className="text-3xl font-semibold mt-2">
                  What would you like help with?
                </h2>

                <p className="mt-3 text-[#888]">
                  Choose an option and VASTRA will help you
                  discover colours that work for you.
                </p>

                <div
                  className="
                    grid
                    sm:grid-cols-2
                    lg:grid-cols-3
                    gap-5
                    mt-8
                  "
                >

                  {colourOptions.map((option) => (

                    <motion.button
                      key={option.title}
                      type="button"
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        handleSubOption(option)
                      }
                      className="
                        text-left
                        bg-[#161616]
                        border
                        border-[#222]
                        rounded-3xl
                        p-6
                        hover:border-[#D4AF37]
                        transition
                        cursor-pointer
                      "
                    >

                      <div className="text-3xl">
                        {option.icon}
                      </div>

                      <h3 className="mt-5 text-xl font-semibold">
                        {option.title}
                      </h3>

                      <p className="mt-2 text-[#777]">
                        Find your colours →
                      </p>

                    </motion.button>

                  ))}

                </div>

              </div>

            )}

            {/* =================================================
                LOCAL CONVERSATION
            ================================================= */}

            <div
              className="
                mt-12
                bg-[#111]
                border
                border-[#222]
                rounded-3xl
                p-8
              "
            >

              <h2 className="text-2xl font-semibold mb-8">
                💬 Conversation
              </h2>

              {messages.length === 0 && !loading && (
                <p className="text-[#666]">
                  Your styling conversation will appear here.
                </p>
              )}

              {messages.map((message, index) => (

                <div
                  key={index}
                  className={`
                    mb-8
                    ${
                      message.role === "user"
                        ? "text-right"
                        : "text-left"
                    }
                  `}
                >

                  <div
                    className={`
                      inline-block
                      max-w-2xl
                      rounded-3xl
                      px-6
                      py-5
                      ${
                        message.role === "user"
                          ? "bg-[#D4AF37] text-black"
                          : "bg-[#161616] border border-[#222] text-white"
                      }
                    `}
                  >

                    <p className="leading-8">
                      {message.text}
                    </p>

                  </div>

                </div>

              ))}

              {loading && (

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="
                    inline-flex
                    items-center
                    gap-3
                    bg-[#111]
                    border
                    border-[#222]
                    rounded-3xl
                    px-6
                    py-5
                  "
                >

                  <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse delay-100" />
                  <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse delay-200" />

                  <span className="text-[#D4AF37]">
                    Personal Stylist is thinking...
                  </span>

                </motion.div>

              )}

            </div>

            {/* =================================================
                OUTFIT ANALYSIS
            ================================================= */}

            <div
              id="upload-section"
              className="
                mt-12
                bg-[#111]
                border
                border-[#222]
                rounded-3xl
                p-8
                transition-all
                duration-300
                hover:border-[#D4AF37]
              "
            >

              <h2 className="text-2xl font-semibold mb-8">
                📸 Outfit Analysis
              </h2>

              <p className="text-[#999] mb-8">
                Upload your outfit and let VASTRA&apos;s Personal
                Stylist analyze your look, colour harmony,
                fit, occasion, accessories and overall style.
              </p>

              <OutfitUpload
                image={image}
                onImageSelect={handleImageSelect}
              />

            </div>

          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default PersonalStylist;