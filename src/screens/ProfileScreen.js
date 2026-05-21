import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../AppContext';
import { signOut } from '../lib/api';
import Icon from '../components/Icon';
import { Card, PageHeader, SectionLabel, Toggle } from '../components/ui';
import { ACHIEVEMENTS, R } from '../data';

const LANG_NAMES = { en: 'English', zu: 'isiZulu', af: 'Afrikaans' };

function StatCol({ value, label, color, showBorder }) {
  const { theme } = useApp();
  return (
    <View style={[styles.statCol, { borderLeftWidth: showBorder ? 1 : 0, borderRightWidth: showBorder ? 1 : 0, borderColor: theme.trackSoft }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.textMuted }]}>{label}</Text>
    </View>
  );
}

function SettingsRow({ icon, label, detail, trailing, last, onPress }) {
  const { theme } = useApp();
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={onPress ? 0.7 : 1}
      style={[styles.settingsRow, { borderBottomWidth: last ? 0 : 1, borderBottomColor: theme.trackSoft }]}>
      <View style={[styles.settingsRowIcon, { backgroundColor: theme.sunken }]}>
        <Icon name={icon} size={16} color={theme.text}/>
      </View>
      <Text style={[styles.settingsRowLabel, { color: theme.text }]}>{label}</Text>
      {detail && <Text style={[styles.settingsRowDetail, { color: onPress ? theme.blue : theme.textMuted, fontWeight: onPress ? '700' : '400' }]}>{detail}</Text>}
      {trailing}
    </TouchableOpacity>
  );
}

export default function ProfileScreen({ navigation }) {
  const { theme, t, persona, user, lang, setLang, dark, setDark } = useApp();
  const userEmail = user?.email ?? (persona.short.toLowerCase() + '@student.ac.za');

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: async () => {
        try { await signOut(); } catch {}
        navigation.replace('Splash');
      }},
    ]);
  };

  const cycleLang = () => {
    const langs = ['en', 'zu', 'af'];
    const next = langs[(langs.indexOf(lang) + 1) % langs.length];
    setLang(next);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <PageHeader title={t.profile} sub="Account & rewards"/>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Identity card */}
        <View style={styles.sectionPad}>
          <Card padded={false}>
            <View style={styles.identityRow}>
              <LinearGradient colors={[theme.blue, '#7C3AED']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={[styles.avatar, { shadowColor: theme.blue }]}>
                <Text style={styles.avatarText}>{persona.initials}</Text>
              </LinearGradient>
              <View style={styles.identityBody}>
                <Text style={[styles.identityName, { color: theme.text }]}>{persona.name}</Text>
                <Text style={[styles.identityEmail, { color: theme.textMuted }]}>{userEmail}</Text>
                <View style={styles.badgeRow}>
                  <View style={[styles.badge, { backgroundColor: theme.blue + '18' }]}>
                    <Text style={[styles.badgeText, { color: theme.blue }]}>{persona.uniShort}</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: theme.sunken }]}>
                    <Text style={[styles.badgeText, { color: theme.text }]}>{persona.funding}</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.statRow, { borderTopColor: theme.trackSoft }]}>
              <StatCol value={R(340)} label="Saved"   color={theme.blue}/>
              <StatCol value="3"     label="Lessons" color="#FFB300" showBorder/>
              <StatCol value="3"     label="Awards"  color={theme.green}/>
            </View>
          </Card>
        </View>

        {/* Achievements */}
        <View style={styles.achievementsPad}>
          <SectionLabel>Achievements</SectionLabel>
          <View style={styles.achievementsList}>
            {ACHIEVEMENTS.map(a => (
              <View key={a.id} style={[styles.achievement, { backgroundColor: theme.surface, borderRadius: theme.rCard, opacity: a.earned ? 1 : 0.5, ...theme.cardShadow }]}>
                <View style={[styles.achievementIcon, { backgroundColor: a.earned ? '#FFB30020' : theme.sunken }]}>
                  <Text style={styles.achievementEmoji}>{a.icon}</Text>
                </View>
                <View style={styles.achievementBody}>
                  <Text style={[styles.achievementName, { color: theme.text }]}>{a.name}</Text>
                  <Text style={[styles.achievementDesc, { color: theme.textMuted }]}>{a.desc}</Text>
                </View>
                {a.earned && <Icon name="check" size={20} color={theme.green}/>}
              </View>
            ))}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.settingsPad}>
          <SectionLabel>Settings</SectionLabel>
          <Card padded={false} style={styles.settingsCard}>
            <SettingsRow icon="moon"     label="Dark mode"           trailing={<Toggle value={dark} onValueChange={setDark}/>}/>
            <SettingsRow icon="bell"     label="Crisis alerts"       trailing={<Toggle value={true} onValueChange={() => {}}/>}/>
            <SettingsRow icon="map"      label="Language"            detail={LANG_NAMES[lang]}   onPress={cycleLang}/>
            <SettingsRow icon="settings" label="WhatsApp coaching"   detail="Open chat →"         onPress={() => Alert.alert('WhatsApp', 'This would open the coaching WhatsApp chat.')}/>
            <SettingsRow icon="wallet"   label="Link bank"           detail="Connect →"           onPress={() => navigation.navigate('LinkBank')} last/>
          </Card>
        </View>

        {/* Sign out */}
        <View style={styles.signOutPad}>
          <TouchableOpacity onPress={handleSignOut} style={styles.signOutBtn}>
            <Text style={styles.signOutText}>Sign out</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.versionText, { color: theme.textMuted }]}>
          EduRand · v1.0 · Built in 🇿🇦 for students
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: { paddingBottom: 32 },

  // Identity card
  sectionPad: { paddingHorizontal: 20 },
  identityRow: { flexDirection: 'row', padding: 18, gap: 14, alignItems: 'center' },
  avatar: {
    width: 64, height: 64, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  avatarText: { fontSize: 24, fontWeight: '900', color: '#fff', letterSpacing: -0.6 },
  identityBody: { flex: 1 },
  identityName: { fontWeight: '800', fontSize: 19, letterSpacing: -0.5 },
  identityEmail: { fontSize: 12.5, marginTop: 2 },
  badgeRow: { flexDirection: 'row', gap: 6, marginTop: 8, flexWrap: 'wrap' },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  statRow: { flexDirection: 'row', borderTopWidth: 1 },
  statCol: { flex: 1, padding: 14, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '900', letterSpacing: -0.6 },
  statLabel: { fontSize: 11, marginTop: 2 },

  // Achievements
  achievementsPad: { paddingHorizontal: 20, marginTop: 20 },
  achievementsList: { gap: 10, marginTop: 10 },
  achievement: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  achievementIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  achievementEmoji: { fontSize: 22 },
  achievementBody: { flex: 1 },
  achievementName: { fontWeight: '700', fontSize: 14.5 },
  achievementDesc: { fontSize: 12, marginTop: 2 },

  // Settings
  settingsPad: { paddingHorizontal: 20, marginTop: 20 },
  settingsCard: { marginTop: 10 },
  settingsRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  settingsRowIcon: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  settingsRowLabel: { flex: 1, fontWeight: '600', fontSize: 14, letterSpacing: -0.2 },
  settingsRowDetail: { fontSize: 12.5 },

  // Sign out
  signOutPad: { paddingHorizontal: 20, marginTop: 20 },
  signOutBtn: { height: 54, borderRadius: 16, backgroundColor: '#FFE48A', alignItems: 'center', justifyContent: 'center' },
  signOutText: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  versionText: { textAlign: 'center', fontSize: 11, marginTop: 16 },
});
