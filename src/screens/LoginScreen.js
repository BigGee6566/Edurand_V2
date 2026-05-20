import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../AppContext';
import Icon from '../components/Icon';

function Field({ label, icon, value, onChangeText, secureTextEntry, keyboardType, theme }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontSize: 11.5, fontWeight: '700', color: theme.textMuted, letterSpacing: 1, textTransform: 'uppercase' }}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: theme.inputBg, borderRadius: theme.rInput, borderWidth: 1.5, borderColor: theme.inputBorder, overflow: 'hidden' }}>
        <View style={{ paddingLeft: 14, paddingRight: 4 }}>
          <Icon name={icon} size={18} color={theme.textMuted}/>
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize="none"
          style={{ flex: 1, height: 52, fontSize: 15, fontWeight: '500', color: theme.text, paddingHorizontal: 8 }}
          placeholderTextColor={theme.textMuted}
        />
      </View>
    </View>
  );
}

function Divider({ label, theme }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <View style={{ flex: 1, height: 1, backgroundColor: theme.track }}/>
      <Text style={{ fontSize: 12, color: theme.textMuted }}>{label}</Text>
      <View style={{ flex: 1, height: 1, backgroundColor: theme.track }}/>
    </View>
  );
}

export default function LoginScreen({ navigation }) {
  const { theme, t, persona } = useApp();
  const [email, setEmail] = useState(persona.short.toLowerCase() + '@student.ac.za');
  const [pw, setPw] = useState('••••••••');
  const [loading, setLoading] = useState(false);

  const submit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); navigation.replace('Main'); }, 700);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView contentContainerStyle={{ padding: 24, flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: theme.sunken }]}>
          <Icon name="arrowLeft" size={20} color={theme.text}/>
        </TouchableOpacity>

        <View style={{ marginBottom: 32, marginTop: 8 }}>
          <Text style={{ fontSize: 36, fontWeight: '900', color: theme.text, letterSpacing: -1 }}>{t.loginTitle}</Text>
          <Text style={{ fontSize: 15, color: theme.textMuted, marginTop: 8, lineHeight: 22 }}>{t.loginSub}</Text>
        </View>

        <View style={{ gap: 16 }}>
          <Field label={t.email} icon="mail" value={email} onChangeText={setEmail} keyboardType="email-address" theme={theme}/>
          <Field label={t.password} icon="lock" value={pw} onChangeText={setPw} secureTextEntry theme={theme}/>
          <TouchableOpacity style={{ alignSelf: 'flex-end' }}>
            <Text style={{ fontSize: 13, color: theme.blue, fontWeight: '600' }}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <View style={{ gap: 14, marginTop: 32 }}>
          <TouchableOpacity activeOpacity={0.88} onPress={submit} style={styles.primaryBtn} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#0F172A"/>
              : <Text style={styles.primaryBtnText}>{t.login}</Text>}
          </TouchableOpacity>

          <Divider label={t.or} theme={theme}/>

          <TouchableOpacity activeOpacity={0.85} onPress={submit}
            style={{ height: 52, borderRadius: theme.rBtn, backgroundColor: theme.btnSecBg, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}>
            <Text style={{ fontSize: 22 }}>G</Text>
            <Text style={{ fontWeight: '700', fontSize: 15, color: theme.btnSecFg }}>{t.continueGoogle}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.replace('Signup')} style={{ alignItems: 'center', paddingVertical: 8 }}>
            <Text style={{ fontSize: 13, color: theme.textMuted }}>
              {t.noAccount}{' '}
              <Text style={{ color: theme.blue, fontWeight: '700' }}>{t.signup}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backBtn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  primaryBtn: { height: 54, borderRadius: 16, backgroundColor: '#FFE48A', alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { fontSize: 17, fontWeight: '800', color: '#0F172A', letterSpacing: -0.4 },
});
