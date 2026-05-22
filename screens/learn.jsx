// screens/learn.jsx — Lessons hub + lesson detail
const { useState, useEffect, useMemo, useRef, useCallback } = React;
function LearnScreen({ t, onGo, persona }) {
  const [openLesson, setOpenLesson] = useState(null);
  const [lessons, setLessons] = useState(LESSONS);
  const done = lessons.filter(l => l.progress === 100).length;

  return (
    <div style={{ paddingBottom: 110 }}>
      <PageHeader title={t.learn} sub="Money skills in 5-minute reads"/>

      {/* progress hero */}
      <div style={{ padding: '0 20px' }}>
        <Card padded={false} style={{ background: 'var(--hero-bg)', color: 'var(--hero-fg)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: 60, background: 'var(--hero-blob)', filter: 'blur(20px)', opacity: 0.6 }}/>
          <div style={{ padding: 20, position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 12, opacity: 0.85, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Your progress</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 900, letterSpacing: '-0.03em', marginTop: 6, lineHeight: 1 }}>{done} of {lessons.length}</div>
                <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>lessons done · {Math.round(done/lessons.length*100)}%</div>
              </div>
              <div style={{
                width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)',
              }}><Icon name="trophy" size={28}/></div>
            </div>
            <div style={{ marginTop: 14 }}>
              <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.18)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${done/lessons.length*100}%`, background: '#fff', borderRadius: 4, transition: 'width 0.6s ease' }}/>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Continue card */}
      {(() => {
        const cont = lessons.find(l => l.progress > 0 && l.progress < 100);
        if (!cont) return null;
        return (
          <div style={{ padding: '14px 20px 0' }}>
            <Card padded={false} style={{ border: '2px solid var(--edu-yellow, #FFB300)' }} onClick={() => setOpenLesson(cont)}>
              <div style={{ padding: 14 }}>
                <div style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 999, background: '#FFB30022', color: '#FFB300', fontSize: 11, fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Pick up where you left off</div>
                <div style={{ marginTop: 10, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 19, letterSpacing: '-0.02em' }}>{cont.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{cont.mins} min · {cont.kind}</div>
                <div style={{ marginTop: 12 }}>
                  <ProgressBar value={cont.progress} color={cont.color} height={6}/>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{cont.progress}% complete</span>
                    <span style={{ fontSize: 12, color: 'var(--edu-blue)', fontWeight: 700 }}>Continue →</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        );
      })()}

      <div style={{ padding: '20px 20px 0' }}>
        <SectionLabel>All lessons</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
          {lessons.map(l => (
            <LessonRow key={l.id} l={l} onClick={() => setOpenLesson(l)}/>
          ))}
        </div>
      </div>

      <Sheet open={!!openLesson} onClose={() => setOpenLesson(null)} title={openLesson?.title}>
        {openLesson && (
          <>
            <div style={{
              height: 160, borderRadius: 16, background: `linear-gradient(135deg, ${openLesson.color}, ${openLesson.color}cc)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', position: 'relative',
              marginBottom: 16,
            }}>
              <div style={{ fontSize: 80 }}>{openLesson.icon}</div>
              {openLesson.kind === 'video' && (
                <div style={{ position: 'absolute', width: 64, height: 64, borderRadius: 32, background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: openLesson.color }}>
                  <Icon name="play" size={28}/>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <Pill>{openLesson.kind}</Pill>
              <Pill><Icon name="clock" size={11}/> {openLesson.mins} min</Pill>
              {openLesson.progress === 100 && <Pill color="var(--edu-green)"><Icon name="check" size={11}/> Done</Pill>}
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              A short, no-fluff lesson built for SA students. Real examples, real R amounts, things you can apply tomorrow.
            </p>
            <Button variant="primary" size="lg" full style={{ marginTop: 16 }} iconRight="play"
              onClick={() => {
                setLessons(prev => prev.map(x => x.id === openLesson.id ? { ...x, progress: Math.min(100, (x.progress || 0) + 40) } : x));
                setOpenLesson(null);
              }}>
              {openLesson.progress === 0 ? 'Start lesson' : openLesson.progress === 100 ? 'Revise' : 'Continue lesson'}
            </Button>
          </>
        )}
      </Sheet>
    </div>
  );
}

function LessonRow({ l, onClick }) {
  return (
    <Card padded={false} onClick={onClick}>
      <div style={{ padding: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: l.color + '22', color: l.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0,
        }}>{l.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14.5, letterSpacing: '-0.01em', color: 'var(--text)' }}>{l.title}</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{l.kind} · {l.mins} min</span>
            {l.progress > 0 && l.progress < 100 && (
              <span style={{ fontSize: 11, color: '#FFB300', fontWeight: 700 }}>· {l.progress}% done</span>
            )}
            {l.progress === 100 && (
              <span style={{ fontSize: 11, color: 'var(--edu-green)', fontWeight: 700, display: 'inline-flex', gap: 3, alignItems: 'center' }}>
                <Icon name="check" size={11}/> Completed
              </span>
            )}
          </div>
        </div>
        <Icon name="arrowRight" size={18} color="var(--text-muted)"/>
      </div>
    </Card>
  );
}

function Pill({ children, color }) {
  return (
    <span style={{
      padding: '5px 10px', borderRadius: 999,
      background: (color || 'var(--text-muted)') + '20',
      color: color || 'var(--text-muted)', fontSize: 11.5, fontWeight: 700,
      letterSpacing: '-0.005em',
      display: 'inline-flex', alignItems: 'center', gap: 4,
    }}>{children}</span>
  );
}

Object.assign(window, { LearnScreen, Pill });
