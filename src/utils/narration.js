// Helpers to wrap text into specific ElevenLabs style structures
export const say        = (text) => ({ text, style: 'statement' });
export const ask        = (text) => ({ text, style: 'question' });
export const cheer      = (text) => ({ text, style: 'encouragement' });
export const emphasize  = (text) => ({ text, style: 'emphasis' });
export const think      = (text) => ({ text, style: 'thinking' });
export const celebrate  = (text) => ({ text, style: 'celebration' });

// Wonder phase — 4 questions (one picked at random per session)
export const wonderNarration = (questionIndex) => {
  const scripts = [
    [ ask("Here's a puzzle! Alex has 83 stickers and gives some to Emma. He has 48 left. How many stickers did he give away? What if knowing a simple addition fact could solve this instantly?") ],
    [ ask("Here's a mystery! If 35 plus 48 equals 83, can you instantly find what 83 minus 35 equals — without counting backwards at all? Addition and subtraction are secret partners!") ],
    [ ask("Think about this! Sam scores 63 points in a game. He loses some points and now has only 27. How many points did he lose? There's a triangle trick that gives you the answer straight away!") ],
    [ ask("Here's a challenge! How can knowing that 27 plus 36 equals 63 help you solve 63 minus 27 — without working it out again? Fact families are like magic — one triangle, four number sentences!") ],
  ];
  return scripts[questionIndex] ?? scripts[0];
};

// Story phase — 4 panels matching STORY_SLIDES
export const storyNarration = (panelIndex) => {
  const panels = [
    // Panel 1 — Alex's Fair Day
    [ say("Alex won 63 tokens at the school fair. He spent some on rides and games. When he counted at the end of the day, he had only 27 tokens left. Emma asked: How many tokens did you spend, Alex? Let's help him figure it out!") ],
    // Panel 2 — The Subtraction Puzzle
    [ say("Alex tried counting backwards from 63 to 27, but kept losing track. Then Emma smiled and said: You already know the answer! You just need to find it using addition. Addition and subtraction are partners!") ],
    // Panel 3 — Emma's Secret Triangle
    [ say("Emma drew a triangle. At the top she wrote 63 — the whole. At the two bottom corners she wrote 27 and a question mark. The two parts always add up to the whole! So 27 plus the missing number equals 63, which means 63 minus 27 equals 36! The Fact Family Triangle unlocks everything!") ],
    // Panel 4 — The Full Fact Family
    [ say("Alex was amazed! From just three numbers — 63, 27, and 36 — he could write four facts: 27 plus 36 equals 63, 36 plus 27 equals 63, 63 minus 27 equals 36, and 63 minus 36 equals 27. They are a family! Now it's your turn to be the expert!") ],
  ];
  return panels[panelIndex] ?? [];
};

// Simulate phase — 3 stations (Take-Away Blocks, Fact Triangle, Number Inverter)
export const simulateNarration = (stationIndex) => {
  const stations = [
    [ say("Station One: Take-Away Blocks! This is the concrete station. Drag the tens and ones blocks to the basket to take away, and see subtraction happening right in front of you!") ],
    [ say("Station Two: Fact Triangle! This is the pictorial station. Use the fact family triangle to find the missing number. Remember — the top is the whole, and the two bottom corners are the parts!") ],
    [ say("Station Three: Number Inverter! This is the abstract station. Use your knowledge of addition to instantly solve the subtraction problem. One fact family gives you four number sentences!") ],
  ];
  return stations[stationIndex] ?? [];
};

// Correct answer feedback (cycles through variants)
export const correctNarration = (seed = 0) => {
  const list = [
    [ cheer("Brilliant! You've got it!") ],
    [ cheer("Excellent work! The inverse relationship helped you!") ],
    [ cheer("Outstanding! You're a subtraction superstar!") ],
    [ cheer("Amazing! Fact families are your superpower!") ],
  ];
  return list[seed % list.length];
};

// Wrong answer feedback (cycles through variants)
export const wrongNarration = (seed = 0) => {
  const list = [
    [ say("Good try! Use the fact family triangle to find the answer.") ],
    [ say("Not quite! Remember — addition and subtraction are inverse operations.") ],
  ];
  return list[seed % list.length];
};

// Badge unlocked narration
export const badgeNarration = (badgeId) => {
  const map = {
    curious_coder: [ celebrate("Badge unlocked! Curious Coder! You've completed the Wonder and Story phases — great exploring!") ],
    sim_scientist:  [ celebrate("Badge unlocked! Sim Scientist! You've mastered all three simulation stations!") ],
    sub_solver:     [ celebrate("Badge unlocked! Sub Solver! You scored over 80 correct answers — fantastic work!") ],
    inv_master:     [ celebrate("Badge unlocked! Inverse Master! You scored a perfect ten out of ten in a world — incredible!") ],
    streak_champ:   [ celebrate("Badge unlocked! Streak Champion! You answered 12 questions correctly in a row — you're on fire!") ],
    journey_hero:   [ celebrate("Badge unlocked! Journey Hero! You've completed all five phases — what an incredible achievement!") ],
  };
  return map[badgeId] ?? [];
};

export const worldCompleteNarration = () => [
  celebrate("Wonderful! You've completed this world! Keep going to unlock the next challenge!")
];

export const allWorldsDoneNarration = () => [
  celebrate("Amazing! You've conquered all ten worlds! You are a true Subtraction Master!")
];

export const reflectIntroNarration = () => [
  say("Great work! Now let's take a moment to reflect on everything you've discovered today.")
];

export const resultsFinalNarration = () => [
  celebrate("Congratulations! You've completed the Subtraction within 100 module. You've mastered fact families and the power of inverse operations. What a fantastic journey!")
];

export const welcomeNarration = () => [
  say("Welcome to Subtraction within 100! Today we'll crack the secret of fact families and discover how addition and subtraction work together!")
];
