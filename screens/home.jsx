// screens/home.jsx — Dashboard
// Big budget card, status, quick actions, recent + smart suggestion.

const { useState, useEffect, useMemo, useRef, useCallback } = React;
function HomeScreen({ t, persona, spending, state, budget, onGo, txns, daysLeft, monthSpent, lang }) {
  const remaining = budget - monthSpent;
  const pct = budget > 0 ? Math.min(100, (monthSpent / budget) * 100) : 0;
  const perDay = daysLeft > 0 ? Math.max(0, remaining / daysLeft) : 0;
  const isCrisis = remaining < 0 || (perDay < 30 && state !== 'healthy');
  const ringColor = state === 'crisis' ? '#EF4444' : state === 'warning' ? '#FFB300' : 'var(--edu-green)';

  // Local greeting based on time of day (faked)
  const hr = new Date().getHours();
  const greet = hr < 12 ? t.greet : hr < 18 ? t.greet : t.greetEvening;

  return (
    <div style={{ paddingBottom: 110 }}>
      {/* Top bar: greet + bell */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 20px 14px' }}>
        <div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{greet}, 👋</div>
          <div style={{ fontSize: 22, fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '-0.025em', marginTop: 2 }}>{persona.short}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <IconChip icon="bell" onClick={() => onGo('news')} notify={isCrisis}/>
          <IconChip icon="user" onClick={() => onGo('profile')} avatar={persona.initials}/>
        </div>
      </div>

      {/* Hero budget card */}
      <div style={{ padding: '0 20px' }}>
        <Card padded={false} style={{
          background: 'var(--hero-bg)', color: 'var(--hero-fg)',
          border: 'none', overflow: 'hidden', position: 'relative',
        }}>
          {/* decorative blob */}
          <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'var(--hero-blob)', filter: 'blur(20px)', opacity: 0.6 }}/>
          <div style={{ position: 'relative', padding: '20px 22px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 12, opacity: 0.85, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{t.monthlyBudget}</div>
                <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>{persona.fundingLabel} · {persona.expectedDate}</div>
              </div>
              <StatusPill state={state}/>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
              <ProgressRing value={pct} size={92} stroke={9} color={ringColor}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 19, fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', lineHeight: 1 }}>{Math.round(pct)}%</div>
                  <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>used</div>
                </div>
              </ProgressRing>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, opacity: 0.7 }}>{t.remaining}</div>
                <div style={{ fontSize: 34, fontFamily: 'var(--font-display)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05 }}>
                  {remaining < 0 ? '−' : ''}{R(remaining)}
                </div>
                <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
                  {R(perDay)} <span style={{ opacity: 0.7 }}>{t.perDay}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button onClick={() => onGo('budget')} style={heroBtn}>
                <Icon name="chart" size={16}/> {t.tracker}
              </button>
              <button onClick={() => onGo('coach')} style={heroBtn}>
                <Icon name="bot" size={16}/> {t.coach}
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Crisis nudge if relevant */}
      {state !== 'healthy' && (
        <div style={{ padding: '14px 20px 0' }}>
          <Card padded={false} style={{
            background: state === 'crisis' ? 'rgba(239,68,68,0.08)' : 'rgba(255,179,0,0.1)',
            border: state === 'crisis' ? '1px solid rgba(239,68,68,0.25)' : '1px solid rgba(255,179,0,0.3)',
          }} onClick={() => onGo('challenges')}>
            <div style={{ padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: state === 'crisis' ? '#EF4444' : '#FFB300', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                <Icon name="alert" size={20}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: '-0.01em' }}>
                  {state === 'crisis' ? `${t.crisisAlert} day ${spending.daysIn + Math.floor(remaining / Math.max(perDay, 1))}` : 'Spending faster than safe pace'}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                  Tap to see 3 swaps that could save you {R(state === 'crisis' ? 480 : 220)} this week.
                </div>
              </div>
              <Icon name="arrowRight" size={18} color="var(--text-muted)"/>
            </div>
          </Card>
        </div>
      )}

      {/* Quick actions grid */}
      <div style={{ padding: '20px 20px 0' }}>
        <SectionLabel>{t.quickActions}</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
          <QuickAction icon="bot"      label={t.coach}     sub="Chat in EN/Zu/Af"   bg="#0066FF" onClick={() => onGo('coach')}/>
          <QuickAction icon="target"   label="Will I make it?" sub="Crisis simulator" bg="#7C3AED" onClick={() => onGo('simulator')}/>
          <QuickAction icon="pizza"    label={t.meals}     sub="From R9 / serving"  bg="#EC4899" onClick={() => onGo('meals')}/>
          <QuickAction icon="bus"      label={t.transport} sub="Beat the Uber tax"  bg="#FFB300" onClick={() => onGo('transport')}/>
          <QuickAction icon="trophy"   label={t.challenges}sub="3 active"           bg="#00C853" onClick={() => onGo('challenges')}/>
          <QuickAction icon="alert"    label="Scam Shield" sub="Paste any sus msg"  bg="#EF4444" onClick={() => onGo('scam')}/>
        </div>
      </div>

      {/* Today's 3 wins carousel */}
      <div style={{ paddingTop: 20 }}>
        <TodayWins onGo={onGo} state={state}/>
      </div>

      {/* Recent activity */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <SectionLabel>{t.recent}</SectionLabel>
          <button onClick={() => onGo('budget')} style={{ background: 'none', border: 'none', color: 'var(--edu-blue)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            {t.seeAll}
          </button>
        </div>
        <Card padded={false}>
          {txns.slice(0, 3).map((tx, i) => (
            <TxnRow key={tx.id} tx={tx} isLast={i === 2}/>
          ))}
        </Card>
      </div>

      {/* Streak strip */}
      <div style={{ padding: '20px 20px 0', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        <StreakStat icon="flame" value="7" label={t.streak} color="#FF6B35"/>
        <StreakStat icon="coin" value={R(340)} label={t.saved} color="#00C853"/>
        <StreakStat icon="grad" value="3/6" label={t.lessons} color="#FFB300"/>
      </div>
    </div>
  );
}

// ── sub-components ──────────────────────────────────────────────
const heroBtn = {
  flex: 1, height: 42, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
  background: 'var(--hero-btn-bg)', color: 'var(--hero-btn-fg)',
  border: 'none', borderRadius: 'var(--r-btn-sm)',
  fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13, letterSpacing: '-0.01em',
  cursor: 'pointer', backdropFilter: 'blur(10px)',
};

function IconChip({ icon, onClick, notify, avatar }) {
  return (
    <button onClick={onClick} style={{
      width: 40, height: 40, borderRadius: 999,
      background: 'var(--sunken)', border: 'var(--card-border)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', color: 'var(--text)', position: 'relative',
      fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 13, letterSpacing: '-0.02em',
    }}>
      {avatar ? avatar : <Icon name={icon} size={18}/>}
      {notify && <span style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, background: '#EF4444', border: '2px solid var(--bg)' }}/>}
    </button>
  );
}

function QuickAction({ icon, label, sub, bg, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: 'var(--surface)', border: 'var(--card-border)',
      borderRadius: 'var(--r-card)', padding: '14px',
      display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start',
      cursor: 'pointer', boxShadow: 'var(--shadow-card)', textAlign: 'left',
      transition: 'transform 0.15s',
      minHeight: 110,
    }}
    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
    onMouseUp={e => e.currentTarget.style.transform = ''}
    onMouseLeave={e => e.currentTarget.style.transform = ''}
    >
      <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
        <Icon name={icon} size={19}/>
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em' }}>{label}</div>
        <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>
      </div>
    </button>
  );
}

function TxnRow({ tx, isLast }) {
  const cat = CATEGORIES.find(c => c.id === tx.cat);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
      borderBottom: isLast ? 'none' : '1px solid var(--track-soft)',
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        background: cat.color + '20', color: cat.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
        flexShrink: 0,
      }}>{cat.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.merchant}</div>
        <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 1 }}>{tx.at}{tx.note ? ` · ${tx.note}` : ''}</div>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, color: tx.amount < 0 ? 'var(--text)' : 'var(--edu-green)', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
        {tx.amount < 0 ? '−' : '+'}{R(tx.amount)}
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{children}</div>;
}

function StreakStat({ icon, value, label, color }) {
  return (
    <Card padded={false}>
      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: color + '22', color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={icon} size={15}/>
        </div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
          <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 3 }}>{label}</div>
        </div>
      </div>
    </Card>
  );
}

Object.assign(window, { HomeScreen, TxnRow, SectionLabel });
