import { DraftPick, PickPosition } from '../types';
import { getDraftPickValue } from '../utils/valueCalculator';

interface DraftPickInputProps {
  pick: DraftPick;
  onUpdate: (pick: DraftPick) => void;
  onRemove: () => void;
  isSuperflex: boolean;
}

export default function DraftPickInput({ pick, onUpdate, onRemove, isSuperflex }: DraftPickInputProps) {
  const handleRoundChange = (round: number) => {
    const value = getDraftPickValue(pick.year, round, pick.position, isSuperflex);
    onUpdate({ ...pick, round, value });
  };

  const handleYearChange = (year: number) => {
    const value = getDraftPickValue(year, pick.round, pick.position, isSuperflex);
    onUpdate({ ...pick, year, value });
  };

  const handlePositionChange = (position: PickPosition) => {
    const value = getDraftPickValue(pick.year, pick.round, position, isSuperflex);
    onUpdate({ ...pick, position, value });
  };

  const years = [2026, 2027, 2028, 2029];

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year
          </label>
          <select
            value={pick.year}
            onChange={(e) => handleYearChange(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Round
          </label>
          <select
            value={pick.round}
            onChange={(e) => handleRoundChange(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={1}>1st</option>
            <option value={2}>2nd</option>
            <option value={3}>3rd</option>
            <option value={4}>4th</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Position
          </label>
          <select
            value={pick.position}
            onChange={(e) => handlePositionChange(e.target.value as PickPosition)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Early">Early</option>
            <option value="Mid">Mid</option>
            <option value="Late">Late</option>
          </select>
        </div>
      </div>

      <div className="mt-2 flex justify-between items-center">
        <span className="text-sm text-gray-600">
          Value: <span className="font-semibold">{pick.value}</span>
        </span>
        <button
          onClick={onRemove}
          className="text-red-600 hover:text-red-800 text-sm font-medium"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
