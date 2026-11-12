import { useRef, useState } from "react";
import api from "../../assets/services/api";

function WardrobeAI() {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = async (event) => {
  const file = event.target.files?.[0];

  if (!file) return;

  // Show the image immediately
  const imageUrl = URL.createObjectURL(file);
  setSelectedImage(imageUrl);

  // Send image to FastAPI
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await api.post("/image-search", formData);

    console.log("VASTRA image search response:", response.data);
  } catch (error) {
    console.error("Image upload failed:", error);
  }
};

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#080808]
        px-6
        py-32
        text-[#111111]
        lg:px-16
      "
    >

      {/* BACKGROUND GLOW */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[500px]
          w-[500px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#D4AF37]/5
          blur-[120px]
        "
      />


      {/* CONTENT */}

      <div className="relative mx-auto max-w-7xl">

        {/* LABEL */}

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
            text-white/40
          "
        >
          <span className="h-px w-8 bg-[#D4AF37]" />

          WARDROBE INTELLIGENCE
        </div>


        {/* HEADING */}

          <h2
  className="
    max-w-5xl
    text-5xl
    font-light
    uppercase
    leading-[0.9]
    tracking-[-0.045em]
    sm:text-6xl
    lg:text-[7rem]
  "
>
  STYLE WHAT YOU OWN
</h2>


        {/* DESCRIPTION */}

        <p
  className="
    mt-8
    max-w-xl
    text-base
    leading-7
    text-white/45
    sm:text-lg
  "
>
  Bring your pieces. Discover new possibilities.
</p>


        {/* MAIN AI AREA */}

        <div
          className="
            mt-20
            grid
            grid-cols-1
            gap-6
            lg:grid-cols-[1.15fr_0.85fr]
          "
        >

          {/* UPLOAD AREA */}

          <div
            className="
              group
              relative
              min-h-[560px]
              overflow-hidden
              rounded-[36px]
              border
              border-white/10
              bg-white/[0.035]
              backdrop-blur-xl
            "
          >

            {/* IMAGE PREVIEW */}

            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Uploaded wardrobe item"
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover
                "
              />
            ) : null}


            {/* OVERLAY */}

            <div
              className={`
                absolute
                inset-0
                ${
                  selectedImage
                    ? "bg-black/45"
                    : "bg-transparent"
                }
              `}
            />


            {/* UPLOAD CONTENT */}

            <div
              className="
                relative
                flex
                min-h-[560px]
                flex-col
                items-center
                justify-center
                px-8
                text-center
              "
            >

              {!selectedImage && (
                <>
                  {/* PLUS */}

                  <div
                    className="
                      flex
                      h-20
                      w-20
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#D4AF37]/30
                      bg-[#D4AF37]/5
                      text-3xl
                      text-[#D4AF37]
                      transition-all
                      duration-500
                      group-hover:scale-110
                      group-hover:border-[#D4AF37]/60
                    "
                  >
                    +
                  </div>

                  <p
                    className="
                      mt-8
                      text-[10px]
                      uppercase
                      tracking-[0.35em]
                      text-[#D4AF37]/80
                    "
                  >
                    START WITH AN IMAGE
                  </p>

                  <h3 className="mt-3 text-3xl font-light">
                    Upload your clothes
                  </h3>

                  <p className="mt-3 max-w-sm text-sm leading-6 text-white/35">
                    Upload an outfit, a single clothing item,
                    or anything you want VASTRA to understand.
                  </p>
                </>
              )}


              {/* BUTTON */}

              <button
                onClick={handleUploadClick}
                className="
                  mt-8
                  rounded-full
                  bg-[#D4AF37]
                  px-7
                  py-3
                  text-sm
                  font-medium
                  text-black
                  transition-all
                  duration-300
                  hover:bg-white
                  hover:scale-105
                "
              >
                {selectedImage ? "Change Image" : "Upload Image"}
              </button>


              {/* HIDDEN INPUT */}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

            </div>


            {/* CORNER LABEL */}

            <div
              className="
                absolute
                bottom-6
                left-6
                text-[9px]
                uppercase
                tracking-[0.3em]
                text-white/25
              "
            >
              JPG · PNG · WEBP
            </div>

          </div>


          {/* FEATURE PANEL */}

<div className="space-y-3">

  {/* FIND SIMILAR */}

  <div
    className="
      group
      grid
      min-h-[230px]
      grid-cols-1
      overflow-hidden
      rounded-[24px]
      border
      border-white/10
      bg-white/[0.025]
      transition-all
      duration-500
      hover:border-[#D4AF37]/30
      lg:grid-cols-[1fr_0.9fr]
    "
  >

    <div className="flex flex-col justify-center p-8 lg:p-10">

      <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]/70">
        01
      </p>

      <h3 className="mt-4 text-3xl font-light">
        Find Similar
      </h3>

      <p className="mt-3 max-w-md text-sm leading-6 text-white/40">
        Upload an item and discover visually similar pieces
        from across the web.
      </p>

      <span className="mt-6 text-xl text-white/20 transition-all duration-300 group-hover:translate-x-2 group-hover:text-[#D4AF37]">
        →
      </span>

    </div>


    {/* DEMO IMAGE */}

    <div className="relative min-h-[230px] overflow-hidden bg-[#111]">

      <img
        src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop"
        alt="Find similar clothing"
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
          opacity-80
          transition-transform
          duration-700
          group-hover:scale-105
        "
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#111] via-black/10 to-transparent" />

      <div className="absolute bottom-5 left-5 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-[9px] uppercase tracking-[0.25em] text-white/60 backdrop-blur-md">
        Visual Search
      </div>

    </div>

  </div>


  {/* BUILD OUTFITS */}

  <div
    className="
      group
      grid
      min-h-[230px]
      grid-cols-1
      overflow-hidden
      rounded-[24px]
      border
      border-white/10
      bg-white/[0.025]
      transition-all
      duration-500
      hover:border-[#D4AF37]/30
      lg:grid-cols-[1fr_0.9fr]
    "
  >

    <div className="flex flex-col justify-center p-8 lg:p-10">

      <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]/70">
        02
      </p>

      <h3 className="mt-4 text-3xl font-light">
        Build Outfits
      </h3>

      <p className="mt-3 max-w-md text-sm leading-6 text-white/40">
        Upload your wardrobe and let VASTRA create
        combinations from what you already own.
      </p>

      <span className="mt-6 text-xl text-white/20 transition-all duration-300 group-hover:translate-x-2 group-hover:text-[#D4AF37]">
        →
      </span>

    </div>


    <div className="relative min-h-[230px] overflow-hidden bg-[#111]">

      <img
        src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop"
        alt="Build outfits from your wardrobe"
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
          opacity-80
          transition-transform
          duration-700
          group-hover:scale-105
        "
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#111] via-black/10 to-transparent" />

      <div className="absolute bottom-5 left-5 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-[9px] uppercase tracking-[0.25em] text-white/60 backdrop-blur-md">
        Wardrobe AI
      </div>

    </div>

  </div>


  {/* RATE MY LOOK */}

  <div
    className="
      group
      grid
      min-h-[230px]
      grid-cols-1
      overflow-hidden
      rounded-[24px]
      border
      border-white/10
      bg-white/[0.025]
      transition-all
      duration-500
      hover:border-[#D4AF37]/30
      lg:grid-cols-[1fr_0.9fr]
    "
  >

    <div className="flex flex-col justify-center p-8 lg:p-10">

      <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]/70">
        03
      </p>

      <h3 className="mt-4 text-3xl font-light">
        Rate My Look
      </h3>

      <p className="mt-3 max-w-md text-sm leading-6 text-white/40">
        Get thoughtful feedback on colors, proportions,
        coordination and styling.
      </p>

      <span className="mt-6 text-xl text-white/20 transition-all duration-300 group-hover:translate-x-2 group-hover:text-[#D4AF37]">
        →
      </span>

    </div>


    <div className="relative min-h-[230px] overflow-hidden bg-[#111]">

      <img
        src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop"
        alt="Rate an outfit"
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
          opacity-80
          transition-transform
          duration-700
          group-hover:scale-105
        "
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#111] via-black/10 to-transparent" />

      <div className="absolute bottom-5 left-5 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-[9px] uppercase tracking-[0.25em] text-white/60 backdrop-blur-md">
        Style Analysis
      </div>

    </div>

  </div>


  {/* STYLE ME */}

  <div
    className="
      group
      grid
      min-h-[230px]
      grid-cols-1
      overflow-hidden
      rounded-[24px]
      border
      border-white/10
      bg-white/[0.025]
      transition-all
      duration-500
      hover:border-[#D4AF37]/30
      lg:grid-cols-[1fr_0.9fr]
    "
  >

    <div className="flex flex-col justify-center p-8 lg:p-10">

      <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]/70">
        04
      </p>

      <h3 className="mt-4 text-3xl font-light">
        Style Me
      </h3>

      <p className="mt-3 max-w-md text-sm leading-6 text-white/40">
        Show VASTRA what you're wearing and discover
        what would complete the look.
      </p>

      <span className="mt-6 text-xl text-white/20 transition-all duration-300 group-hover:translate-x-2 group-hover:text-[#D4AF37]">
        →
      </span>

    </div>


    <div className="relative min-h-[230px] overflow-hidden bg-[#111]">

      <img
        src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop"
        alt="VASTRA style recommendations"
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
          opacity-80
          transition-transform
          duration-700
          group-hover:scale-105
        "
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#111] via-black/10 to-transparent" />

      <div className="absolute bottom-5 left-5 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-[9px] uppercase tracking-[0.25em] text-white/60 backdrop-blur-md">
        Personal Styling
      </div>

    </div>

  </div>

</div>
</div>
</div>
    </section>
  );
}

export default WardrobeAI;