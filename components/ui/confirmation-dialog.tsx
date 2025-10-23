"use client";

import { useState } from "react";
import { Button } from "./button";
import { X, Check, Heart } from "lucide-react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  destination: {
    name: string;
    country: string;
    image: string;
    description: string;
  };
  isLoading?: boolean;
}

export const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  destination,
  isLoading = false,
}: ConfirmationDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-md w-full shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="relative">
          <img
            src={destination.image}
            alt={destination.name}
            className="w-full h-48 object-cover rounded-t-2xl"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 dark:bg-neutral-900/90 p-2 rounded-full hover:scale-110 transition-transform"
          >
            <X size={20} className="text-gray-900 dark:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
              <Heart className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Select Destination
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Add to your travel wishlist
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              {destination.name}
            </h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              {destination.description}
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl mb-6">
            <p className="text-blue-800 dark:text-blue-300 text-sm">
              <strong>What happens next?</strong><br />
              This destination will be added to your personal travel wishlist. You can view all your selected destinations, plan trips, and get personalized recommendations.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Selecting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Check size={16} />
                  Select Destination
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};