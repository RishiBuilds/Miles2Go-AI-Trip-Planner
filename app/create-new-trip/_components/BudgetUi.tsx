import React, { useState } from 'react';

// Types
type BudgetOption = {
  id: number;
  title: string;
  desc: string;
  icon: string;
  color: string;
};

type BudgetUiProps = {
  onSelectedOption: (value: string) => void;
  selectedValue?: string; // Optional: for pre-selection
};

export const SelectBudgetOptions: BudgetOption[] = [
  {
    id: 1,
    title: "Budget-Friendly",
    desc: "Affordable stays and experiences without breaking the bank.",
    icon: "💸",
    color: "bg-green-100 text-green-600",
  },
  {
    id: 2,
    title: "Moderate",
    desc: "A balance of comfort and cost for a smooth trip.",
    icon: "💰",
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    id: 3,
    title: "Luxury",
    desc: "Premium stays and exclusive experiences, no limits.",
    icon: "👑",
    color: "bg-purple-100 text-purple-600",
  },
];

function BudgetUi({ onSelectedOption, selectedValue }: BudgetUiProps) {
  const [selected, setSelected] = useState<string | null>(selectedValue || null);

  const handleSelect = (item: BudgetOption) => {
    const value = `${item.title}:${item.desc}`;
    setSelected(value);
    onSelectedOption(value);
  };

  const isSelected = (item: BudgetOption) => {
    return selected === `${item.title}:${item.desc}`;
  };

  return (
    <div className="mt-2">
      <div 
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-stretch"
        role="radiogroup"
        aria-label="Select your budget preference"
      >
        {SelectBudgetOptions.map((item) => {
          const selected = isSelected(item);
          
          return (
            <div
              key={item.id}
              role="radio"
              tabIndex={0}
              aria-checked={selected}
              aria-label={`${item.title}: ${item.desc}`}
              className={`p-4 border-2 rounded-2xl bg-white cursor-pointer flex flex-col items-center text-center transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                selected
                  ? "border-primary shadow-lg scale-105"
                  : "border-gray-200 hover:border-primary"
              }`}
              onClick={() => handleSelect(item)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSelect(item);
                }
              }}
            >
              {/* Icon with colored background */}
              <div
                className={`text-3xl sm:text-4xl p-3 sm:p-4 rounded-full transition-transform duration-200 ${
                  selected ? "scale-110" : ""
                } ${item.color}`}
                aria-hidden="true"
              >
                {item.icon}
              </div>

              {/* Title */}
              <h2 className="text-base sm:text-lg font-semibold mt-3 text-gray-800">
                {item.title}
              </h2>

              {/* Description */}
              <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">
                {item.desc}
              </p>

              {/* Selected indicator */}
              {selected && (
                <div className="mt-2 flex items-center gap-1 text-primary text-xs font-medium">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Selected</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BudgetUi;