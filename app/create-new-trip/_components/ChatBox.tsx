"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import axios from "axios";
import { Send } from "lucide-react";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import EmptyState from "./EmptyState";
import GroupSizeUi from "./GroupSizeUi";
import BudgetUi from "./BudgetUi";
import TripDurationUi from "./TripDurationUi";
import TravelInterestsUi from "./TravelInterestsUi";
import SpecialRequirementsUi from "./SpecialRequirementsUi";
import FinalUi from "./FinalUi";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTripDetail, useUserDetail } from "@/app/provider";
import { generateUUID } from "@/lib/generateId";

// ==================== Types ====================
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  ui?: UiType;
  timestamp: number;
};

type UiType =
  | "budget"
  | "groupSize"
  | "tripDuration"
  | "travelInterests"
  | "specialRequirements"
  | "final";

export type TripInfo = {
  budget: string;
  destination: string;
  duration: string;
  group_size: string;
  origin: string;
  hotels: Hotel[];
  itinerary: Itinerary[];
};

export type Hotel = {
  hotel_name: string;
  hotel_address: string;
  price_per_night: string;
  hotel_image_url: string;
  geo_coordinates: {
    latitude: number;
    longitude: number;
  };
  rating: number;
  description: string;
};

export type Activity = {
  place_name: string;
  place_details: string;
  place_image_url: string;
  geo_coordinates: {
    latitude: number;
    longitude: number;
  };
  place_address: string;
  ticket_pricing: string;
  time_travel_each_location: string;
  best_time_to_visit: string;
};

export type Itinerary = {
  day: number;
  day_plan: string;
  best_time_to_visit_day: string;
  activities: Activity[];
};

// ==================== Constants ====================
const MAX_TEXTAREA_HEIGHT = 180;
const FINAL_MESSAGE_DELAY = 500;

