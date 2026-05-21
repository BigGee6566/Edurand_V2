import { supabase } from './supabase';

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signUp(email, password, { name, university, fundingType }) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  const user = data.user;
  if (!user) throw new Error('Signup failed — check your email to confirm.');

  const parts = name.trim().split(/\s+/);
  const shortName = parts[0];
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();

  await upsertProfile(user.id, {
    name: name.trim(),
    short_name: shortName,
    initials,
    university,
    funding_type: fundingType,
  });

  return user;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// ── Profile ───────────────────────────────────────────────────────────────────

export async function loadProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data ?? null;
}

export async function upsertProfile(userId, fields) {
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...fields, updated_at: new Date().toISOString() });
  if (error) throw error;
}

// ── Transactions ──────────────────────────────────────────────────────────────

export function dbRowToTxn(row) {
  return {
    id: row.id,
    cat: row.cat,
    merchant: row.merchant,
    amount: parseFloat(row.amount),
    note: row.note || '',
    at: row.at_label,
    created_at: row.created_at,
  };
}

export async function loadTransactions(userId) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw error;
  return (data || []).map(dbRowToTxn);
}

export async function insertTransaction(userId, txn) {
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      cat: txn.cat,
      merchant: txn.merchant,
      amount: txn.amount,
      note: txn.note || null,
      at_label: txn.at || 'Just now',
    })
    .select()
    .single();
  if (error) throw error;
  return dbRowToTxn(data);
}

export async function deleteTransaction(txnId) {
  const { error } = await supabase.from('transactions').delete().eq('id', txnId);
  if (error) throw error;
}

// ── AI Coach — calls Supabase Edge Function (key never leaves the server) ─────

const FALLBACKS = {
  budget: [
    "Based on your spending, you have {remaining} left — that's {perDay}/day for {daysLeft}. Cutting one takeaway this week could save you R80+.",
    "R{remaining} for {daysLeft} is tight. Cook Sunday batch meals (mince + rice = R7/plate) and you'll stretch it easily.",
  ],
  meal: [
    "Cheapest filling meal: pap + chakalaka at ~R14 from Shoprite. Egg fried rice is R17 and lasts 2 days when batch-cooked.",
    "Mince + spaghetti: R28 for 4 servings (~R7/plate). Make it Sunday, eat it all week.",
  ],
  side: [
    "Tutoring 1st-years in your strong subjects pays R80–R150/hr. DM your department's WhatsApp group to start.",
    "Selling notes on Stuvia or peer tutoring through your university's network can earn R200–500 in a week.",
  ],
  general: [
    "I'm here to help you stretch your money! Ask me about your budget, cheap meals, or side hustles.",
    "Key for SA students: cover fixed costs (res, data) first, then discretionary. Want a breakdown of your spending?",
  ],
};

function detectTopic(text) {
  const t = text.toLowerCase();
  if (/budget|money|spend|left|remain|afford/.test(t)) return 'budget';
  if (/meal|eat|food|cook|cheap|hungry|noodle|pap/.test(t)) return 'meal';
  if (/hustle|earn|income|job|work|tutor/.test(t)) return 'side';
  return 'general';
}

function getFallback(text, ctx) {
  const topic = detectTopic(text || '');
  const pool = FALLBACKS[topic] || FALLBACKS.general;
  const tmpl = pool[Math.floor(Math.random() * pool.length)];
  return tmpl
    .replace('{remaining}', `R${Math.round(ctx.remaining ?? 0)}`)
    .replace(/R\{remaining\}/, `R${Math.round(ctx.remaining ?? 0)}`)
    .replace('{perDay}', `R${Math.round(ctx.perDay ?? 0)}`)
    .replace('{daysLeft}', `${ctx.daysLeft ?? 0} days`);
}

export async function askCoach(apiMessages, userContext) {
  const lastUserText = [...apiMessages].reverse().find(m => m.role === 'user')?.content ?? '';

  try {
    const { data, error } = await supabase.functions.invoke('coach', {
      body: { messages: apiMessages, context: userContext },
    });
    if (error || !data?.text) return getFallback(lastUserText, userContext);
    return data.text;
  } catch {
    return getFallback(lastUserText, userContext);
  }
}
