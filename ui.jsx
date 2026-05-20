// ui.jsx — shared design primitives
// Two "directions": cozy (default, refined-soft) and bold (editorial, sharper, big type)
// Theme via CSS variables on the per-device root.

const { useState, useEffect, useRef, useMemo, useCallback, createContext, useContext, Fragment } = React;

// ── Icons (Lucide-ish, 24x24, stroke 1.75) ─────────────────────────
function Icon({ name, size = 22, color = 'currentColor', stroke = 1.75, fill = 'none' }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill, stroke: color, strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    home:        <><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/></>,
    chart:       <><rect x="3" y="13" width="4" height="8" rx="1"/><rect x="10" y="8" width="4" height="13" rx="1"/><rect x="17" y="4" width="4" height="17" rx="1"/></>,
    book:        <><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5v-17z"/><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/></>,
    user:        <><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6"/></>,
    bot:         <><rect x="4" y="8" width="16" height="11" rx="2"/><path d="M12 4v4M9 13v.01M15 13v.01M9 19v2M15 19v2"/></>,
    spark:       <><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></>,
    arrowRight:  <><path d="M5 12h14M13 5l7 7-7 7"/></>,
    arrowLeft:   <><path d="M19 12H5M11 5l-7 7 7 7"/></>,
    arrowDown:   <><path d="M12 5v14M5 13l7 7 7-7"/></>,
    arrowUp:     <><path d="M12 19V5M19 11l-7-7-7 7"/></>,
    check:       <><path d="m5 12 5 5L20 7"/></>,
    plus:        <><path d="M12 5v14M5 12h14"/></>,
    minus:       <><path d="M5 12h14"/></>,
    x:           <><path d="M6 6l12 12M18 6L6 18"/></>,
    send:        <><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7z"/></>,
    bell:        <><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9z"/><path d="M10 21a2 2 0 0 0 4 0"/></>,
    cart:        <><circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/><path d="M3 4h2l2.5 11h11l2-8H6"/></>,
    bus:         <><rect x="4" y="5" width="16" height="13" rx="2"/><path d="M4 11h16M8 18v2M16 18v2"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/></>,
    flame:       <><path d="M12 22c4 0 7-3 7-7 0-3-2-5-3-7-1 2-2 3-3 3-1-2-1-5 0-8-4 1-8 5-8 11 0 5 3 8 7 8z"/></>,
    trophy:      <><path d="M8 4h8v5a4 4 0 0 1-8 0V4z"/><path d="M5 5H3a3 3 0 0 0 5 3M16 5h2a3 3 0 0 1-5 3"/><path d="M12 13v4M9 21h6M10 17h4v4h-4z"/></>,
    coin:        <><circle cx="12" cy="12" r="9"/><path d="M9 9h4a2 2 0 0 1 0 4H9m4 0a2 2 0 0 1 0 4H9M9 7v10"/></>,
    target:      <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill={color}/></>,
    settings:    <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 4.27 16.9l.06-.06a1.65 1.65 0 0 0 .33-1.82A1.65 1.65 0 0 0 3.15 14H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    play:        <><path d="M6 4l14 8-14 8z" fill={color}/></>,
    alert:       <><path d="M12 3 2 21h20L12 3z"/><path d="M12 10v5M12 18v.01"/></>,
    heart:       <><path d="M12 21s-7-4.5-7-11a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 6.5-7 11-7 11z"/></>,
    leaf:        <><path d="M21 3c0 9-7 16-16 16 0-9 7-16 16-16z"/><path d="M5 19 13 11"/></>,
    moon:        <><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></>,
    sun:         <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
    eye:         <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></>,
    lock:        <><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></>,
    mail:        <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 7 9-7"/></>,
    grad:        <><path d="M2 9 12 4l10 5-10 5L2 9z"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/></>,
    fire:        <><path d="M12 22c4 0 7-3 7-7 0-3-2-5-3-7-1 2-2 3-3 3-1-2-1-5 0-8-4 1-8 5-8 11 0 5 3 8 7 8z"/></>,
    wallet:      <><rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18M16 15h2"/></>,
    swap:        <><path d="M7 4v16M3 8l4-4 4 4M17 20V4M21 16l-4 4-4-4"/></>,
    sparkles:    <><path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><path d="m6 6 2 2M16 16l2 2M6 18l2-2M16 8l2-2"/></>,
    clock:       <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    pizza:       <><path d="M12 2 2 22h20L12 2z"/><circle cx="10" cy="14" r="1.2" fill={color}/><circle cx="14" cy="17" r="1.2" fill={color}/><circle cx="11" cy="9" r="1" fill={color}/></>,
    news:        <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h6M7 13h10M7 17h10"/></>,
    map:         <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6z"/><path d="M9 3v15M15 6v15"/></>,
  };
  return <svg {...p} aria-hidden="true">{paths[name] || null}</svg>;
}

