export const PERSONAS = {
  nsfas: {
    id: 'nsfas', name: 'Lerato Dlamini', short: 'Lerato', initials: 'LD',
    university: 'University of Cape Town', uniShort: 'UCT',
    course: '2nd Year • BCom Economics', funding: 'NSFAS',
    fundingLabel: 'NSFAS Allowance', monthlyIncome: 1650, expectedDate: 'paid 25 Jun',
  },
  bursary: {
    id: 'bursary', name: 'Sipho Khumalo', short: 'Sipho', initials: 'SK',
    university: 'University of the Witwatersrand', uniShort: 'Wits',
    course: '3rd Year • BSc Computer Science', funding: 'Sasol Bursary',
    fundingLabel: 'Monthly Stipend', monthlyIncome: 3200, expectedDate: 'paid 1 Jul',
  },
  self: {
    id: 'self', name: 'Aaliyah Patel', short: 'Aaliyah', initials: 'AP',
    university: 'Stellenbosch University', uniShort: 'Stellies',
    course: '1st Year • BA Humanities', funding: 'Part-time + family',
    fundingLabel: 'Side hustle + family', monthlyIncome: 2100, expectedDate: 'next gig: Sat',
  },
};

export const CATEGORIES = [
  { id: 'food',      label: 'Food',           color: '#0066FF', icon: '🍜' },
  { id: 'transport', label: 'Transport',      color: '#FFB300', icon: '🚐' },
  { id: 'rent',      label: 'Rent / Res',     color: '#00C853', icon: '🏠' },
  { id: 'data',      label: 'Data & Airtime', color: '#7C3AED', icon: '📶' },
  { id: 'fun',       label: 'Fun',            color: '#EC4899', icon: '🎉' },
  { id: 'study',     label: 'Study',          color: '#06B6D4', icon: '📚' },
];

export const SPENDING_STATES = {
  healthy: {
    label: 'On track', daysIn: 12, daysLeft: 18,
    txns: [
      { id: 1, cat: 'food',      merchant: 'Checkers Sixty60', amount: -89,  at: 'Today, 12:40',  note: 'Bread, milk, 2-min noodles' },
      { id: 2, cat: 'transport', merchant: 'MyCiTi Bus',       amount: -16,  at: 'Today, 08:12',  note: 'Campus → Mowbray' },
      { id: 3, cat: 'data',      merchant: 'Vodacom',          amount: -49,  at: 'Yesterday',     note: '1GB Power Hour bundle' },
      { id: 4, cat: 'food',      merchant: 'Steers',           amount: -65,  at: 'Yesterday',     note: 'Wacky Wednesday burger' },
      { id: 5, cat: 'fun',       merchant: 'Labia Theatre',    amount: -50,  at: 'Sun, 16 Jun',   note: 'Student night' },
      { id: 6, cat: 'food',      merchant: 'Shoprite',         amount: -210, at: 'Wed, 12 Jun',   note: 'Weekly shop' },
      { id: 7, cat: 'transport', merchant: 'Uber',             amount: -42,  at: 'Tue, 11 Jun',   note: 'Rondebosch → Obs' },
      { id: 8, cat: 'food',      merchant: 'Pick n Pay',       amount: -78,  at: 'Mon, 10 Jun',   note: 'Eggs, oats, peanut butter' },
    ],
  },
  warning: {
    label: 'Watch out', daysIn: 14, daysLeft: 16,
    txns: [
      { id: 1, cat: 'food',      merchant: 'Mr D Food',        amount: -149, at: 'Today, 19:20',  note: 'KFC delivered (R30 fee)' },
      { id: 2, cat: 'transport', merchant: 'Uber',             amount: -88,  at: 'Today, 14:15',  note: 'Late for tut' },
      { id: 3, cat: 'food',      merchant: "Nando's",          amount: -119, at: 'Fri, 21 Jun',   note: 'Quarter chicken + chips' },
      { id: 4, cat: 'data',      merchant: 'MTN',              amount: -99,  at: 'Wed, 19 Jun',   note: 'Out of data, again' },
      { id: 5, cat: 'rent',      merchant: 'Res top-up',       amount: -250, at: 'Fri, 14 Jun' },
      { id: 6, cat: 'food',      merchant: 'Shoprite',         amount: -180, at: 'Wed, 12 Jun' },
      { id: 7, cat: 'transport', merchant: 'MyCiTi Bus',       amount: -32,  at: 'Mon, 10 Jun' },
      { id: 8, cat: 'fun',       merchant: 'Labia Theatre',    amount: -50,  at: 'Sun, 9 Jun',    note: 'Student night' },
    ],
  },
  crisis: {
    label: 'Crisis', daysIn: 24, daysLeft: 6,
    txns: [
      { id: 1,  cat: 'food',      merchant: 'KFC',             amount: -95,  at: 'Today, 13:10' },
      { id: 2,  cat: 'transport', merchant: 'Uber',            amount: -110, at: 'Today, 09:00',  note: 'Slept in, missed bus' },
      { id: 3,  cat: 'fun',       merchant: 'Takealot',        amount: -349, at: 'Yesterday',     note: 'Bluetooth speaker 😬' },
      { id: 4,  cat: 'food',      merchant: 'Mr D Food',       amount: -185, at: 'Yesterday' },
      { id: 5,  cat: 'fun',       merchant: 'Steam',           amount: -220, at: 'Mon, 24 Jun',   note: 'Game sale' },
      { id: 6,  cat: 'food',      merchant: 'Mugg & Bean',     amount: -98,  at: 'Sun, 23 Jun' },
      { id: 7,  cat: 'transport', merchant: 'Bolt',            amount: -76,  at: 'Sat, 22 Jun' },
      { id: 8,  cat: 'fun',       merchant: 'Long Street bar', amount: -240, at: 'Fri, 21 Jun' },
      { id: 9,  cat: 'rent',      merchant: 'Res top-up',      amount: -450, at: 'Fri, 14 Jun' },
      { id: 10, cat: 'food',      merchant: 'Shoprite',        amount: -310, at: 'Wed, 12 Jun' },
    ],
  },
};

