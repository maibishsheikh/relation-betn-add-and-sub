/**
 * generate_audio.js
 * Generates all narration audio files via ElevenLabs API.
 *
 * Usage (Windows PowerShell):
 *   $env:VITE_ELEVENLABS_API_KEY="your_key"; npm run generate-audio
 *
 * Usage (Mac / Linux):
 *   VITE_ELEVENLABS_API_KEY=your_key npm run generate-audio
 *
 * Voice: Alice | ID: Xb7hH8MSUJpSbSDYk0k2 | Model: eleven_multilingual_v2
 * Output: public/assets/audio/
 */

import fs   from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Auto-load .env file (works on all platforms without dotenv)
try {
  const env = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8');
  for (const line of env.split('\n')) {
    const [key, ...val] = line.split('=');
    if (key && val.length) process.env[key.trim()] = val.join('=').trim();
  }
} catch {}

const OUT_DIR  = path.join(__dirname, '..', 'public', 'assets', 'audio');
const API_KEY  = process.env.VITE_ELEVENLABS_API_KEY;
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice — warm, clear, child-friendly
const MODEL    = 'eleven_multilingual_v2';

if (!API_KEY) {
  console.error('❌  VITE_ELEVENLABS_API_KEY not set.');
  console.error('    Windows: $env:VITE_ELEVENLABS_API_KEY="sk_..."; npm run generate-audio');
  console.error('    Mac/Linux: VITE_ELEVENLABS_API_KEY=sk_... npm run generate-audio');
  process.exit(1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

// ── Narration scripts — matched exactly to module content ──────────────────
const SCRIPTS = [
  // ── Intro ──
  {
    file: 'intro_welcome.mp3',
    text: "Welcome to Subtraction within 100! Today we'll crack the secret of fact families and discover how addition and subtraction work together!",
  },

  // ── Wonder phase — 4 questions (one shown at random per session) ──
  {
    file: 'wonder_q1.mp3',
    text: "Here's a puzzle! Alex has 83 stickers and gives some to Emma. He has 48 left. How many stickers did he give away? What if knowing a simple addition fact could solve this instantly?",
  },
  {
    file: 'wonder_q2.mp3',
    text: "Here's a mystery! If 35 plus 48 equals 83, can you instantly find what 83 minus 35 equals — without counting backwards at all? Addition and subtraction are secret partners!",
  },
  {
    file: 'wonder_q3.mp3',
    text: "Think about this! Sam scores 63 points in a game. He loses some points and now has only 27. How many points did he lose? There's a triangle trick that gives you the answer straight away!",
  },
  {
    file: 'wonder_q4.mp3',
    text: "Here's a challenge! How can knowing that 27 plus 36 equals 63 help you solve 63 minus 27 — without working it out again? Fact families are like magic — one triangle, four number sentences!",
  },

  // ── Story phase — 4 panels ──
  {
    file: 'story_panel1.mp3',
    text: "Alex won 63 tokens at the school fair. He spent some on rides and games. When he counted at the end of the day, he had only 27 tokens left. Emma asked: How many tokens did you spend, Alex? Let's help him figure it out!",
  },
  {
    file: 'story_panel2.mp3',
    text: "Alex tried counting backwards from 63 to 27, but kept losing track. Then Emma smiled and said: You already know the answer! You just need to find it using addition. Addition and subtraction are partners!",
  },
  {
    file: 'story_panel3.mp3',
    text: "Emma drew a triangle. At the top she wrote 63 — the whole. At the two bottom corners she wrote 27 and a question mark. The two parts always add up to the whole! So 27 plus the missing number equals 63, which means 63 minus 27 equals 36! The Fact Family Triangle unlocks everything!",
  },
  {
    file: 'story_panel4.mp3',
    text: "Alex was amazed! From just three numbers — 63, 27, and 36 — he could write four facts: 27 plus 36 equals 63, 36 plus 27 equals 63, 63 minus 27 equals 36, and 63 minus 36 equals 27. They are a family! Now it's your turn to be the expert!",
  },

  // ── Simulate phase — 3 stations ──
  {
    file: 'sim_a_intro.mp3',
    text: "Station One: Take-Away Blocks! This is the concrete station. Drag the tens and ones blocks to the basket to take away, and see subtraction happening right in front of you!",
  },
  {
    file: 'sim_b_intro.mp3',
    text: "Station Two: Fact Triangle! This is the pictorial station. Use the fact family triangle to find the missing number. Remember — the top is the whole, and the two bottom corners are the parts!",
  },
  {
    file: 'sim_c_intro.mp3',
    text: "Station Three: Number Inverter! This is the abstract station. Use your knowledge of addition to instantly solve the subtraction problem. One fact family gives you four number sentences!",
  },

  // ── Correct answer feedback ──
  { file: 'feedback_correct_01.mp3', text: "Brilliant! You've got it!" },
  { file: 'feedback_correct_02.mp3', text: "Excellent work! The inverse relationship helped you!" },
  { file: 'feedback_correct_03.mp3', text: "Outstanding! You're a subtraction superstar!" },
  { file: 'feedback_correct_04.mp3', text: "Amazing! Fact families are your superpower!" },

  // ── Wrong answer feedback ──
  { file: 'feedback_wrong_01.mp3', text: "Good try! Use the fact family triangle to find the answer." },
  { file: 'feedback_wrong_02.mp3', text: "Not quite! Remember — addition and subtraction are inverse operations." },

  // ── Badge unlocked ──
  { file: 'badge_curious_coder.mp3', text: "Badge unlocked! Curious Coder! You've completed the Wonder and Story phases — great exploring!" },
  { file: 'badge_sim_scientist.mp3', text: "Badge unlocked! Sim Scientist! You've mastered all three simulation stations!" },
  { file: 'badge_sub_solver.mp3',    text: "Badge unlocked! Sub Solver! You scored over 80 correct answers — fantastic work!" },
  { file: 'badge_inv_master.mp3',    text: "Badge unlocked! Inverse Master! You scored a perfect ten out of ten in a world — incredible!" },
  { file: 'badge_streak_champ.mp3',  text: "Badge unlocked! Streak Champion! You answered 12 questions correctly in a row — you're on fire!" },
  { file: 'badge_journey_hero.mp3',  text: "Badge unlocked! Journey Hero! You've completed all five phases — what an incredible achievement!" },

  // ── World events ──
  { file: 'world_complete.mp3',  text: "Wonderful! You've completed this world! Keep going to unlock the next challenge!" },
  { file: 'all_worlds_done.mp3', text: "Amazing! You've conquered all ten worlds! You are a true Subtraction Master!" },

  // ── Reflect & Results ──
  { file: 'reflect_intro.mp3',   text: "Great work! Now let's take a moment to reflect on everything you've discovered today." },
  { file: 'results_final.mp3',   text: "Congratulations! You've completed the Subtraction within 100 module. You've mastered fact families and the power of inverse operations. What a fantastic journey!" },
];

// ── TTS helper ────────────────────────────────────────────────────────────
function tts(text, outPath) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      text,
      model_id: MODEL,
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    });

    const req = https.request(
      {
        hostname: 'api.elevenlabs.io',
        path:     `/v1/text-to-speech/${VOICE_ID}`,
        method:   'POST',
        headers:  {
          'xi-api-key':     API_KEY,
          'Content-Type':   'application/json',
          'Accept':         'audio/mpeg',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        if (res.statusCode !== 200) {
          let err = '';
          res.on('data', (d) => (err += d));
          res.on('end', () => reject(new Error(`HTTP ${res.statusCode}: ${err}`)));
          return;
        }
        const chunks = [];
        res.on('data',  (d) => chunks.push(d));
        res.on('end',   ()  => { fs.writeFileSync(outPath, Buffer.concat(chunks)); resolve(); });
      }
    );

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── Main ──────────────────────────────────────────────────────────────────
(async () => {
  console.log(`\n🎙️  Generating ${SCRIPTS.length} narration files (Voice: Alice)\n`);
  let ok = 0, skip = 0, fail = 0;

  for (const { file, text } of SCRIPTS) {
    const outPath = path.join(OUT_DIR, file);
    if (fs.existsSync(outPath)) {
      console.log(`  ⏭  ${file} (already exists — delete to regenerate)`);
      skip++;
      continue;
    }
    try {
      process.stdout.write(`  🔊 ${file} … `);
      await tts(text, outPath);
      console.log('✓');
      ok++;
      await new Promise((r) => setTimeout(r, 500)); // rate-limit: 2 req/s
    } catch (e) {
      console.log(`✗  ${e.message}`);
      fail++;
    }
  }

  console.log(`\n✅  Done — ${ok} generated, ${skip} skipped, ${fail} failed.`);
  console.log(`📁  Files saved to: public/assets/audio/\n`);
})();
