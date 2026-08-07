import { motion } from "framer-motion";
import hanger from "../../assets/brand/hanger.png";

function Hanger() {
  return (
    <motion.img
      src={hanger}
      alt="VASTRA Logo"
      draggable={false}
      className="w-[470px] h-auto"
      initial={{
        filter: "drop-shadow(0 0 0px rgba(212,175,55,0))",
      }}
      animate={{
        filter: [
          "drop-shadow(0 0 0px rgba(212,175,55,0))",
          "drop-shadow(0 0 20px rgba(212,175,55,.35))",
          "drop-shadow(0 0 10px rgba(212,175,55,.18))",
        ],
      }}
      transition={{
        delay: 1.8,
        duration: 3,
        ease: "easeOut",
      }}
    />
  );
}

export default Hanger;