import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import Icon from './Icon';
import { useApp } from '../AppContext';

export function Card({ children, style, padded = true, onPress }) {
  const { theme } = useApp();
  const base = {
    backgroundColor: theme.surface,
    borderRadius: theme.rCard,
    padding: padded ? theme.cardPad : 0,
    ...theme.cardShadow,
    overflow: 'hidden',
  };
  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={[base, style]}>
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={[base, style]}>{children}</View>;
}

export function Button({ onPress, children, variant = 'primary', size = 'md', full, disabled, style }) {
  const { theme } = useApp();
  const bg = variant === 'primary' ? theme.btnPrimaryBg : variant === 'secondary' ? theme.btnSecBg : 'transparent';
  const fg = variant === 'primary' ? theme.btnPrimaryFg : theme.btnSecFg;
  const h  = size === 'lg' ? 52 : size === 'sm' ? 38 : 44;
  return (
    <TouchableOpacity
      activeOpacity={0.82}
      disabled={disabled}
      onPress={onPress}
      style={[{
        height: h, borderRadius: theme.rBtn, backgroundColor: bg,
        alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6,
        paddingHorizontal: 20, opacity: disabled ? 0.6 : 1,
        alignSelf: full ? 'stretch' : 'flex-start',
      }, style]}
    >
      {typeof children === 'string'
        ? <Text style={{ color: fg, fontWeight: '700', fontSize: size === 'lg' ? 16 : 14, letterSpacing: -0.3 }}>{children}</Text>
        : children}
    </TouchableOpacity>
  );
}

export function SectionLabel({ children }) {
  const { theme } = useApp();
  return (
    <Text style={{ fontSize: 11.5, fontWeight: '700', color: theme.textMuted, letterSpacing: 1.2, textTransform: 'uppercase' }}>
      {children}
    </Text>
  );
}

export function PageHeader({ title, sub, trailing }) {
  const { theme } = useApp();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 }}>
      <View>
        <Text style={{ fontSize: 24, fontWeight: '900', color: theme.text, letterSpacing: -0.6 }}>{title}</Text>
        {sub ? <Text style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>{sub}</Text> : null}
      </View>
      {trailing}
    </View>
  );
}

export function ProgressRing({ value, size, stroke, color, children }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(100, value) / 100) * circ;
  const cx = size / 2;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle cx={cx} cy={cx} r={r} stroke="rgba(255,255,255,0.2)" strokeWidth={stroke} fill="none"/>
        <Circle cx={cx} cy={cx} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={`${circ} ${circ}`} strokeDashoffset={offset}
          strokeLinecap="round" transform={`rotate(-90, ${cx}, ${cx})`}/>
      </Svg>
      {children}
    </View>
  );
}

export function StatusPill({ state }) {
  const colors = { healthy: '#00C853', warning: '#FFB300', crisis: '#EF4444' };
  const labels = { healthy: 'On track', warning: 'Watch out', crisis: 'Crisis' };
  const c = colors[state] || colors.healthy;
  return (
    <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: c + '25', borderWidth: 1, borderColor: c + '60' }}>
      <Text style={{ fontSize: 11, fontWeight: '800', color: c, letterSpacing: 0.5 }}>{labels[state]}</Text>
    </View>
  );
}

export function TxnRow({ tx, isLast }) {
  const { theme } = useApp();
  const CATS = {
    food:      { color: '#0066FF', icon: '🍜' },
    transport: { color: '#FFB300', icon: '🚐' },
    rent:      { color: '#00C853', icon: '🏠' },
    data:      { color: '#7C3AED', icon: '📶' },
    fun:       { color: '#EC4899', icon: '🎉' },
    study:     { color: '#06B6D4', icon: '📚' },
  };
  const cat = CATS[tx.cat] || CATS.food;
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12,
      borderBottomWidth: isLast ? 0 : 1, borderBottomColor: theme.trackSoft,
    }}>
      <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: cat.color + '20', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 18 }}>{cat.icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: '600', fontSize: 14, color: theme.text, letterSpacing: -0.2 }} numberOfLines={1}>{tx.merchant}</Text>
        <Text style={{ fontSize: 11.5, color: theme.textMuted, marginTop: 1 }}>{tx.at}{tx.note ? ` · ${tx.note}` : ''}</Text>
      </View>
      <Text style={{ fontWeight: '800', fontSize: 15, color: tx.amount < 0 ? theme.text : '#00C853', letterSpacing: -0.4 }}>
        {tx.amount < 0 ? '−' : '+'}R{Math.abs(Math.round(tx.amount)).toLocaleString('en-ZA')}
      </Text>
    </View>
  );
}

export function Toggle({ value, onValueChange }) {
  const { theme } = useApp();
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: theme.track, true: theme.blue }}
      thumbColor="#FFFFFF"
      ios_backgroundColor={theme.track}
    />
  );
}

export function Divider() {
  const { theme } = useApp();
  return <View style={{ height: 1, backgroundColor: theme.trackSoft }} />;
}
