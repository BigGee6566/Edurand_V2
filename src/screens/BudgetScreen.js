import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../AppContext';
import Icon from '../components/Icon';
import { Card, PageHeader, SectionLabel, TxnRow } from '../components/ui';
import { CATEGORIES, R } from '../data';

function SummaryTile({ label, value, sub, icon, color, theme }) {
  return (
    <Card style={{ flex: 1 }} padded={false}>
      <View style={{ padding: 14, gap: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ width: 24, height: 24, borderRadius: 6, backgroundColor: color + '20', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={icon} size={13} color={color}/>
          </View>
          <Text style={{ fontSize: 11.5, color: theme.textMuted, fontWeight: '600' }}>{label}</Text>
        </View>
        <Text style={{ fontSize: 22, fontWeight: '900', color: theme.text, letterSpacing: -0.6 }}>{value}</Text>
        <Text style={{ fontSize: 11, color: theme.textMuted }}>{sub}</Text>
      </View>
    </Card>
  );
}

function CategoryBar({ cat, amount, total, theme }) {
  const pct = total > 0 ? (amount / total) * 100 : 0;
  return (
    <View style={{ gap: 4 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 16 }}>{cat.icon}</Text>
          <Text style={{ fontSize: 13, fontWeight: '600', color: theme.text }}>{cat.label}</Text>
        </View>
        <Text style={{ fontSize: 13, fontWeight: '800', color: theme.text }}>{R(amount)}</Text>
      </View>
      <View style={{ height: 6, borderRadius: 3, backgroundColor: theme.trackSoft, overflow: 'hidden' }}>
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
    if (!amount || !merchant) return;
    onSave({ cat: catId, merchant, amount: mode === 'expense' ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount)), at: 'Just now' });
    setAmount(''); setMerchant(''); setCatId('food');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose}/>
      <View style={[styles.sheet, { backgroundColor: theme.surface }]}>
        <View style={[styles.sheetHandle, { backgroundColor: theme.track }]}/>
        <Text style={{ fontSize: 20, fontWeight: '900', color: theme.text, letterSpacing: -0.5, marginBottom: 20 }}>
          {mode === 'expense' ? 'Log spend' : 'Add income'}
        </Text>

        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
          {['expense', 'income'].map(m => (
            <TouchableOpacity key={m} onPress={() => setMode(m)}
              style={{ flex: 1, height: 40, borderRadius: 10, backgroundColor: mode === m ? theme.blue : theme.sunken, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontWeight: '700', fontSize: 13, color: mode === m ? '#fff' : theme.text }}>
                {m === 'expense' ? 'Expense' : 'Income'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ gap: 12 }}>
          <TextInput
            value={amount} onChangeText={setAmount}
            placeholder="Amount (R)" keyboardType="numeric" placeholderTextColor={theme.textMuted}
            style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}/>
          <TextInput
            value={merchant} onChangeText={setMerchant}
            placeholder="Merchant / description" placeholderTextColor={theme.textMuted}
            style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}/>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {CATEGORIES.map(c => (
              <TouchableOpacity key={c.id} onPress={() => setCatId(c.id)}
                style={{ paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, backgroundColor: catId === c.id ? c.color : theme.sunken }}>
                <Text style={{ fontSize: 12, fontWeight: '600', color: catId === c.id ? '#fff' : theme.text }}>{c.icon} {c.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity onPress={save} style={{ height: 52, borderRadius: 14, backgroundColor: theme.blue, alignItems: 'center', justifyContent: 'center', marginTop: 4 }}>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default function BudgetScreen() {
  const { theme, t, persona, budget, monthSpent, txns, setTxns, budgetState } = useApp();
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
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <PageHeader title={t.budget} sub={persona.fundingLabel + ' · June 2026'} trailing={
        <TouchableOpacity onPress={() => setAddOpen(true)} style={{ flexDirection: 'row', gap: 5, alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: theme.blue }}>
          <Icon name="plus" size={14} color="#fff"/>
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>Add</Text>
        </TouchableOpacity>
      }/>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Summary tiles */}
        <View style={{ paddingHorizontal: 20, flexDirection: 'row', gap: 10 }}>
          <SummaryTile label="Allowance" value={R(budget)}      sub={persona.expectedDate}                        icon="arrowDown" color="#00C853" theme={theme}/>
          <SummaryTile label="Spent"     value={R(monthSpent)}  sub={`${Math.round(monthSpent/budget*100)}% of budget`} icon="arrowUp"   color="#EF4444" theme={theme}/>
        </View>

        {/* Category breakdown */}
        <View style={{ paddingHorizontal: 20, marginTop: 14 }}>
          <Card padded={false}>
            <View style={{ padding: 16, paddingBottom: 8 }}>
              <Text style={{ fontWeight: '800', fontSize: 17, color: theme.text, letterSpacing: -0.4 }}>{t.topCategories}</Text>
              <Text style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>
                {totalSpent > 0 ? `${R(totalSpent)} across ${activeCats.length} categories` : 'No spends yet'}
              </Text>
            </View>
            <View style={{ paddingHorizontal: 16, paddingBottom: 16, gap: 12 }}>
              {activeCats.slice(0, 5).map(c => (
                <CategoryBar key={c.id} cat={c} amount={byCat[c.id]} total={totalSpent} theme={theme}/>
              ))}
            </View>
          </Card>
        </View>

        {/* Filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 14, gap: 8 }}>
          {[{ id: 'all', label: 'All' }, ...CATEGORIES].map(c => (
            <TouchableOpacity key={c.id} onPress={() => setFilter(c.id)}
              style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, backgroundColor: filter === c.id ? theme.blue : theme.sunken }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: filter === c.id ? '#fff' : theme.text }}>
                {'icon' in c ? c.icon + ' ' : ''}{c.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Transactions list */}
        <View style={{ paddingHorizontal: 20, marginTop: 14 }}>
          <SectionLabel>Transactions</SectionLabel>
          <Card padded={false} style={{ marginTop: 10 }}>
            {filteredTxns.map((tx, i) => (
              <TxnRow key={tx.id} tx={tx} isLast={i === filteredTxns.length - 1}/>
            ))}
            {filteredTxns.length === 0 && (
              <View style={{ padding: 24, alignItems: 'center' }}>
                <Text style={{ color: theme.textMuted, fontSize: 14 }}>No transactions</Text>
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
        onSave={(tx) => setTxns(prev => [{ ...tx, id: Date.now() }, ...prev])}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fab: { position: 'absolute', right: 20, bottom: 24, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowColor: '#0066FF', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  input: { height: 50, borderRadius: 12, borderWidth: 1.5, paddingHorizontal: 14, fontSize: 15 },
});
