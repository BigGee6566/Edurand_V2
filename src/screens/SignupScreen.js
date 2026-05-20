import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../AppContext';
import Icon from '../components/Icon';

function Field({ label, icon, value, onChangeText, secureTextEntry, keyboardType, theme }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontSize: 11.5, fontWeight: '700', color: theme.textMuted, letterSpacing: 1, textTransform: 'uppercase' }}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: theme.inputBg, borderRadius: theme.rInput, borderWidth: 1.5, borderColor: theme.inputBorder }}>
        <View style={{ paddingLeft: 14, paddingRight: 4 }}>
          <Icon name={icon} size={18} color={theme.textMuted}/>
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
          style={{ flex: 1, height: 52, fontSize: 15, fontWeight: '500', color: theme.text, paddingHorizontal: 8 }}
          placeholderTextColor={theme.textMuted}
        />
      </View>
    </View>
  );
}

function Chip({ label, active, onPress, theme }) {
  return (
    <TouchableOpacity onPress={onPress} style={{
      paddingVertical: 10, paddingHorizontal: 12, borderRadius: theme.rBtnSm,
      backgroundColor: active ? theme.blue : theme.sunken,
      borderWidth: active ? 0 : 1, borderColor: theme.trackSoft,
      alignItems: 'center',
    }}>
      <Text style={{ fontSize: 13, fontWeight: '600', color: active ? '#fff' : theme.text }}>{label}</Text>
    </TouchableOpacity>
  );
}

function FundCard({ id, label, sub, active, onPress, theme }) {
  return (
    <TouchableOpacity onPress={onPress} style={{
      flexDirection: 'row', alignItems: 'center', gap: 12,
      padding: 14, borderRadius: theme.rCard,
      backgroundColor: active ? theme.blue + '14' : theme.sunken,
      borderWidth: 2, borderColor: active ? theme.blue : 'transparent',
    }}>
      <View style={{
        width: 22, height: 22, borderRadius: 11,
        borderWidth: active ? 7 : 2,
        borderColor: active ? theme.blue : theme.track,
        backgroundColor: 'transparent',
      }}/>
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: '700', fontSize: 15, color: theme.text }}>{label}</Text>
        <Text style={{ fontSize: 12, color: theme.textMuted }}>{sub}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function SignupScreen({ navigation }) {
  const { theme, t, persona, setPersonaId } = useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(persona.name);
  const [email, setEmail] = useState(persona.short.toLowerCase() + '@student.ac.za');
  const [pw, setPw] = useState('');
  const [uni, setUni] = useState('UCT');
  const [fund, setFund] = useState(persona.id);
  const [loading, setLoading] = useState(false);

  const next = () => {
    if (step < 1) { setStep(1); return; }
    setLoading(true);
    setPersonaId(fund);
    setTimeout(() => { setLoading(false); navigation.replace('Main'); }, 800);
  };

  const UNIS = ['UCT', 'Wits', 'Stellies', 'UJ', 'UP', 'Other'];
  const FUNDS = [
    { id: 'nsfas',   label: 'NSFAS',         sub: 'Most common for SA undergrads' },
    { id: 'bursary', label: 'Bursary',        sub: 'Company or merit-based' },
    { id: 'self',    label: 'Self / family',  sub: 'Part-time, parents, or both' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView contentContainerStyle={{ padding: 24, flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <TouchableOpacity onPress={step === 0 ? () => navigation.goBack() : () => setStep(0)}
            style={[styles.backBtn, { backgroundColor: theme.sunken }]}>
            <Icon name="arrowLeft" size={20} color={theme.text}/>
          </TouchableOpacity>
          <View style={{ flex: 1, height: 4, borderRadius: 4, backgroundColor: theme.track, overflow: 'hidden' }}>
            <View style={{ height: '100%', width: `${(step + 1) * 50}%`, backgroundColor: theme.blue, borderRadius: 4 }}/>
          </View>
          <Text style={{ fontSize: 12, color: theme.textMuted, fontWeight: '600' }}>{step + 1}/2</Text>
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 34, fontWeight: '900', color: theme.text, letterSpacing: -1 }}>
            {step === 0 ? t.signupTitle : 'Tell us about you'}
          </Text>
          <Text style={{ fontSize: 14, color: theme.textMuted, marginTop: 8, lineHeight: 20 }}>
            {step === 0 ? t.signupSub : 'So we can tailor your tips.'}
          </Text>
        </View>

        <View style={{ gap: 14, flex: 1 }}>
          {step === 0 ? (
            <>
              <Field label={t.fullName} icon="user" value={name} onChangeText={setName} theme={theme}/>
              <Field label={t.email} icon="mail" value={email} onChangeText={setEmail} keyboardType="email-address" theme={theme}/>
              <Field label={t.password} icon="lock" value={pw} onChangeText={setPw} secureTextEntry theme={theme}/>
            </>
          ) : (
            <>
              <View style={{ gap: 8 }}>
                <Text style={{ fontSize: 11.5, fontWeight: '700', color: theme.textMuted, letterSpacing: 1, textTransform: 'uppercase' }}>{t.university}</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {UNIS.map(u => <Chip key={u} label={u} active={uni === u} onPress={() => setUni(u)} theme={theme}/>)}
                </View>
              </View>
              <View style={{ gap: 8 }}>
                <Text style={{ fontSize: 11.5, fontWeight: '700', color: theme.textMuted, letterSpacing: 1, textTransform: 'uppercase' }}>{t.funding}</Text>
                {FUNDS.map(f => <FundCard key={f.id} {...f} active={fund === f.id} onPress={() => setFund(f.id)} theme={theme}/>)}
              </View>
            </>
          )}
        </View>

        <View style={{ gap: 12, marginTop: 24 }}>
          <TouchableOpacity activeOpacity={0.88} onPress={next} style={styles.primaryBtn} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#0F172A"/>
              : <Text style={styles.primaryBtnText}>{step === 0 ? t.next : t.getStarted} →</Text>}
          </TouchableOpacity>
          {step === 0 && (
            <TouchableOpacity onPress={() => navigation.replace('Login')} style={{ alignItems: 'center', paddingVertical: 8 }}>
              <Text style={{ fontSize: 13, color: theme.textMuted }}>
                {t.haveAccount}{' '}<Text style={{ color: theme.blue, fontWeight: '700' }}>{t.login}</Text>
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backBtn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  primaryBtn: { height: 54, borderRadius: 16, backgroundColor: '#FFE48A', alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { fontSize: 17, fontWeight: '800', color: '#0F172A', letterSpacing: -0.4 },
});