// ==================== Main Component ====================
const ChatBox: React.FC = () => {
  // ========== State ==========
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isFinal, setIsFinal] = useState(false);
  const [tripDetail, setTripDetail] = useState<TripInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ========== Refs ==========
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isProcessingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const finalMessageSentRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ========== Hooks ==========
  const searchParams = useSearchParams();
  const saveTripDetail = useMutation(api.TripDetail.CreateTripDetail);
  const { userDetail } = useUserDetail();
  const tripContext = useTripDetail();

  // ========== Textarea Auto-resize ==========
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.min(scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
    }
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [userInput, adjustTextareaHeight]);

  // ========== Pre-fill from URL Parameter ==========
  useEffect(() => {
    const destination = searchParams.get("destination");
    if (destination && !userInput && messages.length === 0) {
      setUserInput(
        `I want to plan a trip to ${destination}. Can you help me create an amazing itinerary?`
      );
    }
  }, [searchParams, userInput, messages.length]);

  // ========== Auto-scroll ==========
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "assistant" || (!loading && messages.length > 0)) {
      scrollToBottom();
    }
  }, [messages, loading, scrollToBottom]);

  // ========== Cleanup on Unmount ==========
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // ========== Message Creator ==========
  const createMessage = useCallback(
    (role: "user" | "assistant", content: string, ui?: UiType): Message => ({
      id: generateUUID(),
      role,
      content,
      ui,
      timestamp: Date.now(),
    }),
    []
  );

  // ========== Send Message Handler ==========
  const sendMessage = useCallback(
    async (content: string, skipUserMessage = false) => {
      if (!content.trim() || loading || isProcessingRef.current) return;

      isProcessingRef.current = true;
      setLoading(true);
      setError(null);

      if (!skipUserMessage) {
        setUserInput("");
      }

      // Cancel previous request
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      let newMessages = [...messages];

      // Add user message
      if (!skipUserMessage) {
        const newMsg = createMessage("user", content.trim());
        newMessages = [...newMessages, newMsg];
        setMessages(newMessages);
      }

      try {
        const result = await axios.post(
          "/api/aimodel",
          {
            messages: newMessages.map(({ role, content }) => ({ role, content })),
            isFinal,
          },
          {
            signal: abortControllerRef.current.signal,
          }
        );

        // Handle non-final responses
        if (!isFinal) {
          const assistantMsg = createMessage(
            "assistant",
            result.data.resp,
            result.data.ui
          );
          setMessages((prev) => [...prev, assistantMsg]);

          if (result.data.ui === "final") {
            setIsFinal(true);
          }
        }

        // Handle final trip plan
        if (isFinal && result.data.trip_plan) {
          const tripPlan = result.data.trip_plan;
          setTripDetail(tripPlan);
          tripContext?.setTripDetailInfo(tripPlan);

          const tripId = generateUUID();
          await saveTripDetail({
            tripDetail: tripPlan,
            tripId,
            uid: userDetail?._id,
          });
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request cancelled");
          return;
        }

        console.error("Error sending message:", error);
        const errorMsg =
          error instanceof Error ? error.message : "Something went wrong";

        setError(errorMsg);
        setMessages((prev) => [
          ...prev,
          createMessage(
            "assistant",
            "Sorry, something went wrong. Please try again."
          ),
        ]);
      } finally {
        setLoading(false);
        isProcessingRef.current = false;
      }
    },
    [
      loading,
      isFinal,
      messages,
      userDetail,
      saveTripDetail,
      tripContext,
      createMessage,
    ]
  );

  // ========== Option Selection Handler ==========
  const handleOptionSelect = useCallback((value: string) => {
    setUserInput(value);
  }, []);

  // ========== Render UI Components ==========
  const renderGenerativeUi = useCallback(
    (ui?: UiType) => {
      if (!ui) return null;

      const uiComponents: Record<UiType, React.ReactElement> = {
        budget: <BudgetUi onSelectedOption={handleOptionSelect} />,
        groupSize: <GroupSizeUi onSelectedOption={handleOptionSelect} />,
        tripDuration: <TripDurationUi onSelectedOption={handleOptionSelect} />,
        travelInterests: (
          <TravelInterestsUi onSelectedOption={handleOptionSelect} />
        ),
        specialRequirements: (
          <SpecialRequirementsUi onSelectedOption={handleOptionSelect} />
        ),
        final: (
          <FinalUi
            viewTrip={() => console.log("View trip")}
            disable={!tripDetail}
          />
        ),
      };

      return uiComponents[ui] || null;
    },
    [handleOptionSelect, tripDetail]
  );

  // ========== Final State Handler ==========
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];

    if (
      lastMsg?.ui === "final" &&
      !finalMessageSentRef.current &&
      lastMsg.role === "assistant"
    ) {
      finalMessageSentRef.current = true;
      setIsFinal(true);

      const timer = setTimeout(() => {
        sendMessage("Ok, Great!", false);
      }, FINAL_MESSAGE_DELAY);

      return () => clearTimeout(timer);
    }
  }, [messages, sendMessage]);

  // ========== Keyboard Handler ==========
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage(userInput);
      }
    },
    [userInput, sendMessage]
  );

  // ========== Send Button Handler ==========
  const handleSend = useCallback(() => {
    sendMessage(userInput);
  }, [userInput, sendMessage]);

  // ==================== Render ====================
  return (
    <div
      className="h-[85vh] flex flex-col bg-white dark:bg-gray-900 shadow-2xl rounded-3xl overflow-hidden"
      role="region"
      aria-label="AI Trip Planning Chat"
    >
      {messages.length === 0 ? (
        // ========== Empty State ==========
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto overflow-x-hidden">
          <EmptyState onSelectOption={handleOptionSelect} />
        </div>
      ) : (
        <>
          {/* ========== Error Banner ========== */}
          {error && (
            <div
              className="mx-4 mt-4 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg text-red-700 dark:text-red-300 text-xs sm:text-sm shadow-sm flex-shrink-0"
              role="alert"
            >
              <strong className="font-semibold">Error: </strong>
              {error}
            </div>
          )}

          {/* ========== Messages Area ========== */}
          <section
            className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth space-y-4"
            aria-live="polite"
            aria-atomic="false"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-md md:max-w-lg px-3 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-sm sm:text-base shadow-md transition-all duration-200 ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-br-sm"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-sm"
                  }`}
                >
                  <div className="leading-relaxed break-words">
                    {msg.content}
                  </div>
                  {msg.role === "assistant" && renderGenerativeUi(msg.ui)}
                </div>
              </div>
            ))}

            {/* ========== Loading Indicator with Spinner ========== */}
            {loading && (
              <div
                className="flex justify-start"
                role="status"
                aria-label="AI is thinking"
              >
                <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-5 py-3 rounded-2xl rounded-bl-sm shadow-md">
                  <Spinner /> 
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </section>
        </>
      )}

      {/* ========== Input Section ========== */}
      <section className="flex-shrink-0 p-3 sm:p-4 bg-white dark:bg-gray-900">
        <div className="relative flex items-end gap-2 w-full">
          <div className="flex-1 relative bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-200 focus-within:border-primary dark:focus-within:border-primary focus-within:shadow-xl">
            <Textarea
              ref={textareaRef}
              placeholder="Start Conversation with AI To 'Create New Trip'"
              className="w-full min-h-[56px] sm:min-h-[60px] max-h-[180px] bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none resize-none text-sm sm:text-base py-3 sm:py-4 px-4 sm:px-5 pr-14 sm:pr-16 placeholder:text-gray-400 dark:placeholder:text-gray-500 leading-relaxed overflow-y-auto text-foreground"
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              value={userInput}
              disabled={loading}
              aria-label="Message input"
              rows={1}
            />
            <Button
              size="icon"
              className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-purple-500 hover:bg-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              onClick={handleSend}
              disabled={loading || !userInput.trim()}
              aria-label="Send message"
            >
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChatBox;