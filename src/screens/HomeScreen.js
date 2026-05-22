import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';

const SCREEN_W = Dimensions.get('window').width;
const CARD_W = (SCREEN_W - 50) / 2; // 20px left + 10px gap + 20px right
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../AppContext';
import Icon from '../components/Icon';
import { Card, SectionLabel, TxnRow, ProgressRing, StatusPill } from '../components/ui';
import { R } from '../data';

function QuickAction({ icon, label, sub, bg, onPress }) {
  const { theme } = useApp();
  return (
    <TouchableOpacity activeOpacity={0.82} onPress={onPress} style={[styles.qAction, { backgroundColor: theme.surface, borderRadius: theme.rCard, ...theme.cardShadow }]}>
      <View style={[styles.qActionIcon, { backgroundColor: bg }]}>
        <Icon name={icon} size={19} color="#fff"/>
      </View>
      <View>
        <Text style={[styles.qActionLabel, { color: theme.text }]}>{label}</Text>
        <Text style={[styles.qActionSub, { color: theme.textMuted }]}>{sub}</Text>
      </View>
    </TouchableOpacity>
  );
}

function StreakStat({ icon, value, label, color }) {
  const { theme } = useApp();
  return (
    <Card style={styles.flex1} padded={false}>
      <View style={styles.streakPad}>
        <View style={[styles.streakIconWrap, { backgroundColor: color + '22' }]}>
          <Icon name={icon} size={15} color={color}/>
        </View>
        <Text style={[styles.streakValue, { color: theme.text }]}>{value}</Text>
        <Text style={[styles.streakLabel, { color: theme.textMuted }]}>{label}</Text>
      </View>
    </Card>
  );
}

