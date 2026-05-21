import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../AppContext';
import Icon from '../components/Icon';
import { Card, PageHeader } from '../components/ui';

const SA_BANKS = [
  { id:'capitec',   name:'Capitec',      short:'Cap', bg:'#E40521', fg:'#fff' },
  { id:'tyme',      name:'Tymebank',     short:'Ty',  bg:'#00C9A7', fg:'#fff' },
  { id:'fnb',       name:'FNB',          short:'FN',  bg:'#00A3E0', fg:'#fff' },
  { id:'standard',  name:'Standard',     short:'SB',  bg:'#0033A0', fg:'#fff' },
  { id:'absa',      name:'Absa',         short:'Ab',  bg:'#DC0032', fg:'#fff' },
  { id:'nedbank',   name:'Nedbank',      short:'Ne',  bg:'#006633', fg:'#fff' },
  { id:'discovery', name:'Discovery',    short:'Di',  bg:'#FCC11A', fg:'#0F172A' },
  { id:'african',   name:'African Bank', short:'AB',  bg:'#FFB81C', fg:'#0F172A' },
];

const STATUS_MSGS = [
  { at: 0,  text: 'Connecting to bank...' },
  { at: 30, text: 'Authenticating credentials...' },
  { at: 70, text: 'Importing transactions...' },
  { at: 95, text: 'Almost done...' },
];

export default function LinkBankScreen({ navigation }) {
  const { theme } = useApp();
  const [step, setStep]         = useState('pick');
  const [selected, setSelected] = useState(null);
  const [progress, setProgress] = useState(0);

  const handlePickBank = (bank) => {
    setSelected(bank);
    setProgress(0);
    setStep('auth');
  };

  useEffect(() => {
    if (step !== 'auth') return;
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 2;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => setStep('success'), 350);
          return 100;
        }
        return next;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [step]);

  const statusMsg = STATUS_MSGS.reduce((acc, m) => (progress >= m.at ? m.text : acc), STATUS_MSGS[0].text);

  if (step === 'success') {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
        <View style={styles.successCenter}>
          <LinearGradient colors={['#00C853', '#009624']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.successIcon}>
            <Icon name="check" size={42} color="#fff"/>
          </LinearGradient>
          <Text style={[styles.successTitle, { color: theme.text }]}>You're linked</Text>
          <Text style={[styles.successSub, { color: theme.textMuted }]}>
            {selected?.name} is connected. Your transactions will now sync automatically.
          </Text>
          <TouchableOpacity activeOpacity={0.82} onPress={() => navigation.navigate('Budget')}
            style={[styles.successBtn, { borderRadius: theme.rBtn }]}>
            <Text style={styles.successBtnText}>See tracker</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (step === 'auth') {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
        <PageHeader title="Connecting" sub={selected?.name} onBack={() => setStep('pick')} />
        <View style={styles.authCenter}>
          <View style={[styles.authBankIcon, { backgroundColor: selected?.bg, shadowColor: selected?.bg }]}>
            <Text style={[styles.authBankShort, { color: selected?.fg }]}>{selected?.short}</Text>
          </View>
          <Text style={[styles.authTitle, { color: theme.text }]}>
            Connecting to {selected?.name}
          </Text>
          <Text style={[styles.authStatus, { color: theme.textMuted }]}>{statusMsg}</Text>

          {/* Progress bar */}
          <View style={[styles.progressTrack, { backgroundColor: theme.trackSoft }]}>
            <View style={{ height: '100%', width: `${progress}%`, backgroundColor: selected?.bg || theme.blue, borderRadius: 5 }}/>
          </View>
          <Text style={[styles.progressPct, { color: theme.textMuted }]}>{progress}%</Text>
        </View>
      </SafeAreaView>
    );
  }

  // step === 'pick'
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <PageHeader title="Link your bank" sub="Securely connect to auto-import transactions" onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <View style={styles.bankGrid}>
          {SA_BANKS.map(bank => (
            <TouchableOpacity key={bank.id} activeOpacity={0.82} onPress={() => handlePickBank(bank)}
              style={[styles.bankCard, { borderRadius: theme.rCard, ...theme.cardShadow }]}>
              <LinearGradient colors={[bank.bg, bank.bg + 'CC']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={styles.bankCardInner}>
                <View style={styles.bankLogoWrap}>
                  <Text style={[styles.bankShortText, { color: bank.fg }]}>{bank.short}</Text>
                </View>
                <Text style={[styles.bankName, { color: bank.fg }]}>{bank.name}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.disclaimer, { backgroundColor: theme.sunken }]}>
          <Icon name="check" size={16} color={theme.green}/>
          <Text style={[styles.disclaimerText, { color: theme.textMuted }]}>
            EduRand uses read-only open banking. We never store your login credentials. You can disconnect at any time.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 32 },

  // Success screen
  successCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  successIcon: {
    width: 90, height: 90, borderRadius: 45,
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
    shadowColor: '#00C853', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 8,
  },
  successTitle: { fontSize: 28, fontWeight: '900', letterSpacing: -0.8, marginBottom: 8, textAlign: 'center' },
  successSub: { fontSize: 14, textAlign: 'center', lineHeight: 21, marginBottom: 32 },
  successBtn: { height: 52, backgroundColor: '#00C853', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  successBtnText: { color: '#fff', fontWeight: '800', fontSize: 16, letterSpacing: -0.3 },

  // Auth screen
  authCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  authBankIcon: {
    width: 80, height: 80, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 14, elevation: 6,
  },
  authBankShort: { fontSize: 28, fontWeight: '900', letterSpacing: -0.6 },
  authTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.5, marginBottom: 6, textAlign: 'center' },
  authStatus: { fontSize: 13, marginBottom: 32, textAlign: 'center' },
  progressTrack: { width: '100%', height: 10, borderRadius: 5, overflow: 'hidden', marginBottom: 10 },
  progressPct: { fontSize: 12 },

  // Pick screen bank grid
  bankGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  bankCard: { width: '47%', overflow: 'hidden' },
  bankCardInner: { padding: 20, alignItems: 'center', justifyContent: 'center', minHeight: 90, gap: 8 },
  bankLogoWrap: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  bankShortText: { fontSize: 16, fontWeight: '900', letterSpacing: -0.5 },
  bankName: { fontSize: 13, fontWeight: '700', letterSpacing: -0.2, textAlign: 'center' },

  // Disclaimer
  disclaimer: { marginTop: 24, flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 14, borderRadius: 12 },
  disclaimerText: { flex: 1, fontSize: 12, lineHeight: 18 },
});
