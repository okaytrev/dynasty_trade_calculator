import { FantasyCalcPlayer } from '../types';

export async function fetchFantasyCalcValues(): Promise<FantasyCalcPlayer[]> {
  try {
    const response = await fetch(
      'https://api.fantasycalc.com/values/current?isDynasty=true&numQbs=1&numTeams=12&ppr=1'
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch FantasyCalc API: ${response.statusText}`);
    }

    const data = await response.json();

    // The API might return data in different formats, handle both
    if (Array.isArray(data)) {
      return data;
    } else if (data.players && Array.isArray(data.players)) {
      return data.players;
    } else if (data.data && Array.isArray(data.data)) {
      return data.data;
    }

    console.warn('Unexpected API response format:', data);
    return [];
  } catch (error) {
    console.error('Error fetching FantasyCalc values:', error);
    return [];
  }
}
