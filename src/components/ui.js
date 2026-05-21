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
      style={[styles.button, {
        height: h, borderRadius: theme.rBtn, backgroundColor: bg,
        opacity: disabled ? 0.6 : 1,
        alignSelf: full ? 'stretch' : 'flex-start',
      }, style]}
    >
      {typeof children === 'string'
        ? <Text style={[styles.buttonText, { color: fg, fontSize: size === 'lg' ? 16 : 14 }]}>{children}</Text>
        : children}
    </TouchableOpacity>
  );
}

export function SectionLabel({ children }) {
  const { theme } = useApp();
  return (
    <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>
      {children}
    </Text>
  );
}

export function PageHeader({ title, sub, trailing, onBack }) {
  const { theme } = useApp();
  return (
    <View style={styles.pageHeader}>
      {onBack && (
        <TouchableOpacity onPress={onBack} style={[styles.backBtn, { backgroundColor: theme.sunken }]}>
          <Icon name="arrowLeft" size={18} color={theme.text}/>
        </TouchableOpacity>
      )}
      <View style={styles.pageHeaderTitle}>
        <Text style={[styles.pageHeaderText, { color: theme.text }]}>{title}</Text>
        {sub ? <Text style={[styles.pageHeaderSub, { color: theme.textMuted }]}>{sub}</Text> : null}
      </View>
      {trailing}
    </View>
  );
}

export function ProgressBar({ value, max = 100, color, height = 8 }) {
  const { theme } = useApp();
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <View style={[styles.progressTrack, { height, borderRadius: height / 2, backgroundColor: theme.trackSoft }]}>
      <View style={{ height: '100%', width: `${pct}%`, backgroundColor: color || theme.blue, borderRadius: height / 2 }} />
    </View>
  );
}

export function ProgressRing({ value, size, stroke, color, children }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(100, value) / 100) * circ;
  const cx = size / 2;
  return (
    <View style={[styles.ringWrapper, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.ringAbsolute}>
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
    <View style={[styles.statusPill, { backgroundColor: c + '25', borderColor: c + '60' }]}>
      <Text style={[styles.statusPillText, { color: c }]}>{labels[state]}</Text>
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
    <View style={[styles.txnRow, { borderBottomWidth: isLast ? 0 : 1, borderBottomColor: theme.trackSoft }]}>
      <View style={[styles.txnIcon, { backgroundColor: cat.color + '20' }]}>
        <Text style={styles.txnEmoji}>{cat.icon}</Text>
      </View>
      <View style={styles.txnBody}>
        <Text style={[styles.txnMerchant, { color: theme.text }]} numberOfLines={1}>{tx.merchant}</Text>
        <Text style={[styles.txnMeta, { color: theme.textMuted }]}>{tx.at}{tx.note ? ` · ${tx.note}` : ''}</Text>
      </View>
      <Text style={[styles.txnAmount, { color: tx.amount < 0 ? theme.text : '#00C853' }]}>
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
  return <View style={[styles.divider, { backgroundColor: theme.trackSoft }]} />;
}

const styles = StyleSheet.create({
  // Button
  button: {
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row',
    gap: 6, paddingHorizontal: 20,
  },
  buttonText: { fontWeight: '700', letterSpacing: -0.3 },

  // SectionLabel
  sectionLabel: { fontSize: 11.5, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' },

  // PageHeader
  pageHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
  backBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  pageHeaderTitle: { flex: 1 },
  pageHeaderText: { fontSize: 24, fontWeight: '900', letterSpacing: -0.6 },
  pageHeaderSub: { fontSize: 12, marginTop: 2 },

  // ProgressBar
  progressTrack: { overflow: 'hidden' },

  // ProgressRing
  ringWrapper: { alignItems: 'center', justifyContent: 'center' },
  ringAbsolute: { position: 'absolute' },

  // StatusPill
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1 },
  statusPillText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },

  // TxnRow
  txnRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12 },
  txnIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  txnEmoji: { fontSize: 18 },
  txnBody: { flex: 1 },
  txnMerchant: { fontWeight: '600', fontSize: 14, letterSpacing: -0.2 },
  txnMeta: { fontSize: 11.5, marginTop: 1 },
  txnAmount: { fontWeight: '800', fontSize: 15, letterSpacing: -0.4 },

  // Divider
  divider: { height: 1 },
});
