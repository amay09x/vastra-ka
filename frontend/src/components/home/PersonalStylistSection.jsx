import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Camera,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function PersonalStylistSection() {
  const navigate = useNavigate();

  const actions = [
    {
      number: "01",
      icon: <Camera size={21} />,
      title: "Analyze My Outfit",
      description:
        "See what is working, what is off, and how to make the outfit look better on you.",
      micro: "Score · Style · Colours",
      action: "analyze",
    },
    {
      number: "02",
      icon: <Sparkles size={21} />,
      title: "Complete & Improve My Look",
      description:
        "Find what to add, remove, or change when colours or pieces do not work well together.",
      micro: "Fix mismatches · Finish the look",
      action: "complete",
    },
    {
      number: "03",
      icon: <ShoppingBag size={21} />,
      title: "Style My Wardrobe",
      description:
        "Upload the clothes you already own and discover useful combinations from your wardrobe.",
      micro: "Your wardrobe · New combinations",
      action: "wardrobe",
    },
    {
      number: "04",
      icon: <BookOpen size={21} />,
      title: "Fashion Tips",
      description:
        "Ask VASTRA practical questions about colours, fit, styling, occasions and everyday dressing.",
      micro: "Ask VASTRA anything",
      action: "tips",
    },
  ];

  return (
    <section
      id="personal-stylist"
      className="relative overflow-hidden bg-[#111111] px-6 py-24 text-white lg:px-16 lg:py-32"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-[220px] top-[100px] h-[620px] w-[620px] rounded-full border border-[#D4AF37]/10 shadow-[0_0_60px_rgba(212,175,55,0.06)]" />
        <div className="absolute -right-[120px] top-[180px] h-[330px] w-[520px] rotate-[-28deg] rounded-[50%] border border-[#D4AF37]/10" />
        <div className="absolute -bottom-[40px] -left-[180px] h-[400px] w-[400px] rounded-full bg-[#D4AF37]/[0.025] blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-8 bg-[#D4AF37]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-white/40">
              Personal Stylist
            </span>
          </div>

          <h2 className="max-w-5xl text-5xl font-medium uppercase leading-[0.92] tracking-[-0.04em] md:text-7xl lg:text-[6.5rem]">
            CHOOSE HOW
            <br />
            <span className="text-white/30">YOU'D LIKE TO GET STYLED</span>
          </h2>

          <p className="mt-8 max-w-2xl text-base leading-7 text-white/45 md:text-lg">
            Show VASTRA what you're wearing, what you own, or what you need.
            Your stylist will take it from there.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.75, delay: 0.12, ease: "easeOut" }}
          className="mt-16 grid grid-cols-1 gap-5 lg:grid-cols-2"
        >
          {actions.map((item) => (
            <motion.button
              key={item.number}
              type="button"
              onClick={() => navigate(`/stylist/tool/${item.action}`)}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.99 }}
              className="group relative min-h-[245px] overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.025] p-7 text-left transition-all duration-500 hover:border-[#D4AF37]/35 hover:bg-white/[0.04] focus:outline-none focus-visible:border-[#D4AF37]/60 focus-visible:ring-1 focus-visible:ring-[#D4AF37]/40 md:p-8"
            >
              <div className="pointer-events-none absolute inset-y-0 right-0 w-[38%] bg-[radial-gradient(circle_at_50%_45%,rgba(212,175,55,0.07),transparent_58%)] opacity-75" />

              <div className="relative flex h-full flex-col">
                <div className="flex items-start justify-between gap-5">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37] transition duration-300 group-hover:scale-105 group-hover:bg-[#D4AF37]/15">
                    {item.icon}
                  </div>

                  <span className="text-[10px] uppercase tracking-[0.28em] text-[#D4AF37]/55">
                    {item.number}
                  </span>
                </div>

                <h3 className="mt-7 max-w-xl text-2xl font-semibold tracking-[-0.02em] text-white md:text-[27px]">
                  {item.title}
                </h3>

                <p className="mt-3 max-w-xl text-sm leading-7 text-white/42 md:text-[15px]">
                  {item.description}
                </p>

                <div className="mt-auto flex items-center justify-between pt-7">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/28">
                    {item.micro}
                  </span>

                  <span className="inline-flex items-center gap-2 text-sm font-medium text-[#D4AF37]">
                    Explore
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default PersonalStylistSection;
