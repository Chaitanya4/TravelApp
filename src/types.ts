export type ActivityCategory = "attraction" | "food" | "shopping" | "culture";

export interface ItineraryActivity {
  time: string; // e.g. "Morning", "Afternoon", "Evening"
  title: string;
  description: string;
  category: ActivityCategory;
  locationName: string;
  expertTip?: string;
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  activities: ItineraryActivity[];
}

export interface RecommendedPlace {
  name: string;
  category: ActivityCategory;
  description: string;
  whyVisit: string;
  neighborhood: string;
}

export interface Itinerary {
  destination: string;
  durationDays: number;
  overview: string;
  expertTips: string[];
  days: ItineraryDay[];
  recommendedPlaces: RecommendedPlace[];
}

export interface Expert {
  id: "general" | "foodie" | "cultural" | "shopping";
  name: string;
  title: string;
  roleDescription: string;
  bio: string;
  specialization: string[];
  sampleQuestions: string[];
  color: string;
  bgLight: string;
  icon: string; // We'll map this to a Lucide icon in the component
}

export interface Message {
  id: string;
  role: "user" | "expert";
  content: string;
  timestamp: Date;
  expertId: string;
}

export interface SavedPlace {
  name: string;
  category: ActivityCategory;
  locationName: string;
  description: string;
}

export interface UserNote {
  id: string;
  content: string;
  createdAt: string;
}
