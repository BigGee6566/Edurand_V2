import React from 'react';
import Svg, { Path, Rect, Circle, G } from 'react-native-svg';

export default function Icon({ name, size = 22, color = '#0F172A', stroke = 1.75 }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const icons = {
    logoR: <><Path d="M2 9 12 4l10 5-10 5L2 9z" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/><Path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/><Circle cx="19" cy="19" r="5" fill="#00C853" stroke="none"/><Path d="M16.8 16.5h2.4a1.2 1.2 0 0 1 0 2.4h-2.4m0-2.4v5m2.4-2.6 1.8 2.6" stroke="#fff" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round"/></>,
    home:       <><Path d="M3 11.5 12 4l9 7.5" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/><Path d="M5 10v10h14V10" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/></>,
    chart:      <><Rect x="3" y="13" width="4" height="8" rx="1" stroke={color} strokeWidth={stroke}/><Rect x="10" y="8" width="4" height="13" rx="1" stroke={color} strokeWidth={stroke}/><Rect x="17" y="4" width="4" height="17" rx="1" stroke={color} strokeWidth={stroke}/></>,
    book:       <><Path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5v-17z" stroke={color} strokeWidth={stroke}/><Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke={color} strokeWidth={stroke}/></>,
    user:       <><Circle cx="12" cy="8" r="4" stroke={color} strokeWidth={stroke}/><Path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" stroke={color} strokeWidth={stroke}/></>,
    bot:        <><Rect x="4" y="8" width="16" height="11" rx="2" stroke={color} strokeWidth={stroke}/><Path d="M12 4v4M9 13v.01M15 13v.01M9 19v2M15 19v2" stroke={color} strokeWidth={stroke}/></>,
    arrowRight: <Path d="M5 12h14M13 5l7 7-7 7" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/>,
    arrowLeft:  <Path d="M19 12H5M11 5l-7 7 7 7" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/>,
    arrowDown:  <Path d="M12 5v14M5 13l7 7 7-7" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/>,
    arrowUp:    <Path d="M12 19V5M19 11l-7-7-7 7" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/>,
    check:      <Path d="m5 12 5 5L20 7" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/>,
    plus:       <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/>,
    minus:      <Path d="M5 12h14" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/>,
    x:          <Path d="M6 6l12 12M18 6L6 18" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/>,
    send:       <><Path d="M22 2 11 13" stroke={color} strokeWidth={stroke}/><Path d="M22 2 15 22l-4-9-9-4 20-7z" stroke={color} strokeWidth={stroke}/></>,
    bell:       <><Path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9z" stroke={color} strokeWidth={stroke}/><Path d="M10 21a2 2 0 0 0 4 0" stroke={color} strokeWidth={stroke}/></>,
    flame:      <Path d="M12 22c4 0 7-3 7-7 0-3-2-5-3-7-1 2-2 3-3 3-1-2-1-5 0-8-4 1-8 5-8 11 0 5 3 8 7 8z" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/>,
    trophy:     <><Path d="M8 4h8v5a4 4 0 0 1-8 0V4z" stroke={color} strokeWidth={stroke}/><Path d="M5 5H3a3 3 0 0 0 5 3M16 5h2a3 3 0 0 1-5 3" stroke={color} strokeWidth={stroke}/><Path d="M12 13v4M9 21h6M10 17h4v4h-4z" stroke={color} strokeWidth={stroke}/></>,
    coin:       <><Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={stroke}/><Path d="M9 9h4a2 2 0 0 1 0 4H9m4 0a2 2 0 0 1 0 4H9M9 7v10" stroke={color} strokeWidth={stroke}/></>,
    target:     <><Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={stroke}/><Circle cx="12" cy="12" r="5" stroke={color} strokeWidth={stroke}/><Circle cx="12" cy="12" r="1.5" fill={color}/></>,
    settings:   <><Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={stroke}/><Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 4.27 16.9l.06-.06a1.65 1.65 0 0 0 .33-1.82A1.65 1.65 0 0 0 3.15 14H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke={color} strokeWidth={stroke}/></>,
    play:       <Path d="M6 4l14 8-14 8z" fill={color} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/>,
    alert:      <><Path d="M12 3 2 21h20L12 3z" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/><Path d="M12 10v5M12 18v.01" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/></>,
    heart:      <Path d="M12 21s-7-4.5-7-11a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 6.5-7 11-7 11z" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/>,
    moon:       <Path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/>,
    sun:        <><Circle cx="12" cy="12" r="4" stroke={color} strokeWidth={stroke}/><Path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke={color} strokeWidth={stroke}/></>,
    eye:        <><Path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" stroke={color} strokeWidth={stroke}/><Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={stroke}/></>,
    lock:       <><Rect x="4" y="11" width="16" height="10" rx="2" stroke={color} strokeWidth={stroke}/><Path d="M8 11V7a4 4 0 0 1 8 0v4" stroke={color} strokeWidth={stroke}/></>,
    mail:       <><Rect x="3" y="5" width="18" height="14" rx="2" stroke={color} strokeWidth={stroke}/><Path d="m3 7 9 7 9-7" stroke={color} strokeWidth={stroke}/></>,
    grad:       <><Path d="M2 9 12 4l10 5-10 5L2 9z" stroke={color} strokeWidth={stroke}/><Path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" stroke={color} strokeWidth={stroke}/></>,
    wallet:     <><Rect x="3" y="6" width="18" height="14" rx="2" stroke={color} strokeWidth={stroke}/><Path d="M3 10h18M16 15h2" stroke={color} strokeWidth={stroke}/></>,
    swap:       <><Path d="M7 4v16M3 8l4-4 4 4M17 20V4M21 16l-4 4-4-4" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/></>,
    clock:      <><Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={stroke}/><Path d="M12 7v5l3 2" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/></>,
    pizza:      <><Path d="M12 2 2 22h20L12 2z" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/><Circle cx="10" cy="14" r="1.2" fill={color}/><Circle cx="14" cy="17" r="1.2" fill={color}/><Circle cx="11" cy="9" r="1" fill={color}/></>,
    news:       <><Rect x="3" y="5" width="18" height="14" rx="2" stroke={color} strokeWidth={stroke}/><Path d="M7 9h6M7 13h10M7 17h10" stroke={color} strokeWidth={stroke}/></>,
    map:        <><Path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6z" stroke={color} strokeWidth={stroke}/><Path d="M9 3v15M15 6v15" stroke={color} strokeWidth={stroke}/></>,
    bus:        <><Rect x="4" y="5" width="16" height="13" rx="2" stroke={color} strokeWidth={stroke}/><Path d="M4 11h16M8 18v2M16 18v2" stroke={color} strokeWidth={stroke}/><Circle cx="8" cy="15" r="1" fill={color}/><Circle cx="16" cy="15" r="1" fill={color}/></>,
    spark:      <Path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/>,
  };
  return (
    <Svg {...p}>{icons[name] || null}</Svg>
  );
}
