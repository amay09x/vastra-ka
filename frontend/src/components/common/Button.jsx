import { motion } from "framer-motion";

function Button({
    children,
    variant = "primary",
    onClick,
    className = "",
}) {

    const primary =
        "bg-[#D4AF37] text-black hover:bg-[#E8C878]";

    const secondary =
        "border border-[#D4AF37] text-white hover:bg-[#D4AF3715]";

    return (

        <motion.button

            whileHover={{
                scale: 1.03,
                y: -2,
            }}

            whileTap={{
                scale: 0.98,
            }}

            onClick={onClick}

            className={`
            px-8
            py-4
            rounded-[18px]
            font-semibold
            duration-300
            transition-all
            shadow-lg

            ${
                variant === "primary"
                    ? primary
                    : secondary
            }

            ${className}
        `}
        >

            {children}

        </motion.button>

    );

}

export default Button;