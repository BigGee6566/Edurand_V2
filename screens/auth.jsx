// screens/auth.jsx — Splash, intro carousel, login, signup
// Auth never validates anything — just animates → goes to home.

const { useState, useEffect, useMemo, useRef, useCallback } = React;
function SplashScreen({ t, onContinue }) {
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(180deg, var(--splash-1) 0%, var(--splash-2) 100%)',
      padding: 'calc(60px + env(safe-area-inset-top)) 24px 32px',
    }}>
      {/* hero */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 28, textAlign: 'center' }}>
        <div style={{
          width: 132, height: 132, borderRadius: '50%',
          background: 'var(--splash-logo-bg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 20px 60px rgba(0, 102, 255, 0.25)',
        }}>
          <Logo size={84}/>
        </div>
        <div>
          <Wordmark size={48} weight={900}/>
          <p style={{ margin: '10px 0 0', fontSize: 16, fontWeight: 500, color: 'var(--text-muted)', maxWidth: 280, lineHeight: 1.4 }}>
            {t.splashTagline}
          </p>
        </div>
        {/* badges */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['NSFAS-aware', 'WhatsApp coach', 'Built in 🇿🇦'].map(b => (
            <span key={b} style={{
              padding: '6px 12px', borderRadius: 999,
              background: 'var(--splash-chip)', color: 'var(--text)',
              fontSize: 12, fontWeight: 600, letterSpacing: '-0.01em',
            }}>{b}</span>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Button onClick={() => onContinue('signup')} variant="primary" size="lg" full iconRight="arrowRight" style={{ background: '#FFE48A', color: '#0F172A' }}>{t.getStarted}</Button>
        <Button onClick={() => onContinue('login')} variant="ghost" size="md" full>
          {t.haveAccount} <span style={{ color: 'var(--edu-blue)', fontWeight: 700, marginLeft: 4 }}>{t.login}</span>
        </Button>
      </div>
    </div>
  );
}

function LoginScreen({ t, onBack, onLogin, onSwitchToSignup, persona }) {
  const [email, setEmail] = useState(persona.short.toLowerCase() + '@student.ac.za');
  const [pw, setPw] = useState('••••••••');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e?.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 700);
  };

  return (
    <form onSubmit={submit} style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 'calc(56px + env(safe-area-inset-top)) 24px 24px' }}>
      <button type="button" onClick={onBack} aria-label="Go back" style={{
        background: 'var(--sunken)', border: 'none', borderRadius: 999, width: 40, height: 40,
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text)',
        alignSelf: 'flex-start', marginBottom: 24,
      }}><Icon name="arrowLeft" size={18}/></button>

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 34, letterSpacing: '-0.03em', lineHeight: 1.05 }}>{t.loginTitle}</h1>
        <p style={{ margin: '8px 0 0', fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.4 }}>{t.loginSub}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
        <Field label={t.email} icon="mail" id="login-email">
          <input id="login-email" type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle}/>
        </Field>
        <Field label={t.password} icon="lock" id="login-pw" trailing={
          <button type="button" onClick={() => setShowPw(!showPw)} style={trailingBtn} aria-label="Toggle password visibility">
            <Icon name={showPw ? 'eye' : 'eye'} size={16}/>
          </button>
        }>
          <input id="login-pw" type={showPw ? 'text' : 'password'} value={pw} onChange={e => setPw(e.target.value)} style={inputStyle}/>
        </Field>
        <a href="#" onClick={e => e.preventDefault()} style={{ alignSelf: 'flex-end', fontSize: 13, color: 'var(--edu-blue)', fontWeight: 600, textDecoration: 'none' }}>Forgot password?</a>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 24 }}>
        <Button type="submit" variant="primary" size="lg" full disabled={loading} style={{ background: '#FFE48A', color: '#0F172A' }}>
          {loading ? 'Signing in…' : t.login}
        </Button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)', fontSize: 12 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--track)' }}/>
          {t.or}
          <div style={{ flex: 1, height: 1, background: 'var(--track)' }}/>
        </div>
        <Button type="button" onClick={submit} variant="secondary" size="lg" full>
          <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
            <GoogleG/> {t.continueGoogle}
          </span>
        </Button>
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
          {t.noAccount} <a href="#" onClick={e => { e.preventDefault(); onSwitchToSignup(); }} style={{ color: 'var(--edu-blue)', fontWeight: 700, textDecoration: 'none' }}>{t.signup}</a>
        </p>
      </div>
    </form>
  );
}

