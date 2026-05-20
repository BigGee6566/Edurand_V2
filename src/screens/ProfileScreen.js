import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../AppContext';
import Icon from '../components/Icon';
import { Card, PageHeader, SectionLabel, Toggle } from '../components/ui';
import { ACHIEVEMENTS, R } from '../data';

const LANG_NAMES = { en: 'English', zu: 'isiZulu', af: 'Afrikaans' };

function StatCol({ value, label, color, showBorder }) {
  const { theme } = useApp();
  return (
    <View style={{ flex: 1, padding: 14, alignItems: 'center', borderLeftWidth: showBorder ? 1 : 0, borderRightWidth: showBorder ? 1 : 0, borderColor: theme.trackSoft }}>
      <Text style={{ fontSize: 22, fontWeight: '900', color, letterSpacing: -0.6 }}>{value}</Text>
      <Text style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>{label}</Text>
    </View>
  );
}

function SettingsRow({ icon, label, detail, trailing, last, onPress }) {
  const { theme } = useApp();
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={onPress ? 0.7 : 1}
      style={[styles.settingsRow, { borderBottomWidth: last ? 0 : 1, borderBottomColor: theme.trackSoft }]}>
      <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: theme.sunken, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={16} color={theme.text}/>
      </View>
      <Text style={{ flex: 1, fontWeight: '600', fontSize: 14, color: theme.text, letterSpacing: -0.2 }}>{label}</Text>
      {detail && <Text style={{ fontSize: 12.5, color: onPress ? theme.blue : theme.textMuted, fontWeight: onPress ? '700' : '400' }}>{detail}</Text>}
      {trailing}
    </TouchableOpacity>
  );
}

export default function ProfileScreen({ navigation }) {
  const { theme, t, persona, lang, setLang, dark, setDark } = useApp();

  const signOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => navigation.replace('Splash') },
    ]);
  };

  const cycleLang = () => {
    const langs = ['en', 'zu', 'af'];
    const next = langs[(langs.indexOf(lang) + 1) % langs.length];
    setLang(next);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <PageHeader title={t.profile} sub="Account & rewards"/>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        {/* Identity card */}
        <View style={{ paddingHorizontal: 20 }}>
          <Card padded={false}>
            <View style={{ flexDirection: 'row', padding: 18, gap: 14, alignItems: 'center' }}>
              <LinearGradient colors={[theme.blue, '#7C3AED']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={{ width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', shadowColor: theme.blue, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 }}>
                <Text style={{ fontSize: 24, fontWeight: '900', color: '#fff', letterSpacing: -0.6 }}>{persona.initials}</Text>
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '800', fontSize: 19, color: theme.text, letterSpacing: -0.5 }}>{persona.name}</Text>
                <Text style={{ fontSize: 12.5, color: theme.textMuted, marginTop: 2 }}>{persona.short.toLowerCase()}@student.ac.za</Text>
                <View style={{ flexDirection: 'row', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                  <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, backgroundColor: theme.blue + '18' }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: theme.blue }}>{persona.uniShort}</Text>
                  </View>
                  <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, backgroundColor: theme.sunken }}>
                    <Text style={{ fontSize: 11, fontWeight: '600', color: theme.text }}>{persona.funding}</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: theme.trackSoft }}>
              <StatCol value={R(340)} label="Saved"   color={theme.blue}/>
              <StatCol value="3"     label="Lessons" color="#FFB300" showBorder/>
              <StatCol value="3"     label="Awards"  color={theme.green}/>
            </View>
          </Card>
        </View>

        {/* Achievements */}
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <SectionLabel>Achievements</SectionLabel>
          <View style={{ gap: 10, marginTop: 10 }}>
            {ACHIEVEMENTS.map(a => (
              <View key={a.id} style={[styles.achievement, { backgroundColor: theme.surface, borderRadius: theme.rCard, opacity: a.earned ? 1 : 0.5, ...theme.cardShadow }]}>
                <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: a.earned ? '#FFB30020' : theme.sunken, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 22 }}>{a.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', fontSize: 14.5, color: theme.text }}>{a.name}</Text>
                  <Text style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>{a.desc}</Text>
                </View>
                {a.earned && <Icon name="check" size={20} color={theme.green}/>}
              </View>
            ))}
          </View>
        </View>

        {/* Settings */}
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <SectionLabel>Settings</SectionLabel>
          <Card padded={false} style={{ marginTop: 10 }}>
            <SettingsRow icon="moon"     label="Dark mode"           trailing={<Toggle value={dark} onValueChange={setDark}/>}/>
            <SettingsRow icon="bell"     label="Crisis alerts"       trailing={<Toggle value={true} onValueChange={() => {}}/>}/>
            <SettingsRow icon="map"      label="Language"            detail={LANG_NAMES[lang]}   onPress={cycleLang}/>
            <SettingsRow icon="settings" label="WhatsApp coaching"   detail="Open chat →"         onPress={() => Alert.alert('WhatsApp', 'This would open the coaching WhatsApp chat.')}/>
            <SettingsRow icon="wallet"   label="Link bank"           detail="Connect →"           onPress={() => Alert.alert('Link Bank', 'Bank linking coming soon.')} last/>
          </Card>
        </View>

        {/* Sign out */}
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <TouchableOpacity onPress={signOut} style={[styles.signOutBtn, { backgroundColor: '#FFE48A' }]}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#0F172A' }}>Sign out</Text>
          </TouchableOpacity>
        </View>

        <Text style={{ textAlign: 'center', fontSize: 11, color: theme.textMuted, marginTop: 16 }}>
          EduRand · v1.0 · Built in 🇿🇦 for students
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  settingsRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  achievement: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  signOutBtn: { height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
});
