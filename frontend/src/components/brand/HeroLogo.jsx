import { motion } from "framer-motion";
import Hanger from "./Hanger";

function HeroLogo() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.90,
        filter: "blur(14px)",
      }}
      animate={{
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
      }}
      transition={{
        duration: 2.4,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
     <motion.div
  animate={{
    rotate: [-1, 1, -1],
  }}
  transition={{
    delay: 2.3,
    duration: 5,
    repeat: Infinity,
    ease: "easeInOut",
  }}
  style={{
    transformOrigin: "50% 0%",
  }}
>
  <Hanger />
</motion.div>
       
      
      </motion.div>
  );
}

export default HeroLogo;