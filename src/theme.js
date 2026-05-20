export const PALETTES = [
  ['#0066FF', '#00C853', '#FFB300'],
  ['#1B4ED8', '#10B981', '#F59E0B'],
  ['#5B5BF1', '#22C55E', '#FB923C'],
  ['#0B7285', '#A3E635', '#FFC93C'],
];

function shade(hex, pct) {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, (n >> 16) + pct));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + pct));
  const b = Math.max(0, Math.min(255, (n & 0xff) + pct));
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

export function makeTheme({ palette = PALETTES[0], dark = false }) {
  const [blue, green, yellow] = palette;
  const light = !dark;
  return {
    blue, green, yellow,
    bg:         light ? '#F4F6FA' : '#0B0E14',
    surface:    light ? '#FFFFFF' : '#161A23',
    sunken:     light ? '#EEF1F6' : '#1F2430',
    text:       light ? '#0F172A' : '#F1F5F9',
    textMuted:  light ? '#64748B' : '#94A3B8',
    track:      light ? '#E2E8F0' : '#2A303E',
    trackSoft:  light ? '#EEF1F6' : '#222837',
    rCard: 18, rBtn: 14, rBtnSm: 10, rInput: 14, cardPad: 16,
    inputBg:      light ? '#F8FAFC' : '#1F2430',
    inputBorder:  light ? '#CBD5E1' : 'rgba(255,255,255,0.12)',
    btnPrimaryBg: blue,
    btnPrimaryFg: '#FFFFFF',
    btnSecBg:     light ? '#F1F4F9' : '#1F2430',
    btnSecFg:     light ? '#0F172A' : '#F1F5F9',
    heroBg:       [blue, shade(blue, -18)],
    heroFg:       '#FFFFFF',
    heroBlob:     shade(green, 8),
    heroBtnBg:    'rgba(255,255,255,0.18)',
    heroBtnFg:    '#FFFFFF',
    navBg:        light ? 'rgba(255,255,255,0.97)' : 'rgba(11,14,20,0.97)',
    navBorder:    light ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.08)',
    splashBg1:    light ? '#E0F2FE' : '#0B1726',
    splashBg2:    light ? '#F0F9FF' : '#0B0E14',
    splashChip:   light ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.1)',
    splashLogoBg: light ? '#FFFFFF' : '#1F2430',
    cardShadow: light
      ? { shadowColor: '#0F172A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }
      : { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.4, shadowRadius: 4, elevation: 2 },
  };
}
