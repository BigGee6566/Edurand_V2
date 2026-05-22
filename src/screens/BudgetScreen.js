import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../AppContext';
import Icon from '../components/Icon';
import { Card, PageHeader, SectionLabel, TxnRow } from '../components/ui';
import { CATEGORIES, R } from '../data';

function SummaryTile({ label, value, sub, icon, color, theme }) {
  return (
    <Card style={styles.flex1} padded={false}>
      <View style={styles.summaryTilePad}>
        <View style={styles.summaryTileTop}>
          <View style={[styles.summaryTileIcon, { backgroundColor: color + '20' }]}>
            <Icon name={icon} size={13} color={color}/>
          </View>
          <Text style={[styles.summaryTileLabel, { color: theme.textMuted }]}>{label}</Text>
        </View>
        <Text style={[styles.summaryTileValue, { color: theme.text }]}>{value}</Text>
        <Text style={[styles.summaryTileSub, { color: theme.textMuted }]}>{sub}</Text>
      </View>
    </Card>
  );
}

function CategoryBar({ cat, amount, total, theme }) {
  const pct = total > 0 ? (amount / total) * 100 : 0;
  return (
    <View style={styles.catBarWrapper}>
      <View style={styles.catBarHeader}>
        <View style={styles.catBarLeft}>
          <Text style={styles.catBarEmoji}>{cat.icon}</Text>
          <Text style={[styles.catBarLabel, { color: theme.text }]}>{cat.label}</Text>
        </View>
        <Text style={[styles.catBarAmount, { color: theme.text }]}>{R(amount)}</Text>
      </View>
      <View style={[styles.catBarTrack, { backgroundColor: theme.trackSoft }]}>
        <View style={{ height: '100%', width: `${pct}%`, backgroundColor: cat.color, borderRadius: 3 }}/>
      </View>
    </View>
  );
}

