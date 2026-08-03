// ═══════════════════════════════════════════════════════════════
// QUESTION BANK  —  100 questions across 10 types × 3 difficulties
// Question types aligned to TRD learning objectives:
//   L01 fact_family_find   – read triangle, find missing part (sub)
//   L02 fill_blank         – □ − a = b, find whole
//   L03 inverse_check      – is this an inverse pair? Yes/No
//   L04 word_problem       – contextual take-away story
//   L05 complete_family    – pick the matching subtraction fact
//   L06 missing_addend     – □ + b = whole, use subtraction
//   L07 bar_model          – whole/part bar, find missing part
//   L08 true_false_bond    – is number bond correct? True/False
//   L09 regrouping         – plain subtraction (may require regrouping)
//   L10 how_many_more      – comparison / difference word problem
// ═══════════════════════════════════════════════════════════════

const CHARS = [
  "Emma","Oliver","Sophie","Jack","Mia","Ben",
  "Charlotte","Noah","Grace","Ethan","Ava","Liam",
];
const OBJECTS = [
  "apples","stickers","marbles","books","biscuits",
  "flowers","stamps","cards","balloons","coins","pencils","sweets",
];

// Triplets [whole, part1, part2] by difficulty level
const TRIPLETS = {
  1: [
    [28,13,15],[35,18,17],[42,24,18],[30,11,19],[46,27,19],
    [38,16,22],[44,25,19],[32,14,18],[50,23,27],[26,12,14],
    [40,21,19],[29,15,14],[48,29,19],[37,18,19],[25,11,14],
  ],
  2: [
    [63,27,36],[72,45,27],[65,38,27],[75,38,37],[58,29,29],
    [80,46,34],[71,33,38],[68,29,39],[74,46,28],[55,28,27],
    [66,39,27],[73,44,29],[62,35,27],[78,41,37],[57,28,29],
  ],
  3: [
    [83,48,35],[91,54,37],[96,47,49],[88,39,49],[85,36,49],
    [94,57,37],[82,47,35],[87,38,49],[99,62,37],[100,64,36],
    [93,56,37],[86,49,37],[97,58,39],[89,42,47],[84,37,47],
  ],
};

// [easy count, medium count, hard count] per type → total 10 per type = 100 Qs
const QDIST = [
  ["fact_family_find",  [4, 3, 3]],
  ["fill_blank",        [4, 4, 2]],
  ["inverse_check",     [5, 3, 2]],
  ["word_problem",      [3, 4, 3]],
  ["complete_family",   [3, 4, 3]],
  ["missing_addend",    [4, 3, 3]],
  ["bar_model",         [3, 4, 3]],
  ["true_false_bond",   [5, 3, 2]],
  ["regrouping",        [2, 4, 4]],
  ["how_many_more",     [3, 4, 3]],
];

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function genOpts(correct, min = 0, max = 100) {
  const s = new Set([correct]);
  for (const off of [1,-1,2,-2,3,-3,5,-5,10,-10,7,-7]) {
    if (s.size >= 4) break;
    const v = correct + off;
    if (v >= min && v <= max && v !== correct) s.add(v);
  }
  while (s.size < 4) {
    const v = correct + s.size * 4;
    if (v <= max && v !== correct) s.add(v);
    else {
      const v2 = correct - s.size * 4;
      if (v2 >= min && v2 !== correct) s.add(v2);
      else break;
    }
  }
  return shuffle([...s]).slice(0, 4);
}

function getTri(diff, idx) {
  const pool = TRIPLETS[diff];
  return pool[idx % pool.length];
}

