import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../AppContext';
import Icon from '../components/Icon';
import { Card, SectionLabel, PageHeader } from '../components/ui';
import { MEALS, R } from '../data';

export default function MealsScreen({ navigation }) {
  const { theme } = useApp();
  const [selected, setSelected] = useState(null);

  const handleSixty60 = () => {
    Alert.alert(
      'Added to list',
      `${selected?.name} ingredients have been added to your Sixty60 shopping list.`,
      [{ text: 'Great', style: 'default' }]
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <PageHeader title="Budget meals" sub="Recipes under R30/serving" onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Hero */}
        <View style={styles.heroPad}>
          <LinearGradient colors={['#EC4899', '#F97316']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={[styles.heroGradient, { borderRadius: theme.rCard }]}>
            <Text style={styles.heroEmoji}>🍽️</Text>
            <Text style={styles.heroTitle}>Eat well for less</Text>
            <Text style={styles.heroBody}>
              These meals are priced this week at your nearest Shoprite / Pick n Pay. Tap any for the full recipe.
            </Text>
          </LinearGradient>
        </View>

        {/* Meals list */}
        <View style={styles.mealsPad}>
          <SectionLabel>This week's picks</SectionLabel>
          <View style={styles.mealsList}>
            {MEALS.map(meal => (
              <TouchableOpacity key={meal.id} activeOpacity={0.82} onPress={() => setSelected(meal)}>
                <Card padded={false}>
                  <View style={styles.mealRow}>
                    <View style={[styles.mealEmoji, { backgroundColor: theme.sunken }]}>
                      <Text style={styles.mealEmojiText}>{meal.emoji}</Text>
                    </View>
                    <View style={styles.mealBody}>
                      <Text style={[styles.mealName, { color: theme.text }]}>{meal.name}</Text>
                      <Text style={[styles.mealMeta, { color: theme.textMuted }]}>{meal.store} · {meal.time}</Text>
                      <View style={styles.mealBadgeRow}>
                        <View style={styles.costBadge}>
                          <Text style={styles.costBadgeText}>{R(meal.cost)}/serving</Text>
                        </View>
                        <View style={[styles.servingsBadge, { backgroundColor: theme.sunken }]}>
                          <Text style={[styles.servingsBadgeText, { color: theme.textMuted }]}>{meal.servings} servings</Text>
                        </View>
                      </View>
                    </View>
                    <Icon name="arrowRight" size={16} color={theme.textMuted}/>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>

      {/* Meal detail modal */}
      <Modal visible={!!selected} transparent animationType="slide" onRequestClose={() => setSelected(null)}>
        <View style={styles.modalOuter}>
          <View style={[styles.modalSheet, { backgroundColor: theme.surface }]}>
            <ScrollView contentContainerStyle={styles.modalScroll}>
              {selected && (
                <>
                  {/* Handle */}
                  <View style={[styles.handle, { backgroundColor: theme.trackSoft }]}/>

                  {/* Emoji hero */}
                  <View style={styles.emojiHero}>
                    <Text style={styles.emojiHeroText}>{selected.emoji}</Text>
                  </View>
                  <Text style={[styles.modalTitle, { color: theme.text }]}>{selected.name}</Text>

                  {/* Pills */}
                  <View style={styles.pillRow}>
                    <View style={styles.costPill}>
                      <Text style={styles.costPillText}>{R(selected.cost)}/serving</Text>
                    </View>
                    <View style={[styles.infoPill, { backgroundColor: theme.sunken }]}>
                      <Text style={[styles.infoPillText, { color: theme.text }]}>{selected.servings} servings</Text>
                    </View>
                    <View style={[styles.infoPill, { backgroundColor: theme.sunken }]}>
                      <Text style={[styles.infoPillText, { color: theme.text }]}>{selected.time}</Text>
                    </View>
                  </View>

                  {/* Why */}
                  <View style={[styles.whyBox, { backgroundColor: theme.sunken }]}>
                    <Text style={[styles.whyLabel, { color: theme.textMuted }]}>Why this meal?</Text>
                    <Text style={[styles.whyText, { color: theme.text }]}>{selected.why}</Text>
                  </View>

                  {/* Ingredients */}
                  <Text style={[styles.ingredientsLabel, { color: theme.textMuted }]}>Ingredients</Text>
                  {selected.items.map((item, i) => (
                    <View key={i} style={[styles.ingredientRow, {
                      borderBottomWidth: i < selected.items.length - 1 ? 1 : 0,
                      borderBottomColor: theme.trackSoft,
                    }]}>
                      <Text style={[styles.ingredientName, { color: theme.text }]}>{item.name}</Text>
                      <Text style={[styles.ingredientPrice, { color: theme.text }]}>{R(item.price)}</Text>
                    </View>
                  ))}

                  <View style={[styles.totalRow, { backgroundColor: theme.sunken }]}>
                    <Text style={[styles.totalLabel, { color: theme.text }]}>Total basket</Text>
                    <Text style={[styles.totalValue, { color: theme.text }]}>{R(selected.items.reduce((s, i) => s + i.price, 0))}</Text>
                  </View>

                  {/* Actions */}
                  <TouchableOpacity activeOpacity={0.82} onPress={handleSixty60}
                    style={[styles.actionBtn, { borderRadius: theme.rBtn }]}>
                    <Text style={styles.actionBtnText}>Add to Sixty60 list</Text>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.82} onPress={() => setSelected(null)}
                    style={[styles.closeBtn, { borderRadius: theme.rBtn, backgroundColor: theme.sunken }]}>
                    <Text style={[styles.closeBtnText, { color: theme.textMuted }]}>Close</Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: { paddingBottom: 32 },

  // Hero
  heroPad: { paddingHorizontal: 20 },
  heroGradient: { padding: 22, overflow: 'hidden' },
  heroEmoji: { fontSize: 36, marginBottom: 10 },
  heroTitle: { fontSize: 20, fontWeight: '900', color: '#fff', letterSpacing: -0.5, marginBottom: 6 },
  heroBody: { fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 19 },

  // Meals list
  mealsPad: { paddingHorizontal: 20, marginTop: 16 },
  mealsList: { gap: 12, marginTop: 10 },
  mealRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  mealEmoji: { width: 56, height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  mealEmojiText: { fontSize: 28 },
  mealBody: { flex: 1 },
  mealName: { fontSize: 15, fontWeight: '800', letterSpacing: -0.3 },
  mealMeta: { fontSize: 12, marginTop: 2 },
  mealBadgeRow: { flexDirection: 'row', gap: 8, marginTop: 6 },
  costBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, backgroundColor: '#EC489918' },
  costBadgeText: { fontSize: 11, fontWeight: '700', color: '#EC4899' },
  servingsBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  servingsBadgeText: { fontSize: 11, fontWeight: '600' },

  // Modal
  modalOuter: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '85%' },
  modalScroll: { padding: 24 },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  emojiHero: { alignItems: 'center', marginBottom: 16 },
  emojiHeroText: { fontSize: 64 },
  modalTitle: { fontSize: 22, fontWeight: '900', letterSpacing: -0.6, textAlign: 'center', marginBottom: 14 },
  pillRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  costPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: '#EC489920' },
  costPillText: { fontSize: 13, fontWeight: '700', color: '#EC4899' },
  infoPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  infoPillText: { fontSize: 13, fontWeight: '600' },
  whyBox: { borderRadius: 12, padding: 14, marginBottom: 20 },
  whyLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 6 },
  whyText: { fontSize: 14, lineHeight: 20 },
  ingredientsLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10 },
  ingredientRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  ingredientName: { flex: 1, fontSize: 14 },
  ingredientPrice: { fontSize: 14, fontWeight: '700' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginBottom: 20, padding: 12, borderRadius: 10 },
  totalLabel: { fontSize: 14, fontWeight: '700' },
  totalValue: { fontSize: 16, fontWeight: '900' },
  actionBtn: { height: 50, backgroundColor: '#EC4899', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  actionBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  closeBtn: { height: 44, alignItems: 'center', justifyContent: 'center' },
  closeBtnText: { fontWeight: '700', fontSize: 14 },
});
