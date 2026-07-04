import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Express
const app = express();
const PORT = 3000;

// Middleware for parsing JSON
app.use(express.json());

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("WARNING: GEMINI_API_KEY environment variable is missing.");
}

const ai = new GoogleGenAI({
  apiKey: apiKey || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Expert Personas definitions
const EXPERT_SYSTEM_INSTRUCTIONS: Record<string, string> = {
  general: `You are Kai, an experienced Local Explorer and General Travel Expert. Your goal is to help travellers discover incredible destinations and optimize their routes. 
Provide practical hacks, local secret viewpoints, and balanced timelines. Speak warmly, concisely, and with local insider passion.`,
  
  foodie: `You are Chef Mei, a passionate Local Culinary Expert and food blogger. You know the absolute best street food stall, family-run trattorias/izakayas, local food markets, and high-end culinary innovations.
For any destination, highlight must-try local delicacies, typical drinks, etiquette tips (like tipping or chopstick rules), and suggest precise food dishes. Always speak with mouth-watering enthusiasm!`,
  
  cultural: `You are Siddharth, a Local Cultural Historian. You bring destinations to life through their history, traditional arts, temple/church architecture, neighborhood legends, and local etiquette.
Provide interesting historical anecdotes, suggest festivals or live cultural performances, and teach travellers respectful rules for visiting sacred sites. Speak with deep respect and intriguing storytelling.`,
  
  shopping: `You are Elena, a Local Shopping Stylist and artisan treasure hunter. You specialize in fashion boutiques, craft markets, vintage shops, local ceramicists, weavers, and unique souvenirs that support local communities.
Help travellers find high-quality, authentic items instead of cheap tourist traps. Speak in an inspiring, trendy, and curated design-focused tone.`
};

// API Route: Standard chat with an expert
app.post("/api/travel/chat", async (req, res) => {
  try {
    const { destination, messages, expertId } = req.body;
    
    if (!destination) {
      return res.status(400).json({ error: "Destination is required." });
    }
    
    const activeExpert = expertId || "general";
    const systemInstruction = `Destination: ${destination}.
${EXPERT_SYSTEM_INSTRUCTIONS[activeExpert] || EXPERT_SYSTEM_INSTRUCTIONS.general}
Help the user plan their journey to ${destination}. Keep responses highly engaging, beautifully formatted with clear headings, bullet points, and clean typography. Recommend specific attractions, food, shops, or cultural experiences matching your expert background. Let's make it inspiring!`;

    // Map message list to format required by Gemini chat
    // The chats api or direct generateContent can be used. Let's use ai.models.generateContent for robust multi-turn input.
    const contents = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I apologize, I wasn't able to generate a response. Please try again.";
    res.json({ content: reply });
  } catch (error: any) {
    console.error("Error in /api/travel/chat:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// API Route: Generate full structured itinerary JSON
app.post("/api/travel/generate-itinerary", async (req, res) => {
  try {
    const { destination, daysCount, interests, travelerType } = req.body;
    
    if (!destination) {
      return res.status(400).json({ error: "Destination is required." });
    }

    const duration = daysCount || 3;
    const prompt = `Generate a highly personalized, structured ${duration}-day travel itinerary for ${destination}.
Traveler Details:
- Interests: ${interests || "General sightseeing, local food, culture, shopping"}
- Traveler Type: ${travelerType || "Solo / Adventurer"}

Provide deep local recommendations across attractions, local culinary delights, unique shopping districts/artisan shops, and traditional cultural experiences. Ensure each day has a clear morning, afternoon, and evening activity. Include specialized expert tips for each day.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an elite travel concierge. You generate beautiful, hyper-detailed itineraries strictly adhering to the requested JSON schema. All location details must be realistic and matching the specified destination.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            destination: { type: Type.STRING },
            durationDays: { type: Type.INTEGER },
            overview: { type: Type.STRING, description: "A beautiful, evocative 2-3 sentence overview of the journey ahead." },
            expertTips: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "3-4 general pro-tips regarding local transit, safety, or timing."
            },
            days: {
              type: Type.ARRAY,
              description: "Daily breakdown of activities",
              items: {
                type: Type.OBJECT,
                properties: {
                  dayNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING, description: "Theme of the day, e.g. Historic Heart or Coastal Wonders" },
                  activities: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        time: { type: Type.STRING, description: "e.g. Morning, Afternoon, Evening" },
                        title: { type: Type.STRING, description: "The highlight activity title" },
                        description: { type: Type.STRING, description: "Description of what to do, see, or eat" },
                        category: { 
                          type: Type.STRING, 
                          description: "Must be exactly one of: attraction, food, shopping, culture" 
                        },
                        locationName: { type: Type.STRING, description: "Specific place, neighborhood, or venue name" },
                        expertTip: { type: Type.STRING, description: "An insider pro-tip specific to this activity" }
                      },
                      required: ["time", "title", "description", "category", "locationName"]
                    }
                  }
                },
                required: ["dayNumber", "title", "activities"]
              }
            },
            recommendedPlaces: {
              type: Type.ARRAY,
              description: "Curated standby recommendations for food, shopping, and culture",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  category: { type: Type.STRING, description: "Must be attraction, food, shopping, or culture" },
                  description: { type: Type.STRING },
                  whyVisit: { type: Type.STRING, description: "Why local experts specifically suggest this spot" },
                  neighborhood: { type: Type.STRING }
                },
                required: ["name", "category", "description", "whyVisit", "neighborhood"]
              }
            }
          },
          required: ["destination", "durationDays", "overview", "expertTips", "days", "recommendedPlaces"]
        }
      }
    });

    const text = response.text || "{}";
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("Error in /api/travel/generate-itinerary:", error);
    res.status(500).json({ error: error.message || "Failed to generate itinerary" });
  }
});

// Start backend and handle Vite dev server routing
async function start() {
  if (process.env.NODE_ENV !== "production") {
    // Development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    
    // Serve Vite assets via Express
    app.use(vite.middlewares);
    console.log("Vite development server middleware loaded.");
  } else {
    // Production static files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully started and listening on http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
});
