import { generateBank, buildSession } from '../data/questionBank.js';
import { checkNewBadges } from '../data/badges.js';
import { calcXP, calcStars } from '../utils/gamification.js';

const BANK = generateBank();

export function mkFresh() {
  return {
    phase: 'intro',
    // ── Simulate
    simSt: 0,
    ssc: [false, false, false],
    // ── Play
    qs: buildSession(BANK),
    cq: 0,
    cw: 0,
    ws: Array(10).fill(null),   // world scores
    wcorr: 0,                   // correct in current world
    hints: 0,
    att: 0,                     // attempts on current question
    // ── Gamification
    xp: 0,
    stars: 0,
    streak: 0,
    maxStr: 0,
    badges: [],
    // ── Phase completion flags
    pc: {
      wonder:   false,
      story:    false,
      simulate: false,
      play:     false,
      reflect:  false,
    },
    // ── UI
    showMap:     true,
    fb:          null,   // feedback: {ok, xpG, bonus, exp} | null
    hl:          0,      // hint level shown (0/1/2)
    newBadges:   [],     // badge IDs just unlocked (cleared after toast)
    worldResult: null,   // {score, stars, newBadges[]} after world ends
  };
}

export function reducer(s, a) {
  switch (a.t) {

    case 'PHASE':
      return { ...s, phase: a.v, fb: null };

    case 'PHASE_DONE': {
      const pc = { ...s.pc, [a.v]: true };
      const nb = checkNewBadges({ ...s, pc });
      return { ...s, pc, badges: [...s.badges, ...nb], newBadges: nb };
    }

    case 'SIM_COMPLETE': {
      const ssc = [...s.ssc];
      ssc[a.v] = true;
      const nextSt = a.v + 1;
      const nb = checkNewBadges({ ...s, ssc });
      return { ...s, ssc, simSt: nextSt, badges: [...s.badges, ...nb], newBadges: nb };
    }

    case 'ENTER_WORLD':
      return {
        ...s, cw: a.v, cq: a.v * 10,
        showMap: false, wcorr: 0, hints: 0, att: 0,
        fb: null, hl: 0, worldResult: null,
      };

    case 'SHOW_MAP':
      return { ...s, showMap: true, fb: null, worldResult: null };

    case 'CORRECT': {
      const streak = s.streak + 1;
      const maxStr = Math.max(s.maxStr, streak);
      const xpG    = calcXP(s.att + 1, s.hl, streak);
      const xp     = s.xp + xpG;
      const wcorr  = s.wcorr + 1;
      const nb     = checkNewBadges({ ...s, streak, maxStr, xp, wcorr });
      return {
        ...s, streak, maxStr, xp, wcorr, att: 0, hl: 0,
        badges: [...s.badges, ...nb], newBadges: nb,
        fb: { ok: true, xpG, bonus: streak >= 5, exp: a.exp },
      };
    }

    case 'WRONG':
      return { ...s, streak: 0, att: s.att + 1, fb: { ok: false } };

    case 'HINT':
      return { ...s, hl: Math.min(2, s.hl + 1), hints: s.hints + 1 };

    case 'NEXT': {
      const nq      = s.cq + 1;
      const worldEnd = (s.cw + 1) * 10;
      if (nq >= worldEnd) {
        const ws          = [...s.ws];
        ws[s.cw]          = s.wcorr;
        const totalStars  = ws.reduce((t, w) => t + (w !== null ? calcStars(w) : 0), 0);
        const st          = calcStars(s.wcorr);
        const nb          = checkNewBadges({ ...s, ws, stars: totalStars });
        const newB        = [...s.badges, ...nb];
        return {
          ...s, cq: nq, ws, stars: totalStars, badges: newB, newBadges: nb,
          worldResult: {
            score:     s.wcorr,
            stars:     st,
            newBadges: nb,
          },
          fb: null, hl: 0, att: 0, showMap: true,
        };
      }
      return { ...s, cq: nq, fb: null, hl: 0, att: 0 };
    }

    case 'CLEAR_BADGES':
      return { ...s, newBadges: [] };

    case 'RESTART':
      return mkFresh();

    default:
      return s;
  }
}
