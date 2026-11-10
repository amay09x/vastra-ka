import { useEffect, useRef, useState } from "react";

function OutfitAnalysis({ analysis, image, onReset }) {
  if (!analysis) return null;

  /*
   * Backend response reaching this component:
   *
   * {
   *   overall_score: 90,
   *   scores: {
   *     colour_match: 5,
   *     fit: 4,
   *     occasion: 5,
   *     trend_score: 4,
   *     versatility: 4
   *   },
   *   strengths: [...],
   *   improvements: [...],
   *   accessories: [...]
   * }
   */

  const overallScore =
    Number(
      analysis?.overall_score ??
      analysis?.overallScore ??
      analysis?.score ??
      0
    ) || 0;

  const scores = analysis?.scores || {};

  const colour =
    Number(
      scores?.colour_match ??
      scores?.colour ??
      scores?.color_match ??
      scores?.color ??
      analysis?.colour ??
      analysis?.color ??
      0
    ) || 0;

  const fit =
    Number(
      scores?.fit ??
      analysis?.fit ??
      0
    ) || 0;

  const occasion =
    Number(
      scores?.occasion ??
      analysis?.occasion ??
      0
    ) || 0;

  const trend =
    Number(
      scores?.trend_score ??
      scores?.trend ??
      analysis?.trend_score ??
      analysis?.trend ??
      0
    ) || 0;

  const versatility =
    Number(
      scores?.versatility ??
      analysis?.versatility ??
      0
    ) || 0;

  const strengths =
    analysis?.strengths ??
    analysis?.whatsWorking ??
    analysis?.whatIsWorking ??
    [];

  const improvements =
    analysis?.improvements ??
    analysis?.waysToElevate ??
    analysis?.elevate ??
    [];

  const accessories =
    analysis?.accessories ??
    analysis?.recommendedAccessories ??
    [];

  /*
   * These values are optional because your backend response
   * may not currently provide outfit_name/outfit_meta.
   */
  const outfitName =
    analysis?.outfit_name ??
    analysis?.outfitName ??
    "Your Outfit";

  const outfitMeta =
    analysis?.outfit_meta ??
    analysis?.outfitMeta ??
    "Personal Style Analysis";

  const clampScore = (value) => {
    const number = Number(value) || 0;

    return Math.min(
      Math.max(Math.round(number), 0),
      5
    );
  };

  const renderStars = (value) => {
    const safeScore = clampScore(value);

    return (
      <div
        className="
          flex
          items-center
          gap-[5px]
          whitespace-nowrap
        "
        aria-label={`${safeScore} out of 5`}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className={
              index < safeScore
                ? "text-[#D4AF37]"
                : "text-[#4A4A4A]"
            }
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <section className="w-full mt-10">

      {/* =====================================================
          MAIN ANALYSIS CARD

          ONE PHOTO LEFT
          ONE ANALYSIS PANEL RIGHT

          NO ANIMATION HERE
      ===================================================== */}

      <div
        className="
          overflow-hidden
          rounded-[32px]
          border
          border-white/10
          bg-[#111111]
        "
      >

        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* =================================================
              OUTFIT PHOTO
          ================================================= */}

          <div
            className="
              relative
              min-h-[520px]
              lg:min-h-[620px]
              bg-[#0B0B0B]
            "
          >

            {image ? (
              <img
                src={image}
                alt="Analysed outfit"
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover
                "
              />
            ) : (
              <div
                className="
                  absolute
                  inset-0
                  flex
                  items-center
                  justify-center
                  text-white/30
                "
              >
                No outfit image
              </div>
            )}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-gradient-to-t
                from-black/30
                via-transparent
                to-transparent
              "
            />

          </div>


          {/* =================================================
              YOUR LOOK
          ================================================= */}

          <div
            className="
              flex
              flex-col
              justify-center
              p-8
              sm:p-10
              lg:p-12
              xl:p-14
            "
          >

            {/* LABEL */}

            <p
              className="
                text-xs
                uppercase
                tracking-[0.32em]
                text-[#D4AF37]
              "
            >
              Your Look
            </p>


            {/* OUTFIT NAME */}

            <h2
              className="
                mt-4
                text-3xl
                sm:text-4xl
                font-semibold
                leading-tight
                text-white
              "
            >
              {outfitName}
            </h2>


            {/* META */}

            <p
              className="
                mt-3
                text-base
                text-white/45
              "
            >
              {outfitMeta}
            </p>


            {/* =================================================
                OVERALL SCORE
            ================================================= */}

            <div className="mt-12">

              <div className="flex items-end gap-2">

                <span
                  className="
                    text-7xl
                    sm:text-8xl
                    font-semibold
                    leading-none
                    tracking-tight
                    text-[#D4AF37]
                  "
                >
                  {overallScore}
                </span>

                <span
                  className="
                    mb-2
                    text-3xl
                    text-[#D4AF37]
                  "
                >
                  %
                </span>

              </div>

              <p
                className="
                  mt-3
                  text-sm
                  uppercase
                  tracking-[0.18em]
                  text-white/40
                "
              >
                Overall Style Score
              </p>

            </div>


            {/* =================================================
                RATINGS

                NO ANIMATION
            ================================================= */}

            <div
              className="
                mt-12
                space-y-6
              "
            >

              <RatingRow
                label="Colour"
                value={colour}
                renderStars={renderStars}
              />

              <RatingRow
                label="Fit"
                value={fit}
                renderStars={renderStars}
              />

              <RatingRow
                label="Occasion"
                value={occasion}
                renderStars={renderStars}
              />

              <RatingRow
                label="Trend"
                value={trend}
                renderStars={renderStars}
              />

              <RatingRow
                label="Versatility"
                value={versatility}
                renderStars={renderStars}
              />

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          SCROLL CUE

          NO FADE HERE
          ONLY ARROW ANIMATION
      ===================================================== */}

      <div
        className="
          flex
          flex-col
          items-center
          justify-center
          py-12
        "
      >

        <p
          className="
            text-center
            text-sm
            tracking-wide
            text-white/40
          "
        >
          Scroll to discover more about your outfit
        </p>

        <ScrollArrow />

      </div>


      {/* =====================================================
          LOWER CONTENT

          ONLY THESE SECTIONS FADE IN / OUT
      ===================================================== */}

      <div className="mt-2 space-y-24">

        {strengths.length > 0 && (
          <ScrollSection
            title="WHAT'S WORKING"
            items={strengths}
          />
        )}

        {improvements.length > 0 && (
          <ScrollSection
            title="WAYS TO ELEVATE"
            items={improvements}
          />
        )}

        {accessories.length > 0 && (
          <ScrollSection
            title="FINISHING TOUCHES"
            items={accessories}
          />
        )}

      </div>


      {/* =====================================================
          RESET
      ===================================================== */}

      {onReset && (
        <div className="flex justify-center pt-20 pb-10">

          <button
            type="button"
            onClick={onReset}
            className="
              text-sm
              text-white/35
              transition
              hover:text-white/70
            "
          >
            Analyze another outfit →
          </button>

        </div>
      )}

    </section>
  );
}


/* =========================================================
   RATING ROW
========================================================= */

function RatingRow({
  label,
  value,
  renderStars,
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-6
      "
    >

      <span
        className="
          text-base
          sm:text-lg
          text-white/75
        "
      >
        {label}
      </span>

      {renderStars(value)}

    </div>
  );
}


/* =========================================================
   LOWER SCROLL SECTION

   THIS IS THE ONLY CONTENT THAT FADES
========================================================= */

function ScrollSection({
  title,
  items,
}) {
  const sectionRef = useRef(null);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      {
        threshold: 0.18,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`
        transition-all
        duration-700
        ease-out
        ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }
      `}
    >

      {/* SECTION TITLE */}

      <div className="flex items-center gap-5">

        <span
          className="
            h-px
            w-10
            bg-[#D4AF37]/50
          "
        />

        <h3
          className="
            text-xs
            uppercase
            tracking-[0.28em]
            text-[#D4AF37]
          "
        >
          {title}
        </h3>

        <span
          className="
            h-px
            flex-1
            bg-white/10
          "
        />

      </div>


      {/* CONTENT */}

      <div
        className="
          mt-8
          grid
          grid-cols-1
          md:grid-cols-2
          gap-5
        "
      >

        {items.map((item, index) => (

          <div
            key={index}
            className="
              min-h-[120px]
              rounded-[24px]
              border
              border-white/[0.07]
              bg-white/[0.025]
              px-7
              py-6
              flex
              items-center
              transition
              duration-300
              hover:border-[#D4AF37]/20
              hover:bg-white/[0.04]
            "
          >

            <p
              className="
                text-[15px]
                leading-7
                text-white/60
              "
            >
              {typeof item === "string"
                ? item
                : item?.text ||
                  item?.description ||
                  item?.name ||
                  ""}
            </p>

          </div>

        ))}

      </div>

    </section>
  );
}


/* =========================================================
   SCROLL ARROW

   The glow travels from the top/end toward the tip.
========================================================= */

function ScrollArrow() {
  return (
    <div
      className="
        relative
        mt-5
        h-12
        w-6
        flex
        justify-center
      "
    >

      {/* STATIC ARROW */}

      <span
        className="
          absolute
          top-0
          h-8
          w-px
          bg-white/20
        "
      />

      <span
        className="
          absolute
          bottom-2
          left-1/2
          h-3
          w-3
          -translate-x-1/2
          rotate-45
          border-r
          border-b
          border-[#D4AF37]/60
        "
      />


      {/* MOVING GLOW */}

      <span
        className="
          absolute
          top-0
          h-3
          w-[2px]
          bg-[#D4AF37]
          shadow-[0_0_10px_#D4AF37]
          animate-scroll-glow
        "
      />

    </div>
  );
}

export default OutfitAnalysis;