import { Dictionary } from '../../types/Dictionary';
import { Css } from '../../html/css';
import { Comp } from '../utils';

const c = Css('Flag', {
  '': {
    display: 'inline-block',
    w: 4*15,
    h: 3*15,
    borderRadius: '2px',
    overflow: 'hidden',
    verticalAlign: 'middle',
    center: 1,
  },
  ' svg': {
    wh: '100%',
  }
});

export interface FlagSVGProps {
  class?: string;
  iso: string; // ISO codes: fr, en, de, es, it
  title?: string;
  size?: string | number;
}

// SVG flags for the 5 required languages
const FLAGS: Dictionary<any> = {
  fr: (
    <svg viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="600" fill="#002654" />
      <rect x="300" width="300" height="600" fill="#ffffff" />
      <rect x="600" width="300" height="600" fill="#ce1126" />
    </svg>
  ),
  en: (
    <svg viewBox="0 0 1200 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="600" fill="#012169" />
      <path d="M0,0 L1200,600 M1200,0 L0,600" stroke="#ffffff" strokeWidth="80" />
      <path d="M0,0 L1200,600 M1200,0 L0,600" stroke="#c8102e" strokeWidth="48" />
      <path d="M600,0 V600 M0,300 H1200" stroke="#ffffff" strokeWidth="100" />
      <path d="M600,0 V600 M0,300 H1200" stroke="#c8102e" strokeWidth="60" />
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
};

// Mapping for alternative codes
const ISO_MAPPING: Dictionary<string> = {
  gb: 'en', // Great Britain -> English flag
  uk: 'en', // United Kingdom -> English flag
};

export const getFlagIso = (iso?: string) => {
  const lower = iso?.toLowerCase() || '';
  const mapped = (lower ? ISO_MAPPING[lower] : '') || lower;
  return mapped in FLAGS ? mapped : 'fr';
}

export const Flag = ({ iso, title, size, ...props }: FlagSVGProps) => {
  const normalizedIso = getFlagIso(iso);
  const flagSVG = FLAGS[normalizedIso] || FLAGS['fr'];

  return (
    <span {...c('', `-${normalizedIso}`, props)}>
      {flagSVG}
    </span>
  );
};

export const FLAG_NAMES = Object.keys(FLAGS);
export const FLAG_ITEMS: [string, Comp][] = FLAG_NAMES.map((iso) => [
  iso,
  <Flag key={iso} iso={iso} />,
]);
