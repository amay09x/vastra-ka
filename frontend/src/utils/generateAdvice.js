export function generateAdvice(prompt, intent) {
  const text = prompt.toLowerCase();

  // Shopping
  if (intent === "shopping") {

    if (text.includes("wedding")) {
      return "For a wedding, I'd recommend elegant fabrics and timeless colours. A well-fitted outfit with subtle accessories will create a refined and sophisticated look.";
    }

    if (text.includes("interview")) {
      return "Professional outfits work best with neutral colours and clean silhouettes. Focus on confidence, comfort and a polished appearance.";
    }

    if (text.includes("college")) {
      return "For college, comfort and versatility matter most. Breathable fabrics and easy-to-style pieces will keep you looking good throughout the day.";
    }

    if (text.includes("party")) {
      return "For parties, you can be a little more expressive. Rich colours, textured fabrics and statement pieces help create a memorable look.";
    }

    return "I've selected pieces that balance style, comfort and value while matching your request as closely as possible.";
  }

  // Personal Stylist

  if (intent === "personalStylist") {
    return "I'd like to understand your appearance before making recommendations. A quick photo analysis will help me suggest outfits, colours and fits that suit you personally.";
  }

  // Fashion Guide

  if (intent === "fashionGuide") {
    return "Great style starts with understanding colour harmony, fabrics and fit. I'll guide you step by step so your future outfit choices become much easier.";
  }

  // Explore

  if (intent === "explore") {
    return "I've gathered some of today's most popular styles and trending outfit ideas to inspire your next look.";
  }

  // Follow Up

  if (intent === "followUp") {
    return "I'd love to recommend something you'll actually enjoy wearing. Tell me a little more so I can make the right suggestion.";
  }

  return "Let me think about the best recommendation for you.";
}