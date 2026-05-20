// screens/profile.jsx — Profile + stats + achievements + settings
const { useState, useEffect, useMemo, useRef, useCallback } = React;
function ProfileScreen({ t, persona, lang, onSignOut, dark, onToggleDark, onGo, onOpenWhatsApp }) {
  return (
    <div style={{ paddingBottom: 110 }}>
      <PageHeader title={t.profile} sub="Account & rewards"/>

      {/* Identity card */}
      <div style={{ padding: '0 20px' }}>
        <Card padded={false} style={{ overflow: 'visible' }}>
          <div style={{ padding: 18, display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{
              width: 64, height: 64, borderRadius: 20,
              background: 'linear-gradient(135deg, var(--edu-blue), #7C3AED)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
              fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 24, letterSpacing: '-0.02em',
              boxShadow: '0 8px 24px rgba(0,102,255,0.3)', flexShrink: 0,
            }}>{persona.initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 19, letterSpacing: '-0.02em' }}>{persona.name}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 1 }}>{persona.short.toLowerCase()}@student.ac.za</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                <span style={{ padding: '3px 8px', borderRadius: 999, background: 'rgba(0,102,255,0.1)', color: 'var(--edu-blue)', fontSize: 11, fontWeight: 700 }}>{persona.uniShort}</span>
                <span style={{ padding: '3px 8px', borderRadius: 999, background: 'var(--sunken)', color: 'var(--text)', fontSize: 11, fontWeight: 600 }}>{persona.funding}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderTop: '1px solid var(--track-soft)' }}>
            <StatCol value={R(340)} label="Saved" color="var(--edu-blue)"/>
            <StatCol value="3" label="Lessons" color="#FFB300" border/>
            <StatCol value="3" label="Awards" color="var(--edu-green)"/>
          </div>
        </Card>
      </div>

      {/* Achievements */}
      <div style={{ padding: '20px 20px 0' }}>
        <SectionLabel>Achievements</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
          {ACHIEVEMENTS.map(a => (
            <div key={a.id} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: 14,
              background: 'var(--surface)', border: 'var(--card-border)', borderRadius: 'var(--r-card)',
              boxShadow: 'var(--shadow-card)', opacity: a.earned ? 1 : 0.55,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: a.earned ? 'linear-gradient(135deg, #FFB300, #FF6B35)' : 'var(--sunken)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0,
                filter: a.earned ? 'none' : 'grayscale(1)',
              }}>{a.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14.5, letterSpacing: '-0.01em' }}>{a.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{a.desc}</div>
              </div>
              {a.earned && <Icon name="check" size={20} color="var(--edu-green)"/>}
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div style={{ padding: '20px 20px 0' }}>
        <SectionLabel>Settings</SectionLabel>
        <Card padded={false} style={{ marginTop: 10 }}>
          <SettingsRow icon="moon" label="Dark mode" trailing={
            <Toggle on={dark} onChange={onToggleDark}/>
          }/>
          <SettingsRow icon="bell" label="Crisis alerts" trailing={<Toggle on={true}/>}/>
          <SettingsRow icon="map" label="Language" detail={langName(lang)}/>
          <SettingsRow icon="settings" label="WhatsApp coaching" detail="Open chat →" onClick={onOpenWhatsApp}/>
          <SettingsRow icon="wallet" label="Link bank" detail="Connect →" onClick={() => onGo('linkbank')} last/>
        </Card>
      </div>

      <div style={{ padding: '20px 20px 0' }}>
        <Button onClick={onSignOut} variant="secondary" size="lg" full style={{ background: '#FFE48A', color: '#0F172A' }}>Sign out</Button>
      </div>

      <div style={{ padding: '14px 20px 0', textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>EduRand · v1.0 · Built in 🇿🇦 for students</div>
      </div>
    </div>
  );
}

function langName(l) { return { en: 'English', zu: 'isiZulu', af: 'Afrikaans' }[l] || 'English'; }

function StatCol({ value, label, color, border }) {
  return (
    <div style={{ padding: 14, textAlign: 'center', borderLeft: border ? '1px solid var(--track-soft)' : 'none', borderRight: border ? '1px solid var(--track-soft)' : 'none' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20, color, letterSpacing: '-0.02em' }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
    </div>
  );
}

function SettingsRow({ icon, label, detail, trailing, last, onClick }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
      borderBottom: last ? 'none' : '1px solid var(--track-soft)',
      cursor: onClick ? 'pointer' : 'default',
    }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--sunken)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)' }}>
        <Icon name={icon} size={16}/>
      </div>
      <div style={{ flex: 1, fontWeight: 600, fontSize: 14, letterSpacing: '-0.01em' }}>{label}</div>
      {detail && <span style={{ fontSize: 12.5, color: onClick ? 'var(--edu-blue)' : 'var(--text-muted)', fontWeight: onClick ? 700 : 400 }}>{detail}</span>}
      {trailing}
    </div>
  );
}

function Toggle({ on, onChange }) {
  return (
    <button onClick={() => onChange && onChange(!on)} style={{
      width: 42, height: 24, borderRadius: 12, padding: 0,
      background: on ? 'var(--edu-blue)' : 'var(--track)', border: 'none', cursor: 'pointer',
      position: 'relative', transition: 'background 0.2s',
    }}>
      <span style={{
        position: 'absolute', top: 2, left: on ? 20 : 2,
        width: 20, height: 20, borderRadius: 10, background: '#fff',
        transition: 'left 0.2s ease', boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      }}/>
    </button>
  );
}

Object.assign(window, { ProfileScreen });
