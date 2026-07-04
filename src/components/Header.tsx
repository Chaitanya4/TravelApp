import React, { useState } from "react";
import { Globe, MapPin, Calendar, Users, SlidersHorizontal, Sparkles } from "lucide-react";
import { SUGGESTED_DESTINATIONS, SuggestedDestination } from "../data";

interface HeaderProps {
  destination: string;
  setDestination: (d: string) => void;
  daysCount: number;
  setDaysCount: (days: number) => void;
  travelerType: string;
  setTravelerType: (type: string) => void;
  interests: string;
  setInterests: (interests: string) => void;
  onGenerateItinerary: () => void;
  isGenerating: boolean;
  hasItinerary: boolean;
}

export default function Header({
  destination,
  setDestination,
  daysCount,
  setDaysCount,
  travelerType,
  setTravelerType,
  interests,
  setInterests,
  onGenerateItinerary,
  isGenerating,
  hasItinerary,
}: HeaderProps) {
  const [showConfig, setShowConfig] = useState(false);
  const [customDestination, setCustomDestination] = useState("");

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customDestination.trim()) {
      setDestination(customDestination.trim());
      setCustomDestination("");
    }
  };

  const handleQuickDestination = (dest: SuggestedDestination) => {
    setDestination(dest.name);
    setDaysCount(dest.days);
    setInterests(dest.interests);
  };

  return (
    <header className="bg-white border-b border-zinc-100 shadow-xs sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-100">
              <Globe className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900 tracking-tight flex items-center gap-1.5">
                NomadCompass <span className="text-xs font-medium bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">AI Travel Expert</span>
              </h1>
              <p className="text-xs text-zinc-500">Plan personalized itineraries with specialized local experts</p>
            </div>
          </div>

          {/* Current Destination & Trip Parameters bar */}
          <div className="flex flex-wrap items-center gap-3">
            {destination ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-950 rounded-xl text-sm font-medium">
                <MapPin className="h-4 w-4 text-emerald-600" />
                <span>Trip to {destination}</span>
                <span className="text-xs bg-emerald-600/10 text-emerald-700 px-2 py-0.5 rounded-md font-semibold">
                  {daysCount} Days
                </span>
                <span className="text-xs bg-emerald-600/10 text-emerald-700 px-2 py-0.5 rounded-md">
                  {travelerType}
                </span>
              </div>
            ) : (
              <span className="text-xs text-zinc-500 italic">Select a destination below to start your trip planner</span>
            )}

            <button
              id="toggle-config-btn"
              onClick={() => setShowConfig(!showConfig)}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 text-sm font-medium ${
                showConfig 
                  ? "bg-zinc-900 text-white border-zinc-950" 
                  : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Customize Trip</span>
            </button>

            <button
              id="generate-itinerary-btn"
              onClick={onGenerateItinerary}
              disabled={isGenerating || !destination}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-100 disabled:text-zinc-400 text-white font-medium rounded-xl text-sm shadow-md hover:shadow-emerald-100 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isGenerating ? "Generating Plan..." : hasItinerary ? "Regenerate Itinerary" : "Generate Custom Itinerary"}</span>
            </button>
          </div>
        </div>

        {/* Expandable Configuration Drawer */}
        {showConfig && (
          <div className="mt-4 p-5 bg-zinc-50 border border-zinc-200 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-200">
            <h3 className="text-sm font-semibold text-zinc-900 mb-3 flex items-center gap-1.5">
              Configure Your Personalized Itinerary
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Destination selector */}
              <div>
                <label className="block text-xs font-medium text-zinc-600 mb-1.5">Destination Country/City</label>
                <form onSubmit={handleCustomSubmit} className="relative">
                  <input
                    type="text"
                    value={customDestination}
                    onChange={(e) => setCustomDestination(e.target.value)}
                    placeholder="e.g. Kyoto, Tokyo, Paris..."
                    className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 text-xs bg-emerald-600 text-white px-2.5 py-1 rounded-lg hover:bg-emerald-700 font-medium"
                  >
                    Set
                  </button>
                </form>
              </div>

              {/* Days Count */}
              <div>
                <label className="block text-xs font-medium text-zinc-600 mb-1.5">Duration</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={daysCount}
                    onChange={(e) => setDaysCount(parseInt(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                  <span className="text-sm font-semibold text-zinc-800 w-12 text-center bg-white border border-zinc-200 py-1 px-2 rounded-lg">
                    {daysCount} Days
                  </span>
                </div>
              </div>

              {/* Traveler Type */}
              <div>
                <label className="block text-xs font-medium text-zinc-600 mb-1.5">Traveler Style</label>
                <select
                  value={travelerType}
                  onChange={(e) => setTravelerType(e.target.value)}
                  className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:border-emerald-600 focus:ring-1"
                >
                  <option value="Solo Adventurer">👤 Solo Adventurer</option>
                  <option value="Couples Getaway">💑 Romantic Couple</option>
                  <option value="Family Friendly">👪 Family Holiday</option>
                  <option value="Group of Friends">👥 Group of Friends</option>
                  <option value="Business & Leisure">💼 Business & Leisure</option>
                </select>
              </div>

              {/* Interests tag inputs */}
              <div>
                <label className="block text-xs font-medium text-zinc-600 mb-1.5">Specific Focus / Interests</label>
                <input
                  type="text"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  placeholder="e.g., street food, temples, vintage shops..."
                  className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>

            {/* Quick Starter Recommendations */}
            <div className="mt-4 pt-4 border-t border-zinc-200">
              <span className="text-xs font-medium text-zinc-500 block mb-2">Or select an iconic expert-recommended destination:</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {SUGGESTED_DESTINATIONS.map((dest) => (
                  <button
                    key={dest.name}
                    id={`quick-dest-${dest.name.toLowerCase()}`}
                    onClick={() => handleQuickDestination(dest)}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      destination === dest.name
                        ? "border-emerald-600 bg-emerald-50/70 shadow-2xs"
                        : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
                    }`}
                  >
                    <div className="font-semibold text-xs text-zinc-900 flex items-center justify-between">
                      <span>{dest.name}</span>
                      <span className="text-[10px] text-zinc-400 font-normal">{dest.country}</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 truncate mt-0.5">{dest.tagline}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