// ── Logo ─────────────────────────────────────────────────────────
function Logo({ size = 32, mono = false }) {
  const blue = mono ? 'currentColor' : 'var(--edu-blue, #0066FF)';
  const green = mono ? 'currentColor' : 'var(--edu-green, #00C853)';
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-label="EduRand">
      <path d="M6 22 24 13l18 9-18 9-18-9z" fill={blue}/>
      <path d="M14 27v6c0 2 4 4 10 4s10-2 10-4v-6" fill="none" stroke={blue} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="37" cy="34" r="9" fill={green}/>
      <text x="37" y="38.5" textAnchor="middle" fontFamily="ui-sans-serif, system-ui" fontWeight="900" fontSize="13" fill="white">R</text>
    </svg>
  );
}

function Wordmark({ size = 22, weight = 800 }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 0, fontFamily: 'var(--font-display)', fontWeight: weight, fontSize: size, letterSpacing: '-0.03em', lineHeight: 1 }}>
      <span style={{ color: 'var(--edu-blue)' }}>Edu</span>
      <span style={{ color: 'var(--edu-green)' }}>Rand</span>
    </span>
  );
}

// ── Card ─────────────────────────────────────────────────────────
function Card({ children, style, padded = true, accent, onClick, tone = 'surface' }) {
  const bg = tone === 'surface' ? 'var(--surface)' : tone === 'sunken' ? 'var(--sunken)' : tone;
  return (
    <div
      onClick={onClick}
      style={{
        background: bg,
        borderRadius: 'var(--r-card)',
        padding: padded ? 'var(--card-pad)' : 0,
        boxShadow: 'var(--shadow-card)',
        border: 'var(--card-border)',
        position: 'relative',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        ...style,
      }}
      onMouseDown={onClick ? (e) => e.currentTarget.style.transform = 'scale(0.985)' : undefined}
      onMouseUp={onClick ? (e) => e.currentTarget.style.transform = '' : undefined}
      onMouseLeave={onClick ? (e) => e.currentTarget.style.transform = '' : undefined}
    >
      {accent && (
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
          background: accent, borderRadius: '4px 0 0 4px',
        }} />
      )}
      {children}
    </div>
  );
}

// ── Button ──────────────────────────────────────────────────────
function Button({ children, onClick, variant = 'primary', size = 'md', icon, iconRight, full, style, disabled }) {
  const sizes = {
    sm: { h: 36, px: 14, fs: 13, gap: 6, r: 'var(--r-btn-sm)' },
    md: { h: 48, px: 18, fs: 15, gap: 8, r: 'var(--r-btn)' },
    lg: { h: 56, px: 22, fs: 16, gap: 10, r: 'var(--r-btn)' },
  }[size];
  const variants = {
    primary:   { bg: 'var(--btn-primary-bg)', color: 'var(--btn-primary-fg)', border: 'none' },
    secondary: { bg: 'var(--btn-sec-bg)',     color: 'var(--btn-sec-fg)',     border: 'var(--btn-sec-border)' },
    ghost:     { bg: 'transparent',           color: 'var(--text)',           border: 'none' },
    danger:    { bg: '#EF4444', color: '#fff', border: 'none' },
    success:   { bg: 'var(--edu-green)', color: '#fff', border: 'none' },
  }[variant];
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      gap: sizes.gap, height: sizes.h, padding: `0 ${sizes.px}px`, borderRadius: sizes.r,
      fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: sizes.fs,
      ...variants, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
      width: full ? '100%' : 'auto', whiteSpace: 'nowrap',
      transition: 'transform 0.12s ease, filter 0.12s ease',
      letterSpacing: '-0.01em',
      ...style,
    }}
    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
    onMouseUp={e => e.currentTarget.style.transform = ''}
    onMouseLeave={e => e.currentTarget.style.transform = ''}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 16 : 18} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === 'sm' ? 16 : 18} />}
    </button>
  );
}

// ── Progress bar ────────────────────────────────────────────────
function ProgressBar({ value, max = 100, color, height = 8, bg, label }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6, color: 'var(--text-muted)' }}>
          <span>{label}</span>
          <span style={{ color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>{Math.round(pct)}%</span>
        </div>
      )}
      <div style={{
        height, borderRadius: height, background: bg || 'var(--track)',
        overflow: 'hidden', position: 'relative',
      }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: color || 'var(--edu-blue)',
          borderRadius: height, transition: 'width 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        }} />
      </div>
    </div>
  );
}

// ── Progress ring ───────────────────────────────────────────────
function ProgressRing({ value, max = 100, size = 80, stroke = 8, color, children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const off = c - (pct / 100) * c;
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-block' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--track)" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color || 'var(--edu-blue)'} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.22, 1, 0.36, 1)' }}/>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  );
}

