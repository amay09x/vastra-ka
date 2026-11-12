import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function StyleDiscovery() {
    const navigate = useNavigate();
  return (
    <section
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#F3EFE7]
        px-6
        py-32
        text-[#111111]
        lg:px-16
      "
      
    >

      {/* SECTION INTRO */}

      <div className="mx-auto max-w-7xl">

        <motion.div
  className="mb-20"
  initial={{ opacity: 0, y: 25 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: false, amount: 0.3 }}
  transition={{
    duration: 0.7,
    ease: "easeOut",
  }}
>
    </motion.div>

          {/* Small label */}

          <div
            className="
              mb-6
              flex
              items-center
              gap-3
              text-[10px]
              font-medium
              uppercase
              tracking-[0.35em]
              text-black/45
            "
          >
            <span className="h-px w-8 bg-[#B8942F]" />

            STYLE DISCOVERY
          </div>


          {/* Main heading */}

          <h2
            className="
              body-font
              max-w-4xl
              text-5xl
              font-medium
              uppercase
              leading-[0.9]
              tracking-[-0.045em]
              sm:text-6xl
              lg:text-[7rem]
            "
          >
            VASTRA
            <br />
            GETS YOU
          </h2>


          {/* Description */}

          <p
            className="
              mt-8
              max-w-xl
              text-base
              leading-7
              text-black/55
              sm:text-lg
            "
          >
            Your style isn't just what you wear.
            It's a combination of your taste,
            lifestyle, mood and identity.
          </p>

        </div>


        {/* STYLE GRID */}

        <div
  className="
    flex
    items-start
    justify-between
    gap-10
    w-full
  "
>

       <div className="relative mt-20 w-full px-8 lg:px-16">
  <div className="grid grid-cols-4 gap-4 lg:gap-6">

    {/* MINIMAL */}
    <motion.div
 className="
  group
  relative
  mt-0
  h-[620px]
  w-full
  cursor-pointer
"
  initial={{ opacity: 0, y: 25 }}
  whileInView={{ opacity: 1, y: 0 }}
  whileHover={{ y: -20 }}
  viewport={{ once: false, amount: 0.15 }}
  transition={{
    duration: 0.6,
    ease: "easeOut",
  }}
 onClick={() => {
  sessionStorage.setItem(
    "homepageReturnPosition",
    window.scrollY.toString()
  );

  navigate("/results?type=style&style=minimal");
}}
>
      <div className="relative h-full w-full overflow-hidden bg-black">
       <img
  src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&auto=format&fit=crop"
  alt="Minimal style"
  className="
    h-full
    w-full
    object-cover
    transition-transform
    duration-700
    ease-out
    group-hover:scale-105
  "
/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        <div className="absolute bottom-0 left-0 p-7">
          <p className="text-[11px] tracking-[0.3em] text-white/60">01</p>
          <h3 className="mt-2 text-4xl uppercase text-white">Minimal</h3>
          <p className="mt-2 text-base text-white/70">Clean & simple</p>
        </div>
      </div>
    </motion.div>


    {/* CASUAL */}
    <motion.div
  className="
  group
  relative
  mt-16
  h-[620px]
  w-full
  cursor-pointer
"
  initial={{ opacity: 0, y: 25 }}
  whileInView={{ opacity: 1, y: 0 }}
  whileHover={{ y: -20 }}
  viewport={{ once: false, amount: 0.15 }}
  transition={{
    duration: 0.6,
    ease: "easeOut",
  }}
onClick={() => {
  sessionStorage.setItem(
    "homepageReturnPosition",
    window.scrollY.toString()
  );

  navigate("/results?type=style&style=casual");
}}
>
      <div className="relative h-full w-full overflow-hidden bg-black">
        <img
          src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&auto=format&fit=crop"
          alt="Casual style"
          className="
  h-full
  w-full
  object-cover
  transition-transform
  duration-700
  ease-out
  group-hover:scale-105
"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        <div className="absolute bottom-0 left-0 p-7">
          <p className="text-[11px] tracking-[0.3em] text-white/60">02</p>
          <h3 className="mt-2 text-4xl uppercase text-white">Casual</h3>
          <p className="mt-2 text-base text-white/70">
            Easy everyday looks
          </p>
        </div>
      </div>
    </motion.div>


    {/* STREET */}
    <motion.div
  className="
  group
  relative
  mt-32
  h-[620px]
  w-full
  cursor-pointer
"
  initial={{ opacity: 0, y: 25 }}
  whileInView={{ opacity: 1, y: 0 }}
  whileHover={{ y: -20 }}
  viewport={{ once: false, amount: 0.15 }}
  transition={{
    duration: 0.6,
    ease: "easeOut",
  }}
 onClick={() => {
  sessionStorage.setItem(
    "homepageReturnPosition",
    window.scrollY.toString()
  );

  navigate("/results?type=style&style=street");
}}
>
      <div className="relative h-full w-full overflow-hidden bg-black">
        <img
          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop"
          alt="Street style"
          className="
  h-full
  w-full
  object-cover
  transition-transform
  duration-700
  ease-out
  group-hover:scale-105
"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        <div className="absolute bottom-0 left-0 p-7">
          <p className="text-[11px] tracking-[0.3em] text-white/60">03</p>
          <h3 className="mt-2 text-4xl uppercase text-white">Street</h3>
          <p className="mt-2 text-base text-white/70">
            Relaxed & expressive
          </p>
        </div>
      </div>
    </motion.div>


    {/* PARTY */}
   <motion.div
 className="
  group
  relative
  mt-48
  h-[620px]
  w-full
  cursor-pointer
"
  initial={{ opacity: 0, y: 25 }}
  whileInView={{ opacity: 1, y: 0 }}
  whileHover={{ y: -20 }}
  viewport={{ once: false, amount: 0.15 }}
  transition={{
    duration: 0.6,
    ease: "easeOut",
  }}
  onClick={() =>
  navigate("/results?type=style&style=partywear")
}
>
      <div className="relative h-full w-full overflow-hidden bg-black">
        <img
          src="https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=600&auto=format&fit=crop"
          alt="Party wear style"
          className="
  h-full
  w-full
  object-cover
  transition-transform
  duration-700
  ease-out
  group-hover:scale-105
"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        <div className="absolute bottom-0 left-0 p-7">
          <p className="text-[11px] tracking-[0.3em] text-white/60">04</p>
          <h3 className="mt-2 text-4xl uppercase text-white">
            Party Wear
          </h3>
          <p className="mt-2 text-base text-white/70">
            Made to stand out
          </p>
        </div>
      </div>
    </motion.div>

  </div>
</div>
        


        </div>

     

    </section>
    
  );
}

export default StyleDiscovery;