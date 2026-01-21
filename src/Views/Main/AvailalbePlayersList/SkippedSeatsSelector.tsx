import React from 'react';

interface SkippedSeatsSelectorProps {
  skippedSeats: number[];
  nextSeatNumber: number;
  selectedSeatNumber: number;
  onSeatSelect: (seatNumber: number) => void;
}

export const SkippedSeatsSelector: React.FC<SkippedSeatsSelectorProps> = ({
  skippedSeats,
  nextSeatNumber,
  selectedSeatNumber,
  onSeatSelect,
}) => {
  if (skippedSeats.length === 0) {
    return null;
  }

  const seatOptions = [...skippedSeats, nextSeatNumber];

  return (
    <div className="space-y-2 rounded-md border border-gray-200 p-3">
      <p className="text-sm font-semibold text-gray-700">Skipped seats</p>
      <div className="flex flex-wrap gap-3">
        {seatOptions.map((seatNumber) => (
          <label
            key={seatNumber}
            className="flex items-center gap-2 text-sm text-gray-700"
          >
            <input
              type="radio"
              name="seat-selection"
              value={seatNumber}
              checked={selectedSeatNumber === seatNumber}
              onChange={() => onSeatSelect(seatNumber)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            Seat {seatNumber}
          </label>
        ))}
      </div>
    </div>
  );
};
