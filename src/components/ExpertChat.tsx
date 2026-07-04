import React, { useState, useRef, useEffect } from "react";
import { 
  Send, Compass, UtensilsCrossed, BookOpenText, Sparkles, 
  User, Bot, Loader2, ArrowRight, Info, MessageSquareCode
} from "lucide-react";
import { LOCAL_EXPERTS } from "../data";
import { Expert, Message } from "../types";

interface ExpertChatProps {
  destination: string;
  activeExpertId: "general" | "foodie" | "cultural" | "shopping";
  setActiveExpertId: (id: "general" | "foodie" | "cultural" | "shopping") => void;
  messages: Message[];
  onSendMessage: (text: string) => void;
  isSending: boolean;
}

export default function ExpertChat({
  destination,
  activeExpertId,
  setActiveExpertId,
  messages,
  onSendMessage,
  isSending,
}: ExpertChatProps) {
  const [inputText, setInputText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Find current active expert object
  const activeExpert = LOCAL_EXPERTS.find(e => e.id === activeExpertId) || LOCAL_EXPERTS[0];

  useEffect(() => {
    // Scroll to the bottom of the chat list
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  const handleSuggestedClick = (question: string) => {
    if (isSending) return;
    onSendMessage(question);
  };

  // Helper to get expert's icon
  const getExpertIcon = (id: string, className = "h-5 w-5") => {
    switch (id) {
      case "general":
        return <Compass className={className} />;
      case "foodie":
        return <UtensilsCrossed className={className} />;
      case "cultural":
        return <BookOpenText className={className} />;
      case "shopping":
        return <Sparkles className={className} />;
      default:
        return <Compass className={className} />;
    }
  };

  // Filters messages relevant to the current destination & current selected expert (or show general history)
  // To keep it simple and friendly, we show all history of the trip, but label which expert said what
  const filteredMessages = messages.filter(m => m.expertId === activeExpertId);

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl shadow-xs overflow-hidden flex flex-col h-[650px] md:h-[750px]">
      
      {/* 1. Header with Destination Info & Expert Tabs */}
      <div className="bg-zinc-50 border-b border-zinc-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MessageSquareCode className="h-5 w-5 text-emerald-600" />
            <h2 className="font-bold text-zinc-900 text-base">Chat with Local Experts</h2>
          </div>
          {destination && (
            <span className="text-xs bg-zinc-200/60 text-zinc-700 px-2.5 py-1 rounded-full font-semibold">
              🎯 {destination}
            </span>
          )}
        </div>

        {/* Expert Switching Bar */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-zinc-200/50 rounded-xl">
          {LOCAL_EXPERTS.map((expert) => {
            const isActive = expert.id === activeExpertId;
            return (
              <button
                key={expert.id}
                id={`expert-tab-${expert.id}`}
                onClick={() => setActiveExpertId(expert.id)}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-1 sm:px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-white text-emerald-800 shadow-xs border-b border-zinc-200"
                    : "text-zinc-500 hover:text-zinc-800 hover:bg-white/40"
                }`}
                title={expert.title}
              >
                {getExpertIcon(expert.id, `h-4 w-4 ${isActive ? "text-emerald-600" : "text-zinc-400"}`)}
                <span className="hidden sm:inline">{expert.name}</span>
                <span className="sm:hidden text-[10px]">{expert.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Expert Profile Summary Card */}
      <div className="bg-emerald-50/50 border-b border-emerald-100/60 p-3 flex gap-3 items-start">
        <div className={`p-2.5 rounded-xl text-emerald-700 bg-white border border-emerald-100 shadow-3xs`}>
          {getExpertIcon(activeExpert.id, "h-5 w-5")}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-bold text-sm text-zinc-800">{activeExpert.name}</h3>
            <span className="text-[10px] font-medium bg-emerald-100/80 text-emerald-800 px-1.5 py-0.5 rounded-sm">
              {activeExpert.title}
            </span>
          </div>
          <p className="text-xs text-zinc-500 line-clamp-2 mt-0.5" title={activeExpert.bio}>
            {activeExpert.bio}
          </p>
        </div>
      </div>

      {/* 3. Messages Window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/30">
        {filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              {getExpertIcon(activeExpertId, "h-6 w-6")}
            </div>
            <h4 className="font-bold text-sm text-zinc-800">
              Start chatting with {activeExpert.name}!
            </h4>
            <p className="text-xs text-zinc-500 max-w-xs mt-1">
              Ask about secrets, itineraries, specific tips, or choose one of the expert-guided questions below.
            </p>
            
            {/* Suggestion starters */}
            <div className="mt-4 w-full max-w-sm space-y-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Suggested Questions for {destination || "your destination"}:</span>
              {activeExpert.sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestedClick(q)}
                  className="w-full text-left p-2.5 text-xs bg-white hover:bg-emerald-50 hover:text-emerald-900 border border-zinc-200 hover:border-emerald-200 rounded-xl transition-all font-medium shadow-3xs flex items-center justify-between group cursor-pointer"
                >
                  <span className="line-clamp-2">{q}</span>
                  <ArrowRight className="h-3 w-3 text-zinc-400 group-hover:text-emerald-600 flex-shrink-0 ml-1.5" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMessages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs flex-shrink-0 shadow-2xs ${
                    isUser 
                      ? "bg-zinc-800 text-white" 
                      : "bg-emerald-600 text-white"
                  }`}>
                    {isUser ? <User className="h-4 w-4" /> : getExpertIcon(activeExpertId, "h-4 w-4")}
                  </div>

                  {/* Message Bubble */}
                  <div className={`max-w-[82%] rounded-2xl p-3.5 text-sm leading-relaxed shadow-3xs border ${
                    isUser 
                      ? "bg-zinc-900 text-white border-zinc-950 rounded-tr-none" 
                      : "bg-white text-zinc-800 border-zinc-200 rounded-tl-none"
                  }`}>
                    {!isUser && (
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                        {activeExpert.name} • {activeExpert.title}
                      </span>
                    )}
                    <div className="whitespace-pre-line prose prose-sm prose-zinc text-sm">
                      {msg.content}
                    </div>
                    <span className={`text-[9px] block text-right mt-1.5 ${isUser ? "text-zinc-400" : "text-zinc-400"}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Simulated Typing Indicator */}
            {isSending && (
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 animate-pulse">
                  {getExpertIcon(activeExpertId, "h-4 w-4")}
                </div>
                <div className="bg-white text-zinc-800 border border-zinc-200 rounded-2xl rounded-tl-none p-4 text-sm shadow-3xs flex items-center gap-2">
                  <Loader2 className="h-4 w-4 text-emerald-600 animate-spin" />
                  <span className="text-xs text-zinc-500 font-medium">
                    {activeExpert.name} is writing tips...
                  </span>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* 4. Chat Input Box */}
      <div className="p-4 border-t border-zinc-200 bg-white">
        {filteredMessages.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            <span className="text-[10px] text-zinc-400 font-bold uppercase self-center mr-1">Ask:</span>
            {activeExpert.sampleQuestions.slice(0, 2).map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestedClick(q)}
                disabled={isSending}
                className="text-[11px] bg-zinc-100 hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-200 text-zinc-600 border border-zinc-200 px-2.5 py-1 rounded-lg transition-all text-left truncate max-w-[220px] cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={!destination || isSending}
            placeholder={
              destination 
                ? `Message ${activeExpert.name} about ${destination}...` 
                : "Choose a destination first to activate expert chat"
            }
            className="flex-1 bg-zinc-50 focus:bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isSending || !destination}
            className="p-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-100 disabled:text-zinc-400 text-white rounded-xl transition-all shadow-xs cursor-pointer flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
        {!destination && (
          <p className="text-[10px] text-amber-600 font-medium mt-1.5 flex items-center gap-1">
            <Info className="h-3 w-3" /> Note: Type or select a destination in the top panel to start chatting!
          </p>
        )}
      </div>
    </div>
  );
}
