import BrandDivider from "./BrandDivider";

function BrandText() {
  return (
    <div className="flex flex-col items-center">

      <h1
        className="
          mt-4
          brand-font
          text-6xl lg:text-7xl
          tracking-[0.35em]
          text-[var(--gold)]
        "
      >
        VASTRA
      </h1>

      <BrandDivider />

      <p
        className="
          mt-4
          uppercase
          tracking-[0.4em]
          text-sm
          text-[var(--text-secondary)]
        "
      >
        Style Curated for You
      </p>

    </div>
  );
}

export default BrandText;