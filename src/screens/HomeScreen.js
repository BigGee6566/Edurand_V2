import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
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
      <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={19} color="#fff"/>
      </View>
      <View>
        <Text style={{ fontSize: 14, fontWeight: '700', color: theme.text, letterSpacing: -0.2 }}>{label}</Text>
        <Text style={{ fontSize: 11.5, color: theme.textMuted, marginTop: 2 }}>{sub}</Text>
      </View>
    </TouchableOpacity>
  );
}

function StreakStat({ icon, value, label, color }) {
  const { theme } = useApp();
  return (
    <Card style={{ flex: 1 }} padded={false}>
      <View style={{ padding: 12, gap: 6 }}>
        <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: color + '22', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={icon} size={15} color={color}/>
        </View>
        <Text style={{ fontSize: 17, fontWeight: '800', color: theme.text, letterSpacing: -0.5 }}>{value}</Text>
        <Text style={{ fontSize: 10.5, color: theme.textMuted }}>{label}</Text>
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
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>

        {/* Top bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={{ fontSize: 13, color: theme.textMuted, fontWeight: '500' }}>{greet} 👋</Text>
            <Text style={{ fontSize: 22, fontWeight: '900', color: theme.text, letterSpacing: -0.6, marginTop: 2 }}>{persona.short}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity style={[styles.iconChip, { backgroundColor: theme.sunken }]}>
              <Icon name="bell" size={18} color={theme.text}/>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconChip, { backgroundColor: theme.sunken }]}>
              <Text style={{ fontWeight: '800', fontSize: 13, color: theme.text }}>{persona.initials}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero budget card */}
        <View style={{ paddingHorizontal: 20 }}>
          <LinearGradient colors={theme.heroBg} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: theme.rCard, overflow: 'hidden', padding: 22 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
              <View>
                <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: '600', letterSpacing: 1.2, textTransform: 'uppercase' }}>{t.monthlyBudget}</Text>
                <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 4 }}>{persona.fundingLabel} · {persona.expectedDate}</Text>
              </View>
              <StatusPill state={budgetState}/>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <ProgressRing value={pct} size={88} stroke={8} color={ringColor}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 18, fontWeight: '900', color: '#fff', letterSpacing: -0.5 }}>{Math.round(pct)}%</Text>
                  <Text style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', marginTop: 1 }}>used</Text>
                </View>
              </ProgressRing>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{t.remaining}</Text>
                <Text style={{ fontSize: 34, fontWeight: '900', color: '#fff', letterSpacing: -1.2, lineHeight: 40 }}>
                  {remaining < 0 ? '−' : ''}{R(Math.abs(remaining))}
                </Text>
                <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>
                  {R(perDay)} {t.perDay}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
              {[
                { label: t.tracker, icon: 'chart', tab: 'Budget' },
                { label: t.coach,   icon: 'bot',   tab: 'Coach' },
              ].map(btn => (
                <TouchableOpacity key={btn.tab} onPress={() => navigation.navigate(btn.tab)}
                  style={{ flex: 1, height: 42, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: theme.rBtnSm, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Icon name={btn.icon} size={15} color="#fff"/>
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>{btn.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </LinearGradient>
        </View>

        {/* Crisis nudge */}
        {budgetState !== 'healthy' && (
          <View style={{ paddingHorizontal: 20, marginTop: 14 }}>
            <Card padded={false} style={{
              backgroundColor: budgetState === 'crisis' ? '#EF444410' : '#FFB30014',
              borderWidth: 1, borderColor: budgetState === 'crisis' ? '#EF444440' : '#FFB30050',
            }}>
              <View style={{ flexDirection: 'row', padding: 14, gap: 12, alignItems: 'center' }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: budgetState === 'crisis' ? '#EF4444' : '#FFB300', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="alert" size={20} color="#fff"/>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', fontSize: 14, color: theme.text }}>
                    {budgetState === 'crisis' ? 'Running out fast' : 'Spending faster than safe pace'}
                  </Text>
                  <Text style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>
                    Check challenges to save {budgetState === 'crisis' ? R(480) : R(220)} this week
                  </Text>
                </View>
                <Icon name="arrowRight" size={18} color={theme.textMuted}/>
              </View>
            </Card>
          </View>
        )}

        {/* Quick actions */}
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <SectionLabel>{t.quickActions}</SectionLabel>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 }}>
            <QuickAction icon="bot"    label={t.coach}       sub="Chat in EN/Zu/Af"  bg="#0066FF" onPress={() => navigation.navigate('Coach')}/>
            <QuickAction icon="target" label="Will I make it?" sub="Crisis simulator" bg="#7C3AED" onPress={() => {}}/>
            <QuickAction icon="pizza"  label={t.meals}       sub="From R9/serving"   bg="#EC4899" onPress={() => {}}/>
            <QuickAction icon="bus"    label={t.transport}   sub="Beat the Uber tax" bg="#FFB300" onPress={() => {}}/>
            <QuickAction icon="trophy" label={t.challenges}  sub="3 active"          bg="#00C853" onPress={() => {}}/>
            <QuickAction icon="alert"  label="Scam Shield"   sub="Paste any sus msg" bg="#EF4444" onPress={() => {}}/>
          </View>
        </View>

        {/* Recent transactions */}
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <SectionLabel>{t.recent}</SectionLabel>
            <TouchableOpacity onPress={() => navigation.navigate('Budget')}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: theme.blue }}>{t.seeAll}</Text>
            </TouchableOpacity>
          </View>
          <Card padded={false}>
            {txns.slice(0, 3).map((tx, i) => (
              <TxnRow key={tx.id} tx={tx} isLast={i === 2}/>
            ))}
          </Card>
        </View>

        {/* Streak strip */}
        <View style={{ paddingHorizontal: 20, marginTop: 20, flexDirection: 'row', gap: 10 }}>
          <StreakStat icon="flame" value="7"   label={t.streak}  color="#FF6B35"/>
          <StreakStat icon="coin"  value={R(340)} label={t.saved} color="#00C853"/>
          <StreakStat icon="grad"  value="3/6"  label={t.lessons} color="#FFB300"/>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
  iconChip: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  qAction: { width: '47%', padding: 14, gap: 10 },
});
