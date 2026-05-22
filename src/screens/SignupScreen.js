import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../AppContext';
import { signUp } from '../lib/api';
import Icon from '../components/Icon';

function Field({ label, icon, value, onChangeText, secureTextEntry, keyboardType, theme }) {
  return (
    <View style={styles.fieldWrapper}>
      <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>{label}</Text>
      <View style={[styles.fieldInput, { backgroundColor: theme.inputBg, borderRadius: theme.rInput, borderColor: theme.inputBorder }]}>
        <View style={styles.fieldIconWrap}>
          <Icon name={icon} size={18} color={theme.textMuted}/>
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
          style={[styles.fieldTextInput, { color: theme.text }]}
          placeholderTextColor={theme.textMuted}
        />
      </View>
    </View>
  );
}

function Chip({ label, active, onPress, theme }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.chip, {
      borderRadius: theme.rBtnSm,
      backgroundColor: active ? theme.blue : theme.sunken,
      borderWidth: active ? 0 : 1, borderColor: theme.trackSoft,
    }]}>
      <Text style={[styles.chipText, { color: active ? '#fff' : theme.text }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function FundCard({ id, label, sub, active, onPress, theme }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.fundCard, {
      borderRadius: theme.rCard,
      backgroundColor: active ? theme.blue + '14' : theme.sunken,
      borderColor: active ? theme.blue : 'transparent',
    }]}>
      <View style={[styles.fundRadio, {
        borderWidth: active ? 7 : 2,
        borderColor: active ? theme.blue : theme.track,
      }]}/>
      <View style={styles.fundBody}>
        <Text style={[styles.fundLabel, { color: theme.text }]}>{label}</Text>
        <Text style={[styles.fundSub, { color: theme.textMuted }]}>{sub}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function SignupScreen({ navigation }) {
  const { theme, t } = useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [uni, setUni] = useState('UCT');
  const [fund, setFund] = useState('nsfas');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const next = async () => {
    if (step < 1) {
      if (!name.trim() || !email.trim() || !pw) { setError('Please fill in all fields.'); return; }
      setError('');
      setStep(1);
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signUp(email.trim(), pw, { name: name.trim(), university: uni, fundingType: fund });
      navigation.replace('Main');
    } catch (e) {
      setError(e.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const UNIS = ['UCT', 'Wits', 'Stellies', 'UJ', 'UP', 'Other'];
  const FUNDS = [
    { id: 'nsfas',   label: 'NSFAS',         sub: 'Most common for SA undergrads' },
    { id: 'bursary', label: 'Bursary',        sub: 'Company or merit-based' },
    { id: 'self',    label: 'Self / family',  sub: 'Part-time, parents, or both' },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.progressRow}>
          <TouchableOpacity onPress={step === 0 ? () => navigation.goBack() : () => setStep(0)}
            style={[styles.backBtn, { backgroundColor: theme.sunken }]}>
            <Icon name="arrowLeft" size={20} color={theme.text}/>
          </TouchableOpacity>
          <View style={[styles.progressTrack, { backgroundColor: theme.track }]}>
            <View style={{ height: '100%', width: `${(step + 1) * 50}%`, backgroundColor: theme.blue, borderRadius: 4 }}/>
          </View>
          <Text style={[styles.stepCount, { color: theme.textMuted }]}>{step + 1}/2</Text>
        </View>

        <View style={styles.titleBlock}>
          <Text style={[styles.title, { color: theme.text }]}>
            {step === 0 ? t.signupTitle : 'Tell us about you'}
          </Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
            {step === 0 ? t.signupSub : 'So we can tailor your tips.'}
          </Text>
        </View>

        <View style={styles.formArea}>
          {!!error && <Text style={styles.errorText}>{error}</Text>}
          {step === 0 ? (
            <>
              <Field label={t.fullName} icon="user" value={name} onChangeText={setName} theme={theme}/>
              <Field label={t.email} icon="mail" value={email} onChangeText={setEmail} keyboardType="email-address" theme={theme}/>
              <Field label={t.password} icon="lock" value={pw} onChangeText={setPw} secureTextEntry theme={theme}/>
            </>
          ) : (
            <>
              <View style={styles.sectionGroup}>
                <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>{t.university}</Text>
                <View style={styles.chipRow}>
                  {UNIS.map(u => <Chip key={u} label={u} active={uni === u} onPress={() => setUni(u)} theme={theme}/>)}
                </View>
              </View>
              <View style={styles.sectionGroup}>
                <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>{t.funding}</Text>
                {FUNDS.map(f => <FundCard key={f.id} {...f} active={fund === f.id} onPress={() => setFund(f.id)} theme={theme}/>)}
              </View>
            </>
          )}
        </View>

        <View style={styles.ctaGroup}>
          <TouchableOpacity activeOpacity={0.88} onPress={next} style={styles.primaryBtn} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#0F172A"/>
              : <Text style={styles.primaryBtnText}>{step === 0 ? t.next : t.getStarted} →</Text>}
          </TouchableOpacity>
          {step === 0 && (
            <TouchableOpacity onPress={() => navigation.replace('Login')} style={styles.switchRow}>
              <Text style={[styles.switchText, { color: theme.textMuted }]}>
                {t.haveAccount}{' '}<Text style={[styles.switchLink, { color: theme.blue }]}>{t.login}</Text>
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 24, flexGrow: 1 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
  backBtn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  progressTrack: { flex: 1, height: 4, borderRadius: 4, overflow: 'hidden' },
  stepCount: { fontSize: 12, fontWeight: '600' },
  titleBlock: { marginBottom: 24 },
  title: { fontSize: 34, fontWeight: '900', letterSpacing: -1 },
  subtitle: { fontSize: 14, marginTop: 8, lineHeight: 20 },
  formArea: { gap: 14, flex: 1 },
  fieldWrapper: { gap: 6 },
  fieldLabel: { fontSize: 11.5, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  fieldInput: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5 },
  fieldIconWrap: { paddingLeft: 14, paddingRight: 4 },
  fieldTextInput: { flex: 1, height: 52, fontSize: 15, fontWeight: '500', paddingHorizontal: 8 },
  sectionGroup: { gap: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingVertical: 10, paddingHorizontal: 12, alignItems: 'center' },
  chipText: { fontSize: 13, fontWeight: '600' },
  fundCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderWidth: 2 },
  fundRadio: { width: 22, height: 22, borderRadius: 11, backgroundColor: 'transparent' },
  fundBody: { flex: 1 },
  fundLabel: { fontWeight: '700', fontSize: 15 },
  fundSub: { fontSize: 12 },
  ctaGroup: { gap: 12, marginTop: 24 },
  primaryBtn: { height: 54, borderRadius: 16, backgroundColor: '#FFE48A', alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { fontSize: 17, fontWeight: '800', color: '#0F172A', letterSpacing: -0.4 },
  switchRow: { alignItems: 'center', paddingVertical: 8 },
  switchText: { fontSize: 13 },
  switchLink: { fontWeight: '700' },
  errorText: { fontSize: 13, color: '#EF4444', fontWeight: '500' },
});
