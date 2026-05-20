// screens/extras.jsx — added features: Simulator, Scam Shield, Link Bank, WhatsApp preview, Today wins
const { useState, useEffect, useMemo, useRef } = React;

// ─────────────────────────────────────────────────────────────
// 1. CRISIS SIMULATOR — "Will I make it?"
// ─────────────────────────────────────────────────────────────
function SimulatorScreen({ t, onGo, persona, budget, monthSpent, daysLeft, state }) {
  const remaining = budget - monthSpent;
  const safeDaily = Math.max(0, remaining / Math.max(daysLeft, 1));
  const [perDay, setPerDay] = useState(Math.round(state === 'crisis' ? safeDaily * 1.5 : safeDaily * 1.1));

  const daysCovered = perDay > 0 ? Math.floor(remaining / perDay) : daysLeft;
  const willMake = daysCovered >= daysLeft;
  const shortfall = (perDay * daysLeft) - remaining;

  // Projected end date
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + Math.min(daysCovered, daysLeft));
  const allowanceDate = new Date();
  allowanceDate.setDate(allowanceDate.getDate() + daysLeft);
  const dateLabel = endDate.toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' });

  // Build 30-day grid representing days from "today" forward; mark safe vs risky
  const grid = Array.from({ length: daysLeft }, (_, i) => {
    const day = i + 1;
    return { day, safe: day <= daysCovered, isAllowance: day === daysLeft };
  });

  return (
    <div style={{ paddingBottom: 30 }}>
      <PageHeader title="Will I make it?" sub="Move the slider to test scenarios" onBack={() => onGo('home')}/>

      {/* Hero result */}
      <div style={{ padding: '0 20px' }}>
        <Card padded={false} style={{
          background: willMake
            ? 'linear-gradient(135deg, var(--edu-green), #06B6D4)'
            : 'linear-gradient(135deg, #EF4444, #F59E0B)',
          color: '#fff', border: 'none', overflow: 'hidden', position: 'relative',
        }}>
          <div style={{ position: 'absolute', right: -20, top: -20, fontSize: 130, opacity: 0.15 }}>
            {willMake ? '🎯' : '⚠️'}
          </div>
          <div style={{ padding: 20, position: 'relative' }}>
            <div style={{ fontSize: 11.5, opacity: 0.85, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              At R{perDay}/day your money lasts until
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 42, letterSpacing: '-0.035em', marginTop: 8, lineHeight: 1 }}>
              {dateLabel}
            </div>
            <div style={{ fontSize: 13.5, opacity: 0.92, marginTop: 8 }}>
              {willMake
                ? `Allowance lands ${daysLeft - daysCovered === 0 ? 'the same day' : `${daysLeft - daysCovered} days later`}. You'd have ${R(remaining - perDay * daysLeft)} spare.`
                : `That's ${daysLeft - daysCovered} days short of allowance. You'd need ${R(shortfall)} more.`}
            </div>
          </div>
        </Card>
      </div>

      {/* Slider */}
      <div style={{ padding: '14px 20px 0' }}>
        <Card padded={false}>
          <div style={{ padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em' }}>Spend per day</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 28, color: 'var(--edu-blue)', letterSpacing: '-0.025em' }}>{R(perDay)}</div>
            </div>
            <input type="range" min="0" max="200" value={perDay} onChange={e => setPerDay(+e.target.value)}
              style={{ width: '100%', accentColor: willMake ? 'var(--edu-green)' : '#EF4444', marginTop: 14, height: 8 }}/>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              <span>R0</span>
              <span>safe pace ≈ {R(Math.round(safeDaily))}</span>
              <span>R200</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Calendar grid */}
      <div style={{ padding: '14px 20px 0' }}>
        <Card padded={false}>
          <div style={{ padding: '14px 14px 6px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, letterSpacing: '-0.02em' }}>Next {daysLeft} days</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>green = covered · red = short</div>
          </div>
          <div style={{ padding: '6px 14px 16px', display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5 }}>
            {grid.map((g, i) => (
              <div key={i} style={{
                aspectRatio: '1/1',
                borderRadius: 8,
                background: g.isAllowance ? 'var(--edu-blue)' : g.safe ? 'rgba(0,200,83,0.18)' : 'rgba(239,68,68,0.22)',
                border: g.isAllowance ? '2px solid var(--edu-blue)' : 'none',
                color: g.isAllowance ? '#fff' : g.safe ? 'var(--edu-green)' : '#EF4444',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, fontVariantNumeric: 'tabular-nums',
              }}>
                {g.isAllowance ? '💸' : g.day}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Suggestions */}
      <div style={{ padding: '14px 20px 0' }}>
        <SectionLabel>{willMake ? 'You\'re safe — here\'s how to bank more' : 'Three ways to cover the shortfall'}</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
          {(willMake ? [
            { icon: '🏦', text: `Move R${Math.min(50, Math.floor(remaining/20))} into your Tymebank GoalSave today`, gain: `+${Math.floor((remaining-perDay*daysLeft)/2)} into emergency fund` },
            { icon: '🍳', text: 'Lock in 4 cooked meals this week', gain: 'Save ~R85 vs takeaway' },
            { icon: '🚐', text: 'Use Jammie / MyCiTi for the next 3 trips', gain: 'Free up R96' },
          ] : [
            { icon: '🍲', text: 'Drop 2 takeaways this week (cook pap + chakalaka)', gain: 'Save ~R170' },
            { icon: '🚐', text: 'Walk or bus instead of Uber, 4 trips', gain: 'Save ~R130' },
            { icon: '📶', text: 'Switch to data-only Power Hour bundles', gain: 'Save ~R80/mo' },
          ]).map((s, i) => (
            <div key={i} style={{
              display: 'flex', gap: 12, padding: 13, borderRadius: 'var(--r-card)',
              background: 'var(--surface)', border: 'var(--card-border)', boxShadow: 'var(--shadow-card)',
              alignItems: 'center',
            }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--sunken)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{s.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.01em' }}>{s.text}</div>
                <div style={{ fontSize: 11.5, color: 'var(--edu-green)', fontWeight: 700, marginTop: 2 }}>{s.gain}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. SCAM SHIELD — Paste a sus message, get verdict
// ─────────────────────────────────────────────────────────────
const KNOWN_SCAMS = [
  { id: 's1', label: 'NSFAS', color: '#EF4444', title: 'Fake NSFAS allowance "verification" SMS', tag: 'Active this week',
    sample: '"NSFAS: Your June allowance of R5000 is on hold. Verify your details at nsfas-claim[.]co.za to receive payment."',
    flags: ['Shortened/sketchy domain', 'Inflated amount', 'Urgency + link'] },
  { id: 's2', label: 'Capitec', color: '#FFB300', title: 'Capitec OTP phishing', tag: 'Common',
    sample: '"Capitec: We have detected suspicious activity. Confirm your OTP at this link or your account will be frozen."',
    flags: ['Banks never request OTPs via link', 'Threat of frozen account'] },
  { id: 's3', label: 'Bursary', color: '#7C3AED', title: '"Bursary winner" WhatsApp scam', tag: 'Targeting 1st years',
    sample: '"Congratulations! You\'ve been selected for the SAYouth bursary. Pay R250 admin fee to claim."',
    flags: ['Legitimate bursaries never charge a fee', 'WhatsApp source', 'Pressure tactics'] },
  { id: 's4', label: 'Loan', color: '#EC4899', title: 'Mashonisa / quick-loan trap', tag: 'High harm',
    sample: '"No credit check, no payslip. Instant R3000 in your account. WhatsApp +27 73..."',
    flags: ['No credit check = predatory', 'Personal phone number', 'No registration info'] },
];

function ScamShieldScreen({ t, onGo, persona }) {
  const [msg, setMsg] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [verdict, setVerdict] = useState(null);

  const scan = async () => {
    if (!msg.trim()) return;
    setAnalyzing(true);
    setVerdict(null);
    let result = null;
    try {
      const raw = await window.claude.complete({
        messages: [{
          role: 'user',
          content: `You are a scam-detection assistant for South African students. Analyse this message and respond ONLY with a valid JSON object — no prose, no markdown fences. Schema:
{ "risk": "low" | "medium" | "high", "verdict": "string (one-line plain English verdict, 8-14 words)", "flags": ["string", "string", "string"] }

The "flags" array must contain 2-4 short reasons (each 4-10 words) explaining why it's risky or safe. Reference SA context where relevant (NSFAS, Capitec, SARS, mashonisa, etc.).

Message to analyse:
"""${msg}"""`,
        }],
      });
      const match = raw.match(/\{[\s\S]*\}/);
      result = match ? JSON.parse(match[0]) : null;
    } catch (e) { /* fall through */ }
    if (!result) {
      // Heuristic fallback
      const s = msg.toLowerCase();
      const flags = [];
      if (/(http|bit\.ly|tinyurl|\.co\.za\/|\.zw|\.tk)/.test(s)) flags.push('Contains a shortened or suspicious link');
      if (/(otp|pin|password|verify|confirm)/.test(s)) flags.push('Asks for OTP / password / verification');
      if (/(urgent|now|immediately|frozen|suspended)/.test(s)) flags.push('Uses urgency and pressure');
      if (/(fee|pay|deposit|admin)/.test(s)) flags.push('Asks for a payment up front');
      if (/(winner|congratulations|selected|prize)/.test(s)) flags.push('Unsolicited prize / winner claim');
      const risk = flags.length >= 2 ? 'high' : flags.length === 1 ? 'medium' : 'low';
      result = {
        risk,
        verdict: risk === 'high' ? 'Almost certainly a scam. Do not click or reply.' : risk === 'medium' ? 'Some red flags — verify the sender directly first.' : 'No obvious red flags, but stay cautious.',
        flags: flags.length ? flags : ['No common scam patterns detected'],
      };
    }
    setVerdict(result);
    setAnalyzing(false);
  };

  return (
    <div style={{ paddingBottom: 30 }}>
      <PageHeader title="Scam Shield" sub="Paste a message. Find out if it's a scam." onBack={() => onGo('home')}/>

      {/* Hero */}
      <div style={{ padding: '0 20px' }}>
        <Card padded={false} style={{
          background: 'linear-gradient(135deg, #7C3AED, #DB2777)',
          color: '#fff', border: 'none', overflow: 'hidden', position: 'relative',
        }}>
          <div style={{ position: 'absolute', right: -10, top: -10, fontSize: 110, opacity: 0.18 }}>🛡️</div>
          <div style={{ padding: 18, position: 'relative' }}>
            <div style={{ fontSize: 11.5, opacity: 0.85, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Caught 142 scams this week</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 24, letterSpacing: '-0.025em', marginTop: 6, lineHeight: 1.1, maxWidth: 240 }}>
              Don't reply to anything you're not sure of.
            </div>
          </div>
        </Card>
      </div>

      {/* Scanner */}
      <div style={{ padding: '14px 20px 0' }}>
        <Card padded={false}>
          <div style={{ padding: 16 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em', marginBottom: 8 }}>Scan a message</div>
            <textarea
              value={msg}
              onChange={e => setMsg(e.target.value)}
              placeholder="Paste the SMS, WhatsApp, or email content here…"
              rows={5}
              style={{
                width: '100%', padding: 12, borderRadius: 12,
                background: 'var(--sunken)', border: 'none', outline: 'none',
                fontSize: 13.5, fontFamily: 'var(--font-body)', color: 'var(--text)', resize: 'vertical',
                boxSizing: 'border-box', lineHeight: 1.45,
              }}/>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <Button onClick={() => setMsg(KNOWN_SCAMS[0].sample.replace(/^"|"$/g, ''))} variant="secondary" size="sm">Paste example</Button>
              <div style={{ flex: 1 }}/>
              <Button onClick={scan} variant="primary" size="sm" icon="spark" disabled={!msg.trim() || analyzing}>
                {analyzing ? 'Scanning…' : 'Scan message'}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Verdict */}
      {verdict && (
        <div style={{ padding: '14px 20px 0' }}>
          <ScamVerdict verdict={verdict}/>
        </div>
      )}

      {/* Active threats */}
      <div style={{ padding: '20px 20px 0' }}>
        <SectionLabel>Active scams · {persona.uniShort} students</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
          {KNOWN_SCAMS.map(s => (
            <Card key={s.id} padded={false}>
              <div style={{ padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ padding: '3px 8px', borderRadius: 999, background: s.color + '22', color: s.color, fontSize: 10.5, fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{s.label}</span>
                  <span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{s.tag}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, letterSpacing: '-0.02em', marginBottom: 8 }}>{s.title}</div>
                <div style={{ padding: '10px 12px', borderRadius: 10, background: 'var(--sunken)', fontSize: 12.5, color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.5 }}>{s.sample}</div>
                <div style={{ marginTop: 10 }}>
                  {s.flags.map((f, i) => (
                    <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start', fontSize: 12, color: 'var(--text)', marginTop: 4 }}>
                      <span style={{ color: '#EF4444' }}>⚠</span> <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScamVerdict({ verdict }) {
  const tone = { high: { c: '#EF4444', label: 'HIGH RISK',   bg: 'rgba(239,68,68,0.10)' },
                 medium:{ c: '#FFB300', label: 'BE CAREFUL', bg: 'rgba(255,179,0,0.12)' },
                 low:   { c: '#00C853', label: 'LOOKS OK',   bg: 'rgba(0,200,83,0.12)' } }[verdict.risk] || { c: '#FFB300', label: 'CHECK', bg: 'rgba(255,179,0,0.12)' };
  return (
    <Card padded={false} style={{ borderTop: `4px solid ${tone.c}` }}>
      <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ padding: '4px 10px', borderRadius: 999, background: tone.bg, color: tone.c, fontSize: 11, fontWeight: 900, letterSpacing: '0.06em' }}>{tone.label}</span>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, letterSpacing: '-0.02em', lineHeight: 1.3 }}>{verdict.verdict}</div>
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>Red flags</div>
          {verdict.flags.map((f, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--text)', padding: '6px 0', borderBottom: i === verdict.flags.length - 1 ? 'none' : '1px solid var(--track-soft)' }}>
              <span style={{ color: tone.c }}>•</span> <span style={{ flex: 1 }}>{f}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. LINK BANK — pick SA bank, fake OAuth, success
// ─────────────────────────────────────────────────────────────
const SA_BANKS = [
  { id: 'capitec',  name: 'Capitec',     short: 'Cap',  bg: '#E40521', fg: '#fff' },
  { id: 'tyme',     name: 'Tymebank',    short: 'Ty',   bg: '#00C9A7', fg: '#fff' },
  { id: 'fnb',      name: 'FNB',         short: 'FN',   bg: '#00A3E0', fg: '#fff' },
  { id: 'standard', name: 'Standard',    short: 'SB',   bg: '#0033A0', fg: '#fff' },
  { id: 'absa',     name: 'Absa',        short: 'Ab',   bg: '#DC0032', fg: '#fff' },
  { id: 'nedbank',  name: 'Nedbank',     short: 'Ne',   bg: '#006633', fg: '#fff' },
  { id: 'discovery',name: 'Discovery',   short: 'Di',   bg: '#FCC11A', fg: '#0F172A' },
  { id: 'african',  name: 'African Bank',short: 'AB',   bg: '#FFB81C', fg: '#0F172A' },
];

function LinkBankScreen({ t, onGo, showToast }) {
  const [step, setStep] = useState('pick'); // pick | auth | success
  const [bank, setBank] = useState(null);
  const [authProgress, setAuthProgress] = useState(0);

  useEffect(() => {
    if (step !== 'auth') return;
    let p = 0;
    const id = setInterval(() => {
      p += 8 + Math.random() * 12;
      if (p >= 100) { p = 100; clearInterval(id); setTimeout(() => setStep('success'), 350); }
      setAuthProgress(Math.min(100, p));
    }, 220);
    return () => clearInterval(id);
  }, [step]);

  const pick = (b) => { setBank(b); setAuthProgress(0); setStep('auth'); };

  if (step === 'success') {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <PageHeader title="Linked" onBack={() => onGo('profile')}/>
        <div style={{ flex: 1, padding: '0 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: 16 }}>
          <div style={{
            width: 96, height: 96, borderRadius: '50%',
            background: 'var(--edu-green)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 20px 50px rgba(0,200,83,0.4)',
          }}>
            <Icon name="check" size={56} stroke={3}/>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 26, letterSpacing: '-0.025em' }}>You're linked</div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 6, maxWidth: 280 }}>
              EduRand is pulling your <b style={{ color: 'var(--text)' }}>{bank?.name}</b> transactions. You'll see auto-categorised spends shortly.
            </div>
          </div>
          <div style={{ width: '100%', maxWidth: 300 }}>
            <Button onClick={() => { showToast('Bank linked — transactions importing'); onGo('budget'); }} variant="primary" size="lg" full iconRight="arrowRight">See tracker</Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'auth') {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <PageHeader title="Verifying" onBack={() => setStep('pick')}/>
        <div style={{ flex: 1, padding: '0 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 24 }}>
          <div style={{
            width: 88, height: 88, borderRadius: 22,
            background: bank.bg, color: bank.fg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 30, letterSpacing: '-0.02em',
            boxShadow: `0 20px 50px ${bank.bg}55`,
          }}>{bank.short}</div>
          <div style={{ textAlign: 'center', maxWidth: 280 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 19, letterSpacing: '-0.02em' }}>Connecting to {bank.name}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.45 }}>
              Open Banking · read-only · we can't move money. Powered by Stitch.
            </div>
          </div>
          <div style={{ width: '100%', maxWidth: 280 }}>
            <ProgressBar value={authProgress} color={bank.bg} height={8}/>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 8 }}>
              {authProgress < 30 ? 'Authenticating…' : authProgress < 70 ? 'Pulling 90 days of transactions…' : 'Categorising spends…'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 30 }}>
      <PageHeader title="Link your bank" sub="Auto-track. Read-only. 30 seconds." onBack={() => onGo('profile')}/>

      <div style={{ padding: '0 20px' }}>
        <Card padded={false} style={{ background: 'var(--sunken)', border: 'none' }}>
          <div style={{ padding: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
            <Icon name="lock" size={22} color="var(--edu-green)"/>
            <div style={{ flex: 1, fontSize: 12.5, color: 'var(--text)', lineHeight: 1.45 }}>
              Bank-grade encryption. EduRand can <b>only read</b> transactions — never move money or see your password.
            </div>
          </div>
        </Card>
      </div>

      <div style={{ padding: '20px 20px 0' }}>
        <SectionLabel>Pick your bank</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
          {SA_BANKS.map(b => (
            <button key={b.id} onClick={() => pick(b)} style={{
              background: 'var(--surface)', border: 'var(--card-border)', borderRadius: 'var(--r-card)',
              boxShadow: 'var(--shadow-card)', padding: 16, display: 'flex', flexDirection: 'column', gap: 10,
              alignItems: 'flex-start', cursor: 'pointer', textAlign: 'left',
              fontFamily: 'var(--font-body)',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: b.bg, color: b.fg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 17, letterSpacing: '-0.02em',
              }}>{b.short}</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', letterSpacing: '-0.01em' }}>{b.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. WHATSAPP COACH PREVIEW (sheet-like full screen)
// ─────────────────────────────────────────────────────────────
function WhatsAppPreview({ onClose, persona, lang }) {
  const msgs = [
    { role: 'bot', text: 'Hey ' + persona.short + ' 👋 EduRand here. Quick check — how\'s the budget feeling this week?', at: '14:02' },
    { role: 'me',  text: 'Tight bru, spent way too much on Uber',                                                       at: '14:04' },
    { role: 'bot', text: 'Eish, I hear you. Hit me with /uber and I\'ll pull up cheaper routes for tomorrow.',          at: '14:04' },
    { role: 'me',  text: '/uber',                                                                                       at: '14:05' },
    { role: 'bot', text: 'For Mowbray → UCT Upper:\n🚌 Jammie Shuttle · Free · 28 min\n🚐 MyCiTi · R16 · 32 min\n🚗 Uber · R42 · 14 min\n\nThree Jammie trips this week = R96 back in your pocket. Want me to set a daily reminder?', at: '14:05' },
  ];
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 200,
      background: '#075E54', display: 'flex', flexDirection: 'column',
    }}>
      {/* WA header */}
      <div style={{ padding: '14px 12px 12px', background: '#075E54', color: '#fff', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', padding: 6 }}>
          <Icon name="arrowLeft" size={20}/>
        </button>
        <div style={{
          width: 38, height: 38, borderRadius: 19,
          background: 'linear-gradient(135deg, #0066FF, #00C853)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
        }}><Logo size={26} mono/></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.005em' }}>EduRand Coach</span>
            <span style={{ width: 14, height: 14, borderRadius: 7, background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"/></svg>
            </span>
          </div>
          <div style={{ fontSize: 11.5, opacity: 0.85 }}>+27 60 EDU RAND · online</div>
        </div>
        <Icon name="bell" size={18} color="#fff"/>
      </div>

      {/* WA messages */}
      <div style={{
        flex: 1, padding: '14px 12px', overflowY: 'auto',
        background: '#ECE5DD',
        backgroundImage: 'radial-gradient(circle at 50% 0, rgba(7,94,84,0.04), transparent 60%)',
        display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'me' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '80%',
              background: m.role === 'me' ? '#DCF8C6' : '#fff',
              padding: '7px 10px 5px', borderRadius: 8,
              boxShadow: '0 1px 0.5px rgba(0,0,0,0.13)',
              position: 'relative',
              fontSize: 13.5, color: '#0B141A', lineHeight: 1.4,
              whiteSpace: 'pre-wrap',
            }}>
              {m.text}
              <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.45)', textAlign: 'right', marginTop: 2 }}>
                {m.at} {m.role === 'me' && <span style={{ color: '#34B7F1' }}>✓✓</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* WA input */}
      <div style={{ padding: '8px 10px', background: '#ECE5DD', display: 'flex', gap: 6, alignItems: 'center' }}>
        <div style={{
          flex: 1, background: '#fff', borderRadius: 22, padding: '10px 14px',
          fontSize: 13, color: '#999',
        }}>Message</div>
        <div style={{ width: 44, height: 44, borderRadius: 22, background: '#075E54', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="send" size={18}/>
        </div>
      </div>

      <div style={{ background: '#075E54', padding: '12px 16px', textAlign: 'center', color: '#fff' }}>
        <Button onClick={onClose} variant="ghost" size="sm" style={{ background: 'rgba(255,255,255,0.18)', color: '#fff' }}>Back to EduRand</Button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 5. TODAY'S 3 WINS — horizontal carousel for Home
// ─────────────────────────────────────────────────────────────
function TodayWins({ onGo, state }) {
  const wins = state === 'crisis' ? [
    { icon: '🚐', tag: 'Transport', text: 'Take Jammie Shuttle, skip Uber',   gain: 35, to: 'transport' },
    { icon: '🍲', tag: 'Meals',     text: 'Cook pap + chakalaka tonight',     gain: 85, to: 'meals' },
    { icon: '🛡️', tag: 'Stay safe', text: 'Avoid quick-loan offers this week', gain: 0,  to: 'scam',     accent: '#EF4444', altGain: 'Skip loan trap' },
  ] : state === 'warning' ? [
    { icon: '🚐', tag: 'Transport', text: 'MyCiTi for 3 trips this week',     gain: 78,  to: 'transport' },
    { icon: '🍳', tag: 'Meals',     text: 'Egg fried rice — R17 a serving',   gain: 65,  to: 'meals' },
    { icon: '📶', tag: 'Data',      text: 'Switch to MTN Power Hour bundles', gain: 50,  to: 'budget',   altGain: 'R50 / week' },
  ] : [
    { icon: '🎯', tag: 'Challenge', text: 'Add R25 to R52-a-week today',      gain: 25,  to: 'challenges' },
    { icon: '📚', tag: 'Learn',     text: 'Finish "Build R500 emergency"',    gain: 0,   to: 'learn',    altGain: '+1 badge' },
    { icon: '🍳', tag: 'Meals',     text: 'Peanut-butter oats for breakfast', gain: 9,   to: 'meals' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', marginBottom: 10 }}>
        <SectionLabel>Today's 3 wins</SectionLabel>
        <span style={{ fontSize: 11.5, color: 'var(--edu-green)', fontWeight: 700 }}>
          ≈ R{wins.reduce((a, b) => a + b.gain, 0)} if you do all 3
        </span>
      </div>
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '0 20px 4px', scrollbarWidth: 'none' }}>
        {wins.map((w, i) => (
          <button key={i} onClick={() => onGo(w.to)} style={{
            flexShrink: 0, width: 200,
            background: 'var(--surface)', border: 'var(--card-border)', borderRadius: 'var(--r-card)',
            boxShadow: 'var(--shadow-card)', padding: 14, cursor: 'pointer', textAlign: 'left',
            display: 'flex', flexDirection: 'column', gap: 10,
            fontFamily: 'var(--font-body)',
            borderLeft: w.accent ? `4px solid ${w.accent}` : 'var(--card-border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10, background: 'var(--sunken)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
              }}>{w.icon}</div>
              <span style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{w.tag}</span>
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--text)', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.35 }}>{w.text}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 900, color: w.accent || 'var(--edu-green)', letterSpacing: '-0.02em' }}>
              {w.altGain || `+${R(w.gain)}`}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { SimulatorScreen, ScamShieldScreen, LinkBankScreen, WhatsAppPreview, TodayWins });
