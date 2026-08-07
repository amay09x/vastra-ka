import logo from "../../assets/brand/logo.png";

function Logo({ className = "" }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>

      <img
        src={logo}
        alt="VASTRA"
        draggable={false}
       className="h-14 w-auto select-none"
      />

      <h1
        className="
        brand-font
        text-3xl
        tracking-[0.35em]
        text-[#D4AF37]
        "
      >
        VASTRA
      </h1>

    </div>
  );
}

export default Logo;