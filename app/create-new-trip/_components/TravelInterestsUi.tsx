import React from "react";

export const TravelInterestsOptions = [
  { id: 1, title: "Adventure", icon: "🧗", desc: "Thrilling outdoor activities" },
  { id: 2, title: "Culture", icon: "🏛️", desc: "Museums, history & traditions" },
  { id: 3, title: "Food", icon: "🍜", desc: "Local flavors & culinary tours" },
  { id: 4, title: "Nightlife", icon: "🎶", desc: "Bars, clubs & late-night fun" },
  { id: 5, title: "Relaxation", icon: "🌴", desc: "Beaches, spas & downtime" },
  { id: 6, title: "Hidden Gems", icon: "🔎", desc: "Unique offbeat experiences" },
];

interface TravelInterestsUiProps {
  onSelectedOption: (value: string) => void;
  multiSelect?: boolean;
}

function TravelInterestsUi({ onSelectedOption, multiSelect = true }: TravelInterestsUiProps) {
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);

  const handleSelect = (item: typeof TravelInterestsOptions[0]) => {
    let newSelectedIds: number[];

    if (multiSelect) {
      // Toggle selection for multi-select
      if (selectedIds.includes(item.id)) {
        newSelectedIds = selectedIds.filter(id => id !== item.id);
      } else {
        newSelectedIds = [...selectedIds, item.id];
      }
    } else {
      // Single selection only
      newSelectedIds = [item.id];
    }

    setSelectedIds(newSelectedIds);

    // Get all selected items and format them
    const selectedItems = TravelInterestsOptions.filter(opt => 
      newSelectedIds.includes(opt.id)
    );
    const formattedValue = selectedItems
      .map(opt => `${opt.title}:${opt.desc}`)
      .join(";");
    
    onSelectedOption(formattedValue);
  };

  const isSelected = (id: number) => selectedIds.includes(id);

  return (
    <div>
      {multiSelect && (
        <p className="text-sm text-gray-600 mb-3">
          Select one or more interests
        </p>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-center mt-1">
        {TravelInterestsOptions.map((item) => (
          <div
            key={item.id}
            className={`p-4 border-2 rounded-2xl bg-white cursor-pointer flex flex-col items-center text-center transition-all duration-200 hover:shadow-lg ${
              isSelected(item.id)
                ? "border-blue-500 bg-blue-50 shadow-md"
                : "border-gray-200 hover:border-blue-300"
            }`}
            onClick={() => handleSelect(item)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleSelect(item);
              }
            }}
            aria-pressed={isSelected(item.id)}
          >
            <div className="text-4xl mb-2">{item.icon}</div>
            <h2 className="text-lg font-semibold mb-1">{item.title}</h2>
            <p className="text-sm text-gray-600">{item.desc}</p>
            {multiSelect && isSelected(item.id) && (
              <div className="mt-2 text-blue-500 text-xl">✓</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TravelInterestsUi;