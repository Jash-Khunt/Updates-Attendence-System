// lib/event-passwords.ts

// Static passwords for each event
export const eventPasswords: Record<string, string> = {
  "aavishkar": "AAVI2025",
  "cineverse": "CINE2025",
  "stock x stake": "STOCK2025",
  "split or steal": "SPLIT2025",
  "resume relay": "RESUME2025",
  "meme fest": "MEME2025",
  "data loom": "DATA2025",
  "man in middle": "MITM2025",
  "human or ai": "HUMAN2025",
  "escape room": "ESCAPE2025",
  "tech debate": "TECH2025",
  "no keyclick": "NOKEY2025",
  "tech ladder": "LADDER2025",
  "cyber chase": "CYBER2025",
  "decode & dash": "DECODE2025",
  "code relay": "RELAY2025",
  "codewinglet": "WING2025",
};

// Helper to safely get a password
export const getEventPassword = (eventName: string): string => {
  return eventPasswords[eventName.toLowerCase()] || "DEFAULT2025";
};
