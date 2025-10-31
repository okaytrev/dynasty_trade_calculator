import { LeagueSettings as LeagueSettingsType } from '../types';

interface LeagueSettingsProps {
  settings: LeagueSettingsType;
  onChange: (settings: LeagueSettingsType) => void;
}

export default function LeagueSettings({ settings, onChange }: LeagueSettingsProps) {
  const handleToggle = (key: keyof LeagueSettingsType) => {
    onChange({
      ...settings,
      [key]: !settings[key],
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">League Settings</h2>
      <div className="flex flex-wrap gap-4">
        <ToggleButton
          label="Superflex"
          checked={settings.superflex}
          onChange={() => handleToggle('superflex')}
        />
        <ToggleButton
          label="TE Premium"
          checked={settings.tePremium}
          onChange={() => handleToggle('tePremium')}
        />
      </div>
    </div>
  );
}

interface ToggleButtonProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

function ToggleButton({ label, checked, onChange }: ToggleButtonProps) {
  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={onChange}
        />
        <div
          className={`block w-14 h-8 rounded-full transition ${
            checked ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        ></div>
        <div
          className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${
            checked ? 'translate-x-6' : ''
          }`}
        ></div>
      </div>
      <div className="ml-3 text-gray-700 font-medium">{label}</div>
    </label>
  );
}
