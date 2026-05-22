import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { PERSONAS, SPENDING_STATES } from './data';
import I18N from './i18n';
import { makeTheme, PALETTES } from './theme';
import { supabase } from './lib/supabase';
import { loadProfile, upsertProfile, loadTransactions, insertTransaction, deleteTransaction } from './lib/api';

const FUNDING_META = {
  nsfas:   { label: 'NSFAS',        fundingLabel: 'NSFAS Allowance' },
  bursary: { label: 'Bursary',      fundingLabel: 'Monthly Stipend' },
  self:    { label: 'Self / Family', fundingLabel: 'Side hustle + family' },
};

function buildPersona(profile) {
  const fund = FUNDING_META[profile.funding_type] ?? FUNDING_META.nsfas;
  return {
    id: profile.funding_type,
    name: profile.name || 'Student',
    short: profile.short_name || profile.name?.split(' ')[0] || 'Student',
    initials: profile.initials || '??',
    university: profile.university || 'UCT',
    uniShort: profile.university || 'UCT',
    funding: fund.label,
    fundingLabel: fund.fundingLabel,
    monthlyIncome: profile.monthly_budget || 1500,
    expectedDate: 'paid 25th',
  };
}

function calcDaysLeft() {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return Math.max(0, lastDay - now.getDate());
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [profile, setProfile] = useState(null);

  const [lang, setLangState] = useState('en');
  const [dark, setDarkState] = useState(false);
  const [palette, setPalette] = useState(PALETTES[0]);
  const [txns, setTxns] = useState(SPENDING_STATES.warning.txns);

  // ── Data loader (declared before the effect that calls it) ──────────────────
  const loadUserData = useCallback(async (userId) => {
    try {
      const [prof, txnList] = await Promise.all([loadProfile(userId), loadTransactions(userId)]);
      if (prof) {
        setProfile(prof);
        setLangState(prof.language || 'en');
        setDarkState(prof.dark_mode || false);
      }
      setTxns(txnList);
    } catch (e) {
      console.warn('loadUserData error:', e);
    }
  }, []);

  // ── Auth listener ────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoadingAuth(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Load user data on login ───────────────────────────────────────────────────
  useEffect(() => {
    if (user) {
      loadUserData(user.id);
    } else {
      setProfile(null);
      setTxns(SPENDING_STATES.warning.txns);
    }
  }, [user?.id, loadUserData]);

  // ── Actions ───────────────────────────────────────────────────────────────────
  const setLang = useCallback(async (newLang) => {
    setLangState(newLang);
    if (user) {
      try { await upsertProfile(user.id, { language: newLang }); } catch {}
    }
  }, [user?.id]);

  const setDark = useCallback(async (newDark) => {
    setDarkState(newDark);
    if (user) {
      try { await upsertProfile(user.id, { dark_mode: newDark }); } catch {}
    }
  }, [user?.id]);

  const addTxn = useCallback(async (txnData) => {
    if (user) {
      try {
        const saved = await insertTransaction(user.id, txnData);
        setTxns(prev => [saved, ...prev]);
      } catch (e) {
        console.warn('addTxn error:', e);
        setTxns(prev => [{ ...txnData, id: String(Date.now()) }, ...prev]);
      }
    } else {
      setTxns(prev => [{ ...txnData, id: Date.now() }, ...prev]);
    }
  }, [user?.id]);

  const removeTxn = useCallback(async (txnId) => {
    setTxns(prev => prev.filter(t => t.id !== txnId));
    if (user) {
      try { await deleteTransaction(txnId); } catch {}
    }
  }, [user?.id]);

  const updateProfile = useCallback(async (updates) => {
    setProfile(prev => prev ? { ...prev, ...updates } : updates);
    if (user) {
      try { await upsertProfile(user.id, updates); } catch {}
    }
  }, [user?.id]);

  // ── Derived values ────────────────────────────────────────────────────────────
  const persona = profile ? buildPersona(profile) : PERSONAS.nsfas;
  const budget = profile?.monthly_budget ?? 1500;
  const daysLeft = calcDaysLeft();

  const monthSpent = useMemo(
    () => txns.reduce((a, tx) => a + (tx.amount < 0 ? Math.abs(tx.amount) : 0), 0),
    [txns]
  );

  const stateMap = useMemo(() => {
    const pct = budget > 0 ? monthSpent / budget : 0;
    if (pct < 0.6) return { label: 'On track', daysLeft };
    if (pct < 0.85) return { label: 'Watch out', daysLeft };
    return { label: 'Critical', daysLeft };
  }, [monthSpent, budget, daysLeft]);

  const budgetState = stateMap.label.toLowerCase().replace(/\s+/g, '');

  const t = I18N[lang] || I18N.en;
  const theme = useMemo(() => makeTheme({ palette, dark }), [palette, dark]);

  return (
    <AppContext.Provider value={{
      user, loadingAuth,
      persona, profile, updateProfile,
      personaId: persona.id, setPersonaId: () => {},
      budget, setBudget: (b) => updateProfile({ monthly_budget: b }),
      budgetState, setBudgetState: () => {},
      lang, setLang,
      dark, setDark,
      palette, setPalette,
      txns, setTxns, addTxn, removeTxn,
      t, theme, monthSpent, daysLeft, stateMap,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
