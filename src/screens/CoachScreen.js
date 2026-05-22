import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../AppContext';
import { askCoach } from '../lib/api';
import Icon from '../components/Icon';
import { R } from '../data';

function MsgBubble({ msg, theme }) {
  const isBot = msg.role === 'bot';
  return (
    <View style={[styles.msgRow, { flexDirection: isBot ? 'row' : 'row-reverse' }]}>
      {isBot && (
        <View style={[styles.botAvatar, { backgroundColor: theme.blue }]}>
          <Icon name="bot" size={18} color="#fff"/>
        </View>
      )}
      <View style={[styles.bubble, {
        backgroundColor: isBot ? theme.surface : theme.blue,
        borderBottomLeftRadius: isBot ? 4 : 18,
        borderBottomRightRadius: isBot ? 18 : 4,
        ...theme.cardShadow,
      }]}>
        <Text style={[styles.bubbleText, { color: isBot ? theme.text : '#fff' }]}>{msg.text}</Text>
        <Text style={[styles.bubbleTime, { color: isBot ? theme.textMuted : 'rgba(255,255,255,0.6)' }]}>{msg.at}</Text>
      </View>
    </View>
  );
}

function TypingDots({ theme }) {
  return (
    <View style={styles.typingRow}>
      <View style={[styles.botAvatar, { backgroundColor: theme.blue }]}>
        <Icon name="bot" size={18} color="#fff"/>
      </View>
      <View style={[styles.typingBubble, { backgroundColor: theme.surface, ...theme.cardShadow }]}>
        {[0, 1, 2].map(i => (
          <View key={i} style={[styles.dot, { backgroundColor: theme.textMuted }]}/>
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
  const { theme, t, persona, lang, monthSpent, budget, daysLeft } = useApp();
  const scrollRef = useRef(null);
  const remaining = budget - monthSpent;
  const perDay = daysLeft > 0 ? Math.max(0, remaining / daysLeft) : 0;

  const [msgs, setMsgs] = useState([
    { id: 'm0', role: 'bot', text: `Hey ${persona.short}! 👋 I'm your EduRand money coach. You have ${R(remaining)} left this month with ${daysLeft} days to go. What can I help you with?`, at: nowHM() },
  ]);
  const [apiMessages, setApiMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [showQuick, setShowQuick] = useState(true);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [msgs, typing]);

  const send = async (text) => {
    if (!text.trim()) return;
    const userMsg = { id: 'u' + Date.now(), role: 'user', text: text.trim(), at: nowHM() };
    setMsgs(prev => [...prev, userMsg]);
    setInput('');
    setShowQuick(false);
    setTyping(true);

    const newApiMessages = [...apiMessages, { role: 'user', content: text.trim() }];
    setApiMessages(newApiMessages);
    const windowedMessages = newApiMessages.slice(-10); // cap context to last 10 messages

    try {
      const reply = await askCoach(windowedMessages, {
        remaining, perDay, daysLeft,
        name: persona.short,
        university: persona.university,
        fundingType: persona.funding,
      });
      setApiMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      setMsgs(prev => [...prev, { id: 'b' + Date.now(), role: 'bot', text: reply, at: nowHM() }]);
    } catch {
      setMsgs(prev => [...prev, { id: 'b' + Date.now(), role: 'bot', text: "Sorry, I'm having trouble connecting. Try again in a moment.", at: nowHM() }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 60}>

        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.trackSoft }]}>
          <View style={[styles.headerAvatar, { backgroundColor: theme.blue }]}>
            <Icon name="bot" size={24} color="#fff"/>
          </View>
          <View style={styles.headerTitles}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>AI Coach</Text>
            <Text style={[styles.headerSub, { color: theme.textMuted }]}>Always here · responds in your language</Text>
          </View>
          <View style={[styles.onlineDot, { backgroundColor: '#00C853' }]}/>
        </View>

        {/* Messages */}
        <ScrollView ref={scrollRef} style={styles.flex} contentContainerStyle={styles.msgList} showsVerticalScrollIndicator={false}>
          {msgs.map(m => <MsgBubble key={m.id} msg={m} theme={theme}/>)}
          {typing && <TypingDots theme={theme}/>}
        </ScrollView>

        {/* Quick replies */}
        {showQuick && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            style={{ flexGrow: 0 }}
            contentContainerStyle={styles.quickReplies}>
            {t.quickReplies.map((q, i) => (
              <TouchableOpacity key={i} onPress={() => send(q)}
                style={[styles.quickChip, { backgroundColor: theme.surface, borderColor: theme.trackSoft, ...theme.cardShadow }]}>
                <Text style={[styles.quickChipText, { color: theme.text }]}>{q}</Text>
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
  safe: { flex: 1 },
  flex: { flex: 1 },
  msgList: { paddingTop: 16, paddingBottom: 8 },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderBottomWidth: 1 },
  headerAvatar: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  headerTitles: { flex: 1 },
  headerTitle: { fontWeight: '800', fontSize: 16 },
  headerSub: { fontSize: 12 },
  onlineDot: { width: 10, height: 10, borderRadius: 5 },

  // Message bubble
  msgRow: { gap: 10, marginBottom: 12, paddingHorizontal: 16 },
  botAvatar: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end' },
  bubble: { maxWidth: '78%', borderRadius: 18, padding: 14 },
  bubbleText: { fontSize: 14.5, lineHeight: 21 },
  bubbleTime: { fontSize: 10, marginTop: 5, alignSelf: 'flex-end' },

  // Typing indicator
  typingRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginBottom: 12 },
  typingBubble: { borderRadius: 18, borderBottomLeftRadius: 4, padding: 14, flexDirection: 'row', gap: 5, alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4 },

  // Quick replies
  quickReplies: { paddingHorizontal: 16, paddingVertical: 10, gap: 8, alignItems: 'center' },
  quickChip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999, borderWidth: 1 },
  quickChipText: { fontSize: 13, fontWeight: '500' },

  // Input bar
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, padding: 12, borderTopWidth: 1 },
  textInput: { flex: 1, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, maxHeight: 120 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
