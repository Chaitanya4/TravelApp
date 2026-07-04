import React from "react";
import { Bookmark, BookmarkCheck, Trash2, MapPin, Landmark, UtensilsCrossed, Sparkles, BookOpenText } from "lucide-react";
import { SavedPlace, ActivityCategory } from "../types";

interface SavedPlacesProps {
  savedPlaces: SavedPlace[];
  onUnsavePlace: (name: string) => void;
  destination: string;
}

export default function SavedPlaces({
  savedPlaces,
  onUnsavePlace,
  destination,
}: SavedPlacesProps) {
  
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
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "shopping":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "culture":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "attraction":
      default:
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
    }
  };

  if (savedPlaces.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs text-center py-10">
        <div className="w-12 h-12 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-center text-zinc-400 mx-auto mb-3">
          <Bookmark className="h-5 w-5" />
        </div>
        <h4 className="text-sm font-bold text-zinc-800">No bookmarked spots yet</h4>
        <p className="text-[11px] text-zinc-500 max-w-xs mx-auto mt-1">
          Click the bookmark icon beside any daily activity or expert place recommendation to add items to your collection.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-4">
        <div>
          <h3 className="font-extrabold text-zinc-900 text-sm flex items-center gap-1.5">
            <BookmarkCheck className="h-4.5 w-4.5 text-amber-500" />
            My Bookmarked Treasures ({savedPlaces.length})
          </h3>
          <p className="text-[11px] text-zinc-500">Your personalized spots saved for {destination || "your trip"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {savedPlaces.map((place, index) => (
          <div 
            key={index} 
            className="p-3 bg-zinc-50 border border-zinc-150 rounded-xl hover:border-zinc-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 capitalize border ${getCategoryStyles(place.category)}`}>
                  {getCategoryIcon(place.category, "h-3 w-3")}
                  {place.category}
                </span>
                
                <button
                  onClick={() => onUnsavePlace(place.name)}
                  className="p-1 text-zinc-400 hover:text-red-500 rounded-md transition-colors cursor-pointer"
                  title="Remove from favorites"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <h4 className="font-extrabold text-zinc-800 text-xs truncate" title={place.name}>{place.name}</h4>
              <p className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{place.locationName}</span>
              </p>
              
              <p className="text-[11px] text-zinc-600 line-clamp-2 mt-2 leading-relaxed">
                {place.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
