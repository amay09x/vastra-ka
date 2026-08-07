import { motion } from "framer-motion";

import ProfileHeader from "../components/account/ProfileHeader";
import ProfileMenu from "../components/account/ProfileMenu";

function Profile() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#050505] text-white pt-28 pb-20"
    >
      <div className="max-w-4xl mx-auto px-6">

       <h1 className="text-5xl font-semibold">
  Account Settings
</h1>
        <div className="mt-12">

          <ProfileHeader />

        </div>

        <ProfileMenu />

      </div>
    </motion.section>
  );
}

export default Profile;