export default function HomeScreen({ navigation }) {
  const { theme, t, persona, budget, monthSpent, daysLeft, txns, budgetState, stateMap } = useApp();

  const remaining = budget - monthSpent;
  const pct       = budget > 0 ? Math.min(100, (monthSpent / budget) * 100) : 0;
  const perDay    = daysLeft > 0 ? Math.max(0, remaining / daysLeft) : 0;
  const ringColor = budgetState === 'crisis' ? '#EF4444' : budgetState === 'warning' ? '#FFB300' : theme.green;

  const hr = new Date().getHours();
  const greet = hr < 18 ? t.greet : t.greetEvening;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Top bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={[styles.greetText, { color: theme.textMuted }]}>{greet} 👋</Text>
            <Text style={[styles.personaName, { color: theme.text }]}>{persona.short}</Text>
          </View>
          <View style={styles.topBarRight}>
            <TouchableOpacity style={[styles.iconChip, { backgroundColor: theme.sunken }]} onPress={() => navigation.navigate('News')}>
              <Icon name="bell" size={18} color={theme.text}/>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconChip, { backgroundColor: theme.sunken }]} onPress={() => navigation.navigate('Profile')}>
              <Text style={[styles.initialsText, { color: theme.text }]}>{persona.initials}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero budget card */}
        <View style={styles.heroPad}>
          <LinearGradient colors={theme.heroBg} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.heroGradient, { borderRadius: theme.rCard }]}>
            <View style={styles.heroTopRow}>
              <View>
                <Text style={styles.heroLabel}>{t.monthlyBudget}</Text>
                <Text style={styles.heroSub}>{persona.fundingLabel} · {persona.expectedDate}</Text>
              </View>
              <StatusPill state={budgetState}/>
            </View>

            <View style={styles.heroRingRow}>
              <ProgressRing value={pct} size={88} stroke={8} color={ringColor}>
                <View style={styles.ringInner}>
                  <Text style={styles.ringPct}>{Math.round(pct)}%</Text>
                  <Text style={styles.ringUsed}>used</Text>
                </View>
              </ProgressRing>
              <View style={styles.heroAmounts}>
                <Text style={styles.heroRemainingLabel}>{t.remaining}</Text>
                <Text style={styles.heroRemainingAmt}>
                  {remaining < 0 ? '−' : ''}{R(Math.abs(remaining))}
                </Text>
                <Text style={styles.heroPerDay}>
                  {R(perDay)} {t.perDay}
                </Text>
              </View>
            </View>

            <View style={styles.heroBtnRow}>
              {[
                { label: t.tracker, icon: 'chart', tab: 'Budget' },
                { label: t.coach,   icon: 'bot',   tab: 'Coach' },
              ].map(btn => (
                <TouchableOpacity key={btn.tab} onPress={() => navigation.navigate(btn.tab)}
                  hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                  activeOpacity={0.75}
                  style={[styles.heroBtn, { borderRadius: theme.rBtnSm }]}>
                  <Icon name={btn.icon} size={15} color="#fff"/>
                  <Text style={styles.heroBtnText}>{btn.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </LinearGradient>
        </View>

        {/* Crisis nudge */}
        {budgetState !== 'healthy' && (
          <View style={styles.sectionPad}>
            <Card padded={false} style={{
              backgroundColor: budgetState === 'crisis' ? '#EF444410' : '#FFB30014',
              borderWidth: 1, borderColor: budgetState === 'crisis' ? '#EF444440' : '#FFB30050',
            }}>
              <View style={styles.nudgeRow}>
                <View style={[styles.nudgeIcon, { backgroundColor: budgetState === 'crisis' ? '#EF4444' : '#FFB300' }]}>
                  <Icon name="alert" size={20} color="#fff"/>
                </View>
                <View style={styles.nudgeBody}>
                  <Text style={[styles.nudgeTitle, { color: theme.text }]}>
                    {budgetState === 'crisis' ? 'Running out fast' : 'Spending faster than safe pace'}
                  </Text>
                  <Text style={[styles.nudgeSub, { color: theme.textMuted }]}>
                    Check challenges to save {budgetState === 'crisis' ? R(480) : R(220)} this week
                  </Text>
                </View>
                <Icon name="arrowRight" size={18} color={theme.textMuted}/>
              </View>
            </Card>
          </View>
        )}

        {/* Quick actions */}
        <View style={styles.sectionPad}>
          <SectionLabel>{t.quickActions}</SectionLabel>
          <View style={styles.qActionsGrid}>
            <QuickAction icon="bot"    label={t.coach}       sub="Chat in EN/Zu/Af"  bg="#0066FF" onPress={() => navigation.navigate('Coach')}/>
            <QuickAction icon="target" label="Will I make it?" sub="Crisis simulator" bg="#7C3AED" onPress={() => navigation.navigate('Simulator')}/>
            <QuickAction icon="pizza"  label={t.meals}       sub="From R9/serving"   bg="#EC4899" onPress={() => navigation.navigate('Meals')}/>
            <QuickAction icon="bus"    label={t.transport}   sub="Beat the Uber tax" bg="#FFB300" onPress={() => navigation.navigate('Transport')}/>
            <QuickAction icon="trophy" label={t.challenges}  sub="3 active"          bg="#00C853" onPress={() => navigation.navigate('Challenges')}/>
            <QuickAction icon="alert"  label="Scam Shield"   sub="Paste any sus msg" bg="#EF4444" onPress={() => navigation.navigate('ScamShield')}/>
          </View>
        </View>

        {/* Recent transactions */}
        <View style={styles.sectionPad}>
          <View style={styles.txnHeader}>
            <SectionLabel>{t.recent}</SectionLabel>
            <TouchableOpacity onPress={() => navigation.navigate('Budget')}>
              <Text style={[styles.seeAllText, { color: theme.blue }]}>{t.seeAll}</Text>
            </TouchableOpacity>
          </View>
          <Card padded={false}>
            {txns.slice(0, 3).map((tx, i) => (
              <TxnRow key={tx.id} tx={tx} isLast={i === 2}/>
            ))}
          </Card>
        </View>

        {/* Streak strip */}
        <View style={styles.streakRow}>
          <StreakStat icon="flame" value="7"   label={t.streak}  color="#FF6B35"/>
          <StreakStat icon="coin"  value={R(340)} label={t.saved} color="#00C853"/>
          <StreakStat icon="grad"  value="3/6"  label={t.lessons} color="#FFB300"/>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: { paddingBottom: Platform.OS === 'ios' ? 100 : 80 },

  // Top bar
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
  greetText: { fontSize: 13, fontWeight: '500' },
  personaName: { fontSize: 22, fontWeight: '900', letterSpacing: -0.6, marginTop: 2 },
  topBarRight: { flexDirection: 'row', gap: 8 },
  iconChip: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  initialsText: { fontWeight: '800', fontSize: 13 },

  // Hero
  heroPad: { paddingHorizontal: 20 },
  heroGradient: { overflow: 'hidden', padding: 22 },
  heroTopRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  heroLabel: { fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: '600', letterSpacing: 1.2, textTransform: 'uppercase' },
  heroSub: { fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 4 },
  heroRingRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  ringInner: { alignItems: 'center' },
  ringPct: { fontSize: 18, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
  ringUsed: { fontSize: 9, color: 'rgba(255,255,255,0.7)', marginTop: 1 },
  heroAmounts: { flex: 1 },
  heroRemainingLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  heroRemainingAmt: { fontSize: 34, fontWeight: '900', color: '#fff', letterSpacing: -1.2, lineHeight: 40 },
  heroPerDay: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  heroBtnRow: { flexDirection: 'row', gap: 8, marginTop: 16 },
  heroBtn: { flex: 1, height: 42, backgroundColor: 'rgba(255,255,255,0.18)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  heroBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  // Nudge
  sectionPad: { paddingHorizontal: 20, marginTop: 14 },
  nudgeRow: { flexDirection: 'row', padding: 14, gap: 12, alignItems: 'center' },
  nudgeIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  nudgeBody: { flex: 1 },
  nudgeTitle: { fontWeight: '700', fontSize: 14 },
  nudgeSub: { fontSize: 12, marginTop: 2 },

  // Quick actions
  qActionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 },
  qAction: { width: CARD_W, padding: 14, gap: 10 },
  qActionIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  qActionLabel: { fontSize: 14, fontWeight: '700', letterSpacing: -0.2 },
  qActionSub: { fontSize: 11.5, marginTop: 2 },

  // Transactions
  txnHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  seeAllText: { fontSize: 12, fontWeight: '700' },

  // Shared utilities
  flex1: { flex: 1 },

  // Streak
  streakRow: { paddingHorizontal: 20, marginTop: 20, flexDirection: 'row', gap: 10 },
  streakPad: { padding: 12, gap: 6 },
  streakIconWrap: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  streakValue: { fontSize: 17, fontWeight: '800', letterSpacing: -0.5 },
  streakLabel: { fontSize: 10.5 },
});
