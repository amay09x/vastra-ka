import HeroLogo from "../brand/HeroLogo";
import BrandText from "../brand/BrandText";

function BrandReveal() {
  return (
    <section
      className="
        w-[65%]
        h-full
        flex
        flex-col
        justify-center
        pl-24
      "
    >
      <HeroLogo />
      <BrandText />
    </section>
  );
}

export default BrandReveal;