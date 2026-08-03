# Subtraction within 100
### Intellia SG · Grade 2 Mathematics · Singapore MOE Primary 2

> **Module:** G2-MATH-SUB100-001  
> **Topic:** Using the Relationship Between Addition and Subtraction  
> **Framework:** 5E Instructional Model (Wonder → Story → Simulate → Play → Reflect)

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
src/
├── App.jsx                        # Root component & phase router
├── App.css                        # Global styles
├── main.jsx                       # React entry point
│
├── store/
│   └── reducer.js                 # Full app state (useReducer)
│
├── data/
│   ├── questionBank.js            # 100-question bank, 10 types × 3 difficulties
│   ├── badges.js                  # 6 achievement badges
│   ├── worlds.js                  # 10 Play worlds config
│   └── storyPanels.js             # Phase 2 story content
│
├── utils/
│   └── gamification.js            # XP, stars, labels
│
├── hooks/
│   └── useAudio.js                # Sound effect hook
│
└── components/
    ├── shared/
    │   ├── TopBar.jsx
    │   ├── FactFamilyTriangle.jsx  # SVG triangle visual
    │   ├── BarModel.jsx            # SVG bar model visual
    │   ├── NumberPad.jsx           # Digit entry keypad
    │   ├── ImgPH.jsx               # Story image placeholder
    │   └── BadgeToast.jsx          # Slide-in badge notification
    │
    ├── phases/
    │   ├── IntroScreen.jsx
    │   ├── WonderPhase.jsx         # Phase 1 – 3-step inquiry hook
    │   ├── StoryPhase.jsx          # Phase 2 – 6-panel narrative
    │   ├── ReflectPhase.jsx        # Phase 5 – 4-question metacognition
    │   └── ResultsScreen.jsx       # Final results & badges
    │
    ├── simulations/
    │   ├── Base10Station.jsx       # Station A – Concrete blocks
    │   ├── FactFamilyStation.jsx   # Station B – Pictorial triangle
    │   ├── InverterStation.jsx     # Station C – Abstract number pad
    │   └── SimulatePhase.jsx       # Phase 3 wrapper
    │
    └── quiz/
        ├── WorldMap.jsx            # 10-world grid
        ├── QuestionCard.jsx        # Question renderer + feedback overlay
        ├── WorldCompleteModal.jsx  # Post-world celebration
        └── PlayPhase.jsx           # Phase 4 wrapper

public/
└── assets/
    ├── audio/                      # SFX: correct.mp3, wrong.mp3, badge.mp3 …
    └── images/
        └── story/                  # panel-01.jpg … panel-06.jpg
```

---

## Question Bank

| # | Type | Description | E | M | H |
|---|------|-------------|---|---|---|
| L01 | fact_family_find | Read triangle, find missing part | 4 | 3 | 3 |
| L02 | fill_blank | □ − a = b, find whole | 4 | 4 | 2 |
| L03 | inverse_check | Is this an inverse pair? Yes/No | 5 | 3 | 2 |
| L04 | word_problem | Contextual take-away story | 3 | 4 | 3 |
| L05 | complete_family | Pick the matching subtraction fact | 3 | 4 | 3 |
| L06 | missing_addend | □ + b = whole, use subtraction | 4 | 3 | 3 |
| L07 | bar_model | Whole/part bar, find missing part | 3 | 4 | 3 |
| L08 | true_false_bond | Is number bond correct? True/False | 5 | 3 | 2 |
| L09 | regrouping | Plain subtraction with regrouping | 2 | 4 | 4 |
| L10 | how_many_more | Comparison / difference word problem | 3 | 4 | 3 |
| | **Total** | | **36** | **36** | **28** = **100** |

---

## Gamification

| Element | Detail |
|---------|--------|
| **XP** | +10 (1st attempt), +7 (2nd, no hint), +5 (with hint). Streak ≥5 → +5 bonus |
| **Stars** | 3★ ≥9, 2★ ≥7, 1★ ≥5, 0★ <5 per world |
| **Streak** | Resets on wrong answer. Displayed at ≥3 |
| **World unlock** | Must score ≥5/10 to unlock the next world |
| **Badges** | 6 badges (see `src/data/badges.js`) |

---

## Audio Setup

Place MP3 files in `public/assets/audio/`:

| File | Trigger |
|------|---------|
| `correct.mp3` | Correct answer |
| `wrong.mp3` | Wrong answer |
| `badge.mp3` | Badge unlocked |
| `world_complete.mp3` | World finished |
| `phase_complete.mp3` | Phase advanced |
| `click.mp3` | General button click |

Audio silently degrades if files are missing.

---

## Story Images

Place artwork JPGs in `public/assets/images/story/`:

`panel-01.jpg` through `panel-06.jpg`

The `<ImgPH>` placeholder component shows the alt-text until images are available.

---

## Build for Production

```bash
npm run build
# Output in dist/
```

---

## Curriculum Alignment

| Objective | Coverage |
|-----------|----------|
| Understand inverse relationship of + and − | Wonder, Simulate Station C, all 10 question types |
| Use addition facts to find subtraction facts | L01, L03, L05, L06 |
| Subtract within 100 with and without regrouping | L09, L07, L04, L10 |
| Solve word problems involving subtraction | L04, L10 |
| Build and read fact family triangles | Story, Simulate Station B, L01, L05 |
| Read and interpret bar models | L07, Simulate Station A |

---

*Built with React 18 + Vite 5 · No external UI library dependencies*
