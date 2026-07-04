import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import ExpertChat from "./components/ExpertChat";
import ItineraryDisplay from "./components/ItineraryDisplay";
import SavedPlaces from "./components/SavedPlaces";
import { Message, Itinerary, SavedPlace, UserNote } from "./types";
import { Compass, Sparkles, MapPin, ArrowRight, Plane, Globe, Landmark } from "lucide-react";

export default function App() {
  // Destination states (Predefined standard default destination Kyoto, Japan to start strong)
  const [destination, setDestination] = useState<string>("Kyoto");
  const [daysCount, setDaysCount] = useState<number>(3);
  const [travelerType, setTravelerType] = useState<string>("Solo Adventurer");
  const [interests, setInterests] = useState<string>("Zen gardens, matcha ceremonies, authentic street food, artisan ceramics");

  // Selected Expert Chat states
  const [activeExpertId, setActiveExpertId] = useState<"general" | "foodie" | "cultural" | "shopping">("general");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);

  // Itinerary Planner states
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isGeneratingItinerary, setIsGeneratingItinerary] = useState<boolean>(false);

  // Local Storage persisted states (Saved places, custom traveler notes)
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const [userNotes, setUserNotes] = useState<UserNote[]>([]);

  // Load from local storage
  useEffect(() => {
    const cachedPlaces = localStorage.getItem("nomad_saved_places");
    if (cachedPlaces) {
      try {
        setSavedPlaces(JSON.parse(cachedPlaces));
      } catch (e) {
        console.error("Failed to parse saved places", e);
      }
    }

    const cachedNotes = localStorage.getItem("nomad_user_notes");
    if (cachedNotes) {
      try {
        setUserNotes(JSON.parse(cachedNotes));
      } catch (e) {
        console.error("Failed to parse user notes", e);
      }
    }
  }, []);

  // Save to local storage on changes
  useEffect(() => {
    localStorage.setItem("nomad_saved_places", JSON.stringify(savedPlaces));
  }, [savedPlaces]);

  useEffect(() => {
    localStorage.setItem("nomad_user_notes", JSON.stringify(userNotes));
  }, [userNotes]);

  // Set up initial welcoming messages for current destination
  useEffect(() => {
    if (!destination) return;

    // Reset chat logs on new destination to prevent confusion, but preseed nice welcome greetings
    const initialGreetings: Message[] = [
      {
        id: "g-1",
        role: "expert",
        expertId: "general",
        content: `Konnichiwa! I'm Kai, your Lead Local Explorer. Welcome to our ${destination} travel lounge!\n\nI can help you build optimized travel pathways, decode local rail lines, or point out secret mountain views. Try choosing other tabs like Chef Mei or Siddharth to talk about local street food or ancient legends!`,
        timestamp: new Date()
      },
      {
        id: "f-1",
        role: "expert",
        expertId: "foodie",
        content: `Hello foodie! Chef Mei here. Planning to eat your way through ${destination}? Let me know what you're craving! I've curated secret ramen shops, historic matcha tea breweries, and absolute must-try dishes.`,
        timestamp: new Date()
      },
      {
        id: "c-1",
        role: "expert",
        expertId: "cultural",
        content: `Greetings. I'm Siddharth, your Cultural Historian. Let me guide you through the majestic shrines, neighborhood folktales, and etiquette rules that give ${destination} its deep spiritual soul.`,
        timestamp: new Date()
      },
      {
        id: "s-1",
        role: "expert",
        expertId: "shopping",
        content: `Hi trendsetter! Elena here. I'm on the hunt for sustainable, hand-made local ceramics, antique textiles, and indie artisan galleries in ${destination}. Ask me where to avoid cheap plastic trap souvenirs!`,
        timestamp: new Date()
      }
    ];

    setMessages(initialGreetings);
  }, [destination]);

  // Handler: Standard Chat with an Expert
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isSendingMessage || !destination) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      expertId: activeExpertId,
      content: text,
      timestamp: new Date()
    };

    const currentHistory = [...messages, userMsg];
    setMessages(currentHistory);
    setIsSendingMessage(true);

    try {
      // Keep only current expert history to send as context for clean conversational turn
      const relevantHistory = currentHistory
        .filter(m => m.expertId === activeExpertId)
        .map(m => ({
          role: m.role,
          content: m.content
        }));

      const res = await fetch("/api/travel/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          messages: relevantHistory,
          expertId: activeExpertId
        })
      });

      if (!res.ok) {
        throw new Error("Expert network error");
      }

      const data = await res.json();
      
      const responseMsg: Message = {
        id: `e-${Date.now()}`,
        role: "expert",
        expertId: activeExpertId,
        content: data.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, responseMsg]);
    } catch (err: any) {
      console.error("Chat error:", err);
      
      setMessages(prev => [...prev, {
        id: `e-error-${Date.now()}`,
        role: "expert",
        expertId: activeExpertId,
        content: "I apologize, my communication network with the local base is experiencing high turbulence. Please try asking your question again!",
        timestamp: new Date()
      }]);
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Handler: Generate Full Detailed Structured Itinerary
  const handleGenerateItinerary = async () => {
    if (!destination || isGeneratingItinerary) return;

    setIsGeneratingItinerary(true);
    try {
      const res = await fetch("/api/travel/generate-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          daysCount,
          interests,
          travelerType
        })
      });

      if (!res.ok) {
        throw new Error("Itinerary generator server error");
      }

      const data = await res.json();
      setItinerary(data);

      // Add a friendly celebratory announcement message in Kai's chat
      setMessages(prev => [...prev, {
        id: `e-success-${Date.now()}`,
        role: "expert",
        expertId: "general",
        content: `🎉 SUCCESS! I have successfully generated a gorgeous, highly optimized ${daysCount}-day itinerary for ${destination}! It's packed with culinary hotspots from Chef Mei, historical anecdotes from Siddharth, and local shopping gems from Elena. Check out the Daily Guide panel to explore!`,
        timestamp: new Date()
      }]);

    } catch (err: any) {
      console.error("Itinerary generation failed:", err);
      alert("Ah! We hit a slight bump in the road while drafting your itinerary. Please check your internet or try again!");
    } finally {
      setIsGeneratingItinerary(false);
    }
  };

  // Save place/card handlers
  const handleSavePlace = (place: SavedPlace) => {
    if (!savedPlaces.some(p => p.name === place.name)) {
      setSavedPlaces(prev => [...prev, place]);
    }
  };

  const handleUnsavePlace = (name: string) => {
    setSavedPlaces(prev => prev.filter(p => p.name !== name));
  };

  // User travel note handlers
  const handleAddNote = (content: string) => {
    const newNote: UserNote = {
      id: `note-${Date.now()}`,
      content,
      createdAt: new Date().toLocaleDateString()
    };
    setUserNotes(prev => [newNote, ...prev]);
  };

  const handleDeleteNote = (id: string) => {
    setUserNotes(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-zinc-50/70 text-zinc-900 flex flex-col font-sans">
      
      {/* Top Header Controls bar */}
      <Header
        destination={destination}
        setDestination={setDestination}
        daysCount={daysCount}
        setDaysCount={setDaysCount}
        travelerType={travelerType}
        setTravelerType={setTravelerType}
        interests={interests}
        setInterests={setInterests}
        onGenerateItinerary={handleGenerateItinerary}
        isGenerating={isGeneratingItinerary}
        hasItinerary={!!itinerary}
      />

      {/* Main App Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        
        {/* Welcome Hero Callout (if no itinerary generated yet) */}
        {!itinerary && !isGeneratingItinerary && (
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 mb-6 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="max-w-xl text-center md:text-left">
                <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full uppercase tracking-wider">
                  ✨ Instant Custom Planning
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight mt-3">
                  Discover {destination || "your next adventure"} with AI experts
                </h2>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mt-2">
                  Interact directly with our specialized digital locals in the chat panel below, or generate a full premium itinerary mapped by our travel algorithms.
                </p>
                
                <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                  <span className="text-xs bg-zinc-100 text-zinc-600 border border-zinc-200/60 px-2.5 py-1 rounded-lg font-medium flex items-center gap-1">
                    🍜 Culinary Spots
                  </span>
                  <span className="text-xs bg-zinc-100 text-zinc-600 border border-zinc-200/60 px-2.5 py-1 rounded-lg font-medium flex items-center gap-1">
                    ⛩️ Cultural Gems
                  </span>
                  <span className="text-xs bg-zinc-100 text-zinc-600 border border-zinc-200/60 px-2.5 py-1 rounded-lg font-medium flex items-center gap-1">
                    🛍️ Artisan Souvenirs
                  </span>
                </div>
              </div>

              <div className="bg-emerald-600 hover:bg-emerald-700 text-white p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center max-w-xs w-full transition-transform hover:scale-102 cursor-pointer border border-emerald-500/30" onClick={handleGenerateItinerary}>
                <Plane className="h-10 w-10 text-emerald-100 mb-2 animate-bounce" />
                <h4 className="font-extrabold text-sm tracking-tight">Generate Kyoto Plan</h4>
                <p className="text-[11px] text-emerald-100 mt-1">Get an instant 3-day deep cultural guide curated by our experts.</p>
                <div className="mt-3.5 flex items-center gap-1 text-xs font-bold text-white bg-white/10 px-3 py-1.5 rounded-lg">
                  <span>Draft Plan Now</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Side-by-Side Split Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT SIDE: Chat Interface (Spans 5 columns on desktop) */}
          <div className="lg:col-span-5 h-full">
            <ExpertChat
              destination={destination}
              activeExpertId={activeExpertId}
              setActiveExpertId={setActiveExpertId}
              messages={messages}
              onSendMessage={handleSendMessage}
              isSending={isSendingMessage}
            />
          </div>

          {/* RIGHT SIDE: Interactive Itinerary Planner & Displays (Spans 7 columns on desktop) */}
          <div className="lg:col-span-7 space-y-6">
            <ItineraryDisplay
              itinerary={itinerary}
              isGenerating={isGeneratingItinerary}
              onSavePlace={handleSavePlace}
              onUnsavePlace={handleUnsavePlace}
              savedPlaces={savedPlaces}
              userNotes={userNotes}
              onAddNote={handleAddNote}
              onDeleteNote={handleDeleteNote}
            />

            {/* Saved Spotlights Section */}
            <SavedPlaces
              savedPlaces={savedPlaces}
              onUnsavePlace={handleUnsavePlace}
              destination={destination}
            />
          </div>

        </div>

      </main>

      {/* Humble Footer */}
      <footer className="border-t border-zinc-200/80 bg-white py-6 mt-12 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-medium">© 2026 NomadCompass. Driven by Google Gemini AI & Specialized Local Locals.</p>
          <div className="flex gap-4">
            <span className="hover:text-emerald-600 transition-colors cursor-pointer">Terms of Journey</span>
            <span className="hover:text-emerald-600 transition-colors cursor-pointer">Privacy Guidelines</span>
            <span className="hover:text-emerald-600 transition-colors cursor-pointer">Support Hub</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