function SignupScreen({ t, onBack, onSignup, onSwitchToLogin, persona, setPersona }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState(persona.name);
  const [email, setEmail] = useState(persona.short.toLowerCase() + '@student.ac.za');
  const [pw, setPw] = useState('');
  const [uni, setUni] = useState(persona.university);
  const [fund, setFund] = useState(persona.id);
  const [loading, setLoading] = useState(false);

  const next = () => {
    if (step < 1) setStep(s => s + 1);
    else {
      setLoading(true);
      setPersona(fund);
      setTimeout(() => { setLoading(false); onSignup(); }, 800);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 'calc(56px + env(safe-area-inset-top)) 24px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button type="button" onClick={step === 0 ? onBack : () => setStep(0)} aria-label="Go back" style={{
          background: 'var(--sunken)', border: 'none', borderRadius: 999, width: 40, height: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text)',
        }}><Icon name="arrowLeft" size={18}/></button>
        <div style={{ flex: 1, height: 4, borderRadius: 4, background: 'var(--track)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(step + 1) * 50}%`, background: 'var(--edu-blue)', borderRadius: 4, transition: 'width 0.4s ease' }}/>
        </div>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{step + 1}/2</span>
      </div>

      <div style={{ marginBottom: 22 }}>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 32, letterSpacing: '-0.03em', lineHeight: 1.05 }}>
          {step === 0 ? t.signupTitle : 'Tell us about you'}
        </h1>
        <p style={{ margin: '8px 0 0', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.4 }}>
          {step === 0 ? t.signupSub : 'So we can tailor your tips. Skip anytime.'}
        </p>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {step === 0 ? (
          <>
            <Field label={t.fullName} icon="user" id="signup-name">
              <input id="signup-name" type="text" value={name} onChange={e => setName(e.target.value)} style={inputStyle}/>
            </Field>
            <Field label={t.email} icon="mail" id="signup-email">
              <input id="signup-email" type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle}/>
            </Field>
            <Field label={t.password} icon="lock" id="signup-pw">
              <input id="signup-pw" type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="6+ characters" style={inputStyle}/>
            </Field>
          </>
        ) : (
          <>
            <div>
              <label style={fieldLabel}>{t.university}</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {['UCT', 'Wits', 'Stellies', 'UJ', 'UP', 'Other'].map(u => (
                  <Chip key={u} active={uni.includes(u) || (u === 'UCT' && uni === 'University of Cape Town') || (u === 'Wits' && uni === 'University of the Witwatersrand') || (u === 'Stellies' && uni === 'Stellenbosch University')}
                    onClick={() => setUni(u)}>{u}</Chip>
                ))}
              </div>
            </div>
            <div>
              <label style={fieldLabel}>{t.funding}</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { id: 'nsfas',   label: 'NSFAS',           sub: 'Most common for SA undergrads' },
                  { id: 'bursary', label: 'Bursary',          sub: 'Company or merit-based' },
                  { id: 'self',    label: 'Self / family',    sub: 'Part-time, parents, or both' },
                ].map(opt => (
                  <FundCard key={opt.id} active={fund === opt.id} onClick={() => setFund(opt.id)} {...opt}/>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 18 }}>
        <Button onClick={next} variant="primary" size="lg" full iconRight="arrowRight" disabled={loading} style={{ background: '#FFE48A', color: '#0F172A' }}>
          {loading ? 'Creating account…' : step === 0 ? t.next : t.getStarted}
        </Button>
        {step === 0 && (
          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
            {t.haveAccount} <a href="#" onClick={e => { e.preventDefault(); onSwitchToLogin(); }} style={{ color: 'var(--edu-blue)', fontWeight: 700, textDecoration: 'none' }}>{t.login}</a>
          </p>
        )}
      </div>
    </div>
  );
}

// ── Field components ─────────────────────────────────────────
const inputStyle = {
  width: '100%', height: 52, padding: '0 16px 0 44px',
  background: 'var(--input-bg)', border: 'var(--input-border)',
  borderRadius: 'var(--r-input)', fontSize: 15, fontFamily: 'var(--font-body)',
  fontWeight: 500, color: 'var(--text)', outline: 'none', boxSizing: 'border-box',
  letterSpacing: '-0.01em',
};
const fieldLabel = { fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8, display: 'block' };
const trailingBtn = { position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 };

function Field({ label, icon, children, trailing, id }) {
  return (
    <div>
      <label htmlFor={id} style={fieldLabel}>{label}</label>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', display: 'flex', color: 'var(--text-muted)', zIndex: 1 }}>
          <Icon name={icon} size={18}/>
        </span>
        {children}
        {trailing}
      </div>
    </div>
  );
}

function Chip({ children, active, onClick }) {
  return (
    <button type="button" onClick={onClick} style={{
      padding: '10px 12px', borderRadius: 'var(--r-btn-sm)',
      background: active ? 'var(--edu-blue)' : 'var(--sunken)',
      color: active ? '#fff' : 'var(--text)',
      border: active ? 'none' : 'var(--card-border)',
      fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-body)',
      cursor: 'pointer', letterSpacing: '-0.01em',
      transition: 'transform 0.12s', textAlign: 'center',
    }}>{children}</button>
  );
}

function FundCard({ id, label, sub, active, onClick }) {
  return (
    <button type="button" onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '14px 14px',
      background: active ? 'rgba(0,102,255,0.08)' : 'var(--sunken)',
      border: active ? '2px solid var(--edu-blue)' : '2px solid transparent',
      borderRadius: 'var(--r-card)', cursor: 'pointer', width: '100%', textAlign: 'left',
      transition: 'all 0.15s',
    }}>
      <span style={{
        width: 22, height: 22, borderRadius: 11,
        border: active ? '7px solid var(--edu-blue)' : '2px solid var(--track)',
        background: active ? 'var(--edu-blue)' : 'transparent',
        boxSizing: 'border-box', transition: 'all 0.15s',
      }}/>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', letterSpacing: '-0.01em' }}>{label}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{sub}</div>
      </div>
    </button>
  );
}

function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.83.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.95v2.34A9 9 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.94H.95A9 9 0 0 0 0 9c0 1.45.35 2.83.95 4.06l3.02-2.34z" fill="#FBBC04"/>
      <path d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 9 0 9 9 0 0 0 .95 4.94L3.97 7.28C4.68 5.16 6.66 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

Object.assign(window, { SplashScreen, LoginScreen, SignupScreen });
