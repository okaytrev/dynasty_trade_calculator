export type Position = 'QB' | 'RB' | 'WR' | 'TE' | 'PICK';

export interface Player {
  id: string;
  name: string;
  position: Position;
  age?: number;
  value: number;
}

export type PickPosition = 'Early' | 'Mid' | 'Late';

export interface DraftPick {
  id: string;
  round: number;
  year: number;
  position: PickPosition;
  value: number;
}

export type TradeAsset = Player | DraftPick;

export interface LeagueSettings {
  superflex: boolean;
  tePremium: boolean;
}

export interface Team {
  name: string;
  assets: TradeAsset[];
}

export interface TradeResult {
  teamAValue: number;
  teamBValue: number;
  difference: number;
  fairnessPercentage: number;
  winner: 'A' | 'B' | 'Fair';
  message: string;
}

export interface DynastyProcessPlayer {
  player_id?: string;
  player_name: string;
  position: string;
  age?: string;
  value_1qb?: string;
  value_2qb?: string;
}

export interface FantasyCalcPlayer {
  name: string;
  position: string;
  team?: string;
  value: number;
}

export interface PlayerValueData {
  originalName: string;
  position?: string;
  age?: number;
  value1QB?: number;
  value2QB?: number;
  fantasyCalc?: number;
  merged: number;
}

export interface PlayerLookup {
  [normalizedName: string]: PlayerValueData;
}

export function isDraftPick(asset: TradeAsset): asset is DraftPick {
  return 'round' in asset && 'year' in asset;
}

export function isPlayer(asset: TradeAsset): asset is Player {
  return 'position' in asset && !isDraftPick(asset);
}
