import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../AppContext';
import { signIn } from '../lib/api';
import Icon from '../components/Icon';

function Field({ label, icon, value, onChangeText, secureTextEntry, keyboardType, theme }) {
  return (
    <View style={styles.fieldWrapper}>
      <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>{label}</Text>
      <View style={[styles.fieldInput, { backgroundColor: theme.inputBg, borderRadius: theme.rInput, borderColor: theme.inputBorder, overflow: 'hidden' }]}>
        <View style={styles.fieldIconWrap}>
          <Icon name={icon} size={18} color={theme.textMuted}/>
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize="none"
          style={[styles.fieldTextInput, { color: theme.text }]}
          placeholderTextColor={theme.textMuted}
        />
      </View>
    </View>
  );
}

function Divider({ label, theme }) {
  return (
    <View style={styles.dividerRow}>
      <View style={[styles.dividerLine, { backgroundColor: theme.track }]}/>
      <Text style={[styles.dividerLabel, { color: theme.textMuted }]}>{label}</Text>
      <View style={[styles.dividerLine, { backgroundColor: theme.track }]}/>
    </View>
  );
}

export default function LoginScreen({ navigation }) {
  const { theme, t } = useApp();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!email.trim() || !pw) return;
    setLoading(true);
    setError('');
    try {
      await signIn(email.trim(), pw);
      navigation.replace('Main');
    } catch (e) {
      setError(e.message || 'Sign in failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: theme.sunken }]}>
          <Icon name="arrowLeft" size={20} color={theme.text}/>
        </TouchableOpacity>

        <View style={styles.titleBlock}>
          <Text style={[styles.title, { color: theme.text }]}>{t.loginTitle}</Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>{t.loginSub}</Text>
        </View>

        <View style={styles.fieldGroup}>
          <Field label={t.email} icon="mail" value={email} onChangeText={setEmail} keyboardType="email-address" theme={theme}/>
          <Field label={t.password} icon="lock" value={pw} onChangeText={setPw} secureTextEntry theme={theme}/>
          {!!error && <Text style={styles.errorText}>{error}</Text>}
          <TouchableOpacity style={styles.forgotWrap}>
            <Text style={[styles.forgotText, { color: theme.blue }]}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.ctaGroup}>
          <TouchableOpacity activeOpacity={0.88} onPress={submit} style={styles.primaryBtn} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#0F172A"/>
              : <Text style={styles.primaryBtnText}>{t.login}</Text>}
          </TouchableOpacity>

          <Divider label={t.or} theme={theme}/>

          <TouchableOpacity activeOpacity={0.85}
            style={[styles.googleBtn, { borderRadius: theme.rBtn, backgroundColor: theme.btnSecBg }]}>
            <Text style={styles.googleIcon}>G</Text>
            <Text style={[styles.googleBtnText, { color: theme.btnSecFg }]}>{t.continueGoogle}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.replace('Signup')} style={styles.switchRow}>
            <Text style={[styles.switchText, { color: theme.textMuted }]}>
              {t.noAccount}{' '}
              <Text style={[styles.switchLink, { color: theme.blue }]}>{t.signup}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 24, flexGrow: 1 },
  backBtn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  titleBlock: { marginBottom: 32, marginTop: 8 },
  title: { fontSize: 36, fontWeight: '900', letterSpacing: -1 },
  subtitle: { fontSize: 15, marginTop: 8, lineHeight: 22 },
  fieldGroup: { gap: 16 },
  fieldWrapper: { gap: 6 },
  fieldLabel: { fontSize: 11.5, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  fieldInput: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5 },
  fieldIconWrap: { paddingLeft: 14, paddingRight: 4 },
  fieldTextInput: { flex: 1, height: 52, fontSize: 15, fontWeight: '500', paddingHorizontal: 8 },
  forgotWrap: { alignSelf: 'flex-end' },
  forgotText: { fontSize: 13, fontWeight: '600' },
  errorText: { fontSize: 13, color: '#EF4444', fontWeight: '500' },
  ctaGroup: { gap: 14, marginTop: 32 },
  primaryBtn: { height: 54, borderRadius: 16, backgroundColor: '#FFE48A', alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { fontSize: 17, fontWeight: '800', color: '#0F172A', letterSpacing: -0.4 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dividerLine: { flex: 1, height: 1 },
  dividerLabel: { fontSize: 12 },
  googleBtn: { height: 52, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  googleIcon: { fontSize: 22 },
  googleBtnText: { fontWeight: '700', fontSize: 15 },
  switchRow: { alignItems: 'center', paddingVertical: 8 },
  switchText: { fontSize: 13 },
  switchLink: { fontWeight: '700' },
});
