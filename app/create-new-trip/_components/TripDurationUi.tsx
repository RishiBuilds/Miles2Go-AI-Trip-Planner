import React from "react";

export const TripDurationOptions = [
  { id: 1, title: "Weekend", desc: "2-3 days for a quick escape", icon: "⏳" },
  { id: 2, title: "Short", desc: "4-6 days to see the highlights", icon: "📅" },
  { id: 3, title: "Standard", desc: "7-10 days for a balanced trip", icon: "🗓️" },
  { id: 4, title: "Extended", desc: "10+ days to explore in-depth", icon: "🌍" },
];

interface TripDurationUiProps {
  onSelectedOption: (value: string) => void;
}

function TripDurationUi({ onSelectedOption }: TripDurationUiProps) {
  const [selectedId, setSelectedId] = React.useState<number | null>(null);

  const handleSelect = (item: typeof TripDurationOptions[0]) => {
    setSelectedId(item.id);
    onSelectedOption(`${item.title}:${item.desc}`);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center mt-4">
      {TripDurationOptions.map((item) => (
        <div
          key={item.id}
          className={`p-4 border-2 rounded-2xl bg-white cursor-pointer flex flex-col items-center text-center transition-all duration-200 hover:shadow-lg ${
            selectedId === item.id
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
          aria-pressed={selectedId === item.id}
        >
          <div className="text-4xl mb-2">{item.icon}</div>
          <h2 className="text-lg font-semibold mb-1">{item.title}</h2>
          <p className="text-sm text-gray-600">{item.desc}</p>
        </div>
      ))}
    </div>
  );
}

export default TripDurationUi;