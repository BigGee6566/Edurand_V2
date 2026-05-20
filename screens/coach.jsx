// screens/coach.jsx — AI Financial Coach
// Hero feature: real Claude responses, multi-lang, in-chat rich cards (budget,
// meal suggestion, transport, will-i-make-it).

const { useState, useEffect, useMemo, useRef, useCallback } = React;
function CoachScreen({ t, persona, lang, state, monthSpent, budget, daysLeft, txns, onGo }) {
  const [msgs, setMsgs] = useState([
    { id: 'm1', role: 'bot', kind: 'text', text: greetingFor(t, persona, lang, state), at: nowHM() },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);
  const [showQuick, setShowQuick] = useState(true);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, typing]);

  const send = async (text) => {
    if (!text.trim()) return;
    const userMsg = { id: 'u' + Date.now(), role: 'user', kind: 'text', text, at: nowHM() };
    setMsgs(prev => [...prev, userMsg]);
    setInput('');
    setShowQuick(false);
    setTyping(true);

    // Intent detection (cheap heuristic) → maybe attach a rich card
    const intent = detectIntent(text);
    const sysPrompt = buildSystemPrompt(persona, lang, state, monthSpent, budget, daysLeft);

    let reply = '';
    try {
      reply = await window.claude.complete({
        messages: [
          { role: 'user', content: `${sysPrompt}\n\nStudent says: "${text}"\n\nReply in ${langName(lang)}. Keep it warm, brief (2-4 sentences), and use ZAR (R amounts). If you're suggesting a number, anchor it to their actual situation.` },
        ],
      });
    } catch (e) {
      reply = fallbackReply(text, lang, persona);
    }

    setTyping(false);

    const botMsg = { id: 'b' + Date.now(), role: 'bot', kind: 'text', text: reply.trim(), at: nowHM() };
    setMsgs(prev => [...prev, botMsg]);

    // After main reply, attach a rich card if intent matched
    if (intent) {
      setTimeout(() => {
        setMsgs(prev => [...prev, { id: 'c' + Date.now(), role: 'bot', kind: intent, at: nowHM(),
          ctx: { persona, monthSpent, budget, daysLeft, txns } }]);
      }, 450);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      {/* header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '8px 16px 12px',
        borderBottom: '1px solid var(--track-soft)', background: 'var(--surface)',
      }}>
        <button onClick={() => onGo('home')} style={{
          background: 'var(--sunken)', border: 'none', borderRadius: 999, width: 36, height: 36,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text)',
        }}><Icon name="arrowLeft" size={18}/></button>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, var(--edu-blue), #7C3AED)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
          }}><Icon name="bot" size={22}/></div>
          <span style={{ position: 'absolute', bottom: -2, right: -2, width: 12, height: 12, borderRadius: 6, background: 'var(--edu-green)', border: '2px solid var(--surface)' }}/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 15, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>EduRand Coach</div>
          <div style={{ fontSize: 11.5, color: 'var(--edu-green)', fontWeight: 600 }}>● Online · {langName(lang)}</div>
        </div>
      </div>

      {/* messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {msgs.map(m => <Message key={m.id} msg={m} onGo={onGo} t={t}/>)}
        {typing && <TypingBubble t={t}/>}
      </div>

      {/* quick replies */}
      {showQuick && (
        <div style={{ padding: '0 16px 10px', display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {t.quickReplies.map((q, i) => (
            <button key={i} onClick={() => send(q)} style={{
              padding: '8px 14px', borderRadius: 999, whiteSpace: 'nowrap',
              background: 'var(--surface)', border: '1px solid var(--edu-blue)', color: 'var(--edu-blue)',
              fontSize: 12.5, fontWeight: 600, cursor: 'pointer', flexShrink: 0,
              fontFamily: 'var(--font-body)', letterSpacing: '-0.01em',
            }}>{q}</button>
          ))}
        </div>
      )}

      {/* input */}
      <div style={{ padding: '8px 12px 12px', borderTop: '1px solid var(--track-soft)', background: 'var(--surface)' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'var(--sunken)', borderRadius: 24, padding: '4px 4px 4px 16px' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send(input)}
            placeholder={t.askMe}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none',
              fontSize: 14, fontFamily: 'var(--font-body)', color: 'var(--text)', height: 40 }}
          />
          <button onClick={() => send(input)} disabled={!input.trim()} style={{
            width: 36, height: 36, borderRadius: 18,
            background: input.trim() ? 'var(--edu-blue)' : 'var(--track)',
            color: '#fff', border: 'none', cursor: input.trim() ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s',
          }}>
            <Icon name="send" size={16}/>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Message bubble ──────────────────────────────────────────────
function Message({ msg, onGo, t }) {
  const isUser = msg.role === 'user';
  if (msg.kind !== 'text') {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-start', maxWidth: '88%' }}>
        <RichCard kind={msg.kind} ctx={msg.ctx} onGo={onGo}/>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 6 }}>
      {!isUser && (
        <div style={{ width: 26, height: 26, borderRadius: 8, background: 'linear-gradient(135deg, var(--edu-blue), #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
          <Icon name="bot" size={14}/>
        </div>
      )}
      <div style={{
        maxWidth: '78%',
        background: isUser ? 'var(--edu-blue)' : 'var(--surface)',
        color: isUser ? '#fff' : 'var(--text)',
        padding: '10px 14px', borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        fontSize: 14, lineHeight: 1.45, letterSpacing: '-0.005em',
        border: isUser ? 'none' : 'var(--card-border)',
        boxShadow: isUser ? 'none' : 'var(--shadow-card)',
        whiteSpace: 'pre-wrap', wordBreak: 'break-word',
      }}>
        {msg.text}
        <div style={{ fontSize: 10, opacity: 0.5, marginTop: 4, textAlign: isUser ? 'right' : 'left' }}>{msg.at}</div>
      </div>
    </div>
  );
}

function TypingBubble({ t }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
      <div style={{ width: 26, height: 26, borderRadius: 8, background: 'linear-gradient(135deg, var(--edu-blue), #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
        <Icon name="bot" size={14}/>
      </div>
      <div style={{
        padding: '14px 16px', borderRadius: '18px 18px 18px 4px',
        background: 'var(--surface)', border: 'var(--card-border)', boxShadow: 'var(--shadow-card)',
        display: 'flex', gap: 4, alignItems: 'center',
      }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{
            width: 7, height: 7, borderRadius: 4, background: 'var(--text-muted)',
            animation: `dotBlink 1.2s ${i * 0.15}s infinite ease-in-out`,
          }}/>
        ))}
      </div>
    </div>
  );
}

// ── Rich in-chat cards ──────────────────────────────────────────
function RichCard({ kind, ctx, onGo }) {
  if (kind === 'budget-breakdown') {
    const fifty = Math.round(ctx.budget * 0.5);
    const thirty = Math.round(ctx.budget * 0.3);
    const twenty = Math.round(ctx.budget * 0.2);
    return (
      <Card padded={false} style={{ background: 'var(--surface)', maxWidth: 320 }}>
        <div style={{ padding: 14 }}>
          <div style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Plan for {R(ctx.budget)}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
            <BdRow color="#00C853" pct={50} label="Needs (food, transport, rent)" value={R(fifty)}/>
            <BdRow color="#FFB300" pct={30} label="Wants (fun, takeaways)"        value={R(thirty)}/>
            <BdRow color="#0066FF" pct={20} label="Save / emergency"              value={R(twenty)}/>
          </div>
          <Button onClick={() => onGo('budget')} variant="secondary" size="sm" full style={{ marginTop: 12 }} iconRight="arrowRight">Open tracker</Button>
        </div>
      </Card>
    );
  }
  if (kind === 'meal-swap') {
    const meal = MEALS[0];
    return (
      <Card padded={false} style={{ background: 'var(--surface)', maxWidth: 320 }}>
        <div style={{ padding: 14 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 50, height: 50, borderRadius: 12, background: '#EC489922', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{meal.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, letterSpacing: '-0.02em' }}>{meal.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{R(meal.cost)}/serving · {meal.servings} servings · {meal.time}</div>
            </div>
          </div>
          <div style={{ padding: '10px 12px', borderRadius: 10, background: 'var(--sunken)', fontSize: 12.5, color: 'var(--text)', marginTop: 10, lineHeight: 1.45 }}>
            <strong style={{ color: 'var(--edu-green)' }}>Save ~R85</strong> vs your usual Mr D. Add to Sixty60 list?
          </div>
          <Button onClick={() => onGo('meals')} variant="primary" size="sm" full style={{ marginTop: 10 }} iconRight="arrowRight">See more cheap meals</Button>
        </div>
      </Card>
    );
  }
  if (kind === 'crisis-check') {
    const remaining = ctx.budget - ctx.monthSpent;
    const safe = remaining / Math.max(ctx.daysLeft, 1);
    const willMake = safe > 40;
    return (
      <Card padded={false} style={{ background: 'var(--surface)', maxWidth: 320 }}>
        <div style={{ padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: willMake ? '#00C85322' : '#EF444422', color: willMake ? '#00C853' : '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={willMake ? 'check' : 'alert'} size={18}/>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em' }}>{willMake ? "You're on pace" : 'Tight pace ahead'}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Mini label="Left" value={R(remaining)} color={willMake ? 'var(--edu-green)' : '#EF4444'}/>
            <Mini label="Days left" value={ctx.daysLeft}/>
            <Mini label="Safe spend / day" value={R(40)}/>
            <Mini label="Actual / day" value={R(Math.round(safe))} color={safe > 40 ? '#EF4444' : 'var(--edu-green)'}/>
          </div>
          {!willMake && (
            <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 10, lineHeight: 1.45 }}>
              Drop one Mr D + bus 3 trips → back on track by Friday.
            </div>
          )}
        </div>
      </Card>
    );
  }
  if (kind === 'transport-swap') {
    return (
      <Card padded={false} style={{ background: 'var(--surface)', maxWidth: 320 }}>
        <div style={{ padding: 14 }}>
          <div style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Swap Uber for...</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
            {TRANSPORT.slice(0, 3).map(opt => (
              <div key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10, background: 'var(--sunken)' }}>
                <span style={{ fontSize: 20 }}>{opt.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '-0.01em' }}>{opt.mode}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{opt.time}</div>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, color: opt.cost === 0 ? 'var(--edu-green)' : 'var(--text)', letterSpacing: '-0.01em' }}>{opt.cost === 0 ? 'Free' : R(opt.cost)}</div>
              </div>
            ))}
          </div>
          <Button onClick={() => onGo('transport')} variant="secondary" size="sm" full style={{ marginTop: 10 }} iconRight="arrowRight">Compare all routes</Button>
        </div>
      </Card>
    );
  }
  return null;
}

