import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../AppContext';
import Icon from '../components/Icon';
import { Card, SectionLabel, PageHeader } from '../components/ui';
import { TRANSPORT, R } from '../data';

export default function TransportScreen({ navigation }) {
  const { theme, persona } = useApp();
  const [from, setFrom] = useState(persona.uniShort);
  const [to, setTo]     = useState('City Centre');
  const [chosen, setChosen] = useState(TRANSPORT[0].id);

  const selectedOption = TRANSPORT.find(t => t.id === chosen);
  const cheapest = TRANSPORT.reduce((a, b) => a.cost < b.cost ? a : b);
  const savings = selectedOption ? (TRANSPORT.reduce((max, t) => Math.max(max, t.cost), 0) - selectedOption.cost) : 0;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <PageHeader title="Transport" sub="Beat the Uber tax" onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Route inputs */}
        <View style={styles.routePad}>
          <Card>
            <Text style={[styles.routeLabel, { color: theme.textMuted }]}>
              Your route
            </Text>
            <View style={styles.routeFields}>
              {[
                { label: 'From', value: from, onChange: setFrom },
                { label: 'To',   value: to,   onChange: setTo   },
              ].map(field => (
                <View key={field.label} style={[styles.routeField, { backgroundColor: theme.sunken }]}>
                  <Text style={[styles.routeFieldLabel, { color: theme.textMuted }]}>{field.label}</Text>
                  <TextInput
                    value={field.value}
                    onChangeText={field.onChange}
                    style={[styles.routeFieldInput, { color: theme.text }]}
                    placeholderTextColor={theme.textMuted}
                  />
                </View>
              ))}
            </View>
          </Card>
        </View>

        {/* Options */}
        <View style={styles.optionsPad}>
          <SectionLabel>Choose your ride</SectionLabel>
          <View style={styles.optionsList}>
            {TRANSPORT.map(option => {
              const isChosen = chosen === option.id;
              const isCheapest = option.id === cheapest.id;
              return (
                <TouchableOpacity key={option.id} activeOpacity={0.82} onPress={() => setChosen(option.id)}>
                  <Card padded={false} style={{ borderWidth: 2, borderColor: isChosen ? theme.blue : 'transparent' }}>
                    <View style={styles.optionRow}>
                      <View style={[styles.optionIcon, { backgroundColor: isChosen ? theme.blue + '18' : theme.sunken }]}>
                        <Text style={styles.optionEmoji}>{option.icon}</Text>
                      </View>
                      <View style={styles.optionBody}>
                        <View style={styles.optionNameRow}>
                          <Text style={[styles.optionMode, { color: theme.text }]}>{option.mode}</Text>
                          {isCheapest && (
                            <View style={styles.cheapestBadge}>
                              <Text style={styles.cheapestText}>CHEAPEST</Text>
                            </View>
                          )}
                        </View>
                        <Text style={[styles.optionNote, { color: theme.textMuted }]}>{option.note}</Text>
                      </View>
                      <View style={styles.optionCost}>
                        <Text style={[styles.optionCostText, { color: option.cost === 0 ? '#00C853' : theme.text }]}>
                          {option.cost === 0 ? 'Free' : R(option.cost)}
                        </Text>
                        <Text style={[styles.optionTime, { color: theme.textMuted }]}>{option.time}</Text>
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Savings callout */}
        {selectedOption && (
          <View style={styles.savingsPad}>
            <LinearGradient colors={['#00C853', '#009624']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={[styles.savingsGradient, { borderRadius: theme.rCard }]}>
              <View style={styles.savingsIcon}>
                <Text style={styles.savingsIconText}>{selectedOption.icon}</Text>
              </View>
              <View style={styles.savingsBody}>
                <Text style={styles.savingsSelected}>
                  {selectedOption.mode} selected
                </Text>
                {savings > 0 ? (
                  <Text style={styles.savingsAmt}>
                    Saves you {R(savings)} vs Uber
                  </Text>
                ) : (
                  <Text style={styles.savingsAmt}>
                    You picked the most expensive option
                  </Text>
                )}
                <Text style={styles.savingsMeta}>{selectedOption.time} · {selectedOption.note}</Text>
              </View>
            </LinearGradient>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: { paddingBottom: 32 },

  // Route inputs
  routePad: { paddingHorizontal: 20 },
  routeLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 },
  routeFields: { gap: 10 },
  routeField: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  routeFieldLabel: { fontSize: 12, fontWeight: '700', width: 34 },
  routeFieldInput: { flex: 1, fontSize: 14, fontWeight: '600', letterSpacing: -0.2 },

  // Options list
  optionsPad: { paddingHorizontal: 20, marginTop: 16 },
  optionsList: { gap: 10, marginTop: 10 },
  optionRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  optionIcon: { width: 46, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  optionEmoji: { fontSize: 24 },
  optionBody: { flex: 1 },
  optionNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  optionMode: { fontSize: 15, fontWeight: '700', letterSpacing: -0.3 },
  cheapestBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 999, backgroundColor: '#00C85320' },
  cheapestText: { fontSize: 10, fontWeight: '800', color: '#00C853' },
  optionNote: { fontSize: 12, marginTop: 3 },
  optionCost: { alignItems: 'flex-end', gap: 4 },
  optionCostText: { fontSize: 16, fontWeight: '900', letterSpacing: -0.4 },
  optionTime: { fontSize: 11 },

  // Savings callout
  savingsPad: { paddingHorizontal: 20, marginTop: 16 },
  savingsGradient: { padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14 },
  savingsIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  savingsIconText: { fontSize: 22 },
  savingsBody: { flex: 1 },
  savingsSelected: { fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: '600', marginBottom: 2 },
  savingsAmt: { fontSize: 16, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
  savingsMeta: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
});
