import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../AppContext';
import Icon from '../components/Icon';
import { Card, SectionLabel, PageHeader } from '../components/ui';
import { R } from '../data';

const SUGGESTIONS_MAKE = [
  { icon: '🚌', text: 'Switch to Jammie / MyCiTi — save R26 per trip vs Bolt.' },
  { icon: '🍳', text: 'Cook egg fried rice tonight — R17 for two servings.' },
  { icon: '📶', text: 'Download notes on campus Wi-Fi, not mobile data.' },
];
const SUGGESTIONS_CRISIS = [
  { icon: '🚨', text: 'Stop all food delivery apps this week — cook instead.' },
  { icon: '🚶', text: 'Walk or take the free Jammie Shuttle to cut transport to R0.' },
  { icon: '💡', text: 'Check if your res hall has emergency meal vouchers.' },
];

export default function SimulatorScreen({ navigation }) {
  const { theme, budget, monthSpent, daysLeft } = useApp();

  const remaining = budget - monthSpent;
  const safePerDay = daysLeft > 0 ? remaining / daysLeft : 0;

  const [perDayText, setPerDayText] = useState(String(Math.round(safePerDay)));

  const perDay = parseFloat(perDayText) || 0;
  const daysCovered = perDay > 0 ? Math.floor(remaining / perDay) : daysLeft;
  const willMake = daysCovered >= daysLeft;

  const today = new Date();
  const runOutDate = new Date(today);
  runOutDate.setDate(today.getDate() + daysCovered);
  const dateLabel = willMake
    ? 'You make it to month end'
    : runOutDate.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });

  const heroColors = willMake ? ['#00C853', '#009624'] : ['#EF4444', '#B71C1C'];
  const verdict = willMake
    ? 'At this pace, you\'ll have cash left when your next allowance arrives.'
    : `At this pace, money runs out on ${dateLabel}. Adjust your daily spend below.`;

  const suggestions = willMake ? SUGGESTIONS_MAKE : SUGGESTIONS_CRISIS;

  // 30-day dot grid
  const dots = Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1;
    if (dayNum > daysLeft) return 'past';
    if (dayNum === daysLeft) return 'last';
    const cumulativeNeeded = perDay * dayNum;
    return cumulativeNeeded <= remaining ? 'ok' : 'short';
  });

  const DOT_COLORS = { ok: '#00C853', short: '#EF4444', last: '#0066FF', past: theme.trackSoft };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <PageHeader title="Will I make it?" onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Hero card */}
        <View style={styles.heroPad}>
          <LinearGradient colors={heroColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={[styles.heroGradient, { borderRadius: theme.rCard }]}>
            <Text style={styles.heroEyebrow}>
              {willMake ? 'Month end verdict' : 'Money runs out'}
            </Text>
            <Text style={styles.heroDate}>{dateLabel}</Text>
            <Text style={styles.heroVerdict}>{verdict}</Text>
          </LinearGradient>
        </View>

        {/* Mini stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Remaining',  value: R(remaining),           color: theme.blue   },
            { label: 'Days left',  value: `${daysLeft}d`,         color: '#FFB300'     },
            { label: 'Safe/day',   value: R(safePerDay),          color: '#00C853'     },
            { label: 'Actual/day', value: R(perDay),              color: willMake ? '#00C853' : '#EF4444' },
          ].map(stat => (
            <Card key={stat.label} style={styles.flex1} padded={false}>
              <View style={styles.statTile}>
                <Text style={[styles.statTileValue, { color: stat.color }]}>{stat.value}</Text>
                <Text style={[styles.statTileLabel, { color: theme.textMuted }]}>{stat.label}</Text>
              </View>
            </Card>
          ))}
        </View>

        {/* Per-day input */}
        <View style={styles.sectionPad}>
          <Card>
            <Text style={[styles.inputCardLabel, { color: theme.textMuted }]}>
              Spend per day
            </Text>
            <View style={styles.inputRow}>
              <View style={[styles.currencyBadge, { backgroundColor: theme.sunken }]}>
                <Text style={[styles.currencyText, { color: theme.textMuted }]}>R</Text>
              </View>
              <TextInput
                value={perDayText}
                onChangeText={setPerDayText}
                keyboardType="numeric"
                style={[styles.perDayInput, { color: theme.text }]}
                placeholderTextColor={theme.textMuted}
                placeholder="0"
              />
              <Text style={[styles.perDayUnit, { color: theme.textMuted }]}>per day</Text>
            </View>
            <View style={styles.presetRow}>
              {[safePerDay * 0.7, safePerDay, safePerDay * 1.3].map((preset, i) => (
                <TouchableOpacity key={i} activeOpacity={0.82}
                  onPress={() => setPerDayText(String(Math.round(preset)))}
                  style={[styles.presetBtn, { borderRadius: theme.rBtnSm, backgroundColor: theme.sunken }]}>
                  <Text style={[styles.presetBtnText, { color: theme.textMuted }]}>{R(Math.round(preset))}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        </View>

        {/* 30-day dot grid */}
        <View style={styles.sectionPad}>
          <SectionLabel>30-day forecast</SectionLabel>
          <Card style={styles.dotGridCard}>
            <View style={styles.dotGrid}>
              {dots.map((type, i) => (
                <View key={i} style={[styles.dot, { backgroundColor: DOT_COLORS[type] || theme.trackSoft }]}>
                  {type === 'last' && <Text style={styles.dotEmoji}>💸</Text>}
                </View>
              ))}
            </View>
            <View style={styles.legendRow}>
              {[['#00C853','Covered'],['#EF4444','Short'],['#0066FF','Pay day']].map(([c, l]) => (
                <View key={l} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: c }]}/>
                  <Text style={[styles.legendLabel, { color: theme.textMuted }]}>{l}</Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        {/* Suggestions */}
        <View style={styles.sectionPad}>
          <SectionLabel>{willMake ? 'Keep it up' : 'Quick cuts'}</SectionLabel>
          <View style={styles.suggestionsList}>
            {suggestions.map((s, i) => (
              <Card key={i} padded={false}>
                <View style={styles.suggestionRow}>
                  <Text style={styles.suggestionIcon}>{s.icon}</Text>
                  <Text style={[styles.suggestionText, { color: theme.text }]}>{s.text}</Text>
                </View>
              </Card>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: { paddingBottom: 32 },

  // Shared utilities
  flex1: { flex: 1 },

  // Hero
  heroPad: { paddingHorizontal: 20 },
  heroGradient: { padding: 22, overflow: 'hidden' },
  heroEyebrow: { fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 6 },
  heroDate: { fontSize: 28, fontWeight: '900', color: '#fff', letterSpacing: -0.8, marginBottom: 8 },
  heroVerdict: { fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 19 },

  // Mini stats
  statsRow: { paddingHorizontal: 20, marginTop: 16, flexDirection: 'row', gap: 10 },
  statTile: { padding: 10, alignItems: 'center', gap: 4 },
  statTileValue: { fontSize: 14, fontWeight: '800', letterSpacing: -0.4 },
  statTileLabel: { fontSize: 10, textAlign: 'center' },

  // Per-day input card
  sectionPad: { paddingHorizontal: 20, marginTop: 16 },
  inputCardLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  currencyBadge: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  currencyText: { fontSize: 15, fontWeight: '800' },
  perDayInput: { flex: 1, fontSize: 28, fontWeight: '900', letterSpacing: -1 },
  perDayUnit: { fontSize: 13 },
  presetRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  presetBtn: { flex: 1, height: 34, alignItems: 'center', justifyContent: 'center' },
  presetBtnText: { fontSize: 12, fontWeight: '700' },

  // Dot grid
  dotGridCard: { marginTop: 10 },
  dotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  dot: { width: 24, height: 24, borderRadius: 5, alignItems: 'center', justifyContent: 'center' },
  dotEmoji: { fontSize: 10 },
  legendRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 10, height: 10, borderRadius: 2 },
  legendLabel: { fontSize: 11 },

  // Suggestions
  suggestionsList: { gap: 10, marginTop: 10 },
  suggestionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  suggestionIcon: { fontSize: 24 },
  suggestionText: { flex: 1, fontSize: 13, lineHeight: 19 },
});
