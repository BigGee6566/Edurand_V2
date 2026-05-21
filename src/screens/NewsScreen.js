import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../AppContext';
import Icon from '../components/Icon';
import { Card, SectionLabel, PageHeader } from '../components/ui';
import { NEWS } from '../data';

const FILTERS = ['All', 'NSFAS', 'Banking', 'Saving', 'Side hustle', 'Crisis'];

const CAT_COLORS = {
  NSFAS:         '#0066FF',
  Banking:       '#00C9A7',
  'Side hustle': '#FFB300',
  Saving:        '#00C853',
  Crisis:        '#EF4444',
};

export default function NewsScreen({ navigation }) {
  const { theme } = useApp();
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All' ? NEWS : NEWS.filter(n => n.cat === activeFilter);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <PageHeader title="Student finance news" sub="What matters to your money" onBack={() => navigation.goBack()} />

      {/* Filter chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0 }}
        contentContainerStyle={styles.filterChips}>
        {FILTERS.map(f => {
          const isActive = activeFilter === f;
          const color = CAT_COLORS[f] || theme.blue;
          return (
            <TouchableOpacity key={f} activeOpacity={0.82} onPress={() => setActiveFilter(f)}
              style={[styles.filterChip, { backgroundColor: isActive ? color : theme.sunken }]}>
              <Text style={[styles.filterChipText, { color: isActive ? '#fff' : theme.textMuted }]}>
                {f}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>Nothing here yet</Text>
            <Text style={[styles.emptySub, { color: theme.textMuted }]}>Check back soon for updates in this category.</Text>
          </View>
        )}
        {filtered.map(item => {
          const catColor = CAT_COLORS[item.cat] || theme.blue;
          return (
            <Card key={item.id} padded={false}>
              <View style={styles.cardPad}>
                <View style={styles.cardTop}>
                  <View style={styles.cardBadgeRow}>
                    <View style={[styles.catBadge, { backgroundColor: catColor + '20' }]}>
                      <Text style={[styles.catBadgeText, { color: catColor }]}>{item.cat}</Text>
                    </View>
                    {item.hot && (
                      <View style={styles.hotBadge}>
                        <Text style={styles.hotBadgeText}>HOT</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.cardReadTime, { color: theme.textMuted }]}>{item.mins} min read</Text>
                </View>
                <Text style={[styles.cardTitle, { color: theme.text }]}>{item.title}</Text>
                <Text style={[styles.cardSummary, { color: theme.textMuted }]}>{item.summary}</Text>
                <View style={styles.readMore}>
                  <Text style={[styles.readMoreText, { color: catColor }]}>Read article</Text>
                  <Icon name="arrowRight" size={13} color={catColor}/>
                </View>
              </View>
            </Card>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 32, gap: 12 },

  // Filter chips
  filterChips: { paddingHorizontal: 20, paddingVertical: 12, gap: 8, flexDirection: 'row', alignItems: 'center' },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999 },
  filterChipText: { fontSize: 12, fontWeight: '700' },

  // Empty state
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyEmoji: { fontSize: 32 },
  emptyTitle: { fontSize: 15, fontWeight: '700' },
  emptySub: { fontSize: 13 },

  // News card
  cardPad: { padding: 16 },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  cardBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  catBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  catBadgeText: { fontSize: 11, fontWeight: '800' },
  hotBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, backgroundColor: '#EF444420' },
  hotBadgeText: { fontSize: 10, fontWeight: '800', color: '#EF4444' },
  cardReadTime: { fontSize: 11 },
  cardTitle: { fontSize: 15, fontWeight: '800', letterSpacing: -0.3, lineHeight: 21, marginBottom: 6 },
  cardSummary: { fontSize: 13, lineHeight: 19 },
  readMore: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 12 },
  readMoreText: { fontSize: 12, fontWeight: '700' },
});
