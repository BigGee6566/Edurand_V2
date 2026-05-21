import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../AppContext';
import Icon from '../components/Icon';
import { Card, PageHeader, SectionLabel } from '../components/ui';
import { LESSONS } from '../data';

function ProgressBar({ value, color, height = 6 }) {
  const { theme } = useApp();
  return (
    <View style={[styles.progressTrack, { height, borderRadius: height / 2, backgroundColor: theme.trackSoft }]}>
      <View style={{ height: '100%', width: `${value}%`, backgroundColor: color, borderRadius: height / 2 }}/>
    </View>
  );
}

function LessonRow({ l, onPress }) {
  const { theme } = useApp();
  return (
    <Card padded={false} onPress={onPress}>
      <View style={styles.lessonRowInner}>
        <View style={[styles.lessonRowIcon, { backgroundColor: l.color + '22' }]}>
          <Text style={styles.lessonRowEmoji}>{l.icon}</Text>
        </View>
        <View style={styles.lessonRowBody}>
          <Text style={[styles.lessonRowTitle, { color: theme.text }]}>{l.title}</Text>
          <View style={styles.lessonRowMeta}>
            <Text style={[styles.lessonRowMetaText, { color: theme.textMuted }]}>{l.kind} · {l.mins} min</Text>
            {l.progress > 0 && l.progress < 100 && (
              <Text style={styles.lessonRowInProgress}>· {l.progress}% done</Text>
            )}
            {l.progress === 100 && (
              <Text style={[styles.lessonRowDone, { color: theme.green }]}>✓ Completed</Text>
            )}
          </View>
          {l.progress > 0 && l.progress < 100 && (
            <View style={styles.lessonRowProgress}>
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
      <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose}/>
      <View style={[styles.sheet, { backgroundColor: theme.surface }]}>
        <View style={[styles.sheetHandle, { backgroundColor: theme.track }]}/>

        <LinearGradient colors={[lesson.color, lesson.color + 'CC']} style={styles.lessonHero}>
          <Text style={styles.lessonHeroEmoji}>{lesson.icon}</Text>
          {lesson.kind === 'video' && (
            <View style={styles.playBtn}>
              <Icon name="play" size={28} color={lesson.color}/>
            </View>
          )}
        </LinearGradient>

        <View style={styles.metaChips}>
          <View style={[styles.metaChip, { backgroundColor: theme.sunken }]}>
            <Text style={[styles.metaChipText, { color: theme.textMuted }]}>{lesson.kind}</Text>
          </View>
          <View style={[styles.metaChip, styles.metaChipRow, { backgroundColor: theme.sunken }]}>
            <Icon name="clock" size={11} color={theme.textMuted}/>
            <Text style={[styles.metaChipText, { color: theme.textMuted }]}>{lesson.mins} min</Text>
          </View>
          {lesson.progress === 100 && (
            <View style={[styles.metaChip, styles.metaChipRow, { backgroundColor: theme.green + '20' }]}>
              <Icon name="check" size={11} color={theme.green}/>
              <Text style={[styles.metaChipText, { color: theme.green }]}>Done</Text>
            </View>
          )}
        </View>

        <Text style={[styles.lessonDesc, { color: theme.textMuted }]}>
          A short, no-fluff lesson built for SA students. Real examples, real R amounts, things you can apply tomorrow.
        </Text>

        <TouchableOpacity onPress={onProgress}
          style={[styles.startBtn, { backgroundColor: theme.blue }]}>
          <Icon name="play" size={18} color="#fff"/>
          <Text style={styles.startBtnText}>
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
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <PageHeader title={t.learn} sub="Money skills in 5-minute reads"/>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Progress hero */}
        <View style={styles.heroPad}>
          <LinearGradient colors={theme.heroBg} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.heroGradient, { borderRadius: theme.rCard }]}>
            <View style={styles.heroTopRow}>
              <View>
                <Text style={styles.heroLabel}>Your progress</Text>
                <Text style={styles.heroDone}>{done} of {lessons.length}</Text>
                <Text style={styles.heroSub}>lessons done · {Math.round(done / lessons.length * 100)}%</Text>
              </View>
              <View style={styles.heroTrophyWrap}>
                <Icon name="trophy" size={28} color="#fff"/>
              </View>
            </View>
            <View style={styles.heroProgressWrap}>
              <View style={styles.heroProgressTrack}>
                <View style={{ height: '100%', width: `${done / lessons.length * 100}%`, backgroundColor: '#fff', borderRadius: 4 }}/>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Continue card */}
        {cont && (
          <View style={styles.sectionPad}>
            <Card padded={false} style={styles.continueCard} onPress={() => setOpenLesson(cont)}>
              <View style={styles.continuePad}>
                <View style={styles.continueBadge}>
                  <Text style={styles.continueBadgeText}>PICK UP WHERE YOU LEFT OFF</Text>
                </View>
                <Text style={[styles.continueTitle, { color: theme.text }]}>{cont.title}</Text>
                <Text style={[styles.continueMeta, { color: theme.textMuted }]}>{cont.mins} min · {cont.kind}</Text>
                <View style={styles.continueProgressWrap}>
                  <ProgressBar value={cont.progress} color={cont.color} height={6}/>
                  <View style={styles.continueProgressRow}>
                    <Text style={[styles.continueProgressPct, { color: theme.textMuted }]}>{cont.progress}% complete</Text>
                    <Text style={[styles.continueAction, { color: theme.blue }]}>Continue →</Text>
                  </View>
                </View>
              </View>
            </Card>
          </View>
        )}

        {/* All lessons */}
        <View style={styles.lessonsList}>
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
  safe: { flex: 1 },
  scrollContent: { paddingBottom: Platform.OS === 'ios' ? 100 : 80 },

  // Progress bar
  progressTrack: { overflow: 'hidden' },

  // Lesson row
  lessonRowInner: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, minHeight: 56 },
  lessonRowIcon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  lessonRowEmoji: { fontSize: 24 },
  lessonRowBody: { flex: 1 },
  lessonRowTitle: { fontWeight: '700', fontSize: 14.5, letterSpacing: -0.2 },
  lessonRowMeta: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 4 },
  lessonRowMetaText: { fontSize: 11 },
  lessonRowInProgress: { fontSize: 11, color: '#FFB300', fontWeight: '700' },
  lessonRowDone: { fontSize: 11, fontWeight: '700' },
  lessonRowProgress: { marginTop: 6 },

  // Hero
  heroPad: { paddingHorizontal: 20 },
  heroGradient: { padding: 20, overflow: 'hidden' },
  heroTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  heroLabel: { fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
  heroDone: { fontSize: 32, fontWeight: '900', color: '#fff', letterSpacing: -1, marginTop: 6 },
  heroSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  heroTrophyWrap: { width: 56, height: 56, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  heroProgressWrap: { marginTop: 14 },
  heroProgressTrack: { height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.2)', overflow: 'hidden' },

  // Continue card
  sectionPad: { paddingHorizontal: 20, marginTop: 14 },
  continueCard: { borderWidth: 2, borderColor: '#FFB300' },
  continuePad: { padding: 14 },
  continueBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: '#FFB30020', marginBottom: 10 },
  continueBadgeText: { fontSize: 11, fontWeight: '800', color: '#FFB300', letterSpacing: 0.8 },
  continueTitle: { fontWeight: '800', fontSize: 18, letterSpacing: -0.4 },
  continueMeta: { fontSize: 12, marginTop: 2 },
  continueProgressWrap: { marginTop: 12 },
  continueProgressRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  continueProgressPct: { fontSize: 12 },
  continueAction: { fontSize: 12, fontWeight: '700' },

  // Lessons list
  lessonsList: { paddingHorizontal: 20, marginTop: 20, gap: 10 },

  // Modal
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  lessonHero: { height: 160, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 16, overflow: 'hidden' },
  lessonHeroEmoji: { fontSize: 72 },
  playBtn: { position: 'absolute', width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.95)', alignItems: 'center', justifyContent: 'center' },
  metaChips: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  metaChip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  metaChipRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaChipText: { fontSize: 11.5, fontWeight: '700' },
  lessonDesc: { fontSize: 14, lineHeight: 22, marginBottom: 20 },
  startBtn: { height: 54, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  startBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
