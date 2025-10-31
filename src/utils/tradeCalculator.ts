import { TradeAsset, TradeResult } from '../types';

export function calculateTrade(
  teamAAssets: TradeAsset[],
  teamBAssets: TradeAsset[]
): TradeResult {
  const teamAValue = calculateTotalValue(teamAAssets);
  const teamBValue = calculateTotalValue(teamBAssets);
  const difference = teamAValue - teamBValue;
  const averageValue = (teamAValue + teamBValue) / 2;

  // Prevent division by zero
  const fairnessPercentage =
    averageValue === 0
      ? 100
      : Math.max(0, 100 - Math.min((Math.abs(difference) / averageValue) * 100, 100));

  let winner: 'A' | 'B' | 'Fair';
  let message: string;

  if (fairnessPercentage >= 95) {
    winner = 'Fair';
    message = 'This is a very fair trade!';
  } else if (Math.abs(difference) < averageValue * 0.05) {
    winner = 'Fair';
    message = 'Fair trade';
  } else if (difference > 0) {
    winner = 'A';
    const percentDiff = ((difference / teamBValue) * 100).toFixed(1);
    message = `Team A gains +${percentDiff}% value`;
  } else {
    winner = 'B';
    const percentDiff = ((Math.abs(difference) / teamAValue) * 100).toFixed(1);
    message = `Team B gains +${percentDiff}% value`;
  }

  return {
    teamAValue,
    teamBValue,
    difference,
    fairnessPercentage: Math.round(fairnessPercentage),
    winner,
    message,
  };
}

export function calculateTotalValue(assets: TradeAsset[]): number {
  return assets.reduce((total, asset) => total + asset.value, 0);
}

export function getFairnessColor(fairnessPercentage: number): string {
  if (fairnessPercentage >= 90) {
    return 'bg-green-500';
  } else if (fairnessPercentage >= 70) {
    return 'bg-yellow-500';
  } else {
    return 'bg-red-500';
  }
}

export function getFairnessTextColor(fairnessPercentage: number): string {
  if (fairnessPercentage >= 90) {
    return 'text-green-600';
  } else if (fairnessPercentage >= 70) {
    return 'text-yellow-600';
  } else {
    return 'text-red-600';
  }
}
