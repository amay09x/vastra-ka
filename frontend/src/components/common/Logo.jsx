import logo from "../../assets/brand/logo.png";

function Logo({ className = "" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>

      <img
        src={logo}
        alt="VASTRA"
        draggable={false}
        className="h-10 w-auto select-none"
      />

      <h1
        className="
          brand-font
          text-2xl
          tracking-[0.28em]
          text-[#D4AF37]
          leading-none
        "
      >
        VASTRA
      </h1>

    </div>
  );
}

export default Logo;