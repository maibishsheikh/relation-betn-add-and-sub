export const BADGES = [
  {
    id:   "curious_coder",
    label: "🎯 Curious Coder",
    desc:  "Complete Wonder & Story phases",
    cond:  (s) => s.pc.wonder && s.pc.story,
  },
  {
    id:   "sim_scientist",
    label: "🔬 Sim Scientist",
    desc:  "Complete all 3 Simulation stations",
    cond:  (s) => s.ssc.every(Boolean),
  },
  {
    id:   "sub_solver",
    label: "➖ Sub Solver",
    desc:  "Score 80+ correct answers in Play",
    cond:  (s) => s.ws.reduce((t, w) => t + (w ?? 0), 0) >= 80,
  },
  {
    id:   "inv_master",
    label: "💎 Inverse Master",
    desc:  "Score 10/10 in any single world",
    cond:  (s) => s.ws.some((w) => w === 10),
  },
  {
    id:   "streak_champ",
    label: "🔥 Streak Champion",
    desc:  "Achieve a 12+ answer streak",
    cond:  (s) => s.maxStr >= 12,
  },
  {
    id:   "journey_hero",
    label: "🌟 Journey Hero",
    desc:  "Complete all 5 phases",
    cond:  (s) => Object.values(s.pc).every(Boolean),
  },
];

export function checkNewBadges(state) {
  return BADGES
    .filter((b) => !state.badges.includes(b.id) && b.cond(state))
    .map((b) => b.id);
}
