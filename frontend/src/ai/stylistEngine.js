import { detectIntent } from "../utils/detectIntent";
import { generateAdvice } from "../utils/generateAdvice";

export function stylistEngine(prompt) {
  const intent = detectIntent(prompt);

  const advice = generateAdvice(prompt, intent);

  return {
    intent,
    advice,
  };
}
export function generateHistoryTitle(prompt) {
  const text = prompt.toLowerCase();

  if (text.includes("interview")) {
    if (text.includes("₹")) {
      const match = prompt.match(/₹\s?\d+/);
      if (match) return `Interview Outfit Under ${match[0]}`;
    }
    return "Interview Outfit";
  }

  if (text.includes("wedding")) {
    return "Wedding Outfit for Special Occasion";
  }

  if (text.includes("college")) {
    return "College Outfit for Tomorrow";
  }

  if (text.includes("shirt")) {
    return "Black Oversized Shirts Under Budget";
  }

  if (text.includes("colour") || text.includes("color")) {
    return "Best Colours for My Skin Tone";
  }

  if (text.includes("analyse") || text.includes("analyze")) {
    return "Outfit Analysis & Improvements";
  }

  if (text.includes("shoe")) {
    return "Shoes That Match My Outfit";
  }

  if (text.includes("blazer")) {
    return "Styling a Blue Blazer";
  }

  return prompt.length > 40
    ? prompt.substring(0, 40) + "..."
    : prompt;
}