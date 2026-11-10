import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import StyleDiscovery from "./StyleDiscovery";
import WardrobeAI from "./WardrobeAI";
import PersonalStylistSection from "./PersonalStylistSection";
import LandingHero from "./LandingHero";
import AIWorkspace from "./AIWorkspace";

function Hero() {
  const navigate = useNavigate();

  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [userPrompt, setUserPrompt] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (data) => {

    // =====================================================
    // NORMAL TEXT SEARCH
    // =====================================================

    if (typeof data === "string") {
      const prompt = data.trim();

      // Don't do anything if the search box is empty
      if (!prompt) {
        return;
      }

      // Open the existing Personal Stylist
      // and pass the user's search as the first message.
      navigate(`/chat?prompt=${encodeURIComponent(prompt)}`);

      return;
    }

    // =====================================================
    // IMAGE SEARCH
    // =====================================================

    if (data && typeof data === "object") {
      setUserPrompt(data.filename || "Image search");
      setSearchResults(data.results || []);

      setTimeout(() => {
        setWorkspaceOpen(true);
      }, 500);
    }
  };

  return (
    <AnimatePresence mode="wait">

      {workspaceOpen ? (

        <AIWorkspace
          key="workspace"
          userPrompt={userPrompt}
          searchResults={searchResults}
        />

      ) : (

        <>
          <LandingHero
            key="landing"
            onSearch={handleSearch}
          />

          <StyleDiscovery />

          <PersonalStylistSection />

          <WardrobeAI />
        </>

      )}

    </AnimatePresence>
  );
}

export default Hero;