import { DynastyProcessPlayer } from '../types';

export async function fetchDynastyProcessCSV(url: string): Promise<DynastyProcessPlayer[]> {
  try {
    console.log('Fetching CSV from:', url);
    const response = await fetch(url);
    console.log('CSV fetch response status:', response.status);
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }
    const text = await response.text();
    console.log('CSV text length:', text.length);
    const players = parseCSV(text);
    console.log('Parsed players:', players.length);
    if (players.length > 0) {
      console.log('Sample player:', players[0]);
    }
    return players;
  } catch (error) {
    console.error('Error fetching Dynasty Process CSV:', error);
    return [];
  }
}

export function parseCSV(csvText: string): DynastyProcessPlayer[] {
  const lines = csvText.trim().split('\n');
  console.log('CSV lines:', lines.length);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  console.log('CSV headers:', headers);
  const players: DynastyProcessPlayer[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0) continue;

    const player: DynastyProcessPlayer = {
      player_name: '',
      position: '',
    };

    headers.forEach((header, index) => {
      const key = header.toLowerCase().replace(/\s+/g, '_');
      if (key.includes('name') || key === 'player') {
        player.player_name = values[index] || '';
      } else if (key === 'position' || key === 'pos') {
        player.position = values[index] || '';
      } else if (key === 'age') {
        player.age = values[index];
      } else if (key === 'value_1qb') {
        player.value_1qb = values[index];
      } else if (key === 'value_2qb') {
        player.value_2qb = values[index];
      } else if (key.includes('id')) {
        player.player_id = values[index];
      }
    });

    if (i === 1) {
      console.log('First row values:', values);
      console.log('First player parsed:', player);
    }

    if (player.player_name && player.position) {
      players.push(player);
    } else if (i < 5) {
      console.log(`Row ${i} skipped - name: "${player.player_name}", pos: "${player.position}"`);
    }
  }

  console.log('Total players parsed:', players.length);
  return players;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}
