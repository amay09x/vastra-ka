import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Sparkles,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

import { NAV_LINKS } from "../../constants/navigation";
import Logo from "../common/Logo";

function Navbar() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);
  useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      profileRef.current &&
      !profileRef.current.contains(event.target)
    ) {
      setProfileOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  const profileMenu = [
    {
      title: "Wishlist",
      path: "/wishlist",
    },
    {
      title: "History",
      path: "/stylist",
    },
    {
      title: "Account Settings",
      path: "/account",
    },
    {
      title: "Logout",
      path: null,
    },
  ];

  const handleProfileClick = (item) => {
    setProfileOpen(false);

    if (item.path) {
      navigate(item.path);
    } else {
      alert("Logout will be connected after authentication.");
    }
  };

  return (
<header className="fixed top-3 left-0 right-0 z-50 px-4 md:px-6">      
      {/* GLASS NAVBAR */}
      <div
  className="
    w-full
    h-[64px]
    rounded-[18px]
    border
    border-white/[0.10]
    bg-[#080808]/65
    backdrop-blur-2xl
    shadow-[0_8px_35px_rgba(0,0,0,0.28)]
    flex
    items-center
    px-5
    md:px-6
    lg:px-7
  "
>

        {/* ================= LOGO ================= */}

        <Link
          to="/"
          className="
            flex
            items-center
            shrink-0
            group
          "
        >
          <Logo />
        </Link>


        {/* ================= DESKTOP RIGHT SIDE ================= */}

        <div
          className="
            hidden
            lg:flex
            items-center
            ml-auto
            gap-6
          "
        >

          {/* NAVIGATION */}

          <nav className="flex items-center gap-6">

            {NAV_LINKS.map((item) => (
              <Link
                key={item.title}
                to={item.path}
                className="
                  relative
                  text-[14px]
                  text-white/65
                  hover:text-white
                  transition-colors
                  duration-300
                  whitespace-nowrap
                  group
                "
              >
                {item.title}

                <span
                  className="
                    absolute
                    -bottom-2
                    left-1/2
                    -translate-x-1/2
                    w-0
                    h-[1px]
                    bg-[#D4AF37]
                    group-hover:w-full
                    transition-all
                    duration-300
                  "
                />
              </Link>
            ))}

          </nav>


          {/* ASK VASTRA */}

          <button
            onClick={() => navigate("/stylist")}
            className="
              flex
              items-center
              gap-2
              text-[13px]
              text-[#D4AF37]
              whitespace-nowrap
              hover:text-white
              transition-colors
            "
          >
            <Sparkles size={15} />
            <span>ASK VASTRA</span>
          </button>


          {/* NOTIFICATION */}

          <button
            className="
              text-white/60
              hover:text-[#D4AF37]
              transition-colors
            "
          >
            <Bell size={18} strokeWidth={1.6} />
          </button>


          {/* PROFILE */}

          <div
  ref={profileRef}
  className="relative"
>

            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="
                flex
                items-center
                gap-2
                group
              "
            >

              <div
                className="
                  w-8
                  h-8
                  rounded-full
                  border
                  border-white/15
                  bg-white/[0.03]
                  flex
                  items-center
                  justify-center
                  text-sm
                  text-white
                  group-hover:border-[#D4AF37]/60
                  transition
                "
              >
                K
              </div>

              <ChevronDown
                size={14}
                className="
                  text-white/40
                  group-hover:text-white
                  transition
                "
              />

            </button>


            {/* PROFILE DROPDOWN */}

            {profileOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-14
                  w-60
                  rounded-2xl
                  border
                  border-white/10
                  bg-[#0c0c0c]/95
                  backdrop-blur-xl
                  shadow-2xl
                  overflow-hidden
                "
              >

                <div className="px-5 py-4 border-b border-white/10">

                  <p className="text-sm font-medium text-white">
                    Kumar Shailendra
                  </p>

                  <p className="text-xs text-white/40 mt-1">
                    VASTRA member
                  </p>

                </div>

                {profileMenu.map((item) => (
                  <button
                    key={item.title}
                    onClick={() => handleProfileClick(item)}
                    className="
                      w-full
                      text-left
                      px-5
                      py-3
                      text-sm
                      text-white/70
                      hover:text-white
                      hover:bg-white/[0.04]
                      transition
                    "
                  >
                    {item.title}
                  </button>
                ))}

              </div>
            )}

          </div>

        </div>


        {/* ================= MOBILE ================= */}

        <button
          className="
            lg:hidden
            ml-auto
            text-white
          "
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

      </div>


      {/* ================= MOBILE MENU ================= */}

      {menuOpen && (
        <div
          className="
            lg:hidden
            mt-2
            rounded-2xl
            border
            border-white/10
            bg-[#090909]/95
            backdrop-blur-xl
            p-6
          "
        >

          <div className="flex flex-col gap-5">

            {NAV_LINKS.map((item) => (
              <Link
                key={item.title}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className="
                  text-white/70
                  hover:text-[#D4AF37]
                  transition
                "
              >
                {item.title}
              </Link>
            ))}

            <button
              onClick={() => navigate("/stylist")}
              className="
                flex
                items-center
                gap-2
                text-[#D4AF37]
                pt-2
              "
            >
              <Sparkles size={16} />
              ASK VASTRA
            </button>

          </div>

        </div>
      )}

    </header>
  );
}

export default Navbar;