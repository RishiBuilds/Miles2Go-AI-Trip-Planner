"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2, 
  X, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Star, 
  Clock, 
  Plane, 
  Hotel, 
  Utensils, 
  Camera, 
  Zap,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RefreshCw,
  Mic,
  MicOff,
  Volume2,
  VolumeX
} from "lucide-react";
import { generateUUID } from "@/lib/generateId";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  suggestions?: string[];
  quickActions?: QuickAction[];
  metadata?: {
    type?: "trip_suggestion" | "price_alert" | "booking_confirmation" | "general";
    data?: any;
  };
};

type QuickAction = {
  id: string;
  label: string;
  action: string;
  icon?: React.ReactNode;
  data?: any;
};

type ChatMode = "travel_planning" | "price_inquiry" | "booking_help" | "general_support";

interface AIChatAssistantProps {
  mode?: ChatMode;
  initialMessage?: string;
  onActionTrigger?: (action: string, data?: any) => void;
  className?: string;
}

const AIChatAssistant: React.FC<AIChatAssistantProps> = ({
  mode = "general_support",
  initialMessage,
  onActionTrigger,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>(mode);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Speech Recognition
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = false;
          recognitionRef.current.interimResults = false;
          recognitionRef.current.lang = 'en-US';
          
          recognitionRef.current.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setUserInput(transcript);
            setIsListening(false);
          };
          
          recognitionRef.current.onerror = () => {
            setIsListening(false);
          };
        }
        
        // Speech Synthesis
        if (window.speechSynthesis) {
          synthRef.current = window.speechSynthesis;
        }
      } catch (error) {
        console.warn('Speech APIs not available:', error);
      }
    }
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Initialize chat with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = getWelcomeMessage(chatMode);
      setMessages([{
        id: generateUUID(),
        role: "assistant",
        content: welcomeMessage.content,
        timestamp: Date.now(),
        suggestions: welcomeMessage.suggestions,
        quickActions: welcomeMessage.quickActions
      }]);
    }
  }, [isOpen, chatMode, messages.length]);

  // Handle initial message
  useEffect(() => {
    if (initialMessage && isOpen && messages.length <= 1) {
      setUserInput(initialMessage);
    }
  }, [initialMessage, isOpen, messages.length]);

  const getWelcomeMessage = (mode: ChatMode) => {
    const welcomeMessages = {
      travel_planning: {
        content: "🌍 Hi! I'm your AI Travel Assistant. I can help you plan amazing trips, find the best deals, and create personalized itineraries. What destination are you dreaming of?",
        suggestions: [
          "Plan a trip to Paris for 5 days under $2000",
          "Find the best hotels in Tokyo",
          "Suggest activities for a family trip to Bali",
          "What's the best time to visit Iceland?"
        ],
        quickActions: [
          { id: "destinations", label: "Browse Destinations", action: "browse_destinations", icon: <MapPin size={16} /> },
          { id: "budget_planner", label: "Budget Planner", action: "open_budget_planner", icon: <DollarSign size={16} /> },
          { id: "trip_optimizer", label: "AI Trip Optimizer", action: "open_trip_optimizer", icon: <Zap size={16} /> }
        ]
      },
      price_inquiry: {
        content: "💰 I'm here to help you find the best prices and deals! I can check real-time pricing, set up price alerts, and find exclusive discounts. What are you looking to book?",
        suggestions: [
          "Check hotel prices in Paris for next month",
          "Set up price alerts for flights to Tokyo",
          "Find restaurant deals in Barcelona",
          "Compare activity prices in Dubai"
        ],
        quickActions: [
          { id: "price_alerts", label: "Set Price Alert", action: "set_price_alert", icon: <Clock size={16} /> },
          { id: "compare_prices", label: "Compare Prices", action: "compare_prices", icon: <Star size={16} /> },
          { id: "deals", label: "Today's Deals", action: "show_deals", icon: <Sparkles size={16} /> }
        ]
      },
      booking_help: {
        content: "📅 I can assist you with bookings, modifications, and any questions about your reservations. How can I help you today?",
        suggestions: [
          "Help me modify my hotel booking",
          "Check my reservation status",
          "Cancel my restaurant booking",
          "Add services to my existing trip"
        ],
        quickActions: [
          { id: "my_bookings", label: "My Bookings", action: "show_bookings", icon: <Calendar size={16} /> },
          { id: "modify_booking", label: "Modify Booking", action: "modify_booking", icon: <RefreshCw size={16} /> },
          { id: "support", label: "Contact Support", action: "contact_support", icon: <MessageSquare size={16} /> }
        ]
      },
      general_support: {
        content: "👋 Hello! I'm your AI assistant. I can help with travel planning, bookings, price inquiries, and general support. What would you like to know?",
        suggestions: [
          "Plan a new trip",
          "Check my bookings",
          "Find the best deals",
          "Get travel recommendations"
        ],
        quickActions: [
          { id: "plan_trip", label: "Plan Trip", action: "plan_trip", icon: <Plane size={16} /> },
          { id: "find_deals", label: "Find Deals", action: "find_deals", icon: <DollarSign size={16} /> },
          { id: "my_account", label: "My Account", action: "my_account", icon: <User size={16} /> }
        ]
      }
    };
    
    return welcomeMessages[mode];
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isTyping) return;

    const newMessage: ChatMessage = {
      id: generateUUID(),
      role: "user",
      content: userInput.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newMessage]);
    setUserInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(newMessage.content, chatMode);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userMessage: string, mode: ChatMode): ChatMessage => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Travel planning responses
    if (lowerMessage.includes('trip') || lowerMessage.includes('travel') || lowerMessage.includes('plan')) {
      return {
        id: generateUUID(),
        role: "assistant",
        content: "🎯 Great! I'd love to help you plan an amazing trip. To create the perfect itinerary, I'll need a few details:\n\n• **Destination**: Where would you like to go?\n• **Duration**: How many days?\n• **Budget**: What's your budget range?\n• **Travel style**: Adventure, relaxation, culture, or luxury?\n• **Group size**: Solo, couple, family, or group?\n\nOnce I have these details, I can use AI to optimize your trip and find the best deals!",
        timestamp: Date.now(),
        suggestions: [
          "I want to go to Paris for 5 days with a $2000 budget",
          "Plan a romantic getaway for 2 people",
          "Family trip to Disney World for a week",
          "Solo backpacking adventure in Southeast Asia"
        ],
        quickActions: [
          { id: "trip_form", label: "Fill Trip Form", action: "open_trip_form", icon: <Plane size={16} /> },
          { id: "ai_optimizer", label: "AI Optimizer", action: "open_ai_optimizer", icon: <Zap size={16} /> }
        ],
        metadata: { type: "trip_suggestion" }
      };
    }

    // Price inquiry responses
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('deal')) {
      return {
        id: generateUUID(),
        role: "assistant",
        content: "💰 I can help you find the best prices! Our AI continuously monitors prices across thousands of vendors to ensure you get the best deals.\n\n**Current trending deals:**\n• Hotels in Paris: 25% off this week\n• Tokyo flights: $200 cheaper than last month\n• Barcelona restaurants: Special dinner packages\n\nWould you like me to check specific prices or set up price alerts for you?",
        timestamp: Date.now(),
        suggestions: [
          "Check hotel prices in Paris",
          "Set price alert for Tokyo flights",
          "Find restaurant deals in Barcelona",
          "Compare activity prices"
        ],
        quickActions: [
          { id: "price_check", label: "Check Prices", action: "check_prices", icon: <DollarSign size={16} /> },
          { id: "set_alert", label: "Set Alert", action: "set_price_alert", icon: <Clock size={16} /> }
        ],
        metadata: { type: "price_alert" }
      };
    }

    // Booking help responses
    if (lowerMessage.includes('booking') || lowerMessage.includes('reservation') || lowerMessage.includes('cancel')) {
      return {
        id: generateUUID(),
        role: "assistant",
        content: "📅 I'm here to help with your bookings! I can assist you with:\n\n• **View bookings**: Check all your current reservations\n• **Modify bookings**: Change dates, guests, or services\n• **Cancel bookings**: Process cancellations and refunds\n• **Add services**: Enhance your existing bookings\n\nWhat would you like to do with your booking?",
        timestamp: Date.now(),
        suggestions: [
          "Show my current bookings",
          "Modify my hotel reservation",
          "Cancel my restaurant booking",
          "Add airport transfer to my trip"
        ],
        quickActions: [
          { id: "view_bookings", label: "View Bookings", action: "show_bookings", icon: <Calendar size={16} /> },
          { id: "modify", label: "Modify", action: "modify_booking", icon: <RefreshCw size={16} /> }
        ],
        metadata: { type: "booking_confirmation" }
      };
    }

    // Default response
    return {
      id: generateUUID(),
      role: "assistant",
      content: "I understand you're looking for help! I'm equipped with advanced AI to assist you with:\n\n🌍 **Travel Planning** - Personalized itineraries and recommendations\n💰 **Price Optimization** - Real-time deals and price alerts\n📅 **Booking Management** - Easy booking modifications and support\n🎯 **Smart Suggestions** - AI-powered travel insights\n\nWhat specific area would you like help with?",
      timestamp: Date.now(),
      suggestions: [
        "Help me plan a trip",
        "Find the best deals",
        "Check my bookings",
        "Get travel recommendations"
      ],
      quickActions: [
        { id: "plan_trip", label: "Plan Trip", action: "plan_trip", icon: <Plane size={16} /> },
        { id: "find_deals", label: "Find Deals", action: "find_deals", icon: <Sparkles size={16} /> }
      ],
      metadata: { type: "general" }
    };
  };

  const handleQuickAction = (action: string, data?: any) => {
    if (onActionTrigger) {
      onActionTrigger(action, data);
    }
    
    // Handle internal actions
    switch (action) {
      case "browse_destinations":
        window.location.href = "/destinations";
        break;
      case "open_trip_optimizer":
        // This would open the AI Trip Optimizer component
        break;
      case "show_bookings":
        window.location.href = "/dashboard/bookings";
        break;
      default:
        console.log("Action triggered:", action, data);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setUserInput(suggestion);
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakMessage = (text: string) => {
    if (synthRef.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      synthRef.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!isOpen) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <MessageSquare size={24} className="text-white" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <div className={`bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isTyping ? "Typing..." : "Online"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <X size={16} />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[400px]">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl rounded-br-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl rounded-bl-sm'
                  } px-4 py-3`}>
                    <div className="flex items-start gap-2 mb-2">
                      {message.role === 'assistant' && (
                        <Bot size={16} className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                        
                        {message.role === 'assistant' && (
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(message.content)}
                              className="h-6 px-2 text-xs"
                            >
                              <Copy size={12} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => isSpeaking ? stopSpeaking() : speakMessage(message.content)}
                              className="h-6 px-2 text-xs"
                            >
                              {isSpeaking ? <VolumeX size={12} /> : <Volume2 size={12} />}
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                              <ThumbsUp size={12} />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                              <ThumbsDown size={12} />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Quick Actions */}
                    {message.quickActions && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {message.quickActions.map((action) => (
                          <Button
                            key={action.id}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickAction(action.action, action.data)}
                            className="h-8 px-3 text-xs bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                          >
                            {action.icon}
                            <span className="ml-1">{action.label}</span>
                          </Button>
                        ))}
                      </div>
                    )}
                    
                    {/* Suggestions */}
                    {message.suggestions && (
                      <div className="mt-3 space-y-1">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Suggestions:</p>
                        {message.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="block w-full text-left text-xs p-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Bot size={16} className="text-blue-600 dark:text-blue-400" />
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <Textarea
                    ref={textareaRef}
                    placeholder="Ask me anything about travel..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="min-h-[40px] max-h-[100px] resize-none pr-12 text-sm"
                    rows={1}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={isListening ? stopListening : startListening}
                    className={`absolute right-2 top-2 h-6 w-6 p-0 ${isListening ? 'text-red-500' : 'text-gray-400'}`}
                  >
                    {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                  </Button>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!userInput.trim() || isTyping}
                  className="h-10 w-10 p-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AIChatAssistant;