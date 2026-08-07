import { motion } from "framer-motion";

const conversations = [
  {
    group: "Today",
    title: "Interview Outfit",
    icon: "💼",
    category: "Outfit Builder",
    preview: "Create a formal interview outfit under ₹5000.",
    time: "12:45 PM",
  },
  {
    group: "Today",
    title: "Outfit Analysis",
    icon: "📸",
    category: "Image Analysis",
    preview: "Analyze my black oversized shirt and beige chinos.",
    time: "10:32 AM",
  },
  {
    group: "Yesterday",
    title: "Wedding Styling",
    icon: "💍",
    category: "Personal Stylist",
    preview: "Luxury wedding guest outfit recommendations.",
    time: "6:20 PM",
  },
  {
    group: "Last 7 Days",
    title: "Colour Analysis",
    icon: "🎨",
    category: "Colour Analysis",
    preview: "Suggest colours that match my skin tone.",
    time: "3:40 PM",
  },
  {
    group: "Last 7 Days",
    title: "College Outfit",
    icon: "🎓",
    category: "Outfit Builder",
    preview: "Minimalist everyday college wardrobe.",
    time: "11:05 AM",
  },
];
function History() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#050505] text-white"
    >
      <div className="max-w-5xl mx-auto px-6 pt-28 pb-20">

        <span className="uppercase tracking-widest text-[#D4AF37] font-semibold">

          History

        </span>

        <h1 className="text-5xl font-semibold mt-5">

          Continue where you left off.

        </h1>

        <p className="mt-6 text-[#999] leading-8">

          Access all your previous conversations,
          outfit analyses and styling recommendations.

        </p>

        <div className="mt-16 space-y-6">

          {["Today", "Yesterday", "Last 7 Days"].map((group) => (
  <div key={group} className="mb-14">

    <h2 className="text-[#D4AF37] uppercase tracking-[0.25em] text-sm font-semibold mb-6">
      {group}
    </h2>

    <div className="space-y-6">

      {conversations
        .filter((item) => item.group === group)
        .map((item) => (

          <motion.div
            whileHover={{
              y: -3,
              scale: 1.01,
            }}
            key={item.title}
            className="
              bg-[#111]
              border
              border-[#222]
              rounded-3xl
              p-7
              cursor-pointer
              hover:border-[#D4AF37]
              transition
            "
          >

            <div className="flex justify-between">

              <div className="flex gap-5">

                <div className="text-4xl">

                  {item.icon}

                </div>

                <div>

                  <h3 className="text-2xl font-semibold">

                    {item.title}

                  </h3>

                  <span
                    className="
                      inline-block
                      mt-3
                      px-3
                      py-1
                      rounded-full
                      bg-[#1B1B1B]
                      text-[#D4AF37]
                      text-sm
                    "
                  >

                    {item.category}

                  </span>

                  <p className="mt-4 text-[#999] leading-7">

                    {item.preview}

                  </p>

                </div>

              </div>

              <span className="text-[#777]">

                {item.time}

              </span>

            </div>

          </motion.div>

      ))}

    </div>

  </div>
))}

              <div className="flex justify-between items-center">

                <div className="flex items-center gap-5">

                  <div className="text-4xl">

                    {item.icon}

                  </div>

                  <div>

                    <h2 className="text-xl font-semibold">

                      {item.title}

                    </h2>

                    <p className="text-[#888] mt-1">

                      {item.date}

                    </p>

                  </div>

                </div>

                <span className="text-[#777]">

                  {item.time}

                </span>

              </div>

            

          

        </div>

  

    </motion.section>
  );
}

export default History;