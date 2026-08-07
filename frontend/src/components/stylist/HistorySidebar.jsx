import { motion } from "framer-motion";

const history = [
  "Black shirt under ₹3000",
  "Wedding outfit ideas",
  "Analyze my outfit",
  "Office casual look",
  "White sneakers",
  "Best colours for me",
];

function HistorySidebar() {
  return (
    <div
     className="
w-[290px]
h-[calc(100vh-100px)]
sticky
top-24
flex-shrink-0
bg-[#111]
border-r
border-[#222]
p-6
overflow-y-auto
"
    >
      <h2 className="text-2xl font-semibold">

        🕘 History

      </h2>

      

      <div className="mt-8 space-y-4">

        {history.map((item, index) => (

  <motion.div
    key={index}
    whileHover={{ x: 5 }}
    className="
      py-4
      border-b
      border-[#222]
      cursor-pointer
      hover:text-[#D4AF37]
      transition
    "
  >

    {item}

  </motion.div>

))}

        

      </div>

    </div>
  );
}

export default HistorySidebar;