import { motion } from "framer-motion";
import { Menu, Send } from "lucide-react";
import { useState } from "react";

import {
  stylistEngine,
  generateHistoryTitle,
} from "../ai/stylistEngine";

import HistorySidebar from "../components/stylist/HistorySidebar";
import OutfitUpload from "../components/stylist/OutfitUpload";

function PersonalStylist() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [prompt, setPrompt] = useState("");

  const [messages, setMessages] = useState([]);
  // const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(false);

  const [image, setImage] = useState(null);

  const quickActions = [
    {
      icon: "📸",
      title: "Analyze My Outfit",
      prompt: "Analyze my outfit."
    },
    {
      icon: "👔",
      title: "Build an Outfit",
      prompt: "Build me an outfit."
    },
    {
      icon: "🎨",
      title: "Find My Best Colours",
      prompt: "Find the best colours for me."
    },
    {
      icon: "✨",
      title: "Improve My Style",
      prompt: "Help me improve my style."
    },
    {
      icon: "👟",
      title: "Complete My Look",
      prompt: "Complete my outfit."
    },
    {
      icon: "📖",
      title: "Fashion Tips",
      prompt: "Teach me fashion."
    }
  ];

  const handleAsk = () => {

    if (!prompt.trim()) return;

    const currentPrompt = prompt;
//     setHistory((prev) => [
//   {
//     title: generateHistoryTitle(currentPrompt),
//     time: "Just now",
//   },
//   ...prev,
// ]);

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: currentPrompt,
      },
    ]);

    setPrompt("");

    setLoading(true);

    setTimeout(() => {

      const response = stylistEngine(currentPrompt);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: response.advice,
        },
      ]);

      setLoading(false);

    }, 1200);

  };

  return (

    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#050505] text-white"
    >

      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-28 pb-20">

       <div className="flex items-start gap-8">

          {sidebarOpen && (
  <HistorySidebar />
)}

         <div className="flex-1 min-w-0">
           
            <div className="flex items-center gap-4">

              <button
  onClick={() => setSidebarOpen(!sidebarOpen)}
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
  "
>

  <Menu size={20} />

  <span className="font-medium">

    History

  </span>

</button>

              <div>

                <p className="uppercase tracking-[0.25em] text-[#D4AF37] text-sm">

                  ✨ Personal Stylist

                </p>

                <h1 className="text-4xl font-semibold mt-2">

                  Let's style your perfect look.

                </h1>

              </div>

            </div>
                        {/* Search */}

            <div className="mt-10">

              <div className="flex bg-[#111] border border-[#222] rounded-2xl overflow-hidden">

                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
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
                  className="
                    px-8
                    bg-[#D4AF37]
                    text-black
                    font-semibold
                    flex
                    items-center
                    gap-2
                  "
                >

                  <Send size={18} />

                  Ask

                </button>

              </div>

            </div>
            

            {/* Quick Actions */}

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

                Choose how you'd like to get styled

              </h2>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">

                {quickActions.map((item) => (

                  <motion.div
                    key={item.title}
                    whileHover={{
                      y: -6,
                    }}
                    onClick={() => setPrompt(item.prompt)}
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

  Click to instantly start a conversation with your stylist.

</p>

<div className="mt-6 flex items-center text-[#D4AF37] font-medium">

  Try Now

  <span className="ml-2 text-lg">

    →

  </span>

</div>
                  </motion.div>

                ))}

              </div>

            </div>

            {/* Conversation */}

            <div
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

  💬 Conversation

</h2>

              {messages.map((message, index) => (

                <div
                  key={index}
                  className={`mb-8 ${
                    message.role === "user"
                      ? "text-right"
                      : "text-left"
                  }`}
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
                          : "bg-[#111] border border-[#222] text-white"
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

            {/* Outfit Analysis */}

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
              <OutfitUpload
                image={image}
                onImageSelect={setImage}
              />

            </div>

          </div>

        </div>

      </div>

    </motion.section>

  );

}

export default PersonalStylist;