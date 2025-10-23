import { Button } from "@/components/ui/button";
import { Globe2, Check, Loader2 } from "lucide-react";

type FinalUiProps = {
  viewTrip: () => void;
  disable: boolean;
  isPlanning?: boolean; // To show different states
};

function FinalUi({ viewTrip, disable, isPlanning = true }: FinalUiProps) {
  return (
    <div 
      className="flex flex-col items-center justify-center mt-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100"
      role="status"
      aria-live="polite"
      aria-busy={disable}
    >
      {/* Icon with conditional animation */}
      <div className="relative">
        {disable ? (
          <Loader2 
            size={48}
            className="text-primary animate-spin" 
            aria-hidden="true"
          />
        ) : (
          <Globe2 
            size={48}
            className="text-primary" 
            aria-hidden="true"
          />
        )}
      </div>

      {/* Status Text */}
      <h2 className="mt-4 text-lg font-semibold text-primary">
        {disable ? (
          <>✈️ Planning your dream trip</>
        ) : (
          <>✨ Your trip is ready!</>
        )}
      </h2>

      <p className="text-gray-500 text-sm text-center max-w-sm mt-2">
        {disable ? (
          "Gathering best destinations, activities, and travel details for you."
        ) : (
          "Your personalized itinerary is prepared. Click below to explore your adventure!"
        )}
      </p>

      {/* Action Button */}
      <Button 
        disabled={disable} 
        onClick={viewTrip} 
        className="mt-4 w-full max-w-xs transition-all duration-200 disabled:opacity-60"
        aria-label={disable ? "Trip planning in progress" : "View your trip details"}
      >
        {disable ? (
          <>
            <Loader2 size={16} className="mr-2 animate-spin" />
            Planning...
          </>
        ) : (
          <>
            <Check size={16} className="mr-2" />
            View My Trip
          </>
        )}
      </Button>
    </div>
  );
}

export default FinalUi;