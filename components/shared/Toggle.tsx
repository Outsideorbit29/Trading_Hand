import React from 'react';

interface ToggleProps<T extends string> {
  options: { value: T; label: string }[];
  selectedValue: T;
  onSelect: (value: T) => void;
}

// FIX: Removed trailing comma from <T extends string,> to fix type inference.
const Toggle = <T extends string>({ options, selectedValue, onSelect }: ToggleProps<T>) => {
  return (
    <div className="flex bg-gray-700 rounded-lg p-1 space-x-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option.value)}
          className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-300 focus:outline-none ${
            selectedValue === option.value
              ? 'bg-cyan-500 text-white shadow'
              : 'text-gray-300 hover:bg-gray-600'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default Toggle;