function AddModal({ visible, onClose, onSave, theme }) {
  const [mode, setMode] = useState('expense');
  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [catId, setCatId] = useState('food');

  const save = () => {
    const parsed = parseFloat(amount);
    if (!merchant.trim() || !amount || isNaN(parsed) || parsed <= 0) return;
    onSave({ cat: catId, merchant: merchant.trim(), amount: mode === 'expense' ? -parsed : parsed, at: 'Just now' });
    setAmount(''); setMerchant(''); setCatId('food');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose}/>
      <View style={[styles.sheet, { backgroundColor: theme.surface }]}>
        <View style={[styles.sheetHandle, { backgroundColor: theme.track }]}/>
        <Text style={[styles.sheetTitle, { color: theme.text }]}>
          {mode === 'expense' ? 'Log spend' : 'Add income'}
        </Text>

        <View style={styles.modeRow}>
          {['expense', 'income'].map(m => (
            <TouchableOpacity key={m} onPress={() => setMode(m)}
              style={[styles.modeBtn, { backgroundColor: mode === m ? theme.blue : theme.sunken }]}>
              <Text style={[styles.modeBtnText, { color: mode === m ? '#fff' : theme.text }]}>
                {m === 'expense' ? 'Expense' : 'Income'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            value={amount} onChangeText={setAmount}
            placeholder="Amount (R)" keyboardType="numeric" placeholderTextColor={theme.textMuted}
            style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}/>
          <TextInput
            value={merchant} onChangeText={setMerchant}
            placeholder="Merchant / description" placeholderTextColor={theme.textMuted}
            style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}/>

          <View style={styles.catChipRow}>
            {CATEGORIES.map(c => (
              <TouchableOpacity key={c.id} onPress={() => setCatId(c.id)}
                style={[styles.catChip, { backgroundColor: catId === c.id ? c.color : theme.sunken }]}>
                <Text style={[styles.catChipText, { color: catId === c.id ? '#fff' : theme.text }]}>{c.icon} {c.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity onPress={save} style={[styles.saveBtn, { backgroundColor: theme.blue }]}>
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default function BudgetScreen() {
  const { theme, t, persona, budget, monthSpent, txns, addTxn, budgetState } = useApp();
  const [filter, setFilter] = useState('all');
  const [addOpen, setAddOpen] = useState(false);

  const byCat = useMemo(() => {
    const out = {};
    CATEGORIES.forEach(c => { out[c.id] = 0; });
    txns.forEach(tx => { if (tx.amount < 0) out[tx.cat] = (out[tx.cat] || 0) + Math.abs(tx.amount); });
    return out;
  }, [txns]);
  const totalSpent = Object.values(byCat).reduce((a, b) => a + b, 0);
  const filteredTxns = filter === 'all' ? txns : txns.filter(tx => tx.cat === filter);
  const activeCats = CATEGORIES.filter(c => byCat[c.id] > 0).sort((a, b) => byCat[b.id] - byCat[a.id]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <PageHeader title={t.budget} sub={persona.fundingLabel + ' · ' + new Date().toLocaleString('en-ZA', { month: 'long', year: 'numeric' })} trailing={
        <TouchableOpacity onPress={() => setAddOpen(true)} style={[styles.addBtn, { backgroundColor: theme.blue }]}>
          <Icon name="plus" size={14} color="#fff"/>
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      }/>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Summary tiles */}
        <View style={styles.tilesRow}>
          <SummaryTile label="Allowance" value={R(budget)}      sub={persona.expectedDate}                        icon="arrowDown" color="#00C853" theme={theme}/>
          <SummaryTile label="Spent"     value={R(monthSpent)}  sub={`${Math.round(monthSpent/budget*100)}% of budget`} icon="arrowUp"   color="#EF4444" theme={theme}/>
        </View>

        {/* Category breakdown */}
        <View style={styles.sectionPad}>
          <Card padded={false}>
            <View style={styles.catCardHeader}>
              <Text style={[styles.catCardTitle, { color: theme.text }]}>{t.topCategories}</Text>
              <Text style={[styles.catCardSub, { color: theme.textMuted }]}>
                {totalSpent > 0 ? `${R(totalSpent)} across ${activeCats.length} categories` : 'No spends yet'}
              </Text>
            </View>
            <View style={styles.catCardBars}>
              {activeCats.slice(0, 5).map(c => (
                <CategoryBar key={c.id} cat={c} amount={byCat[c.id]} total={totalSpent} theme={theme}/>
              ))}
            </View>
          </Card>
        </View>

        {/* Filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChips}>
          {[{ id: 'all', label: 'All' }, ...CATEGORIES].map(c => (
            <TouchableOpacity key={c.id} onPress={() => setFilter(c.id)}
              style={[styles.filterChip, { backgroundColor: filter === c.id ? theme.blue : theme.sunken }]}>
              <Text style={[styles.filterChipText, { color: filter === c.id ? '#fff' : theme.text }]}>
                {c.icon ? c.icon + ' ' : ''}{c.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Transactions list */}
        <View style={styles.sectionPad}>
          <SectionLabel>Transactions</SectionLabel>
          <Card padded={false} style={styles.txnCard}>
            {filteredTxns.map((tx, i) => (
              <TxnRow key={tx.id} tx={tx} isLast={i === filteredTxns.length - 1}/>
            ))}
            {filteredTxns.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, { color: theme.textMuted }]}>No transactions</Text>
              </View>
            )}
          </Card>
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity onPress={() => setAddOpen(true)} style={[styles.fab, { backgroundColor: theme.blue }]}>
        <Icon name="plus" size={26} color="#fff" stroke={2.5}/>
      </TouchableOpacity>

      <AddModal visible={addOpen} onClose={() => setAddOpen(false)} theme={theme}
        onSave={(tx) => addTxn(tx)}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: { paddingBottom: 24 },

  // Shared utilities
  flex1: { flex: 1 },

  // Add button in header
  addBtn: { flexDirection: 'row', gap: 5, alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  // Summary tiles
  tilesRow: { paddingHorizontal: 20, flexDirection: 'row', gap: 10 },
  summaryTilePad: { padding: 14, gap: 4 },
  summaryTileTop: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  summaryTileIcon: { width: 24, height: 24, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  summaryTileLabel: { fontSize: 11.5, fontWeight: '600' },
  summaryTileValue: { fontSize: 22, fontWeight: '900', letterSpacing: -0.6 },
  summaryTileSub: { fontSize: 11 },

  // Category breakdown card
  sectionPad: { paddingHorizontal: 20, marginTop: 14 },
  catCardHeader: { padding: 16, paddingBottom: 8 },
  catCardTitle: { fontWeight: '800', fontSize: 17, letterSpacing: -0.4 },
  catCardSub: { fontSize: 12, marginTop: 2 },
  catCardBars: { paddingHorizontal: 16, paddingBottom: 16, gap: 12 },

  // Category bar
  catBarWrapper: { gap: 4 },
  catBarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  catBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  catBarEmoji: { fontSize: 16 },
  catBarLabel: { fontSize: 13, fontWeight: '600' },
  catBarAmount: { fontSize: 13, fontWeight: '800' },
  catBarTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },

  // Filter chips
  filterChips: { paddingHorizontal: 20, paddingTop: 14, gap: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999 },
  filterChipText: { fontSize: 13, fontWeight: '600' },

  // Transactions
  txnCard: { marginTop: 10 },
  emptyState: { padding: 24, alignItems: 'center' },
  emptyText: { fontSize: 14 },

  // FAB
  fab: { position: 'absolute', right: 20, bottom: Platform.OS === 'ios' ? 24 : 16, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowColor: '#0066FF', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 },

  // Modal sheet
  modalBackdrop: { flex: 1 },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  sheetTitle: { fontSize: 20, fontWeight: '900', letterSpacing: -0.5, marginBottom: 20 },

  // Modal mode toggle
  modeRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  modeBtn: { flex: 1, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  modeBtnText: { fontWeight: '700', fontSize: 13 },

  // Modal inputs
  inputGroup: { gap: 12 },
  input: { height: 50, borderRadius: 12, borderWidth: 1.5, paddingHorizontal: 14, fontSize: 15 },
  catChipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catChip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999 },
  catChipText: { fontSize: 12, fontWeight: '600' },
  saveBtn: { height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
