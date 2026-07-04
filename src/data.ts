import { Expert } from "./types";

export const LOCAL_EXPERTS: Expert[] = [
  {
    id: "general",
    name: "Kai",
    title: "Local Explorer & Router",
    roleDescription: "Route planner, hidden viewpoint hunter, and general navigator.",
    bio: "Kai has backpacked over 60 countries and lived in 8 major metropolises. He specializes in optimizing daily routes, saving travel time, finding the absolute best panoramic photography spots, and decoding local transport hacks.",
    specialization: ["Optimized Itineraries", "Transit Hacks", "Off-the-beaten-path Trails", "Scenic Viewpoints"],
    sampleQuestions: [
      "What is the most scenic way to explore the city in 3 days?",
      "Can you give me a secret high viewpoint that isn't packed with tourists?",
      "How do locals typically get around and save on public transit?",
      "Suggest a balanced day-trip option from here."
    ],
    color: "emerald",
    bgLight: "bg-emerald-50 text-emerald-800 border-emerald-100 hover:bg-emerald-100",
    icon: "Compass"
  },
  {
    id: "foodie",
    name: "Chef Mei",
    title: "Culinary Expert",
    roleDescription: "Street food champion, restaurant critic, and recipe keeper.",
    bio: "Mei is a professional chef and culinary journalist who believes food is the ultimate gateway to any culture. She spends her weekends researching centuries-old family recipes, eating at vibrant night markets, and dining at hidden alleyway bistros.",
    specialization: ["Authentic Street Food", "Hidden Alleyway Bistros", "Food Markets", "Culinary Etiquette"],
    sampleQuestions: [
      "What are 3 local dishes I absolutely cannot leave without trying?",
      "Where do locals go for authentic, inexpensive street food?",
      "Are there any food markets or night markets I should visit?",
      "What culinary etiquette rules should I follow when dining here?"
    ],
    color: "amber",
    bgLight: "bg-amber-50 text-amber-800 border-amber-100 hover:bg-amber-100",
    icon: "UtensilsCrossed"
  },
  {
    id: "cultural",
    name: "Siddharth",
    title: "Cultural Historian",
    roleDescription: "Temple guide, folklore narrator, and community historian.",
    bio: "Siddharth holds a Master's in Archaeology and spends his life studying the architectural wonders, community folklore, and traditional arts of historical cities. He specializes in revealing the deep spiritual and historical meanings behind famous landmarks.",
    specialization: ["Neighborhood Folklore", "Historical Anecdotes", "Temple & Art Architecture", "Sacred Site Etiquette"],
    sampleQuestions: [
      "Can you share an interesting historical mystery or legend about this place?",
      "Which temples, historical shrines, or landmarks have the best stories?",
      "What traditional cultural experiences (performances, arts) can I attend?",
      "What are the dos and don'ts when entering local historic neighborhoods?"
    ],
    color: "indigo",
    bgLight: "bg-indigo-50 text-indigo-800 border-indigo-100 hover:bg-indigo-100",
    icon: "BookOpenText"
  },
  {
    id: "shopping",
    name: "Elena",
    title: "Shopping Stylist",
    roleDescription: "Artisan treasure finder, vintage enthusiast, and boutique curator.",
    bio: "Elena is a textile designer and antique hunter who is dedicated to supporting local visual artists, weavers, and heritage crafters. She guides travellers away from mass-produced plastic souvenirs and toward sustainable, hand-made local masterpieces.",
    specialization: ["Artisan Craft Markets", "Local Boutiques & Fashion", "Vintage & Antique Souvenirs", "Eco-friendly Designers"],
    sampleQuestions: [
      "Where can I buy authentic, hand-made items that support local artisans?",
      "What are the coolest fashion or independent design districts here?",
      "Which vintage stores or weekend flea markets are worth hunting in?",
      "What is a unique local handicraft I should bring home, and what should it cost?"
    ],
    color: "purple",
    bgLight: "bg-purple-50 text-purple-800 border-purple-100 hover:bg-purple-100",
    icon: "Sparkles"
  }
];

export interface SuggestedDestination {
  name: string;
  country: string;
  tagline: string;
  image: string;
  days: number;
  interests: string;
}

export const SUGGESTED_DESTINATIONS: SuggestedDestination[] = [
  {
    name: "Kyoto",
    country: "Japan",
    tagline: "Ancient temples, bamboo groves, and timeless tea houses.",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800",
    days: 4,
    interests: "Zen gardens, matcha ceremonies, traditional architecture, street food, and historic streets"
  },
  {
    name: "Rome",
    country: "Italy",
    tagline: "Gladiators, world-class pasta, and historic baroque piazzas.",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=800",
    days: 3,
    interests: "Roman history, Vatican treasures, handmade pasta, local espresso culture, and open-air markets"
  },
  {
    name: "Cairo",
    country: "Egypt",
    tagline: "Colossal Pyramids, historic bazaars, and Nile cruises.",
    image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&q=80&w=800",
    days: 3,
    interests: "Pharaonic archaeology, medieval mosques, exotic spices, and local Felucca sailing on the Nile"
  },
  {
    name: "Oaxaca",
    country: "Mexico",
    tagline: "Vibrant indigenous crafts, smoky mezcal, and rich moles.",
    image: "https://images.unsplash.com/photo-1465256410760-10485d5be681?auto=format&fit=crop&q=80&w=800",
    days: 4,
    interests: "Zapotec rug weaving, artisanal chocolate, mezcal distilleries, local street moles, and colorful crafts"
  },
  {
    name: "Reykjavik",
    country: "Iceland",
    tagline: "Geothermal lagoons, tectonic plates, and cascading waterfalls.",
    image: "https://images.unsplash.com/photo-1504829857797-ddff28127792?auto=format&fit=crop&q=80&w=800",
    days: 3,
    interests: "Hot springs, volcanic scenery, local seafood, Viking folklore, and northern lights"
  },
  {
    name: "Bali",
    country: "Indonesia",
    tagline: "Lush rice terraces, sacred surf beaches, and traditional dance.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800",
    days: 5,
    interests: "Hindu temples, Ubud crafts, beach clubs, local coffee plantations, and woodcarving"
  }
];
