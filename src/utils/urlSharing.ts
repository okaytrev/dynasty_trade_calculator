import { TradeAsset, LeagueSettings } from '../types';

interface TradeState {
  teamA: TradeAsset[];
  teamB: TradeAsset[];
  settings: LeagueSettings;
}

export function encodeTradeToURL(state: TradeState): string {
  try {
    const data = JSON.stringify(state);
    const encoded = btoa(data);
    const url = new URL(window.location.href);
    url.searchParams.set('trade', encoded);
    return url.toString();
  } catch (error) {
    console.error('Error encoding trade to URL:', error);
    return window.location.href;
  }
}

export function decodeTradeFromURL(): TradeState | null {
  try {
    const url = new URL(window.location.href);
    const encoded = url.searchParams.get('trade');

    if (!encoded) {
      return null;
    }

    const data = atob(encoded);
    const state: TradeState = JSON.parse(data);

    return state;
  } catch (error) {
    console.error('Error decoding trade from URL:', error);
    return null;
  }
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }

  // Fallback for older browsers
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  return new Promise((resolve, reject) => {
    try {
      document.execCommand('copy');
      textArea.remove();
      resolve();
    } catch (error) {
      textArea.remove();
      reject(error);
    }
  });
}
