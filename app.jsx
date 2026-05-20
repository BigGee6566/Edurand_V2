// app.jsx — top-level state, routing, theme, both devices side-by-side

const { useState, useEffect, useMemo, useRef, useCallback } = React;
const APP_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#0066FF", "#00C853", "#FFB300"],
  "direction": "cozy",
  "dark": false,
  "persona": "nsfas",
  "lang": "en",
  "budgetState": "warning",
  "budget": 1500
}/*EDITMODE-END*/;

const TABS = [
  { id: 'home',    label: 'Home',    icon: 'home' },
  { id: 'budget',  label: 'Budget',  icon: 'chart' },
  { id: 'coach',   label: 'Coach',   icon: 'bot' },
  { id: 'learn',   label: 'Learn',   icon: 'book' },
  { id: 'profile', label: 'Profile', icon: 'user' },
];

const PALETTES = [
  ['#0066FF', '#00C853', '#FFB300'],  // original — confident blue + grass green + amber
  ['#1B4ED8', '#10B981', '#F59E0B'],  // saturated tech — deeper indigo, jewel green, tangerine
  ['#5B5BF1', '#22C55E', '#FB923C'],  // friendly violet — softer, more playful
  ['#0B7285', '#A3E635', '#FFC93C'],  // earthy aqua — south-african sun feel, lime accent
];

// ─────────────────────────────────────────────────────────────
// Theme: writes CSS variables onto the device root.
// Two "directions":
//   cozy   — soft rounded, generous, friendly
//   bold   — sharper, editorial, bigger type, thinner card surfaces
// Light / Dark variants.
// ─────────────────────────────────────────────────────────────
function themeVars({ palette, direction, dark }) {
  const [blue, green, yellow] = palette;
  const cozy = direction === 'cozy';
  const light = !dark;
  return {
    '--edu-blue':   blue,
    '--edu-green':  green,
    '--edu-yellow': yellow,
    '--font-display': cozy ? '"Plus Jakarta Sans", system-ui, sans-serif' : '"Bricolage Grotesque", "Plus Jakarta Sans", system-ui, sans-serif',
    '--font-body':    '"Plus Jakarta Sans", system-ui, sans-serif',

    '--bg':         light ? '#F4F6FA' : '#0B0E14',
    '--surface':    light ? '#FFFFFF' : '#161A23',
    '--sunken':     light ? '#EEF1F6' : '#1F2430',
    '--text':       light ? '#0F172A' : '#F1F5F9',
    '--text-muted': light ? '#64748B' : '#94A3B8',
    '--track':      light ? '#E2E8F0' : '#2A303E',
    '--track-soft': light ? '#EEF1F6' : '#222837',

    '--r-card':     cozy ? '18px' : '12px',
    '--r-btn':      cozy ? '14px' : '10px',
    '--r-btn-sm':   cozy ? '10px' : '8px',
    '--r-input':    cozy ? '14px' : '10px',
    '--card-pad':   cozy ? '16px' : '14px',

    '--card-border': cozy ? (light ? '1px solid rgba(15,23,42,0.04)' : '1px solid rgba(255,255,255,0.06)') : (light ? '1px solid rgba(15,23,42,0.08)' : '1px solid rgba(255,255,255,0.08)'),
    '--shadow-card': cozy
      ? (light ? '0 1px 2px rgba(15,23,42,0.04), 0 4px 18px rgba(15,23,42,0.04)' : '0 1px 2px rgba(0,0,0,0.4)')
      : 'none',

    '--input-bg':     light ? '#F8FAFC' : '#1F2430',
    '--input-border': light ? '1.5px solid #CBD5E1' : '1.5px solid rgba(255,255,255,0.12)',

    '--btn-primary-bg': blue,
    '--btn-primary-fg': '#FFFFFF',
    '--btn-sec-bg':     light ? '#F1F4F9' : '#1F2430',
    '--btn-sec-fg':     light ? '#0F172A' : '#F1F5F9',
    '--btn-sec-border': '1.5px solid transparent',

    '--hero-bg':  `linear-gradient(135deg, ${blue} 0%, ${shade(blue, -12)} 100%)`,
    '--hero-fg':  '#FFFFFF',
    '--hero-blob': shade(green, 8),
    '--hero-btn-bg': 'rgba(255,255,255,0.18)',
    '--hero-btn-fg': '#FFFFFF',

    '--nav-bg':     light ? 'rgba(255,255,255,0.94)' : 'rgba(11,14,20,0.94)',
    '--nav-border': light ? '1px solid rgba(15,23,42,0.06)' : '1px solid rgba(255,255,255,0.06)',

    '--splash-1': light ? '#E0F2FE' : '#0B1726',
    '--splash-2': light ? '#F0F9FF' : '#0B0E14',
    '--splash-chip': light ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.1)',
    '--splash-logo-bg': light ? '#FFFFFF' : '#1F2430',

    '--bottom-safe': '0px',
  };
}

