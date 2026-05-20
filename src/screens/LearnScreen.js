import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../AppContext';
import Icon from '../components/Icon';
import { Card, PageHeader, SectionLabel } from '../components/ui';
import { LESSONS } from '../data';

function ProgressBar({ value, color, height = 6 }) {
  const { theme } = useApp();
  return (
    <View style={{ height, borderRadius: height / 2, backgroundColor: theme.trackSoft, overflow: 'hidden' }}>
      <View style={{ height: '100%', width: `${value}%`, backgroundColor: color, borderRadius: height / 2 }}/>
    </View>
  );
}

function LessonRow({ l, onPress }) {
  const { theme } = useApp();
  return (
    <Card padded={false} onPress={onPress}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 }}>
        <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: l.color + '22', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 24 }}>{l.icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: '700', fontSize: 14.5, color: theme.text, letterSpacing: -0.2 }}>{l.title}</Text>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 4 }}>
            <Text style={{ fontSize: 11, color: theme.textMuted }}>{l.kind} · {l.mins} min</Text>
            {l.progress > 0 && l.progress < 100 && (
              <Text style={{ fontSize: 11, color: '#FFB300', fontWeight: '700' }}>· {l.progress}% done</Text>
            )}
            {l.progress === 100 && (
              <Text style={{ fontSize: 11, color: theme.green, fontWeight: '700' }}>✓ Completed</Text>
            )}
          </View>
          {l.progress > 0 && l.progress < 100 && (
            <View style={{ marginTop: 6 }}>
              <ProgressBar value={l.progress} color={l.color} height={4}/>
            </View>
          )}
        </View>
        <Icon name="arrowRight" size={18} color={theme.textMuted}/>
      </View>
    </Card>
  );
}

function LessonModal({ lesson, onClose, onProgress }) {
  const { theme } = useApp();
  if (!lesson) return null;
  return (
    <Modal visible={!!lesson} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }} activeOpacity={1} onPress={onClose}/>
      <View style={[styles.sheet, { backgroundColor: theme.surface }]}>
        <View style={[styles.sheetHandle, { backgroundColor: theme.track }]}/>

        <LinearGradient colors={[lesson.color, lesson.color + 'CC']} style={styles.lessonHero}>
          <Text style={{ fontSize: 72 }}>{lesson.icon}</Text>
          {lesson.kind === 'video' && (
            <View style={styles.playBtn}>
              <Icon name="play" size={28} color={lesson.color}/>
            </View>
          )}
        </LinearGradient>

        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
          <View style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: theme.sunken }}>
            <Text style={{ fontSize: 11.5, fontWeight: '700', color: theme.textMuted }}>{lesson.kind}</Text>
          </View>
          <View style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: theme.sunken, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Icon name="clock" size={11} color={theme.textMuted}/>
            <Text style={{ fontSize: 11.5, fontWeight: '700', color: theme.textMuted }}>{lesson.mins} min</Text>
          </View>
          {lesson.progress === 100 && (
            <View style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: theme.green + '20', flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Icon name="check" size={11} color={theme.green}/>
              <Text style={{ fontSize: 11.5, fontWeight: '700', color: theme.green }}>Done</Text>
            </View>
          )}
        </View>

        <Text style={{ fontSize: 14, color: theme.textMuted, lineHeight: 22, marginBottom: 20 }}>
          A short, no-fluff lesson built for SA students. Real examples, real R amounts, things you can apply tomorrow.
        </Text>

        <TouchableOpacity onPress={onProgress}
          style={{ height: 54, borderRadius: 14, backgroundColor: theme.blue, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}>
          <Icon name="play" size={18} color="#fff"/>
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>
            {lesson.progress === 0 ? 'Start lesson' : lesson.progress === 100 ? 'Revise' : 'Continue lesson'}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

export default function LearnScreen() {
  const { theme, t } = useApp();
  const [lessons, setLessons] = useState(LESSONS);
  const [openLesson, setOpenLesson] = useState(null);
  const done = lessons.filter(l => l.progress === 100).length;
  const cont = lessons.find(l => l.progress > 0 && l.progress < 100);

  const handleProgress = () => {
    if (!openLesson) return;
    setLessons(prev => prev.map(x => x.id === openLesson.id ? { ...x, progress: Math.min(100, (x.progress || 0) + 40) } : x));
    setOpenLesson(null);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <PageHeader title={t.learn} sub="Money skills in 5-minute reads"/>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>

        {/* Progress hero */}
        <View style={{ paddingHorizontal: 20 }}>
          <LinearGradient colors={theme.heroBg} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: theme.rCard, padding: 20, overflow: 'hidden' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View>
                <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' }}>Your progress</Text>
                <Text style={{ fontSize: 32, fontWeight: '900', color: '#fff', letterSpacing: -1, marginTop: 6 }}>{done} of {lessons.length}</Text>
                <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>lessons done · {Math.round(done / lessons.length * 100)}%</Text>
              </View>
              <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="trophy" size={28} color="#fff"/>
              </View>
            </View>
            <View style={{ marginTop: 14 }}>
              <View style={{ height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.2)', overflow: 'hidden' }}>
                <View style={{ height: '100%', width: `${done / lessons.length * 100}%`, backgroundColor: '#fff', borderRadius: 4 }}/>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Continue card */}
        {cont && (
          <View style={{ paddingHorizontal: 20, marginTop: 14 }}>
            <Card padded={false} style={{ borderWidth: 2, borderColor: '#FFB300' }} onPress={() => setOpenLesson(cont)}>
              <View style={{ padding: 14 }}>
                <View style={{ alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: '#FFB30020', marginBottom: 10 }}>
                  <Text style={{ fontSize: 11, fontWeight: '800', color: '#FFB300', letterSpacing: 0.8 }}>PICK UP WHERE YOU LEFT OFF</Text>
                </View>
                <Text style={{ fontWeight: '800', fontSize: 18, color: theme.text, letterSpacing: -0.4 }}>{cont.title}</Text>
                <Text style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>{cont.mins} min · {cont.kind}</Text>
                <View style={{ marginTop: 12 }}>
                  <ProgressBar value={cont.progress} color={cont.color} height={6}/>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                    <Text style={{ fontSize: 12, color: theme.textMuted }}>{cont.progress}% complete</Text>
                    <Text style={{ fontSize: 12, color: theme.blue, fontWeight: '700' }}>Continue →</Text>
                  </View>
                </View>
              </View>
            </Card>
          </View>
        )}

        {/* All lessons */}
        <View style={{ paddingHorizontal: 20, marginTop: 20, gap: 10 }}>
          <SectionLabel>All lessons</SectionLabel>
          {lessons.map(l => (
            <LessonRow key={l.id} l={l} onPress={() => setOpenLesson(l)}/>
          ))}
        </View>
      </ScrollView>

      <LessonModal lesson={openLesson} onClose={() => setOpenLesson(null)} onProgress={handleProgress}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  lessonHero: { height: 160, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 16, overflow: 'hidden' },
  playBtn: { position: 'absolute', width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.95)', alignItems: 'center', justifyContent: 'center' },
});