// ── Bottom nav ──────────────────────────────────────────────────
function BottomNav({ active, onChange, tabs }) {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      paddingBottom: 'var(--bottom-safe)',
      background: 'var(--nav-bg)',
      borderTop: 'var(--nav-border)',
      backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      zIndex: 10,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', padding: '8px 4px 4px' }}>
        {tabs.map(t => {
          const isActive = active === t.id;
          return (
            <button key={t.id} onClick={() => onChange(t.id)}
              style={{
                flex: 1, background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '6px 4px',
                color: isActive ? 'var(--edu-blue)' : 'var(--text-muted)',
                position: 'relative',
              }}>
              {isActive && (
                <span style={{
                  position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                  width: 24, height: 3, borderRadius: 2, background: 'var(--edu-blue)',
                }} />
              )}
              <Icon name={t.icon} size={22} stroke={isActive ? 2.2 : 1.75}/>
              <span style={{ fontSize: 10.5, fontFamily: 'var(--font-body)', fontWeight: isActive ? 700 : 500, letterSpacing: '-0.005em' }}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Status pill (on track / warning / crisis) ──────────────────
function StatusPill({ state }) {
  const cfg = {
    healthy: { color: '#00C853', bg: 'rgba(0,200,83,0.12)', label: 'On track', icon: 'check' },
    warning: { color: '#FFB300', bg: 'rgba(255,179,0,0.12)', label: 'Watch out', icon: 'alert' },
    crisis:  { color: '#EF4444', bg: 'rgba(239,68,68,0.12)', label: 'Crisis',    icon: 'alert' },
  }[state] || { color: '#00C853', bg: 'rgba(0,200,83,0.12)', label: 'On track', icon: 'check' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '4px 9px', borderRadius: 999, background: cfg.bg, color: cfg.color,
      fontSize: 11.5, fontWeight: 700, letterSpacing: '-0.01em',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 3, background: cfg.color }} />
      {cfg.label}
    </span>
  );
}

// ── Slide-up sheet ─────────────────────────────────────────────
function Sheet({ open, onClose, title, children }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      pointerEvents: open ? 'auto' : 'none',
      visibility: open ? 'visible' : 'hidden',
    }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
        opacity: open ? 1 : 0, transition: 'opacity 0.25s ease',
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: 'var(--surface)', borderRadius: '24px 24px 0 0',
        padding: '12px 20px 28px', paddingBottom: 'calc(28px + var(--bottom-safe))',
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.32s cubic-bezier(0.22, 1, 0.36, 1)',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.18)',
        maxHeight: '85%', overflow: 'auto',
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--track)', margin: '4px auto 14px' }} />
        {title && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em' }}>{title}</h3>
            <button onClick={onClose} style={{ background: 'var(--sunken)', border: 'none', borderRadius: 999, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text)' }}>
              <Icon name="x" size={18}/>
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

// ── Page header (back arrow + title + optional trailing) ───────
function PageHeader({ title, sub, onBack, trailing }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '8px 20px 12px' }}>
      {onBack && (
        <button onClick={onBack} style={{ background: 'var(--sunken)', border: 'none', borderRadius: 999, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text)', marginTop: 2 }}>
          <Icon name="arrowLeft" size={18}/>
        </button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.025em', lineHeight: 1.05 }}>{title}</h1>
        {sub && <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>{sub}</p>}
      </div>
      {trailing}
    </div>
  );
}

// ── Toast (top transient message) ───────────────────────────────
function useToast() {
  const [msg, setMsg] = useState(null);
  const show = useCallback((text, tone = 'success') => {
    setMsg({ text, tone, id: Math.random() });
    setTimeout(() => setMsg(m => (m && m.text === text) ? null : m), 2400);
  }, []);
  const Toast = msg ? (
    <div style={{
      position: 'absolute', top: 70, left: '50%', transform: 'translateX(-50%)',
      background: msg.tone === 'success' ? 'var(--edu-green)' : msg.tone === 'danger' ? '#EF4444' : 'var(--text)',
      color: '#fff', padding: '10px 16px', borderRadius: 999,
      fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-body)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
      zIndex: 200,
      animation: 'toastIn 0.32s cubic-bezier(0.22, 1, 0.36, 1)',
    }}>{msg.text}</div>
  ) : null;
  return [Toast, show];
}

// ── Currency helper ─────────────────────────────────────────────
function R(n) {
  const abs = Math.abs(Math.round(n));
  return 'R' + abs.toLocaleString('en-ZA');
}

Object.assign(window, {
  Icon, Logo, Wordmark, Card, Button, ProgressBar, ProgressRing,
  BottomNav, StatusPill, Sheet, PageHeader, useToast, R,
});
