import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../AppContext';
import Icon from '../components/Icon';
import { Card, SectionLabel, PageHeader } from '../components/ui';

const KNOWN_SCAMS = [
  { id:'s1', label:'NSFAS',   color:'#EF4444', title:'Fake NSFAS allowance "verification" SMS',    tag:'Active this week', sample:'"NSFAS: Your June allowance of R5000 is on hold. Verify at nsfas-claim[.]co.za"', flags:['Sketchy domain','Inflated amount','Urgency + link'] },
  { id:'s2', label:'Capitec', color:'#FFB300', title:'Capitec OTP phishing',                       tag:'Common',           sample:'"Capitec: Suspicious activity. Confirm OTP at this link or account frozen."',        flags:['Banks never ask OTP via link','Threat of frozen account'] },
  { id:'s3', label:'Bursary', color:'#7C3AED', title:'"Bursary winner" WhatsApp scam',             tag:'Targeting 1st years', sample:'"Congrats! SAYouth bursary selected. Pay R250 admin fee to claim."',               flags:['Legitimate bursaries never charge a fee','Pressure tactics'] },
  { id:'s4', label:'Loan',    color:'#EC4899', title:'Mashonisa / quick-loan trap',                tag:'High harm',        sample:'"No credit check. Instant R3000. WhatsApp +27 73..."',                              flags:['No credit check = predatory','Personal phone number'] },
];

function scanHeuristic(msg) {
  const s = msg.toLowerCase();
  const flags = [];
  if (/(http|bit\.ly|tinyurl|\.co\.za\/|\.zw|\.tk)/.test(s)) flags.push('Contains a shortened or suspicious link');
  if (/(otp|pin|password|verify|confirm)/.test(s)) flags.push('Asks for OTP / password / verification');
  if (/(urgent|now|immediately|frozen|suspended)/.test(s)) flags.push('Uses urgency and pressure');
  if (/(fee|pay|deposit|admin)/.test(s)) flags.push('Asks for a payment up front');
  if (/(winner|congratulations|selected|prize)/.test(s)) flags.push('Unsolicited prize / winner claim');
  const risk = flags.length >= 2 ? 'high' : flags.length === 1 ? 'medium' : 'low';
  return {
    risk,
    verdict: risk === 'high'
      ? 'Almost certainly a scam. Do not click or reply.'
      : risk === 'medium'
      ? 'Some red flags — verify the sender directly first.'
      : 'No obvious red flags, but stay cautious.',
    flags: flags.length ? flags : ['No common scam patterns detected'],
  };
}

const RISK_COLORS = { high: '#EF4444', medium: '#FFB300', low: '#00C853' };
const RISK_BG     = { high: '#EF444415', medium: '#FFB30015', low: '#00C85315' };