function BdRow({ color, pct, label, value }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
        <span style={{ color: 'var(--text)', fontWeight: 600 }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.01em' }}>{value}</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: 'var(--track)' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3 }}/>
      </div>
    </div>
  );
}

function Mini({ label, value, color }) {
  return (
    <div style={{ padding: '8px 10px', borderRadius: 8, background: 'var(--sunken)' }}>
      <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: color || 'var(--text)', letterSpacing: '-0.02em', marginTop: 2 }}>{value}</div>
    </div>
  );
}

// ── helpers ─────────────────────────────────────────────────────
function langName(l) { return { en: 'English', zu: 'isiZulu', af: 'Afrikaans' }[l] || 'English'; }
function nowHM() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

function greetingFor(t, persona, lang, state) {
  const en = {
    healthy: `Heita ${persona.short}! 👋 I'm your EduRand coach. You're cruising this month — R${1500} budget, on pace. Ask me anything: budget, NSFAS tips, cheap meals, side hustles.`,
    warning: `Hey ${persona.short} — quick check, your spending picked up the last few days. Want me to find a couple of swaps that put you back on safe pace?`,
    crisis:  `Hey ${persona.short}, I gotta be real — at this rate you'll be short before allowance day. Let's fix it. Want me to draft a 6-day plan?`,
  };
  const zu = {
    healthy: `Heita ${persona.short}! 👋 Ngingumeluleki wakho we-EduRand. Inyanga ihamba kahle. Ngibuze noma yini.`,
    warning: `Sawubona ${persona.short} — qaphela, izinsuku ezimbalwa zokugcina uchithe kakhulu. Ngifune izinto ezimbili ongazinika?`,
    crisis:  `Sawubona ${persona.short}, ngeqiniso — uma uqhubeka kanjena uzophelelwa imali. Asilungise. Ufuna iplani lezinsuku eziyisithupha?`,
  };
  const af = {
    healthy: `Hallo ${persona.short}! 👋 Ek's jou EduRand-afrigter. Hierdie maand lyk goed. Vra my enigiets.`,
    warning: `Hey ${persona.short} — vinnige check, jou besteding het opgegaan. Wil jy hê ek moet 'n paar swaps voorstel?`,
    crisis:  `Hey ${persona.short}, ek's eerlik — teen hierdie pas hardloop jy uit voor toelaagdatum. Kom ons sort dit met 'n 6-dae plan?`,
  };
  return { en, zu, af }[lang][state];
}