export const LESSONS = [
  { id: 'l1', title: 'How NSFAS actually pays out',    mins: 5, kind: 'article',     progress: 100, color: '#00C853', icon: '🎓' },
  { id: 'l2', title: 'The 50/30/20 rule (SA edition)', mins: 6, kind: 'video',       progress: 100, color: '#0066FF', icon: '▶' },
  { id: 'l3', title: 'Build a R500 emergency fund',    mins: 8, kind: 'interactive', progress: 60,  color: '#FFB300', icon: '⚡' },
  { id: 'l4', title: 'Tax-free savings for students',  mins: 7, kind: 'article',     progress: 0,   color: '#7C3AED', icon: '📈' },
  { id: 'l5', title: 'Side hustles that pay in 7 days',mins: 9, kind: 'video',       progress: 0,   color: '#EC4899', icon: '💼' },
  { id: 'l6', title: 'When to say no to Mr D',         mins: 4, kind: 'quiz',        progress: 0,   color: '#06B6D4', icon: '❓' },
];

export const ACHIEVEMENTS = [
  { id: 'a1', name: '7-day streak',  desc: 'Logged every spend for a week.', icon: '🔥', earned: true },
  { id: 'a2', name: 'Budget Boss',   desc: 'Stayed under for 2 months.',     icon: '👑', earned: true },
  { id: 'a3', name: 'Saving Star',   desc: 'Reached R500 emergency fund.',   icon: '⭐', earned: true },
  { id: 'a4', name: 'Sixty60 Pro',   desc: "Beat last month's food spend.",  icon: '🛒', earned: false },
  { id: 'a5', name: 'No-Uber Week',  desc: '7 days using only bus/walk.',    icon: '🚐', earned: false },
];

export const R = (n) => `R${Math.abs(Math.round(n)).toLocaleString('en-ZA')}`;