function buildQ(type, whole, part1, part2, diff, seed) {
  const ch  = CHARS[seed % CHARS.length];
  const ch2 = CHARS[(seed + 4) % CHARS.length];
  const obj = OBJECTS[Math.floor(seed / CHARS.length) % OBJECTS.length];

  const base = { type, difficulty: diff, whole, part1, part2 };

  switch (type) {
    /* ── L01 ── */
    case "fact_family_find":
      return {
        ...base, visual: "triangle", missing: "part2",
        qt: `${part1} + ${part2} = ${whole}\n\nWhat is ${whole} − ${part1}?`,
        opts: genOpts(part2), ans: part2,
        h1: `Look at the triangle — ${whole} is at the top (the whole).`,
        h2: `If ${part1} + ${part2} = ${whole}, then ${whole} − ${part1} = ?`,
        exp: `${whole} − ${part1} = ${part2}. Whole minus one part gives the other part!`,
      };

    /* ── L02 ── */
    case "fill_blank":
      return {
        ...base, visual: "sentence", missing: "whole",
        qt: `□ − ${part1} = ${part2}\n\nFind the missing whole number.`,
        opts: genOpts(whole), ans: whole,
        h1: `Think: what number minus ${part1} equals ${part2}?`,
        h2: `Use the inverse: ${part2} + ${part1} = ${whole}`,
        exp: `The whole is ${whole}. Check: ${whole} − ${part1} = ${part2} ✓`,
      };

    /* ── L03 ── */
    case "inverse_check": {
      const useCorrect = seed % 2 === 0;
      const shown = useCorrect ? part2 : (part2 + 2 <= 99 ? part2 + 2 : part2 - 2);
      const correct = shown + part1 === whole ? "Yes" : "No";
      return {
        ...base, visual: "trueFalse", missing: "part2",
        qt: `Is ${whole} − ${part1} = ${shown}\nrelated to ${shown} + ${part1} = ${whole}?`,
        opts: ["Yes", "No"], ans: correct,
        h1: `Check: does ${shown} + ${part1} = ${whole}?`,
        h2: `${shown} + ${part1} = ${shown + part1}. Compare to ${whole}.`,
        exp: correct === "Yes"
          ? `Yes! They are an inverse pair. Addition undoes subtraction! ✓`
          : `No. ${shown} + ${part1} = ${shown + part1}, not ${whole}.`,
      };
    }

    /* ── L04 ── */
    case "word_problem":
      return {
        ...base, visual: "picture", missing: "part1", ch, obj,
        qt: `${ch} had ${whole} ${obj}.\nThey gave some away.\n${part2} are left.\n\nHow many did ${ch} give away?`,
        opts: genOpts(part1), ans: part1,
        h1: `Draw a bar model: whole = ${whole}, remaining = ${part2}.`,
        h2: `${whole} − ${part2} = the number given away.`,
        exp: `${whole} − ${part2} = ${part1}. ${ch} gave away ${part1} ${obj}!`,
      };

    /* ── L05 ── */
    case "complete_family": {
      const cAns = `${whole}−${part1}=${part2}`;
      const wrongs = shuffle([
        `${whole}−${part1}=${part2 + 2}`,
        `${part1}−${part2}=${whole}`,
        `${whole}+${part1}=${part2}`,
      ]).slice(0, 3);
      return {
        ...base, visual: "triangle", missing: "part2",
        qt: `${part1} + ${part2} = ${whole}\n\nWhich fact also belongs to this family?`,
        opts: shuffle([cAns, ...wrongs]), ans: cAns,
        h1: `A fact family has 2 additions and 2 subtractions.`,
        h2: `The subtraction facts are ${whole}−${part1}=? and ${whole}−${part2}=?`,
        exp: `${whole}−${part1}=${part2} is the inverse of ${part1}+${part2}=${whole} ✓`,
      };
    }

    /* ── L06 ── */
    case "missing_addend":
      return {
        ...base, visual: "sentence", missing: "part1",
        qt: `□ + ${part2} = ${whole}\n\nFind the missing addend.`,
        opts: genOpts(part1), ans: part1,
        h1: `Use subtraction: ${whole} − ${part2} = ?`,
        h2: `Inverse relationship: ${whole} − ${part2} = the missing addend.`,
        exp: `${whole} − ${part2} = ${part1}. So the missing addend is ${part1}!`,
      };

    /* ── L07 ── */
    case "bar_model":
      return {
        ...base, visual: "barModel", missing: "part2",
        qt: `Whole = ${whole}\nOne part = ${part1}\n\nFind the other part.`,
        opts: genOpts(part2), ans: part2,
        h1: `Both parts must total ${whole}.`,
        h2: `${whole} − ${part1} = the missing part.`,
        exp: `${whole} − ${part1} = ${part2}. The missing part is ${part2}!`,
      };

    /* ── L08 ── */
    case "true_false_bond": {
      const useC = seed % 3 !== 0;
      const sP1 = useC ? part1 : part1 + 3;
      const correct2 = sP1 + part2 === whole ? "True" : "False";
      return {
        ...base, visual: "trueFalse", missing: "whole",
        qt: `Is this number bond correct?\n\n[ ${whole} ]\n↙        ↘\n[ ${sP1} ]   [ ${part2} ]`,
        opts: ["True", "False"], ans: correct2,
        h1: `Check: does ${sP1} + ${part2} = ${whole}?`,
        h2: `${sP1} + ${part2} = ${sP1 + part2}. Is that ${whole}?`,
        exp: correct2 === "True"
          ? `True! ${sP1} + ${part2} = ${whole} ✓`
          : `False! ${sP1} + ${part2} = ${sP1 + part2}, not ${whole}.`,
      };
    }

    /* ── L09 ── */
    case "regrouping":
      return {
        ...base, visual: "sentence", missing: "part2",
        qt: `${whole} − ${part1} = □`,
        opts: genOpts(part2), ans: part2,
        h1: `Regroup: break ${whole} into tens and ones.`,
        h2: `Verify with addition: ${part2} + ${part1} should equal ${whole}.`,
        exp: `${whole} − ${part1} = ${part2}. Check: ${part2} + ${part1} = ${whole} ✓`,
      };

    /* ── L10 ── */
    case "how_many_more":
      return {
        ...base, visual: "picture", missing: "part2", ch, ch2, obj,
        qt: `${ch} has ${whole} ${obj}.\n${ch2} has ${part1} ${obj}.\n\nHow many more does ${ch} have?`,
        opts: genOpts(part2), ans: part2,
        h1: `"How many more" means find the difference.`,
        h2: `${whole} − ${part1} = the difference.`,
        exp: `${whole} − ${part1} = ${part2}. ${ch} has ${part2} more ${obj}!`,
      };

    default:
      return { ...base, qt: "Question", opts: [1,2,3,4], ans: 1, visual: "sentence", missing: "part2", h1:"",h2:"",exp:"" };
  }
}

export function generateBank() {
  const all = [];
  let seed = 0;
  QDIST.forEach(([type, [e, m, h]]) => {
    for (let i = 0; i < e; i++) { const [w,p1,p2] = getTri(1, i); all.push(buildQ(type,w,p1,p2,1,seed++)); }
    for (let i = 0; i < m; i++) { const [w,p1,p2] = getTri(2, i); all.push(buildQ(type,w,p1,p2,2,seed++)); }
    for (let i = 0; i < h; i++) { const [w,p1,p2] = getTri(3, i); all.push(buildQ(type,w,p1,p2,3,seed++)); }
  });
  return all;
}

export function buildSession(bank) {
  const byType = {};
  bank.forEach((q) => { if (!byType[q.type]) byType[q.type] = []; byType[q.type].push(q); });
  const selected = Object.values(byType).flatMap((qs) => shuffle(qs).slice(0, 10));
  return shuffle(selected);
}
