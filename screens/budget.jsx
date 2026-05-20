// screens/budget.jsx — Budget tracker
// Donut breakdown + monthly trend + transactions list + Add Expense sheet.

const { useState, useEffect, useMemo, useRef, useCallback } = React;
function BudgetScreen({ t, persona, budget, monthSpent, txns, setTxns, lang, showToast, state, onOpenAdd }) {
  const [filter, setFilter] = useState('all');

  // Sum per category
  const byCat = useMemo(() => {
    const out = {};
    CATEGORIES.forEach(c => out[c.id] = 0);
    txns.forEach(tx => { if (tx.amount < 0) out[tx.cat] = (out[tx.cat] || 0) + Math.abs(tx.amount); });
    return out;
  }, [txns]);
  const totalSpent = Object.values(byCat).reduce((a, b) => a + b, 0);

  const filteredTxns = filter === 'all' ? txns : txns.filter(tx => tx.cat === filter);

  // Trend across last 4 months
  const trend = [
    { m: 'Mar', spent: 1320, budget },
    { m: 'Apr', spent: 1480, budget },
    { m: 'May', spent: 1390, budget },
    { m: 'Jun', spent: monthSpent, budget, current: true },
  ];

  return (
    <div style={{ paddingBottom: 30 }}>
      <PageHeader title={t.budget} sub={persona.fundingLabel + ' · June 2026'} trailing={
        <button onClick={onOpenAdd} style={{
          background: 'var(--edu-blue)', color: '#fff', border: 'none',
          padding: '8px 14px', borderRadius: 999, fontWeight: 700, fontSize: 13,
          fontFamily: 'var(--font-body)', cursor: 'pointer', display: 'inline-flex', gap: 6, alignItems: 'center',
          boxShadow: '0 4px 12px rgba(0,102,255,0.3)',
        }}>
          <Icon name="plus" size={15} stroke={2.5}/> Add
        </button>
      }/>

      {/* Summary tiles */}
      <div style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <SummaryTile label="Allowance" value={R(budget)} delta={persona.expectedDate} icon="arrowDown" color="#00C853"/>
        <SummaryTile label="Spent" value={R(monthSpent)} delta={`${Math.round(monthSpent/budget*100)}% of budget`} icon="arrowUp" color="#EF4444"/>
      </div>

      {/* Donut + category breakdown */}
      <div style={{ padding: '14px 20px 0' }}>
        <Card padded={false}>
          <div style={{ padding: '16px 16px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, letterSpacing: '-0.02em' }}>{t.topCategories}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{totalSpent > 0 ? `${R(totalSpent)} across ${Object.values(byCat).filter(v => v > 0).length} categories` : 'No spends yet'}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '8px 18px 16px' }}>
            <DonutChart byCat={byCat} total={totalSpent}/>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {CATEGORIES.filter(c => byCat[c.id] > 0).sort((a, b) => byCat[b.id] - byCat[a.id]).slice(0, 4).map(c => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 4, background: c.color }}/>
                  <span style={{ flex: 1, fontSize: 12.5, fontWeight: 600, color: 'var(--text)' }}>{c.label}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' }}>{R(byCat[c.id])}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Trend */}
      <div style={{ padding: '14px 20px 0' }}>
        <Card padded={false}>
          <div style={{ padding: '16px 16px 10px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, letterSpacing: '-0.02em' }}>4-month trend</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Blue bar = spent, green outline = budget</div>
          </div>
          <div style={{ padding: '4px 16px 16px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: 10, height: 140 }}>
            {trend.map(m => {
              const ratio = m.spent / Math.max(m.budget, 1);
              const h = Math.min(110, ratio * 100);
              const over = m.spent > m.budget;
              return (
                <div key={m.m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{R(m.spent)}</div>
                  <div style={{ width: '100%', maxWidth: 36, height: 110, display: 'flex', alignItems: 'flex-end', position: 'relative' }}>
                    {/* budget outline */}
                    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '100%', border: '1.5px dashed var(--edu-green)', borderRadius: 6, opacity: 0.5 }}/>
                    {/* spent bar */}
                    <div style={{
                      width: '100%', height: `${h}%`,
                      background: over ? '#EF4444' : m.current ? 'var(--edu-blue)' : 'rgba(0,102,255,0.5)',
                      borderRadius: '6px 6px 2px 2px',
                      transition: 'height 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                    }}/>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: m.current ? 800 : 500, color: m.current ? 'var(--text)' : 'var(--text-muted)' }}>{m.m}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Filter chips + transactions */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <SectionLabel>All spends</SectionLabel>
          <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{filteredTxns.length} {filteredTxns.length === 1 ? 'item' : 'items'}</span>
        </div>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 10, paddingBottom: 4, scrollbarWidth: 'none' }}>
          <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>All</FilterChip>
          {CATEGORIES.map(c => (
            <FilterChip key={c.id} active={filter === c.id} onClick={() => setFilter(c.id)} dot={c.color}>{c.label}</FilterChip>
          ))}
        </div>
        <Card padded={false}>
          {filteredTxns.length === 0 ? (
            <div style={{ padding: 28, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No spends in this category yet.</div>
          ) : filteredTxns.slice(0, 12).map((tx, i, arr) => (
            <TxnRow key={tx.id} tx={tx} isLast={i === arr.slice(0, 12).length - 1}/>
          ))}
        </Card>
      </div>

      {/* FAB and AddSheet are rendered at the Prototype root */}
    </div>
  );
}

function SummaryTile({ label, value, delta, icon, color }) {
  return (
    <Card padded={false}>
      <div style={{ padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{ width: 24, height: 24, borderRadius: 7, background: color + '22', color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={icon} size={14}/>
          </div>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</div>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 24, letterSpacing: '-0.03em', color: 'var(--text)', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 4 }}>{delta}</div>
      </div>
    </Card>
  );
}

function FilterChip({ active, onClick, dot, children }) {
  return (
    <button onClick={onClick} style={{
      padding: '7px 12px', borderRadius: 999, whiteSpace: 'nowrap',
      background: active ? 'var(--text)' : 'var(--sunken)',
      color: active ? 'var(--bg)' : 'var(--text)',
      border: 'none', cursor: 'pointer',
      fontSize: 12, fontWeight: 600, letterSpacing: '-0.01em',
      display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0,
    }}>
      {dot && <span style={{ width: 7, height: 7, borderRadius: 4, background: dot }}/>}
      {children}
    </button>
  );
}

// ── Donut chart ─────────────────────────────────────────────────
function DonutChart({ byCat, total }) {
  const r = 42, stroke = 16, c = 2 * Math.PI * r, cx = 60, cy = 60;
  let off = 0;
  const cats = CATEGORIES.filter(c => byCat[c.id] > 0);
  return (
    <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
      <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--track)" strokeWidth={stroke}/>
        {cats.map((cat, i) => {
          const portion = total > 0 ? byCat[cat.id] / total : 0;
          const dash = portion * c;
          const seg = <circle key={cat.id} cx={cx} cy={cy} r={r} fill="none" stroke={cat.color} strokeWidth={stroke}
            strokeDasharray={`${dash} ${c - dash}`} strokeDashoffset={-off}/>;
          off += dash;
          return seg;
        })}
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>spent</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text)', lineHeight: 1, marginTop: 2 }}>{R(total)}</div>
      </div>
    </div>
  );
}

// ── Add expense / income sheet ──────────────────────────────────
function AddSheet({ open, onClose, mode, setMode, onSave }) {
  const [amount, setAmount] = useState('');
  const [cat, setCat] = useState('food');
  const [merchant, setMerchant] = useState('');

  useEffect(() => { if (open) { setAmount(''); setMerchant(''); } }, [open]);

  const submit = () => {
    const n = parseFloat(amount);
    if (!n || n <= 0) return;
    onSave({
      cat: mode === 'income' ? 'food' : cat,
      merchant: merchant || (mode === 'income' ? 'Income' : 'Cash spend'),
      amount: mode === 'income' ? n : -n,
      at: 'Just now',
      note: '',
    });
  };

  return (
    <Sheet open={open} onClose={onClose} title={mode === 'expense' ? 'Add spend' : 'Add money in'}>
      {/* tab toggle */}
      <div style={{ display: 'flex', gap: 6, background: 'var(--sunken)', padding: 4, borderRadius: 12, marginBottom: 18 }}>
        {['expense', 'income'].map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            flex: 1, height: 36, borderRadius: 9, border: 'none',
            background: mode === m ? 'var(--surface)' : 'transparent',
            color: 'var(--text)', cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13,
            boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
          }}>{m === 'expense' ? 'Spend' : 'Income'}</button>
        ))}
      </div>

      {/* amount */}
      <div style={{ textAlign: 'center', padding: '14px 0 18px' }}>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Amount (R)</div>
        <input
          type="number" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)}
          placeholder="0"
          style={{
            width: '100%', textAlign: 'center', border: 'none', outline: 'none',
            background: 'transparent', color: mode === 'expense' ? '#EF4444' : 'var(--edu-green)',
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 56, letterSpacing: '-0.04em',
            marginTop: 6,
          }}
          autoFocus
        />
      </div>

      {mode === 'expense' && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>Category</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {CATEGORIES.map(c => (
              <button key={c.id} onClick={() => setCat(c.id)} style={{
                padding: '12px 6px', borderRadius: 12, cursor: 'pointer',
                background: cat === c.id ? c.color + '22' : 'var(--sunken)',
                border: cat === c.id ? `2px solid ${c.color}` : '2px solid transparent',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                color: 'var(--text)', fontWeight: 600, fontSize: 11.5,
                fontFamily: 'var(--font-body)',
              }}>
                <span style={{ fontSize: 22 }}>{c.icon}</span>
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>Where</div>
        <input value={merchant} onChange={e => setMerchant(e.target.value)} placeholder={mode === 'expense' ? 'Checkers, Uber, …' : 'NSFAS, family, gig'} style={{
          width: '100%', height: 50, padding: '0 16px',
          background: 'var(--input-bg)', border: 'var(--input-border)',
          borderRadius: 'var(--r-input)', fontSize: 15, fontFamily: 'var(--font-body)',
          fontWeight: 500, color: 'var(--text)', outline: 'none', boxSizing: 'border-box',
        }}/>
      </div>

      {/* Sticky submit so it's always reachable */}
      <div style={{
        position: 'sticky', bottom: 0,
        marginLeft: -20, marginRight: -20, marginBottom: -28,
        marginTop: 20,
        padding: '14px 20px calc(20px + var(--bottom-safe))',
        background: 'var(--surface)',
        borderTop: '1px solid var(--track-soft)',
        zIndex: 2,
      }}>
        <Button onClick={submit} variant="primary" size="lg" full disabled={!amount} iconRight="check">
          {mode === 'expense' ? `Log ${amount ? 'R' + amount : 'spend'}` : `Add ${amount ? 'R' + amount : 'income'}`}
        </Button>
      </div>
    </Sheet>
  );
}

Object.assign(window, { BudgetScreen, AddSheet, DonutChart });
