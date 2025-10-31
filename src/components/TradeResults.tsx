import { TradeResult } from '../types';
import { getFairnessColor, getFairnessTextColor } from '../utils/tradeCalculator';

interface TradeResultsProps {
  result: TradeResult | null;
}

export default function TradeResults({ result }: TradeResultsProps) {
  if (!result) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <p className="text-gray-500 text-lg">
          Add players and picks to both teams, then click "Calculate Trade" to see results.
        </p>
      </div>
    );
  }

  const fairnessColor = getFairnessColor(result.fairnessPercentage);
  const textColor = getFairnessTextColor(result.fairnessPercentage);

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Trade Analysis</h2>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Team A Value</h3>
          <p className="text-3xl font-bold text-blue-600">{result.teamAValue}</p>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Team B Value</h3>
          <p className="text-3xl font-bold text-blue-600">{result.teamBValue}</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-semibold text-gray-700">Trade Fairness</span>
          <span className={`text-2xl font-bold ${textColor}`}>
            {result.fairnessPercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
          <div
            className={`h-full ${fairnessColor} transition-all duration-500 ease-out flex items-center justify-center`}
            style={{ width: `${result.fairnessPercentage}%` }}
          >
            <span className="text-white text-sm font-semibold">
              {result.fairnessPercentage}%
            </span>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className={`text-xl font-semibold ${textColor}`}>{result.message}</p>
        {result.winner !== 'Fair' && (
          <p className="text-gray-600 mt-2">
            Difference: {Math.abs(result.difference)} points
          </p>
        )}
      </div>

      <div className="mt-6 pt-6 border-t">
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>90%+ Fair</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>70-90% Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>&lt;70% Unfair</span>
          </div>
        </div>
      </div>
    </div>
  );
}
