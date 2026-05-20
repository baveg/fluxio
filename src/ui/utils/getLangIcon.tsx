import type { Dictionary } from '../../types/Dictionary';
import type { Comp } from '.';

export interface FlagSVGProps {
  class?: string;
  iso: string; // ISO codes: fr, en, de, es, it, nl
  title?: string;
  size?: string | number;
}

// SVG flags for the 6 required languages
export const FLAGS: Dictionary<Comp> = {
  '': (
    <svg viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="900" height="600" fill="#000000" />
    </svg>
  ),
  fr: (
    <svg viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="600" fill="#002654" />
      <rect x="300" width="300" height="600" fill="#ffffff" />
      <rect x="600" width="300" height="600" fill="#ce1126" />
    </svg>
  ),
  en: (
    <svg viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="900" height="600" fill="#012169" />
      <path d="M0,0 L900,600 M900,0 L0,600" stroke="#ffffff" strokeWidth="80" />
      <path d="M0,0 L900,600 M900,0 L0,600" stroke="#c8102e" strokeWidth="48" />
      <path d="M450,0 V600 M0,300 H900" stroke="#ffffff" strokeWidth="100" />
      <path d="M450,0 V600 M0,300 H900" stroke="#c8102e" strokeWidth="60" />
    </svg>
  ),
  de: (
    <svg viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="900" height="200" fill="#000000" />
      <rect y="200" width="900" height="200" fill="#dd0000" />
      <rect y="400" width="900" height="200" fill="#ffce00" />
    </svg>
  ),
  es: (
    <svg viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="900" height="600" fill="#aa151b" />
      <rect y="150" width="900" height="300" fill="#f1bf00" />
    </svg>
  ),
  it: (
    <svg viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="600" fill="#009246" />
      <rect x="300" width="300" height="600" fill="#ffffff" />
      <rect x="600" width="300" height="600" fill="#ce2b37" />
    </svg>
  ),
  nl: (
    <svg viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="900" height="200" fill="#ae1c28" />
      <rect y="200" width="900" height="200" fill="#ffffff" />
      <rect y="400" width="900" height="200" fill="#21468b" />
    </svg>
  ),
};

export const LANGS: Dictionary<string> = {
  '': 'Auto',
  fr: 'Français',
  en: 'English',
  de: 'Deutsch',
  es: 'Español',
  it: 'Italiano',
  nl: 'Nederlands',
};

// Mapping for alternative codes
export const ISO_MAPPING: Dictionary<string> = {
  gb: 'en', // Great Britain -> English flag
  uk: 'en', // United Kingdom -> English flag
};

export const getLangIso = (iso?: string) => {
  const lower = iso?.toLowerCase() || '';
  const mapped = ISO_MAPPING[lower] || lower;
  return mapped in FLAGS ? mapped : '';
};

export const getLangIcon = (iso?: string) => FLAGS[getLangIso(iso)] || FLAGS[''];

export const getLangTitle = (iso?: string) => LANGS[getLangIso(iso)] || LANGS[''];

export const LANG_ENTRIES = Object.entries(LANGS).map(([iso, title]) => ({
  iso,
  icon: getLangIcon(iso),
  title,
}));