export default function ScamShieldScreen({ navigation }) {
  const { theme } = useApp();
  const [message, setMessage] = useState('');
  const [result, setResult] = useState(null);

  const handleScan = () => {
    if (!message.trim()) return;
    setResult(scanHeuristic(message));
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <PageHeader title="Scam Shield" sub="Paste any suspicious message" onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Hero */}
        <View style={styles.heroPad}>
          <LinearGradient colors={['#7C3AED', '#4F46E5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={[styles.heroGradient, { borderRadius: theme.rCard }]}>
            <View style={styles.heroIconWrap}>
              <Text style={styles.heroEmoji}>🛡️</Text>
            </View>
            <Text style={styles.heroTitle}>AI-free scam detector</Text>
            <Text style={styles.heroBody}>
              Paste any SMS, WhatsApp message, or email you are not sure about. We check it for common scam patterns instantly.
            </Text>
          </LinearGradient>
        </View>

        {/* Input */}
        <View style={styles.sectionPad}>
          <Card>
            <Text style={[styles.inputLabel, { color: theme.textMuted }]}>
              Paste the suspicious message
            </Text>
            <TextInput
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={5}
              placeholder="e.g. &quot;NSFAS: Your allowance is on hold. Tap here to verify...&quot;"
              placeholderTextColor={theme.textMuted}
              style={[styles.textInput, { color: theme.text, backgroundColor: theme.sunken }]}
            />
            <TouchableOpacity activeOpacity={0.82} onPress={handleScan}
              style={[styles.scanBtn, { borderRadius: theme.rBtn }]}>
              <Icon name="alert" size={16} color="#fff"/>
              <Text style={styles.scanBtnText}>Scan message</Text>
            </TouchableOpacity>
          </Card>
        </View>

        {/* Verdict */}
        {result && (
          <View style={styles.sectionPad}>
            <Card padded={false} style={{ borderWidth: 1, borderColor: RISK_COLORS[result.risk] + '50', backgroundColor: RISK_BG[result.risk] }}>
              <View style={styles.verdictPad}>
                <View style={styles.verdictBadgeRow}>
                  <View style={[styles.riskBadge, { backgroundColor: RISK_COLORS[result.risk] }]}>
                    <Text style={styles.riskBadgeText}>{result.risk} risk</Text>
                  </View>
                </View>
                <Text style={[styles.verdictText, { color: theme.text }]}>{result.verdict}</Text>
                <Text style={[styles.flagsLabel, { color: theme.textMuted }]}>Flags found</Text>
                {result.flags.map((flag, i) => (
                  <View key={i} style={styles.flagRow}>
                    <View style={[styles.flagDot, { backgroundColor: RISK_COLORS[result.risk] }]}/>
                    <Text style={[styles.flagText, { color: theme.text }]}>{flag}</Text>
                  </View>
                ))}
              </View>
            </Card>
          </View>
        )}

        {/* Known scams */}
        <View style={styles.knownScamsPad}>
          <SectionLabel>Known scams targeting students</SectionLabel>
          <View style={styles.knownScamsList}>
            {KNOWN_SCAMS.map(scam => (
              <Card key={scam.id} padded={false}>
                <View style={styles.scamPad}>
                  <View style={styles.scamHeader}>
                    <View style={[styles.scamBadge, { backgroundColor: scam.color + '20' }]}>
                      <Text style={[styles.scamBadgeText, { color: scam.color }]}>{scam.label}</Text>
                    </View>
                    <Text style={[styles.scamTag, { color: theme.textMuted }]}>{scam.tag}</Text>
                  </View>
                  <Text style={[styles.scamTitle, { color: theme.text }]}>{scam.title}</Text>
                  <View style={[styles.scamSample, { backgroundColor: theme.sunken }]}>
                    <Text style={[styles.scamSampleText, { color: theme.textMuted }]}>{scam.sample}</Text>
                  </View>
                  <View style={styles.scamFlags}>
                    {scam.flags.map((f, i) => (
                      <View key={i} style={styles.scamFlagRow}>
                        <Text style={[styles.scamFlagBang, { color: scam.color }]}>!</Text>
                        <Text style={[styles.scamFlagText, { color: theme.textMuted }]}>{f}</Text>
                      </View>
                    ))}
                  </View>
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

  // Hero
  heroPad: { paddingHorizontal: 20 },
  heroGradient: { padding: 22, overflow: 'hidden' },
  heroIconWrap: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  heroEmoji: { fontSize: 22 },
  heroTitle: { fontSize: 20, fontWeight: '900', color: '#fff', letterSpacing: -0.5, marginBottom: 6 },
  heroBody: { fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 19 },

  // Input card
  sectionPad: { paddingHorizontal: 20, marginTop: 16 },
  inputLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 },
  textInput: {
    fontSize: 14, lineHeight: 21,
    minHeight: 110, textAlignVertical: 'top',
    borderRadius: 10, padding: 12,
  },
  scanBtn: { marginTop: 12, height: 46, backgroundColor: '#7C3AED', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  scanBtnText: { color: '#fff', fontWeight: '800', fontSize: 15, letterSpacing: -0.3 },

  // Verdict
  verdictPad: { padding: 16 },
  verdictBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  riskBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  riskBadgeText: { fontSize: 11, fontWeight: '800', color: '#fff', letterSpacing: 1, textTransform: 'uppercase' },
  verdictText: { fontSize: 15, fontWeight: '700', lineHeight: 21, marginBottom: 12 },
  flagsLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8 },
  flagRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 5 },
  flagDot: { width: 6, height: 6, borderRadius: 3, marginTop: 6 },
  flagText: { flex: 1, fontSize: 13, lineHeight: 19 },

  // Known scams
  knownScamsPad: { paddingHorizontal: 20, marginTop: 20 },
  knownScamsList: { gap: 12, marginTop: 10 },
  scamPad: { padding: 16 },
  scamHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  scamBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  scamBadgeText: { fontSize: 11, fontWeight: '800' },
  scamTag: { fontSize: 11 },
  scamTitle: { fontSize: 14, fontWeight: '700', marginBottom: 8, lineHeight: 20 },
  scamSample: { borderRadius: 8, padding: 10, marginBottom: 10 },
  scamSampleText: { fontSize: 12, fontStyle: 'italic', lineHeight: 18 },
  scamFlags: { gap: 4 },
  scamFlagRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  scamFlagBang: { fontSize: 12, fontWeight: '700' },
  scamFlagText: { flex: 1, fontSize: 12, lineHeight: 17 },
});
