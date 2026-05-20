import React, { createContext, useContext, useState, useMemo } from 'react';
import { PERSONAS, SPENDING_STATES } from './data';
import I18N from './i18n';
import { makeTheme, PALETTES } from './theme';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [personaId, setPersonaId] = useState('nsfas');
  const [budgetState, setBudgetState] = useState('warning');
  const [budget, setBudget] = useState(1500);
  const [lang, setLang] = useState('en');
  const [dark, setDark] = useState(false);
  const [palette, setPalette] = useState(PALETTES[0]);
  const [txns, setTxns] = useState(SPENDING_STATES.warning.txns);

  const persona = PERSONAS[personaId];
  const stateMap = SPENDING_STATES[budgetState];
  const t = I18N[lang] || I18N.en;
  const theme = useMemo(() => makeTheme({ palette, dark }), [palette, dark]);
  const monthSpent = useMemo(
    () => txns.reduce((a, tx) => a + (tx.amount < 0 ? Math.abs(tx.amount) : 0), 0),
    [txns]
  );
  const daysLeft = stateMap.daysLeft;

  return (
    <AppContext.Provider value={{
      persona, personaId, setPersonaId,
      budgetState, setBudgetState,
      budget, setBudget,
      lang, setLang,
      dark, setDark,
      palette, setPalette,
      txns, setTxns,
      t, theme, monthSpent, daysLeft, stateMap,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
