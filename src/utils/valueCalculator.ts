import { DynastyProcessPlayer, FantasyCalcPlayer, PlayerLookup, PlayerValueData } from '../types';

const DEFAULT_VALUE = 5;
const FANTASY_CALC_WEIGHT = 0.7;
const DYNASTY_PROCESS_WEIGHT = 0.3;

export function createPlayerLookup(
  dynastyPlayers: DynastyProcessPlayer[],
  fantasyCalcPlayers: FantasyCalcPlayer[],
  isSuperflex: boolean = false,
  isTEPremium: boolean = false
): PlayerLookup {
  const lookup: PlayerLookup = {};

  // Add Dynasty Process players
  dynastyPlayers.forEach(player => {
    const key = normalizePlayerName(player.player_name);
    const value1QB = player.value_1qb ? parseFloat(player.value_1qb) : undefined;
    const value2QB = player.value_2qb ? parseFloat(player.value_2qb) : undefined;
    const age = player.age ? parseInt(player.age) : undefined;

    if (!lookup[key]) {
      lookup[key] = {
        originalName: player.player_name,
        position: player.position,
        age: age,
        merged: 0
      };
    }
    lookup[key].value1QB = value1QB;
    lookup[key].value2QB = value2QB;
    if (player.position && !lookup[key].position) {
      lookup[key].position = player.position;
    }
    if (age && !lookup[key].age) {
      lookup[key].age = age;
    }
  });

  // Add FantasyCalc players
  fantasyCalcPlayers.forEach(player => {
    const key = normalizePlayerName(player.name);

    if (!lookup[key]) {
      lookup[key] = {
        originalName: player.name,
        position: player.position,
        merged: 0
      };
    } else if (!lookup[key].originalName) {
      lookup[key].originalName = player.name;
    }
    lookup[key].fantasyCalc = player.value;
    if (player.position && !lookup[key].position) {
      lookup[key].position = player.position;
    }
  });

  // Calculate merged values
  Object.keys(lookup).forEach(key => {
    lookup[key].merged = calculateMergedValue(lookup[key], isSuperflex, isTEPremium);
  });

  return lookup;
}

export function calculateMergedValue(
  data: PlayerValueData,
  isSuperflex: boolean = false,
  isTEPremium: boolean = false
): number {
  const dynastyValue = isSuperflex ? data.value2QB : data.value1QB;
  const { fantasyCalc, position } = data;

  let baseValue: number;

  // If both values available, use weighted average
  if (dynastyValue !== undefined && fantasyCalc !== undefined) {
    baseValue = Math.round(
      dynastyValue * DYNASTY_PROCESS_WEIGHT + fantasyCalc * FANTASY_CALC_WEIGHT
    );
  }
  // If only one value available, use it
  else if (fantasyCalc !== undefined) {
    baseValue = fantasyCalc;
  }
  else if (dynastyValue !== undefined) {
    baseValue = dynastyValue;
  }
  // If neither available, return default
  else {
    baseValue = DEFAULT_VALUE;
  }

  // Apply TE Premium multiplier if enabled and player is TE
  if (isTEPremium && position === 'TE') {
    // Tiered multiplier based on value
    // High-value TEs (50+): 1.4x
    // Mid-value TEs (20-50): 1.6x
    // Low-value TEs (<20): 2.0x
    let multiplier: number;
    if (baseValue >= 50) {
      multiplier = 1.4;
    } else if (baseValue >= 20) {
      multiplier = 1.6;
    } else {
      multiplier = 2.0;
    }
    return Math.round(baseValue * multiplier);
  }

  return baseValue;
}

export function getPlayerValue(
  playerName: string,
  lookup: PlayerLookup,
  isSuperflex: boolean = false,
  isTEPremium: boolean = false
): number {
  const key = normalizePlayerName(playerName);
  const data = lookup[key];
  if (!data) return DEFAULT_VALUE;

  // Recalculate with current settings
  return calculateMergedValue(data, isSuperflex, isTEPremium);
}

export function normalizePlayerName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/['-]/g, ' ')  // Replace hyphens and apostrophes with spaces
    .replace(/\s+/g, ' ')   // Normalize multiple spaces to single space
    .replace(/[^a-z0-9\s]/g, '');  // Remove other special characters
}

export function getAllPlayerNames(lookup: PlayerLookup): string[] {
  return Object.keys(lookup).sort();
}

// Store pick values from CSV
let pickValuesLookup: { [key: string]: { value1qb: number; value2qb: number } } = {};

export function setPickValuesFromCSV(players: any[]) {
  pickValuesLookup = {};
  players.forEach(player => {
    if (player.position === 'TE' || !player.position) return; // Skip TEs and invalid entries

    const name = player.player_name;
    if (name && name.includes('Pick') || name.includes('1st') || name.includes('2nd') || name.includes('3rd') || name.includes('4th')) {
      const value1qb = parseFloat(player.value_1qb) || 0;
      const value2qb = parseFloat(player.value_2qb) || 0;
      pickValuesLookup[name] = { value1qb, value2qb };
    }
  });
  console.log('Pick values loaded:', Object.keys(pickValuesLookup).length);
}

export function getDraftPickValue(
  year: number,
  round: number,
  position: string,
  isSuperflex: boolean = false
): number {
  // Format: "2026 Early 1st", "2027 2nd", etc.
  let key: string;

  if (year === 2026) {
    key = `${year} ${position} ${getOrdinal(round)}`;
  } else {
    // For 2027+, use generic format like "2027 1st"
    key = `${year} ${getOrdinal(round)}`;
  }

  const pickData = pickValuesLookup[key];
  if (pickData) {
    return isSuperflex ? pickData.value2qb : pickData.value1qb;
  }

  // Fallback values if not found
  return round === 1 ? 3000 : round === 2 ? 1000 : 500;
}

function getOrdinal(round: number): string {
  switch (round) {
    case 1: return '1st';
    case 2: return '2nd';
    case 3: return '3rd';
    case 4: return '4th';
    default: return `${round}th`;
  }
}
