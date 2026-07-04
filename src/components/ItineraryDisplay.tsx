import React, { useState } from "react";
import { 
  Calendar, MapPin, Bookmark, BookmarkCheck, Lightbulb, 
  UtensilsCrossed, Sparkles, BookOpenText, Landmark, Compass, 
  ClipboardCopy, Printer, Info, CheckSquare, Save, Trash2, Plus
} from "lucide-react";
import { Itinerary, ItineraryActivity, ActivityCategory, SavedPlace, UserNote } from "../types";

interface ItineraryDisplayProps {
  itinerary: Itinerary | null;
  isGenerating: boolean;
  onSavePlace: (place: SavedPlace) => void;
  onUnsavePlace: (name: string) => void;
  savedPlaces: SavedPlace[];
  userNotes: UserNote[];
  onAddNote: (content: string) => void;
  onDeleteNote: (id: string) => void;
}

export default function ItineraryDisplay({
  itinerary,
  isGenerating,
  onSavePlace,
  onUnsavePlace,
  savedPlaces,
  userNotes,
  onAddNote,
  onDeleteNote,
}: ItineraryDisplayProps) {
  const [activeTab, setActiveTab] = useState<"itinerary" | "food" | "shopping" | "culture" | "tips">("itinerary");
  const [activeDay, setActiveDay] = useState<number>(1);
  const [newNoteText, setNewNoteText] = useState("");
  const [copied, setCopied] = useState(false);

  if (isGenerating) {
    return (
      <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-xs flex flex-col items-center justify-center min-h-[500px]">
        <div className="relative w-20 h-20 mb-6">
          {/* Circular Pulse waves */}
          <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-ping" />
          <div className="absolute inset-2 bg-emerald-500/20 rounded-full animate-pulse" />
          <div className="absolute inset-4 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-md">
            <Compass className="h-8 w-8 animate-spin" style={{ animationDuration: "3s" }} />
          </div>
        </div>
        <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Curating Your Personalized Journey...</h3>
        <p className="text-sm text-zinc-500 text-center max-w-sm mt-2">
          Consulting Chef Mei, Siddharth, Elena, and Kai to compile historical secrets, foodie hotspots, artisan crafts, and optimized transit schedules.
        </p>
        <div className="w-full max-w-xs bg-zinc-100 h-1.5 rounded-full mt-6 overflow-hidden">
          <div className="bg-emerald-600 h-full animate-infinite-loading rounded-full" style={{ width: "65%" }} />
        </div>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-xs flex flex-col items-center justify-center min-h-[500px] text-center">
        <div className="w-16 h-16 bg-zinc-50 border border-zinc-200 rounded-2xl flex items-center justify-center text-zinc-400 mb-4">
          <Calendar className="h-8 w-8" />
        </div>
        <h3 className="text-base font-bold text-zinc-800">No active itinerary plan</h3>
        <p className="text-xs text-zinc-500 max-w-md mt-1.5">
          Select or enter a destination above, customize your interests under "Customize Trip", and click <strong className="text-emerald-700">"Generate Custom Itinerary"</strong> to see a premium, AI-crafted day-by-day travel map.
        </p>
      </div>
    );
  }

  // Helper to copy text summary of itinerary
  const handleCopyItinerary = () => {
    let text = `TRIP PLANNER: ${itinerary.destination.toUpperCase()}\n`;
    text += `Overview: ${itinerary.overview}\n\n`;
    
    itinerary.days.forEach(day => {
      text += `Day ${day.dayNumber}: ${day.title}\n`;
      day.activities.forEach(act => {
        text += `- ${act.time} (${act.locationName}): ${act.title} - ${act.description}\n`;
        if (act.expertTip) text += `  💡 Local Expert Tip: ${act.expertTip}\n`;
      });
      text += `\n`;
    });
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isSaved = (name: string) => {
    return savedPlaces.some(p => p.name === name);
  };

  const handleToggleSave = (name: string, category: ActivityCategory, locationName: string, description: string) => {
    if (isSaved(name)) {
      onUnsavePlace(name);
    } else {
      onSavePlace({ name, category, locationName, description });
    }
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    onAddNote(newNoteText.trim());
    setNewNoteText("");
  };

  // Icon getter based on category
  const getCategoryIcon = (category: ActivityCategory, className = "h-4 w-4") => {
    switch (category) {
      case "food":
        return <UtensilsCrossed className={className} />;
      case "shopping":
        return <Sparkles className={className} />;
      case "culture":
        return <BookOpenText className={className} />;
      case "attraction":
      default:
        return <Landmark className={className} />;
    }
  };

  const getCategoryStyles = (category: ActivityCategory) => {
    switch (category) {
      case "food":
        return "bg-amber-50 text-amber-800 border-amber-200/60";
      case "shopping":
        return "bg-purple-50 text-purple-800 border-purple-200/60";
      case "culture":
        return "bg-indigo-50 text-indigo-800 border-indigo-200/60";
      case "attraction":
      default:
        return "bg-emerald-50 text-emerald-800 border-emerald-200/60";
    }
  };

  // Filters places recommended by category
  const filteredPlaces = itinerary.recommendedPlaces.filter(
    p => p.category === activeTab
  );

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl shadow-xs overflow-hidden flex flex-col min-h-[650px]">
      
      {/* Itinerary Header & Overview */}
      <div className="p-6 border-b border-zinc-100 bg-linear-to-r from-emerald-50/40 to-white">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase">Active Planner</span>
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight mt-0.5">{itinerary.destination}</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Curated for a <span className="font-semibold text-zinc-700">{itinerary.durationDays}-day</span> deep immersion
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleCopyItinerary}
              className="p-2 border border-zinc-200 text-zinc-600 rounded-xl hover:bg-zinc-50 hover:text-zinc-900 transition-all text-xs flex items-center gap-1.5 font-medium cursor-pointer"
              title="Copy text plan to clipboard"
            >
              <ClipboardCopy className="h-4 w-4" />
              <span>{copied ? "Copied!" : "Copy Plan"}</span>
            </button>
          </div>
        </div>

        <p className="text-sm text-zinc-600 leading-relaxed italic border-l-2 border-emerald-500 pl-3">
          "{itinerary.overview}"
        </p>
      </div>

      {/* Main Inner Nav Tabs */}
      <div className="flex border-b border-zinc-200 bg-zinc-50 px-4 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("itinerary")}
          className={`py-3 px-4 font-bold text-xs tracking-wide uppercase border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "itinerary"
              ? "border-emerald-600 text-emerald-800"
              : "border-transparent text-zinc-500 hover:text-zinc-800"
          }`}
        >
          📅 Daily Guide
        </button>
        <button
          onClick={() => setActiveTab("food")}
          className={`py-3 px-4 font-bold text-xs tracking-wide uppercase border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "food"
              ? "border-amber-500 text-amber-800"
              : "border-transparent text-zinc-500 hover:text-zinc-800"
          }`}
        >
          🍜 Local Food
        </button>
        <button
          onClick={() => setActiveTab("shopping")}
          className={`py-3 px-4 font-bold text-xs tracking-wide uppercase border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "shopping"
              ? "border-purple-500 text-purple-800"
              : "border-transparent text-zinc-500 hover:text-zinc-800"
          }`}
        >
          🛍️ Souvenirs & Crafts
        </button>
        <button
          onClick={() => setActiveTab("culture")}
          className={`py-3 px-4 font-bold text-xs tracking-wide uppercase border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "culture"
              ? "border-indigo-500 text-indigo-800"
              : "border-transparent text-zinc-500 hover:text-zinc-800"
          }`}
        >
          🎭 Cultural Gems
        </button>
        <button
          onClick={() => setActiveTab("tips")}
          className={`py-3 px-4 font-bold text-xs tracking-wide uppercase border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "tips"
              ? "border-emerald-500 text-emerald-800"
              : "border-transparent text-zinc-500 hover:text-zinc-800"
          }`}
        >
          💡 Transit & Hacks
        </button>
      </div>

      {/* Tab Panel Content */}
      <div className="flex-1 p-6">
        
        {/* TAB 1: ITINERARY (Daily Breakdown) */}
        {activeTab === "itinerary" && (
          <div>
            {/* Days Selector Rail */}
            <div className="flex gap-2 mb-6 pb-2 border-b border-zinc-100 overflow-x-auto scrollbar-none">
              {itinerary.days.map((day) => (
                <button
                  key={day.dayNumber}
                  onClick={() => setActiveDay(day.dayNumber)}
                  className={`py-2 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    activeDay === day.dayNumber
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                >
                  Day {day.dayNumber}: {day.title.split(":")[0]}
                </button>
              ))}
            </div>

            {/* Selected Day Timeline */}
            {itinerary.days
              .filter((day) => day.dayNumber === activeDay)
              .map((day) => (
                <div key={day.dayNumber} className="space-y-6">
                  <div className="mb-4">
                    <h3 className="text-base font-extrabold text-zinc-800 flex items-center gap-2">
                      <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-lg text-xs font-black">
                        DAY {day.dayNumber}
                      </span>
                      {day.title}
                    </h3>
                  </div>

                  <div className="relative border-l border-zinc-200 pl-5 ml-2.5 space-y-6">
                    {day.activities.map((act, index) => {
                      const saved = isSaved(act.title);
                      return (
                        <div key={index} className="relative">
                          {/* Timeline dot */}
                          <div className="absolute -left-[27px] top-1.5 w-3 h-3 bg-white border-2 border-emerald-600 rounded-full" />
                          
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 bg-zinc-50/70 hover:bg-zinc-50 p-4 rounded-2xl border border-zinc-200/50 transition-all">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                <span className="text-[10px] font-extrabold bg-zinc-200 text-zinc-700 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                  {act.time}
                                </span>
                                <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-md flex items-center gap-1 ${getCategoryStyles(act.category)}`}>
                                  {getCategoryIcon(act.category)}
                                  <span className="capitalize">{act.category}</span>
                                </span>
                                <span className="text-xs text-zinc-500 font-medium flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                                  {act.locationName}
                                </span>
                              </div>

                              <h4 className="font-bold text-zinc-800 text-sm">{act.title}</h4>
                              <p className="text-xs text-zinc-600 leading-relaxed mt-1">
                                {act.description}
                              </p>

                              {act.expertTip && (
                                <div className="mt-2 text-[11px] bg-white border border-emerald-100 text-emerald-900 px-3 py-1.5 rounded-xl flex items-start gap-1.5 shadow-3xs">
                                  <Lightbulb className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0 mt-0.5 animate-bounce" />
                                  <span><strong className="font-bold">Expert Tip:</strong> {act.expertTip}</span>
                                </div>
                              )}
                            </div>

                            <button
                              id={`save-act-${act.title.replace(/\s+/g, '-').toLowerCase()}`}
                              onClick={() => handleToggleSave(act.title, act.category, act.locationName, act.description)}
                              className={`p-2 rounded-xl transition-all border self-start cursor-pointer ${
                                saved 
                                  ? "bg-amber-50 text-amber-600 border-amber-200" 
                                  : "bg-white text-zinc-400 border-zinc-200 hover:text-zinc-600 hover:bg-zinc-50"
                              }`}
                              title={saved ? "Unsave place" : "Save place to list"}
                            >
                              {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* TAB 2, 3, 4: EXPERT PLACES HIGHLIGHTS */}
        {(activeTab === "food" || activeTab === "shopping" || activeTab === "culture") && (
          <div>
            <div className="mb-4">
              <h3 className="text-base font-extrabold text-zinc-800 flex items-center gap-2">
                <span className="capitalize">{activeTab}</span> Spotlights
              </h3>
              <p className="text-xs text-zinc-500">
                Specialized local treasures handpicked for {itinerary.destination}
              </p>
            </div>

            {filteredPlaces.length === 0 ? (
              <div className="text-center py-10 bg-zinc-50 border border-dashed border-zinc-200 rounded-xl">
                <p className="text-xs text-zinc-500">No specific places categorized as {activeTab} yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPlaces.map((place, idx) => {
                  const saved = isSaved(place.name);
                  return (
                    <div key={idx} className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/50 hover:border-zinc-300 transition-all flex justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold text-zinc-500 bg-white px-2 py-0.5 rounded-md border border-zinc-200 flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-zinc-400" />
                            {place.neighborhood}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-zinc-800 text-sm">{place.name}</h4>
                        <p className="text-xs text-zinc-600 leading-relaxed mt-1">{place.description}</p>
                        
                        <div className="mt-2 text-[11px] bg-white text-zinc-600 border border-zinc-200 p-2.5 rounded-xl">
                          <strong className="text-emerald-700 font-bold">Why Experts Suggest This:</strong> {place.whyVisit}
                        </div>
                      </div>

                      <button
                        id={`save-place-${place.name.replace(/\s+/g, '-').toLowerCase()}`}
                        onClick={() => handleToggleSave(place.name, place.category, place.neighborhood, place.description)}
                        className={`p-2 rounded-xl transition-all border self-start flex-shrink-0 cursor-pointer ${
                          saved 
                            ? "bg-amber-50 text-amber-600 border-amber-200" 
                            : "bg-white text-zinc-400 border-zinc-200 hover:text-zinc-600 hover:bg-zinc-50"
                        }`}
                      >
                        {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: TRANSIT & HACKS */}
        {activeTab === "tips" && (
          <div className="space-y-4">
            <div className="mb-2">
              <h3 className="text-base font-extrabold text-zinc-800 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Transit, Safety, & Etiquette Hacks
              </h3>
              <p className="text-xs text-zinc-500">Crucial local facts compiled by our guide Kai before you board</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {itinerary.expertTips.map((tip, idx) => (
                <div key={idx} className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-2xl flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-emerald-950 font-medium leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>

            {/* Travel safety message card */}
            <div className="p-4 bg-amber-50 border border-amber-200/50 rounded-2xl flex gap-3 mt-4">
              <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-900">Expert Recommendation</h4>
                <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5">
                  Always download an offline map of {itinerary.destination} in your Google Maps app and keep a digital photograph of your passport and emergency medical contact numbers stored in your email archives.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Side segment: Interactive Travel Notebook */}
      <div className="border-t border-zinc-200 bg-zinc-50/50 p-6">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">📝 Custom Trip Notes & Checklist</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Note input/form */}
          <form onSubmit={handleAddNoteSubmit} className="space-y-2">
            <textarea
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Jot down reservations, budget notes, flight times, or questions to ask the experts..."
              className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-xs focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 h-24"
            />
            <button
              type="submit"
              disabled={!newNoteText.trim()}
              className="w-full py-2 bg-zinc-850 hover:bg-zinc-900 disabled:bg-zinc-200 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Save Note</span>
            </button>
          </form>

          {/* Note listing */}
          <div className="border border-zinc-200 bg-white rounded-xl p-3 h-32 overflow-y-auto space-y-2">
            {userNotes.length === 0 ? (
              <p className="text-[11px] text-zinc-400 italic text-center py-8">No travel notes added yet. Keep checklist items here.</p>
            ) : (
              <div className="space-y-2">
                {userNotes.map((note) => (
                  <div key={note.id} className="flex items-start justify-between gap-2 p-2 bg-zinc-50 border border-zinc-150 rounded-lg group">
                    <p className="text-xs text-zinc-700 leading-relaxed whitespace-pre-line">{note.content}</p>
                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="p-1 text-zinc-400 hover:text-red-500 rounded-md transition-colors"
                      title="Delete note"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