function shade(hex, percent) {
  const n = parseInt(hex.replace('#', ''), 16);
  let r = (n >> 16) + percent;
  let g = ((n >> 8) & 0xff) + percent;
  let b = (n & 0xff) + percent;
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

// ─────────────────────────────────────────────────────────────
// One self-contained Prototype instance (used per device frame)
// ─────────────────────────────────────────────────────────────
function Prototype({ tweaks, setTweak, deviceKind }) {
  const persona = PERSONAS[tweaks.persona];
  const t = I18N[tweaks.lang] || I18N.en;
  const stateMap = SPENDING_STATES[tweaks.budgetState];
  const budget = tweaks.budget;
  const monthSpent = useMemo(() => stateMap.txns.reduce((a, b) => a + (b.amount < 0 ? Math.abs(b.amount) : 0), 0), [stateMap]);
  const daysLeft = stateMap.daysLeft;

  // Local screen state
  const [route, setRoute] = useState('tab'); // splash | login | signup | tab (with `tab` value) | coach | meals | transport | challenges | news | simulator | scam | linkbank
  const [tab, setTab] = useState('home');
  const [txns, setTxns] = useState(stateMap.txns);
  const [waOpen, setWaOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [addMode, setAddMode] = useState('expense');

  // Reset txns when state changes
  useEffect(() => { setTxns(SPENDING_STATES[tweaks.budgetState].txns); }, [tweaks.budgetState]);

  // Reset to home on persona/lang change to avoid mismatched state
  useEffect(() => { if (route !== 'splash' && route !== 'login' && route !== 'signup') { /* keep */ } }, [tweaks.persona, tweaks.lang]);

  const [Toast, showToast] = useToast();

  const themeStyle = themeVars(tweaks);

  const goToTab = (id) => { setTab(id); setRoute('tab'); };
  const goTo = (id) => {
    if (['home', 'budget', 'coach', 'learn', 'profile'].includes(id)) goToTab(id);
    else setRoute(id);
  };

  const Inner = () => {
    if (route === 'splash')  return <SplashScreen  t={t} onContinue={(next) => setRoute(next)}/>;
    if (route === 'login')   return <LoginScreen   t={t} persona={persona} onBack={() => setRoute('splash')} onLogin={() => { setTab('home'); setRoute('tab'); }} onSwitchToSignup={() => setRoute('signup')}/>;
    if (route === 'signup')  return <SignupScreen  t={t} persona={persona} onBack={() => setRoute('splash')} onSignup={() => { setTab('home'); setRoute('tab'); }} onSwitchToLogin={() => setRoute('login')} setPersona={() => {}}/>;
    if (route === 'meals')      return <MealsScreen      t={t} onGo={goTo} showToast={showToast}/>;
    if (route === 'transport')  return <TransportScreen  t={t} onGo={goTo} persona={persona} showToast={showToast}/>;
    if (route === 'challenges') return <ChallengesScreen t={t} onGo={goTo} showToast={showToast}/>;
    if (route === 'news')       return <NewsScreen       t={t} onGo={goTo}/>;
    if (route === 'simulator')  return <SimulatorScreen  t={t} onGo={goTo} persona={persona} budget={budget} monthSpent={monthSpent} daysLeft={daysLeft} state={tweaks.budgetState}/>;
    if (route === 'scam')       return <ScamShieldScreen t={t} onGo={goTo} persona={persona}/>;
    if (route === 'linkbank')   return <LinkBankScreen   t={t} onGo={goTo} showToast={showToast}/>;

    // Default: tabbed screens
    if (tab === 'home')    return <HomeScreen    t={t} persona={persona} spending={stateMap} state={tweaks.budgetState} budget={budget} onGo={goTo} txns={txns} daysLeft={daysLeft} monthSpent={monthSpent} lang={tweaks.lang}/>;
    if (tab === 'budget')  return <BudgetScreen  t={t} persona={persona} budget={budget} monthSpent={monthSpent} txns={txns} setTxns={setTxns} lang={tweaks.lang} showToast={showToast} state={tweaks.budgetState} onOpenAdd={() => setAddOpen(true)}/>;
    if (tab === 'coach')   return <CoachScreen   t={t} persona={persona} lang={tweaks.lang} state={tweaks.budgetState} monthSpent={monthSpent} budget={budget} daysLeft={daysLeft} txns={txns} onGo={goTo}/>;
    if (tab === 'learn')   return <LearnScreen   t={t} onGo={goTo} persona={persona}/>;
    if (tab === 'profile') return <ProfileScreen t={t} persona={persona} lang={tweaks.lang} dark={tweaks.dark} onGo={goTo} onOpenWhatsApp={() => setWaOpen(true)} onToggleDark={(v) => setTweak('dark', v)} onSignOut={() => setRoute('splash')}/>;
    return null;
  };

  const showBottomNav = route === 'tab';
  const NAV_H = 70;

  // iOS status bar is absolutely positioned over the top; Android renders it above.
  const topPad = deviceKind === 'ios' ? 56 : 0;

  return (
    <div
      data-screen-label={`${deviceKind.toUpperCase()} ${route === 'tab' ? tab : route}`}
      style={{
        ...themeStyle,
        position: 'relative',
        width: '100%', height: '100%',
        background: 'var(--bg)',
        color: 'var(--text)',
        fontFamily: 'var(--font-body)',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}>
      <div style={{
        position: 'absolute',
        top: topPad, left: 0, right: 0,
        bottom: showBottomNav ? NAV_H : 0,
        overflow: 'auto',
      }}>
        <Inner/>
      </div>
      {showBottomNav && <BottomNav tabs={TABS} active={tab} onChange={goToTab}/>}

      {/* Floating add-spend FAB — only on Budget tab */}
      {route === 'tab' && tab === 'budget' && (
        <button onClick={() => setAddOpen(true)} aria-label="Add spend" style={{
          position: 'absolute', right: 18, bottom: NAV_H + 14,
          width: 58, height: 58, borderRadius: 29,
          background: 'var(--edu-blue)', color: '#fff', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 12px 32px rgba(0,102,255,0.45), 0 2px 8px rgba(0,0,0,0.18)',
          zIndex: 80,
        }}>
          <Icon name="plus" size={28} stroke={2.4}/>
        </button>
      )}

      {/* Add-spend sheet at root so it covers full device */}
      <AddSheet
        open={addOpen}
        onClose={() => setAddOpen(false)}
        mode={addMode}
        setMode={setAddMode}
        onSave={(tx) => {
          setTxns(prev => [{ ...tx, id: Date.now() }, ...prev]);
          setAddOpen(false);
          showToast(tx.amount < 0 ? `Spend of ${R(Math.abs(tx.amount))} logged` : `${R(tx.amount)} added to income`);
          if (tab !== 'budget') goToTab('budget');
        }}
      />

      {waOpen && <WhatsAppPreview onClose={() => setWaOpen(false)} persona={persona} lang={tweaks.lang}/>}
      {Toast}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Top-level App: tweaks panel + Android + iOS frames
// ─────────────────────────────────────────────────────────────
function App() {
  const [tweaks, setTweak] = useTweaks(APP_TWEAK_DEFAULTS);

  return (
    <>
      <GlobalStyles dark={tweaks.dark}/>

      {/* Stage background */}
      <div style={{
        minHeight: '100vh',
        background: tweaks.dark
          ? 'radial-gradient(ellipse at top, #1a1f2e 0%, #050810 60%, #000 100%)'
          : 'radial-gradient(ellipse at top, #E6EEFB 0%, #C7D8F2 50%, #94B0DD 100%)',
        padding: '40px 24px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        {/* Title strip */}
        <div style={{ textAlign: 'center', marginBottom: 28, maxWidth: 920 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <Logo size={36}/>
            <Wordmark size={28} weight={900}/>
          </div>
          <div style={{
            fontFamily: tweaks.direction === 'cozy' ? '"Plus Jakarta Sans", system-ui, sans-serif' : '"Bricolage Grotesque", system-ui, sans-serif',
            fontWeight: 800, fontSize: 'clamp(22px, 3vw, 32px)', letterSpacing: '-0.025em',
            color: tweaks.dark ? '#fff' : '#0F172A', lineHeight: 1.15,
          }}>
            Smart money & lifestyle assistant <br/>for South African students.
          </div>
          <div style={{
            fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
            fontWeight: 500, fontSize: 14, color: tweaks.dark ? '#94A3B8' : '#475569', marginTop: 8, maxWidth: 540, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.5,
          }}>
            Tap around on either device. They're independent. Toggle <b>Tweaks</b> to swap palettes, switch personas, change the language, or flip the spending crisis on.
          </div>
        </div>

        {/* Two devices side-by-side */}
        <div style={{
          display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start',
        }}>
          <DeviceWithLabel label="Android · Material" kind="android">
            <AndroidDevice width={380} height={820} dark={tweaks.dark}>
              <Prototype tweaks={tweaks} setTweak={setTweak} deviceKind="android"/>
            </AndroidDevice>
          </DeviceWithLabel>

          <DeviceWithLabel label="iOS · Liquid Glass" kind="ios">
            <IOSDevice width={380} height={820} dark={tweaks.dark}>
              <Prototype tweaks={tweaks} setTweak={setTweak} deviceKind="ios"/>
            </IOSDevice>
          </DeviceWithLabel>
        </div>

        <Credit dark={tweaks.dark}/>
      </div>

      <TweaksUI tweaks={tweaks} setTweak={setTweak}/>
    </>
  );
}

function DeviceWithLabel({ label, kind, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <div style={{ position: 'relative' }}>
        {children}
      </div>
      <div style={{
        padding: '6px 14px', borderRadius: 999, background: 'rgba(0,0,0,0.6)',
        color: '#fff', fontFamily: '"Plus Jakarta Sans", system-ui', fontSize: 12, fontWeight: 700, letterSpacing: '-0.005em',
        backdropFilter: 'blur(10px)',
      }}>{label}</div>
    </div>
  );
}

function Credit({ dark }) {
  return (
    <div style={{
      marginTop: 32, padding: '12px 16px', borderRadius: 12,
      background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.6)',
      color: dark ? '#94A3B8' : '#475569',
      fontFamily: '"Plus Jakarta Sans", system-ui', fontSize: 12,
      backdropFilter: 'blur(10px)', maxWidth: 540, textAlign: 'center',
    }}>
      Prototype · AI Coach uses real model calls · All amounts in ZAR · Personas, brands & flows reflect SA student life
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Tweaks panel
// ─────────────────────────────────────────────────────────────
function TweaksUI({ tweaks, setTweak }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Visual direction"/>
      <TweakRadio label="Direction" value={tweaks.direction} options={['cozy', 'bold']}
        onChange={v => setTweak('direction', v)}/>
      <TweakToggle label="Dark mode" value={tweaks.dark}
        onChange={v => setTweak('dark', v)}/>
      <TweakColor label="Palette" value={tweaks.palette} options={PALETTES}
        onChange={v => setTweak('palette', v)}/>

      <TweakSection label="Persona"/>
      <TweakRadio label="Funding" value={tweaks.persona} options={['nsfas', 'bursary', 'self']}
        onChange={v => setTweak('persona', v)}/>

      <TweakSection label="This month"/>
      <TweakRadio label="State" value={tweaks.budgetState} options={['healthy', 'warning', 'crisis']}
        onChange={v => setTweak('budgetState', v)}/>
      <TweakSlider label="Budget" value={tweaks.budget} min={500} max={5000} step={100} unit=" R"
        onChange={v => setTweak('budget', v)}/>

      <TweakSection label="Language"/>
      <TweakRadio label="Language" value={tweaks.lang} options={['en', 'zu', 'af']}
        onChange={v => setTweak('lang', v)}/>
    </TweaksPanel>
  );
}

// ─────────────────────────────────────────────────────────────
// Global stylesheet — fonts + keyframes
// ─────────────────────────────────────────────────────────────
function GlobalStyles({ dark }) {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&display=swap');

      html, body { margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
      * { box-sizing: border-box; }
      button, input, textarea { font-family: inherit; }
      input::placeholder, textarea::placeholder { color: ${dark ? '#64748B' : '#94A3B8'}; opacity: 1; }
      input:focus, textarea:focus { border-color: var(--edu-blue, #0066FF) !important; box-shadow: 0 0 0 3px rgba(0,102,255,0.15); }

      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes popIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
      @keyframes msgIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes toastIn { from { opacity: 0; transform: translate(-50%, -8px); } to { opacity: 1; transform: translate(-50%, 0); } }
      @keyframes dotBlink {
        0%, 80%, 100% { opacity: 0.35; transform: scale(0.8); }
        40% { opacity: 1; transform: scale(1); }
      }

      ::-webkit-scrollbar { width: 0; height: 0; }
    `}</style>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
