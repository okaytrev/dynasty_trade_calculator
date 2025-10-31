import { useState, useEffect } from 'react';
import {
  TradeAsset,
  Player,
  DraftPick,
  LeagueSettings as LeagueSettingsType,
  PlayerLookup,
  TradeResult,
} from './types';
import LeagueSettings from './components/LeagueSettings';
import TeamColumn from './components/TeamColumn';
import TradeResults from './components/TradeResults';
import { fetchDynastyProcessCSV } from './utils/csvParser';
import { fetchFantasyCalcValues } from './utils/apiClient';
import { createPlayerLookup, getDraftPickValue, setPickValuesFromCSV } from './utils/valueCalculator';
import { calculateTrade } from './utils/tradeCalculator';
import { encodeTradeToURL, decodeTradeFromURL, copyToClipboard } from './utils/urlSharing';

const DYNASTY_PROCESS_CSV_URL =
  'https://raw.githubusercontent.com/dynastyprocess/data/master/files/values.csv';

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerLookup, setPlayerLookup] = useState<PlayerLookup>({});
  const [leagueSettings, setLeagueSettings] = useState<LeagueSettingsType>({
    superflex: false,
    tePremium: false,
  });
  const [teamAAssets, setTeamAAssets] = useState<TradeAsset[]>([]);
  const [teamBAssets, setTeamBAssets] = useState<TradeAsset[]>([]);
  const [tradeResult, setTradeResult] = useState<TradeResult | null>(null);
  const [shareMessage, setShareMessage] = useState<string>('');
  const [rawDynastyPlayers, setRawDynastyPlayers] = useState<any[]>([]);

  useEffect(() => {
    loadPlayerData();
    loadTradeFromURL();
  }, []);

  // Recalculate values when league settings change
  useEffect(() => {
    if (rawDynastyPlayers.length > 0) {
      console.log('Recalculating values - Superflex:', leagueSettings.superflex, 'TE Premium:', leagueSettings.tePremium);
      const lookup = createPlayerLookup(rawDynastyPlayers, [], leagueSettings.superflex, leagueSettings.tePremium);
      setPlayerLookup(lookup);

      // Update all existing player and pick values
      setTeamAAssets(assets => assets.map(asset => {
        if ('round' in asset) {
          // It's a draft pick
          const pick = asset as DraftPick;
          const newValue = getDraftPickValue(pick.year, pick.round, pick.position, leagueSettings.superflex);
          return { ...pick, value: newValue };
        } else {
          // It's a player
          const playerData = lookup[asset.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ')];
          return { ...asset, value: playerData?.merged || asset.value };
        }
      }));

      setTeamBAssets(assets => assets.map(asset => {
        if ('round' in asset) {
          // It's a draft pick
          const pick = asset as DraftPick;
          const newValue = getDraftPickValue(pick.year, pick.round, pick.position, leagueSettings.superflex);
          return { ...pick, value: newValue };
        } else {
          // It's a player
          const playerData = lookup[asset.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ')];
          return { ...asset, value: playerData?.merged || asset.value };
        }
      }));
    }
  }, [leagueSettings.superflex, leagueSettings.tePremium]);

  function loadTradeFromURL() {
    const savedTrade = decodeTradeFromURL();
    if (savedTrade) {
      setTeamAAssets(savedTrade.teamA);
      setTeamBAssets(savedTrade.teamB);
      setLeagueSettings(savedTrade.settings);
    }
  }

  async function loadPlayerData() {
    try {
      setLoading(true);
      setError(null);

      // Only fetch Dynasty Process data for now
      const dynastyPlayers = await fetchDynastyProcessCSV(DYNASTY_PROCESS_CSV_URL);

      console.log('Dynasty Players loaded:', dynastyPlayers.length);

      // Store raw data for recalculation when settings change
      setRawDynastyPlayers(dynastyPlayers);

      // Load pick values from CSV
      setPickValuesFromCSV(dynastyPlayers);

      const lookup = createPlayerLookup(dynastyPlayers, [], leagueSettings.superflex, leagueSettings.tePremium);
      setPlayerLookup(lookup);

      if (Object.keys(lookup).length === 0) {
        setError('Warning: No player data loaded. Using fallback values.');
        setPlayerLookup(getFallbackPlayerLookup());
      } else {
        console.log('Player lookup created with', Object.keys(lookup).length, 'players');
      }
    } catch (err) {
      setError('Warning: Could not load live data. Using fallback values.');
      console.error('Error loading player data:', err);
      setPlayerLookup(getFallbackPlayerLookup());
    } finally {
      setLoading(false);
    }
  }

  function getFallbackPlayerLookup(): PlayerLookup {
    // Sample fallback data for testing
    const fallbackPlayers = [
      { name: "Josh Allen", value: 9500, position: "QB", age: 28 },
      { name: "Patrick Mahomes", value: 9200, position: "QB", age: 29 },
      { name: "Lamar Jackson", value: 8800, position: "QB", age: 27 },
      { name: "Christian McCaffrey", value: 8500, position: "RB", age: 28 },
      { name: "Breece Hall", value: 8200, position: "RB", age: 23 },
      { name: "Bijan Robinson", value: 8000, position: "RB", age: 22 },
      { name: "Justin Jefferson", value: 9000, position: "WR", age: 25 },
      { name: "Ja'Marr Chase", value: 8700, position: "WR", age: 24 },
      { name: "CeeDee Lamb", value: 8500, position: "WR", age: 25 },
      { name: "Amon-Ra St. Brown", value: 7800, position: "WR", age: 25 },
      { name: "Travis Kelce", value: 6500, position: "TE", age: 35 },
      { name: "Sam LaPorta", value: 5800, position: "TE", age: 23 },
    ];

    const lookup: PlayerLookup = {};
    fallbackPlayers.forEach(p => {
      const normalized = p.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ');
      lookup[normalized] = {
        originalName: p.name,
        position: p.position,
        age: p.age,
        merged: p.value,
        fantasyCalc: p.value,
      };
    });
    return lookup;
  }

  function createNewPlayer(): Player {
    return {
      id: `player-${Date.now()}-${Math.random()}`,
      name: '',
      position: 'RB',
      value: 5,
    };
  }

  function createNewPick(): DraftPick {
    return {
      id: `pick-${Date.now()}-${Math.random()}`,
      round: 1,
      year: 2026,
      position: 'Mid',
      value: getDraftPickValue(2026, 1, 'Mid', leagueSettings.superflex),
    };
  }

  function handleAddPlayerA() {
    setTeamAAssets([...teamAAssets, createNewPlayer()]);
  }

  function handleAddPickA() {
    setTeamAAssets([...teamAAssets, createNewPick()]);
  }

  function handleUpdateAssetA(index: number, asset: TradeAsset) {
    const newAssets = [...teamAAssets];
    newAssets[index] = asset;
    setTeamAAssets(newAssets);
  }

  function handleRemoveAssetA(index: number) {
    setTeamAAssets(teamAAssets.filter((_, i) => i !== index));
  }

  function handleAddPlayerB() {
    setTeamBAssets([...teamBAssets, createNewPlayer()]);
  }

  function handleAddPickB() {
    setTeamBAssets([...teamBAssets, createNewPick()]);
  }

  function handleUpdateAssetB(index: number, asset: TradeAsset) {
    const newAssets = [...teamBAssets];
    newAssets[index] = asset;
    setTeamBAssets(newAssets);
  }

  function handleRemoveAssetB(index: number) {
    setTeamBAssets(teamBAssets.filter((_, i) => i !== index));
  }

  function handleCalculateTrade() {
    const result = calculateTrade(teamAAssets, teamBAssets);
    setTradeResult(result);
  }

  async function handleShareTrade() {
    const url = encodeTradeToURL({
      teamA: teamAAssets,
      teamB: teamBAssets,
      settings: leagueSettings,
    });

    try {
      await copyToClipboard(url);
      setShareMessage('Link copied to clipboard!');
      setTimeout(() => setShareMessage(''), 3000);
    } catch (error) {
      setShareMessage('Failed to copy link');
      setTimeout(() => setShareMessage(''), 3000);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">Loading player data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            Dynasty Trade Calculator
          </h1>
          <p className="text-gray-600 text-lg">
            Analyze your fantasy football dynasty trades with live player values
          </p>
        </header>

        {error && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded">
            <p className="font-medium">Warning</p>
            <p>{error}</p>
          </div>
        )}

        <LeagueSettings settings={leagueSettings} onChange={setLeagueSettings} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <TeamColumn
            teamName="Team A"
            assets={teamAAssets}
            playerLookup={playerLookup}
            isSuperflex={leagueSettings.superflex}
            onAddPlayer={handleAddPlayerA}
            onAddPick={handleAddPickA}
            onUpdateAsset={handleUpdateAssetA}
            onRemoveAsset={handleRemoveAssetA}
          />

          <TeamColumn
            teamName="Team B"
            assets={teamBAssets}
            playerLookup={playerLookup}
            isSuperflex={leagueSettings.superflex}
            onAddPlayer={handleAddPlayerB}
            onAddPick={handleAddPickB}
            onUpdateAsset={handleUpdateAssetB}
            onRemoveAsset={handleRemoveAssetB}
          />
        </div>

        <div className="text-center mb-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleCalculateTrade}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xl py-4 px-12 rounded-lg shadow-lg transition transform hover:scale-105"
            >
              Calculate Trade
            </button>
            <button
              onClick={handleShareTrade}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition"
            >
              Share Trade
            </button>
          </div>
          {shareMessage && (
            <p className="mt-3 text-green-600 font-medium">{shareMessage}</p>
          )}
        </div>

        <TradeResults result={tradeResult} />

        <footer className="mt-8 text-center text-gray-600 text-sm">
          <p>
            Data source: Dynasty Process
          </p>
          <p className="mt-1">
            Player values from dynastyprocess.com
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
