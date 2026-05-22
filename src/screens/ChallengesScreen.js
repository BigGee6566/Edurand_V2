import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../AppContext';
import Icon from '../components/Icon';
import { Card, SectionLabel, PageHeader, ProgressBar } from '../components/ui';
import { CHALLENGES, R } from '../data';

const NEW_CHALLENGES = [
  { id:'n1', icon: '📵', label: 'No social media Mon-Wed', desc: 'Save 4hrs/week, reduce data spend.' },
  { id:'n2', icon: '☕', label: 'Make your own coffee',    desc: 'R8 vs R35 a cup. Save R540/month.' },
  { id:'n3', icon: '📚', label: '1 free library session/week', desc: 'Swap a paid café for UCT library.' },
];

export default function ChallengesScreen({ navigation }) {
  const { theme } = useApp();
  const [challenges, setChallenges] = useState(CHALLENGES);

  const totalSaved = challenges.reduce((sum, c) => sum + c.saved, 0);

  const addToday = (id) => {
    setChallenges(prev => prev.map(c => c.id === id ? { ...c, saved: Math.min(c.target, c.saved + 25) } : c));
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <PageHeader title="Challenges" sub="Saving streaks & goals" onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Hero */}
        <View style={styles.heroPad}>
          <LinearGradient colors={['#7C3AED', '#0066FF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={[styles.heroGradient, { borderRadius: theme.rCard }]}>
            <Text style={styles.heroEyebrow}>Total saved via challenges</Text>
            <Text style={styles.heroTotal}>{R(totalSaved)}</Text>
            <Text style={styles.heroSub}>
              {challenges.length} active challenges · keep going!
            </Text>
          </LinearGradient>
        </View>

        {/* Active challenges */}
        <View style={styles.challengesPad}>
          <SectionLabel>Active challenges</SectionLabel>
          <View style={styles.challengesList}>
            {challenges.map(c => {
              const pct = Math.round((c.saved / c.target) * 100);
              return (
                <Card key={c.id} padded={false}>
                  <View style={styles.challengePad}>
                    <View style={styles.challengeTop}>
                      <View style={styles.challengeInfo}>
                        <Text style={[styles.challengeName, { color: theme.text }]}>{c.name}</Text>
                        <Text style={[styles.challengeDesc, { color: theme.textMuted }]}>{c.desc}</Text>
                      </View>
                      <View style={[styles.dayBadge, { backgroundColor: c.color + '20' }]}>
                        <Text style={[styles.dayBadgeText, { color: c.color }]}>Day {c.daysIn}</Text>
                      </View>
                    </View>

                    <View style={styles.challengeProgress}>
                      <Text style={[styles.challengeSaved, { color: theme.text }]}>{R(c.saved)} saved</Text>
                      <Text style={[styles.challengeGoal, { color: theme.textMuted }]}>Goal: {R(c.target)} · {pct}%</Text>
                    </View>

                    <ProgressBar value={c.saved} max={c.target} color={c.color} height={8}/>

                    <TouchableOpacity activeOpacity={0.82} onPress={() => addToday(c.id)}
                      style={[styles.addDayBtn, { borderRadius: theme.rBtnSm, backgroundColor: c.color + '18' }]}>
                      <Icon name="coin" size={14} color={c.color}/>
                      <Text style={[styles.addDayBtnText, { color: c.color }]}>+ R25 today</Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              );
            })}
          </View>
        </View>

        {/* Pick a new challenge */}
        <View style={styles.newChallengesPad}>
          <SectionLabel>Pick a new one</SectionLabel>
          <View style={styles.newChallengesList}>
            {NEW_CHALLENGES.map(nc => (
              <TouchableOpacity key={nc.id} activeOpacity={0.82}
                style={[styles.newChallengeRow, { backgroundColor: theme.surface, borderRadius: theme.rCard, borderColor: theme.trackSoft, ...theme.cardShadow }]}>
                <View style={[styles.newChallengeIcon, { backgroundColor: theme.sunken }]}>
                  <Text style={styles.newChallengeEmoji}>{nc.icon}</Text>
                </View>
                <View style={styles.newChallengeBody}>
                  <Text style={[styles.newChallengeLabel, { color: theme.text }]}>{nc.label}</Text>
                  <Text style={[styles.newChallengeDesc, { color: theme.textMuted }]}>{nc.desc}</Text>
                </View>
                <View style={[styles.newChallengeArrow, { backgroundColor: theme.blue + '18' }]}>
                  <Icon name="arrowRight" size={14} color={theme.blue}/>
                </View>
              </TouchableOpacity>
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

  // Hero
  heroPad: { paddingHorizontal: 20 },
  heroGradient: { padding: 22, overflow: 'hidden' },
  heroEyebrow: { fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 6 },
  heroTotal: { fontSize: 40, fontWeight: '900', color: '#fff', letterSpacing: -1.4, marginBottom: 4 },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },

  // Active challenges
  challengesPad: { paddingHorizontal: 20, marginTop: 20 },
  challengesList: { gap: 12, marginTop: 10 },
  challengePad: { padding: 16 },
  challengeTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 },
  challengeInfo: { flex: 1, marginRight: 12 },
  challengeName: { fontSize: 16, fontWeight: '800', letterSpacing: -0.4, marginBottom: 3 },
  challengeDesc: { fontSize: 12, lineHeight: 17 },
  dayBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  dayBadgeText: { fontSize: 12, fontWeight: '800' },
  challengeProgress: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  challengeSaved: { fontSize: 13, fontWeight: '700' },
  challengeGoal: { fontSize: 12 },
  addDayBtn: { marginTop: 12, height: 38, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 },
  addDayBtnText: { fontSize: 13, fontWeight: '700' },

  // New challenges
  newChallengesPad: { paddingHorizontal: 20, marginTop: 24 },
  newChallengesList: { gap: 10, marginTop: 10 },
  newChallengeRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderWidth: 1 },
  newChallengeIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  newChallengeEmoji: { fontSize: 22 },
  newChallengeBody: { flex: 1 },
  newChallengeLabel: { fontSize: 14, fontWeight: '700', letterSpacing: -0.2 },
  newChallengeDesc: { fontSize: 12, marginTop: 2 },
  newChallengeArrow: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});
