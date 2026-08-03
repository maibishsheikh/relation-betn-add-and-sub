export function calcXP(attempt, hintsUsed, streak) {
  const base = attempt === 1 ? 10 : hintsUsed > 0 ? 5 : 7;
  return base + (streak >= 5 ? 5 : 0);
}

export function calcStars(correct) {
  return correct >= 9 ? 3 : correct >= 7 ? 2 : correct >= 5 ? 1 : 0;
}

export function starLabel(stars) {
  return ["Keep practising! 💪", "Good effort! ✓", "Great job! 🎉", "Perfect! Outstanding! 🏆"][stars];
}