function detectIntent(text) {
  const s = text.toLowerCase();
  if (/(budget|nsfas|allowance|plan|begroting|isabelo)/.test(s)) return 'budget-breakdown';
  if (/(meal|food|cook|cheap|kos|ukudla|hungry)/.test(s))         return 'meal-swap';
  if (/(crisis|broke|make it|month.?end|out of|maand|phelile|kupheli)/.test(s)) return 'crisis-check';
  if (/(uber|taxi|transport|bus|myciti|vervoer|izokuthutha)/.test(s)) return 'transport-swap';
  if (/(save|saving|spaar|londoloza)/.test(s)) return 'budget-breakdown';
  return null;
}

function buildSystemPrompt(p, lang, state, spent, budget, days) {
  return `You are EduRand Coach — a warm, witty financial coach for South African students. You speak like a chilled friend who knows varsity life (use light SA slang like "heita", "varsity", "bru" sparingly — never forced). Reference South African brands when relevant: Checkers Sixty60, Shoprite, Pick n Pay, NSFAS, MyCiTi, Uber, Bolt, Mr D, Capitec, Tymebank.

Student profile: ${p.name}, ${p.course}, ${p.university}, funded by ${p.funding}.
This month: budget R${budget}, spent R${spent}, R${budget - spent} left, ${days} days to go. State: ${state}.

NEVER lecture. NEVER use generic "set a budget" advice. Always anchor to their actual numbers and SA context. Keep replies to 2-4 sentences max. Use emoji sparingly (max 1). Use the rand symbol R.`;
}

function fallbackReply(text, lang, p) {
  const en = `Got you. Based on your numbers, the move is probably: cut one takeaway this week and walk to campus twice. That alone usually frees up R120-R180. Want a 6-day plan?`;
  const zu = `Ngikuzwile. Ngokombono wakho: yeka i-takeaway eyodwa kuleli sonto bese uhamba ngezinyawo ukuya enyuvesi kabili. Lokho kuvula u-R120-R180.`;
  const af = `Reg. Volgens jou syfers: skip een takeaway dié week en stap twee keer kampus toe. Dit alleen maak gewoonlik R120-R180 oop.`;
  return { en, zu, af }[lang] || en;
}

Object.assign(window, { CoachScreen });
