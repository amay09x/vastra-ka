import {
  Heart,
  History,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";

const menuItems = [
  {
    icon: Heart,
    title: "Wishlist",
  },
  {
    icon: History,
    title: "History",
  },
  {
    icon: Settings,
    title: "Account Settings",
  },
  {
    icon: LogOut,
    title: "Logout",
  },
];

function ProfileMenu() {
  return (
    <div className="mt-10 bg-[#111] border border-[#222] rounded-3xl overflow-hidden">

      {menuItems.map((item, index) => {

        const Icon = item.icon;

        return (

          <button
            key={item.title}
            className={`
              w-full
              flex
              items-center
              justify-between
              px-8
              py-6
              hover:bg-[#181818]
              transition
              ${
                index !== menuItems.length - 1
                  ? "border-b border-[#222]"
                  : ""
              }
            `}
          >

            <div className="flex items-center gap-4">

              <Icon size={22} color="#D4AF37" />

              <span>

                {item.title}

              </span>

            </div>

            <ChevronRight size={18} color="#666" />

          </button>

        );

      })}

    </div>
  );
}

export default ProfileMenu;