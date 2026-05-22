// screens/features.jsx — Meals, Transport, Challenges, News
// (Bundled because each is light)

// ── MEALS ────────────────────────────────────────────────────
const { useState, useEffect, useMemo, useRef, useCallback } = React;
function MealsScreen({ t, onGo, showToast }) {
  const [openMeal, setOpenMeal] = useState(null);
  const [list, setList] = useState([]);

  return (
    <div style={{ paddingBottom: 110 }}>
      <PageHeader title="Meals" sub="Cheap, real food. Built around Sixty60." onBack={() => onGo('home')}/>

      {/* Header banner */}
      <div style={{ padding: '0 20px' }}>
        <Card padded={false} style={{ background: 'linear-gradient(135deg, #EC4899, #F97316)', color: '#fff', border: 'none', overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', right: -20, bottom: -20, fontSize: 120, opacity: 0.18 }}>🍜</div>
          <div style={{ padding: 18, position: 'relative' }}>
            <div style={{ fontSize: 12, opacity: 0.85, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Today's pick</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 26, letterSpacing: '-0.025em', marginTop: 6, maxWidth: 220 }}>Eat for under R30 a day this week.</div>
            <div style={{ fontSize: 12.5, opacity: 0.9, marginTop: 6 }}>4 meal swaps. R380 saved on average.</div>
          </div>
        </Card>
      </div>

      <div style={{ padding: '20px 20px 0' }}>
        <SectionLabel>Cheap meals · ranked by cost</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
          {MEALS.map(m => (
            <Card key={m.id} padded={false} onClick={() => setOpenMeal(m)}>
              <div style={{ padding: 14, display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, flexShrink: 0 }}>{m.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15.5, letterSpacing: '-0.02em' }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{m.store} · {m.servings} servings · {m.time}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--edu-green)', fontWeight: 700, marginTop: 4 }}>{m.why}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 19, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1 }}>{R(m.cost)}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 3 }}>per serving</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Shopping list */}
      <div style={{ padding: '20px 20px 0' }}>
        <SectionLabel>Your shopping list ({list.length})</SectionLabel>
        <Card padded={false} style={{ marginTop: 10 }}>
          {list.length === 0 ? (
            <div style={{ padding: 22, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              Tap a meal → "Add to Sixty60 list" to build a real shop.
            </div>
          ) : (
            <>
              {list.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '12px 16px', borderBottom: i === list.length - 1 ? 'none' : '1px solid var(--track-soft)' }}>
                  <Icon name="cart" size={16} color="var(--text-muted)"/>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{item.name}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13, letterSpacing: '-0.01em' }}>{R(item.price)}</span>
                </div>
              ))}
              <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>Total</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 17, color: 'var(--edu-blue)', letterSpacing: '-0.02em' }}>{R(list.reduce((a, b) => a + b.price, 0))}</span>
              </div>
            </>
          )}
        </Card>
      </div>

      <Sheet open={!!openMeal} onClose={() => setOpenMeal(null)} title={openMeal?.name}>
        {openMeal && (
          <>
            <div style={{ height: 130, borderRadius: 16, background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80, marginBottom: 14 }}>{openMeal.emoji}</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              <Pill color="var(--edu-green)">{R(openMeal.cost)} / serving</Pill>
              <Pill>{openMeal.servings} servings</Pill>
              <Pill><Icon name="clock" size={11}/> {openMeal.time}</Pill>
            </div>
            <p style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>{openMeal.why}</p>
            <div style={{ marginTop: 16 }}>
              <SectionLabel>Ingredients · {openMeal.store}</SectionLabel>
              <Card padded={false} style={{ marginTop: 10 }}>
                {openMeal.items.map((it, i, arr) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 14px', borderBottom: i === arr.length - 1 ? 'none' : '1px solid var(--track-soft)', fontSize: 13.5 }}>
                    <span style={{ fontWeight: 600 }}>{it.name}</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '-0.01em' }}>{R(it.price)}</span>
                  </div>
                ))}
              </Card>
            </div>
            <Button variant="primary" size="lg" full style={{ marginTop: 16 }} icon="cart"
              onClick={() => {
                setList(prev => [...prev, ...openMeal.items]);
                setOpenMeal(null);
                showToast(`${openMeal.items.length} items added to Sixty60 list`);
              }}>Add to Sixty60 list</Button>
          </>
        )}
      </Sheet>
    </div>
  );
}

