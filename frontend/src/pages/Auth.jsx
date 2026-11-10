import AnimatedBackground from "../components/auth/AnimatedBackground";
import HeroLogo from "../components/auth/logo/HeroLogo";
import BrandText from "../components/brand/BrandText";
import LoginCard from "../components/auth/LoginCard";
import { useState } from "react";

function Auth() {
  const [cardGlow, setCardGlow] = useState({
  x: 50,
  y: 50,
});
  return (
    <main className="relative h-screen overflow-hidden bg-[#050505]">

      <AnimatedBackground />

      <div className="relative z-20 flex h-full">

       {/* LEFT SIDE */}

<section
  className="
    w-[65%]
    h-full
    flex
    flex-col
    items-center
    justify-center
    overflow-hidden
  "
>
  {/* HANGER */}
<div className="w-[480px] h-[320px] flex items-center justify-center -translate-y-8">
  <HeroLogo />
</div>    
  

  {/* BRAND */}
  <div className="-mt-7">
    <BrandText />
  </div>
</section>

        
    {/* RIGHT SIDE */}

<LoginCard />
</div>
       </main>
  );
}


export default Auth;