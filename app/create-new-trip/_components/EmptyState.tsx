import { suggestions } from '@/app/_components/Hero';
import React from 'react';

type Suggestion = {
  id?: number | string;
  title: string;
  icon: React.ReactNode;
  description?: string;
};

type EmptyStateProps = {
  onSelectOption: (option: string) => void;
  title?: string;
  subtitle?: string;
};

const EmptyState: React.FC<EmptyStateProps> = ({
  onSelectOption,
  title = "Start Planning Your Next Adventure with AI",
  subtitle = "Discover hidden gems, top stays, and unique experiences — all tailored to your budget with the power of AI.",
}) => {
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    suggestion: string
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelectOption(suggestion);
    }
  };

  return (
    <div 
      className="mt-8 sm:mt-10 px-4 sm:px-6 lg:px-8 w-full max-w-full flex flex-col"
      role="region"
      aria-label="Trip planning suggestions"
    >
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="font-bold text-xl sm:text-2xl lg:text-3xl leading-snug">
          {title.split('Adventure with AI')[0]}
          <strong className="text-primary">Adventure with AI</strong>
        </h2>

        <p className="mt-3 text-gray-600 text-sm sm:text-base leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Suggestion Chips */}
      <div 
        className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-6 sm:mt-8 w-full"
        role="group"
        aria-label="Quick trip suggestions"
      >
        {suggestions.map((suggestion, index) => {
          // Use id if available, fallback to index
          const key = (suggestion as any).id || `suggestion-${index}`;
          
          return (
            <div
              key={key}
              role="button"
              tabIndex={0}
              aria-label={`Plan a trip: ${suggestion.title}`}
              onClick={() => onSelectOption(suggestion.title)}
              onKeyDown={(e) => handleKeyDown(e, suggestion.title)}
              className="group flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm cursor-pointer 
                hover:border-primary hover:bg-primary/5 hover:shadow-sm
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                active:scale-95
                transition-all duration-200"
            >
              <span 
                className="text-lg group-hover:scale-110 transition-transform duration-200" 
                aria-hidden="true"
              >
                {suggestion.icon}
              </span>
              <span className="font-medium text-gray-700 group-hover:text-primary transition-colors">
                {suggestion.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmptyState;