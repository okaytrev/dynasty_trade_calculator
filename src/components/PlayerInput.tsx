import { useState } from 'react';
import { Player, Position, PlayerLookup } from '../types';
import { getPlayerValue, normalizePlayerName } from '../utils/valueCalculator';

interface PlayerInputProps {
  player: Player;
  playerLookup: PlayerLookup;
  onUpdate: (player: Player) => void;
  onRemove: () => void;
}

export default function PlayerInput({
  player,
  playerLookup,
  onUpdate,
  onRemove,
}: PlayerInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{ normalized: string; original: string }>>([]);

  const handleNameChange = (value: string) => {
    onUpdate({ ...player, name: value });

    if (value.length > 0) {
      const normalizedInput = normalizePlayerName(value);

      // Search through all players and match against normalized names
      // Split input into words to handle partial matches better (e.g., "Njigba" matches "Smith-Njigba")
      const inputWords = normalizedInput.split(/\s+/).filter(w => w.length > 0);

      const matches = Object.entries(playerLookup)
        .filter(([normalizedName, data]) => {
          // Match if any input word is found in the player name
          return inputWords.some(word => normalizedName.includes(word));
        })
        .map(([normalizedName, data]) => ({
          normalized: normalizedName,
          original: data.originalName
        }))
        .slice(0, 10);

      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectPlayer = (normalizedName: string, originalName: string) => {
    const playerData = playerLookup[normalizedName];
    const value = playerData?.merged || 5;

    // Map position to our Position type, default to RB if not found
    let position: Position = 'RB';
    if (playerData?.position) {
      const pos = playerData.position.toUpperCase();
      if (pos === 'QB' || pos === 'RB' || pos === 'WR' || pos === 'TE') {
        position = pos as Position;
      }
    }

    onUpdate({
      ...player,
      name: originalName,
      position: position,
      age: playerData?.age,
      value,
    });
    setShowSuggestions(false);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-3 relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Player Name
          </label>
          <input
            type="text"
            value={player.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Enter player name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {showSuggestions && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.normalized}
                  className="w-full px-3 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
                  onClick={() => handleSelectPlayer(suggestion.normalized, suggestion.original)}
                >
                  {suggestion.original}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Position
          </label>
          <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
            {player.position}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Age
          </label>
          <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
            {player.age || '-'}
          </div>
        </div>
      </div>

      <div className="mt-2 flex justify-between items-center">
        <span className="text-sm text-gray-600">
          Value: <span className="font-semibold">{player.value}</span>
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