// ── TRANSPORT ─────────────────────────────────────────────────
function TransportScreen({ t, onGo, persona, showToast }) {
  const [from, setFrom] = useState(persona.uniShort === 'UCT' ? 'Mowbray' : persona.uniShort === 'Wits' ? 'Braamfontein' : 'Tygerberg');
  const [to, setTo] = useState(persona.uniShort === 'UCT' ? 'UCT Upper Campus' : persona.uniShort === 'Wits' ? 'Wits East Campus' : 'Stellies Main');
  const [chosen, setChosen] = useState('t1');

  const chosenOpt = TRANSPORT.find(o => o.id === chosen);
  const saved = 48 - (chosenOpt?.cost || 0);  // vs Uber

  return (
    <div style={{ paddingBottom: 110 }}>
      <PageHeader title="Transport" sub="Beat the Uber tax" onBack={() => onGo('home')}/>

      {/* route input */}
      <div style={{ padding: '0 20px' }}>
        <Card padded={false}>
          <div style={{ padding: 16 }}>
            <RoutePoint dot="var(--edu-green)" label="From" id="route-from" value={from} onChange={setFrom}/>
            <div style={{ height: 18, marginLeft: 7, borderLeft: '2px dashed var(--track)' }}/>
            <RoutePoint dot="var(--edu-blue)" label="To" id="route-to" value={to} onChange={setTo}/>
          </div>
        </Card>
      </div>

      {/* options */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <SectionLabel>5 ways to get there</SectionLabel>
          <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Sorted by cost</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {TRANSPORT.map(opt => {
            const isPick = chosen === opt.id;
            return (
              <button key={opt.id} onClick={() => setChosen(opt.id)} style={{
                background: isPick ? 'rgba(0,102,255,0.06)' : 'var(--surface)',
                border: isPick ? '2px solid var(--edu-blue)' : '2px solid transparent',
                borderRadius: 'var(--r-card)', boxShadow: 'var(--shadow-card)',
                padding: 14, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
                width: '100%', textAlign: 'left', transition: 'all 0.15s',
                fontFamily: 'var(--font-body)',
              }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--sunken)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                  {opt.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.01em' }}>{opt.mode}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>{opt.note}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 17, letterSpacing: '-0.02em', color: opt.cost === 0 ? 'var(--edu-green)' : 'var(--text)', lineHeight: 1 }}>
                    {opt.cost === 0 ? 'Free' : R(opt.cost)}
                  </div>
                  <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 3 }}>{opt.time}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* savings callout */}
      <div style={{ padding: '20px 20px 0' }}>
        <Card padded={false} style={{ background: 'linear-gradient(135deg, #00C853, #00B8D4)', color: '#fff', border: 'none', overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', right: -10, top: -10, opacity: 0.18, fontSize: 100 }}>💰</div>
          <div style={{ padding: 18, position: 'relative' }}>
            <div style={{ fontSize: 11.5, opacity: 0.85, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>If you pick {chosenOpt?.mode}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 34, letterSpacing: '-0.03em', marginTop: 6, lineHeight: 1 }}>{saved > 0 ? `${R(saved)} saved` : 'Quickest pick'}</div>
            <div style={{ fontSize: 12.5, opacity: 0.9, marginTop: 6 }}>{saved > 0 ? 'vs Uber, this one trip. R' + (saved * 20) + ' over a month if you do this daily.' : 'You\'re paying for speed today.'}</div>
            <Button variant="ghost" size="sm" style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', marginTop: 10 }} iconRight="check"
              onClick={() => showToast(`${chosenOpt?.mode} logged for ${chosenOpt?.cost === 0 ? 'free' : R(chosenOpt.cost)}`)}>
              Log this trip
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function RoutePoint({ dot, label, value, onChange, id }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ width: 16, height: 16, borderRadius: 8, background: dot, flexShrink: 0, border: '3px solid var(--surface)', boxShadow: `0 0 0 2px ${dot}` }}/>
      <div style={{ flex: 1 }}>
        <label htmlFor={id} style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', display: 'block' }}>{label}</label>
        <input id={id} value={value} onChange={e => onChange(e.target.value)} style={{
          width: '100%', border: 'none', outline: 'none', background: 'transparent',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--text)',
          letterSpacing: '-0.02em', padding: 0,
        }}/>
      </div>
    </div>
  );
}

// ── CHALLENGES ───────────────────────────────────────────────
function ChallengesScreen({ t, onGo, showToast }) {
  const [chs, setChs] = useState(CHALLENGES);
  return (
    <div style={{ paddingBottom: 110 }}>
      <PageHeader title="Challenges" sub="Save without thinking" onBack={() => onGo('home')}/>

      {/* hero card */}
      <div style={{ padding: '0 20px' }}>
        <Card padded={false} style={{ background: 'linear-gradient(135deg, #7C3AED, #0066FF)', color: '#fff', border: 'none', overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', right: -10, bottom: -30, fontSize: 130, opacity: 0.18 }}>🏆</div>
          <div style={{ padding: 18, position: 'relative' }}>
            <div style={{ fontSize: 12, opacity: 0.85, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>This month</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 30, letterSpacing: '-0.03em', marginTop: 6, lineHeight: 1 }}>{R(chs.reduce((a, b) => a + b.saved, 0))}</div>
            <div style={{ fontSize: 12.5, opacity: 0.9, marginTop: 6 }}>saved across {chs.length} active challenges</div>
          </div>
        </Card>
      </div>

      <div style={{ padding: '20px 20px 0' }}>
        <SectionLabel>Active challenges</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
          {chs.map(c => (
            <Card key={c.id} padded={false}>
              <div style={{ padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em' }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{c.desc}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 17, color: c.color, letterSpacing: '-0.02em' }}>{R(c.saved)}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>of {R(c.target)}</div>
                  </div>
                </div>
                <ProgressBar value={c.saved} max={c.target} color={c.color} height={8}/>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Day {c.daysIn}/{c.days}</span>
                  <button onClick={() => {
                    setChs(prev => prev.map(x => x.id === c.id ? { ...x, saved: x.saved + 25 } : x));
                    showToast(`+R25 added to ${c.name}`);
                  }} style={{
                    background: 'none', border: 'none', color: c.color, fontSize: 12, fontWeight: 800,
                    cursor: 'pointer', letterSpacing: '-0.01em',
                  }}>+ R25 today</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px 20px 0' }}>
        <SectionLabel>Pick a new one</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
          {[
            { name: 'Skip 1 Mr D per week', t: 'Save ~R600/month' },
            { name: 'Coffee at home only',  t: 'Save ~R420/month' },
            { name: 'No-spend Sundays',     t: 'Save ~R280/month' },
          ].map(s => (
            <button key={s.name} onClick={() => showToast(`Challenge "${s.name}" started`)} style={{
              background: 'var(--surface)', border: 'var(--card-border)', borderRadius: 'var(--r-card)',
              boxShadow: 'var(--shadow-card)', padding: 14, display: 'flex', alignItems: 'center',
              gap: 12, cursor: 'pointer', width: '100%', textAlign: 'left',
              fontFamily: 'var(--font-body)',
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--sunken)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--edu-blue)' }}>
                <Icon name="plus" size={20}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: '-0.01em' }}>{s.name}</div>
                <div style={{ fontSize: 11.5, color: 'var(--edu-green)', fontWeight: 600, marginTop: 1 }}>{s.t}</div>
              </div>
              <Icon name="arrowRight" size={18} color="var(--text-muted)"/>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── NEWS ─────────────────────────────────────────────────────
function NewsScreen({ t, onGo }) {
  const [filter, setFilter] = useState('All');
  const cats = ['All', 'NSFAS', 'Banking', 'Saving', 'Side hustle', 'Crisis'];
  const list = filter === 'All' ? NEWS : NEWS.filter(n => n.cat === filter);

  return (
    <div style={{ paddingBottom: 110 }}>
      <PageHeader title="News" sub="What matters for your money this week" onBack={() => onGo('home')}/>

      <div style={{ padding: '0 20px 12px', display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {cats.map(c => (
          <FilterChip key={c} active={filter === c} onClick={() => setFilter(c)}>{c}</FilterChip>
        ))}
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {list.map(n => (
          <Card key={n.id} padded={false}>
            <div style={{ padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <span style={{ padding: '3px 8px', borderRadius: 999, background: 'var(--sunken)', color: 'var(--text)', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.02em' }}>{n.cat}</span>
                {n.hot && <span style={{ padding: '3px 8px', borderRadius: 999, background: '#EF444422', color: '#EF4444', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.02em' }}>🔥 Hot</span>}
                <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto' }}>{n.mins} min read</span>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, letterSpacing: '-0.02em', lineHeight: 1.25 }}>{n.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.45 }}>{n.summary}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { MealsScreen, TransportScreen, ChallengesScreen, NewsScreen });
