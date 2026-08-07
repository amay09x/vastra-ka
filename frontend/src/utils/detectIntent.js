export function detectIntent(prompt) {
  const text = prompt.toLowerCase();

  // Personal Styling
  if (
    text.includes("look good on me") ||
    text.includes("suit me") ||
    text.includes("my skin") ||
    text.includes("my body") ||
    text.includes("my face") ||
    text.includes("analyze")
  ) {
    return "personalStylist";
  }

  // Fashion Learning
  if (
    text.includes("teach") ||
    text.includes("learn") ||
    text.includes("guide") ||
    text.includes("fashion tips") ||
    text.includes("how to style")
  ) {
    return "fashionGuide";
  }

  // User is confused
  if (
    text.includes("don't know") ||
    text.includes("dont know") ||
    text.includes("confused") ||
    text.includes("help me choose") ||
    text.includes("suggest something")
  ) {
    return "followUp";
  }

  // Explore
  if (
    text.includes("trending") ||
    text.includes("latest") ||
    text.includes("explore")
  ) {
    return "explore";
  }

  // Default
  return "shopping";
}