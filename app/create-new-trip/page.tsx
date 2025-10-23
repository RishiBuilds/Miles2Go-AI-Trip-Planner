"use client";
import React, { useState } from "react";
import ChatBox from "./_components/ChatBox";
import Iternerary from "./_components/Itinerary";
import GlobalMap from "./_components/GlobalMap";
import { Button } from "@/components/ui/button";
import { Globe2, Plane } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CreateNewTrip = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-5 p-4 sm:p-6 lg:p-10">
      {/* Chatbox (left side) */}
      <div className="col-span-1 md:col-span-2 order-1">
        <ChatBox />
      </div>

      {/* Map / Itinerary (right side) */}
      <div className="col-span-1 md:col-span-3 order-2 relative">
        {activeIndex === 0 ? (
          <Iternerary />
        ) : (
          <GlobalMap autoRotate autoRotateSpeed={0.6} />
        )}

        {/* Toggle Button - Opposite styles for each icon */}
        <div
          className="absolute left-1/2 transform -translate-x-1/2 
                bottom-6 sm:bottom-10 md:bottom-12 lg:bottom-16 z-10"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setActiveIndex(activeIndex === 0 ? 1 : 0)}
                size="lg"
                style={
                  activeIndex === 0
                    ? {
                        backgroundColor: '#000000',
                        borderWidth: '3px',
                        borderStyle: 'solid',
                        borderColor: '#FFFFFF',
                      }
                    : {
                        backgroundColor: '#FFFFFF',
                        borderWidth: '3px',
                        borderStyle: 'solid',
                        borderColor: '#000000',
                      }
                }
                className="rounded-full shadow-2xl transition-all duration-200 hover:scale-105 p-4"
              >
                {activeIndex === 0 ? (
                  <Plane 
                    className="h-7 w-7 stroke-[2.5]" 
                    style={{ color: '#FFFFFF', fill: 'none' }}
                  />
                ) : (
                  <Globe2 
                    className="h-7 w-7 stroke-[2.5]" 
                    style={{ color: '#000000', fill: 'none' }}
                  />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-900 text-white">
              Toggle between map and itinerary
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default CreateNewTrip;