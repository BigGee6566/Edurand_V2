import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import { useApp } from '../AppContext';
import { Button } from '../components/ui';

function Logo({ size = 56 }) {
  const { theme } = useApp();
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Path d="M6 22 24 13l18 9-18 9-18-9z" fill={theme.blue}/>
      <Path d="M14 27v6c0 2 4 4 10 4s10-2 10-4v-6" fill="none" stroke={theme.blue} strokeWidth="2.5" strokeLinecap="round"/>
      <Circle cx="37" cy="34" r="9" fill={theme.green}/>
      <Path d="M33 28v13" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      <Path d="M33 28h5.5Q43 28 43 31.5Q43 35 38.5 35H33" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <Path d="M38 35l4.5 6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  );
}

export default function SplashScreen({ navigation }) {
  const { theme, t, user, loadingAuth } = useApp();

  useEffect(() => {
    if (!loadingAuth && user) {
      navigation.replace('Main');
    }
  }, [user, loadingAuth]);
  return (
    <LinearGradient colors={[theme.splashBg1, theme.splashBg2]} style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.hero}>
          <View style={[styles.logoCircle, { backgroundColor: theme.splashLogoBg }]}>
            <Logo size={84}/>
          </View>
          <View style={styles.brand}>
            <Text style={styles.wordmark}>
              <Text style={{ color: theme.blue }}>Edu</Text>
              <Text style={{ color: theme.green }}>Rand</Text>
            </Text>
            <Text style={[styles.tagline, { color: theme.textMuted }]}>{t.splashTagline}</Text>
          </View>
          <View style={styles.badges}>
            {['NSFAS-aware', 'WhatsApp coach', 'Built in 🇿🇦'].map(b => (
              <View key={b} style={[styles.chip, { backgroundColor: theme.splashChip }]}>
                <Text style={[styles.chipText, { color: theme.text }]}>{b}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.ctas}>
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => navigation.navigate('Signup')}
            style={styles.primaryBtn}
          >
            <Text style={styles.primaryBtnText}>{t.getStarted} →</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Login')}
            style={styles.ghostBtn}
          >
            <Text style={[styles.ghostBtnText, { color: theme.textMuted }]}>
              {t.haveAccount}{' '}
              <Text style={{ color: theme.blue, fontWeight: '700' }}>{t.login}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: 24 },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 28 },
  logoCircle: {
    width: 140, height: 140, borderRadius: 70,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#0066FF', shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25, shadowRadius: 30, elevation: 10,
  },
  brand: { alignItems: 'center', gap: 8 },
  wordmark: { fontSize: 52, fontWeight: '900', letterSpacing: -1.5 },
  tagline: { fontSize: 16, fontWeight: '500', textAlign: 'center', maxWidth: 260, lineHeight: 22 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999 },
  chipText: { fontSize: 12.5, fontWeight: '600' },
  ctas: { gap: 12, paddingBottom: 8 },
  primaryBtn: {
    height: 56, borderRadius: 16, backgroundColor: '#FFE48A',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#FFB300', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
  },
  primaryBtnText: { fontSize: 17, fontWeight: '800', color: '#0F172A', letterSpacing: -0.4 },
  ghostBtn: { alignItems: 'center', paddingVertical: 12 },
  ghostBtnText: { fontSize: 14 },
});
