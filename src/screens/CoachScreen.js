import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../AppContext';
import Icon from '../components/Icon';
import { R } from '../data';

const FALLBACKS = {
  budget: [
    "Based on your spending so far, you have {remaining} left. At your current pace, that works out to {perDay} per day — tight but doable if you cut takeaways to one this week.",
    "Good news: {remaining} is still workable for {daysLeft} days. Cook at home 4 of the next 7 days and you could save R120+ easily.",
  ],
  meal: [
    "Cheapest filling meal right now: pap + chakalaka at about R14 per plate from Shoprite. Egg fried rice is R17 if you want variety — both last 2 days when batch-cooked.",
    "Mince and spaghetti is your best protein bet this week at R28 for 4 servings (~R7/plate). Worth making on Sunday for the week.",
  ],
  side: [
    "Tutoring 1st-years in your strong subjects can pay R80–R150/hr — better than UberEats and you set the schedule. DM your department's WhatsApp group.",
    "Selling notes on Stuvia or tutoring through UCT's peer network are the fastest ways to earn R200–500 in a week without leaving campus.",
  ],
  general: [
    "I'm here to help you stretch this month's money! Ask me about your budget, cheap meals, side hustles, or how to handle your NSFAS.",
    "Great question. The key for SA students is balancing fixed costs (res/rent, data) before discretionary spending. Want a quick breakdown of your spending patterns?",
  ],
};

function detectTopic(text) {
  const t = text.toLowerCase();
  if (/budget|money|spend|left|remain|afford/.test(t)) return 'budget';
  if (/meal|eat|food|cook|cheap|hungry|noodle|pap/.test(t)) return 'meal';
  if (/hustle|earn|income|job|work|tutor/.test(t)) return 'side';
  return 'general';
}

function getReply(text, persona, monthSpent, budget, daysLeft) {
  const topic = detectTopic(text);
  const pool = FALLBACKS[topic] || FALLBACKS.general;
  const template = pool[Math.floor(Math.random() * pool.length)];
  const remaining = budget - monthSpent;
  const perDay = daysLeft > 0 ? Math.max(0, remaining / daysLeft) : 0;
  return template
    .replace('{remaining}', R(remaining))
    .replace('{perDay}', R(perDay))
    .replace('{daysLeft}', daysLeft + ' days');
}

function MsgBubble({ msg, theme }) {
  const isBot = msg.role === 'bot';
  return (
    <View style={{ flexDirection: isBot ? 'row' : 'row-reverse', gap: 10, marginBottom: 12, paddingHorizontal: 16 }}>
      {isBot && (
        <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: theme.blue, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end' }}>
          <Icon name="bot" size={18} color="#fff"/>
        </View>
      )}
      <View style={{
        maxWidth: '78%',
        backgroundColor: isBot ? theme.surface : theme.blue,
        borderRadius: 18,
        borderBottomLeftRadius: isBot ? 4 : 18,
        borderBottomRightRadius: isBot ? 18 : 4,
        padding: 14,
        ...theme.cardShadow,
      }}>
        <Text style={{ fontSize: 14.5, color: isBot ? theme.text : '#fff', lineHeight: 21 }}>{msg.text}</Text>
        <Text style={{ fontSize: 10, color: isBot ? theme.textMuted : 'rgba(255,255,255,0.6)', marginTop: 5, alignSelf: 'flex-end' }}>{msg.at}</Text>
      </View>
    </View>
  );
}

function TypingDots({ theme }) {
  return (
    <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginBottom: 12 }}>
      <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: theme.blue, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="bot" size={18} color="#fff"/>
      </View>
      <View style={{ backgroundColor: theme.surface, borderRadius: 18, borderBottomLeftRadius: 4, padding: 14, flexDirection: 'row', gap: 5, alignItems: 'center', ...theme.cardShadow }}>
        {[0, 1, 2].map(i => (
          <View key={i} style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: theme.textMuted }}/>
        ))}
      </View>
    </View>
  );
}

function nowHM() {
  const d = new Date();
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function CoachScreen() {
  const { theme, t, persona, lang, budgetState, monthSpent, budget, daysLeft } = useApp();
  const scrollRef = useRef(null);
  const [msgs, setMsgs] = useState([
    { id: 'm0', role: 'bot', text: `Hey ${persona.short}! 👋 I'm your EduRand money coach. You have ${R(budget - monthSpent)} left this month with ${daysLeft} days to go. What can I help you with?`, at: nowHM() },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [showQuick, setShowQuick] = useState(true);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [msgs, typing]);

  const send = (text) => {
    if (!text.trim()) return;
    const userMsg = { id: 'u' + Date.now(), role: 'user', text: text.trim(), at: nowHM() };
    setMsgs(prev => [...prev, userMsg]);
    setInput('');
    setShowQuick(false);
    setTyping(true);
    setTimeout(() => {
      const reply = getReply(text, persona, monthSpent, budget, daysLeft);
      setTyping(false);
      setMsgs(prev => [...prev, { id: 'b' + Date.now(), role: 'bot', text: reply, at: nowHM() }]);
    }, 1000 + Math.random() * 800);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>

        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.trackSoft }]}>
          <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: theme.blue, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="bot" size={24} color="#fff"/>
          </View>
          <View>
            <Text style={{ fontWeight: '800', fontSize: 16, color: theme.text }}>AI Coach</Text>
            <Text style={{ fontSize: 12, color: theme.textMuted }}>Always here · responds in your language</Text>
          </View>
          <View style={[styles.onlineDot, { backgroundColor: '#00C853' }]}/>
        </View>

        {/* Messages */}
        <ScrollView ref={scrollRef} style={{ flex: 1 }} contentContainerStyle={{ paddingTop: 16, paddingBottom: 8 }} showsVerticalScrollIndicator={false}>
          {msgs.map(m => <MsgBubble key={m.id} msg={m} theme={theme}/>)}
          {typing && <TypingDots theme={theme}/>}
        </ScrollView>

        {/* Quick replies */}
        {showQuick && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}>
            {t.quickReplies.map((q, i) => (
              <TouchableOpacity key={i} onPress={() => send(q)}
                style={{ paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.trackSoft, ...theme.cardShadow }}>
                <Text style={{ fontSize: 13, color: theme.text, fontWeight: '500' }}>{q}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Input bar */}
        <View style={[styles.inputBar, { backgroundColor: theme.surface, borderTopColor: theme.trackSoft }]}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder={t.askMe}
            placeholderTextColor={theme.textMuted}
            style={[styles.textInput, { backgroundColor: theme.sunken, color: theme.text }]}
            multiline
            maxLength={500}
            onSubmitEditing={() => send(input)}
          />
          <TouchableOpacity onPress={() => send(input)} disabled={!input.trim()}
            style={[styles.sendBtn, { backgroundColor: input.trim() ? theme.blue : theme.sunken }]}>
            <Icon name="send" size={18} color={input.trim() ? '#fff' : theme.textMuted}/>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderBottomWidth: 1 },
  onlineDot: { width: 10, height: 10, borderRadius: 5, marginLeft: 'auto' },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, padding: 12, borderTopWidth: 1 },
  textInput: { flex: 1, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, maxHeight: 120 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
