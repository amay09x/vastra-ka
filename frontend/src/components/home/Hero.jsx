import { useState } from "react";
import { AnimatePresence } from "framer-motion";

import LandingHero from "./LandingHero";
import AIWorkspace from "./AIWorkspace";

function Hero() {
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [userPrompt, setUserPrompt] = useState("");

  const handleSearch = (prompt) => {
    setUserPrompt(prompt);

    setTimeout(() => {
      setWorkspaceOpen(true);
    }, 500);
  };

  return (
    <AnimatePresence mode="wait">

      {workspaceOpen ? (

        <AIWorkspace
          key="workspace"
          userPrompt={userPrompt}
        />

      ) : (

        <LandingHero
          key="landing"
          onSearch={handleSearch}
        />

      )}

    </AnimatePresence>
  );
}

export default Hero;