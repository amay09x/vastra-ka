import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Sparkles,
  Menu,
  X,
} from "lucide-react";

import { NAV_LINKS } from "../../constants/navigation";
import Logo from "../common/Logo";

function Navbar() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

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
    <header className="fixed top-0 left-0 w-full z-50 bg-[#050505] border-b border-[#1a1a1a]">

      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <div className="h-16 flex items-center justify-between">

          {/* Logo */}

          <div className="cursor-pointer">
            <Logo />
          </div>

          {/* Desktop Navigation */}

          <nav className="hidden lg:flex items-center gap-10">

            {NAV_LINKS.map((item) => (

              <Link
                key={item.title}
                to={item.path}
                className="
                  text-[#cfcfcf]
                  hover:text-[#D4AF37]
                  transition-all
                  duration-300
                  relative
                  group
                "
              >

                {item.title}

                <span
                  className="
                    absolute
                    left-0
                    -bottom-2
                    h-[2px]
                    w-0
                    bg-[#D4AF37]
                    group-hover:w-full
                    transition-all
                  "
                />

              </Link>

            ))}

          </nav>

          {/* Right Side */}

          <div className="hidden lg:flex items-center gap-5">

            <button
              className="
                flex
                items-center
                gap-2
                px-5
                py-2.5
                rounded-full
                bg-[#D4AF37]
                text-black
                font-medium
                hover:scale-105
                transition
              "
            >

              <Sparkles size={18} />

              Ask AI

            </button>

            <Bell
              size={21}
              className="cursor-pointer hover:text-[#D4AF37] transition"
            />

            <div className="relative">

              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="
                  w-10
                  h-10
                  rounded-full
                  bg-[#D4AF37]
                  text-black
                  font-semibold
                  flex
                  items-center
                  justify-center
                  hover:scale-105
                  transition
                "
              >

                K

              </button>

              {profileOpen && (

                <div
                  className="
                    absolute
                    right-0
                    mt-3
                    w-64
                    bg-[#111]
                    border
                    border-[#222]
                    rounded-2xl
                    overflow-hidden
                    shadow-2xl
                    z-50
                  "
                >

                  <div className="p-6 border-b border-[#222]">

                    <h3 className="font-semibold">

                      Kumar Shailendra

                    </h3>

                  </div>

                  {profileMenu.map((item) => (

                    <button
                      key={item.title}
                      onClick={() => handleProfileClick(item)}
                      className="
                        w-full
                        text-left
                        px-6
                        py-4
                        hover:bg-[#181818]
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

          {/* Mobile Menu Button */}

          <button
            className="lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >

            {menuOpen ? <X /> : <Menu />}

          </button>

        </div>

      </div>

      {/* Mobile Menu */}

      {menuOpen && (

        <div className="lg:hidden bg-[#090909] border-t border-[#1f1f1f]">

          <div className="flex flex-col gap-5 py-6 px-8">

            {NAV_LINKS.map((item) => (

              <Link
                key={item.title}
                to={item.path}
                onClick={() => setMenuOpen(false)}
              >

                {item.title}

              </Link>

            ))}

          </div>

        </div>

      )}

    </header>
  );
}

export default Navbar;