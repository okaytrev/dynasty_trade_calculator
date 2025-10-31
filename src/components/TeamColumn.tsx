import { TradeAsset, Player, DraftPick, PlayerLookup } from '../types';
import PlayerInput from './PlayerInput';
import DraftPickInput from './DraftPickInput';

interface TeamColumnProps {
  teamName: string;
  assets: TradeAsset[];
  playerLookup: PlayerLookup;
  isSuperflex: boolean;
  onAddPlayer: () => void;
  onAddPick: () => void;
  onUpdateAsset: (index: number, asset: TradeAsset) => void;
  onRemoveAsset: (index: number) => void;
}

export default function TeamColumn({
  teamName,
  assets,
  playerLookup,
  isSuperflex,
  onAddPlayer,
  onAddPick,
  onUpdateAsset,
  onRemoveAsset,
}: TeamColumnProps) {
  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{teamName}</h2>

      <div className="mb-4">
        {assets.map((asset, index) => {
          if ('round' in asset) {
            // It's a draft pick
            return (
              <DraftPickInput
                key={asset.id}
                pick={asset as DraftPick}
                isSuperflex={isSuperflex}
                onUpdate={(updatedPick) => onUpdateAsset(index, updatedPick)}
                onRemove={() => onRemoveAsset(index)}
              />
            );
          } else {
            // It's a player
            return (
              <PlayerInput
                key={asset.id}
                player={asset as Player}
                playerLookup={playerLookup}
                onUpdate={(updatedPlayer) => onUpdateAsset(index, updatedPlayer)}
                onRemove={() => onRemoveAsset(index)}
              />
            );
          }
        })}
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={onAddPlayer}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition"
        >
          + Add Player
        </button>
        <button
          onClick={onAddPick}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition"
        >
          + Add Pick
        </button>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-700">Total Value:</span>
          <span className="text-2xl font-bold text-blue-600">{totalValue}</span>
        </div>
      </div>
    </div>
  );
}
