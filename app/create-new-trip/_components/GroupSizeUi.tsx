import React, { useState } from "react";

// Types
type TravelerOption = {
  id: number;
  title: string;
  desc: string;
  icon: string;
  people: string;
};

type GroupSizeUiProps = {
  onSelectedOption: (value: string) => void;
  selectedValue?: string; // Optional: to show selected state
};

// Data
export const SelectTravelesList: TravelerOption[] = [
  {
    id: 1,
    title: "Just Me",
    desc: "Embark on a soul-refreshing solo adventure full of freedom and discovery.",
    icon: "🌍",
    people: "1 person",
  },
  {
    id: 2,
    title: "A Couple",
    desc: "A romantic getaway designed for two hearts exploring together.",
    icon: "💑",
    people: "2 people",
  },
  {
    id: 3,
    title: "Family",
    desc: "Create lasting memories with a fun-filled family vacation for all ages.",
    icon: "👨‍👩‍👧‍👦",
    people: "3 to 5 people",
  },
  {
    id: 4,
    title: "Friends",
    desc: "An exciting group trip packed with laughter, adventure, and shared stories.",
    icon: "🎉",
    people: "5 to 10 people",
  },
];

function GroupSizeUi({ onSelectedOption, selectedValue }: GroupSizeUiProps) {
  const [selected, setSelected] = useState<string | null>(selectedValue || null);

  const handleSelect = (item: TravelerOption) => {
    const value = `${item.title}:${item.people}`;
    setSelected(value);
    onSelectedOption(value);
  };

  const isSelected = (item: TravelerOption) => {
    return selected === `${item.title}:${item.people}`;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 items-center mt-1">
      {SelectTravelesList.map((item) => (
        <div
          key={item.id}
          role="button"
          tabIndex={0}
          aria-label={`Select ${item.title} - ${item.people}`}
          aria-pressed={isSelected(item)}
          className={`p-3 border rounded-2xl bg-white cursor-pointer transition-all duration-200 hover:border-primary hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
            isSelected(item)
              ? "border-primary bg-primary/5 shadow-md"
              : "border-gray-200"
          }`}
          onClick={() => handleSelect(item)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleSelect(item);
            }
          }}
        >
          <h2 className="text-3xl mb-2" aria-hidden="true">
            {item.icon}
          </h2>
          <h2 className="font-semibold text-gray-800">{item.title}</h2>
          <p className="text-xs text-gray-500 mt-1">{item.people}</p>
        </div>
      ))}
    </div>
  );
}

export default GroupSizeUi;