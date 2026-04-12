---
name: bible-maze-game
description: >
  Build, fix, and upgrade interactive HTML5 maze games for Bible Explorer Kids Etsy shop.
  Use this skill for: creating new Bible-themed kids maze games, fixing bugs in existing
  game HTML files, making games mobile-friendly (touch controls, swipe, D-pad), preparing
  Etsy QR code activities for GitHub Pages, adding random question pools, fuzzy answer
  matching, copyright protection, removing emojis, or fixing audio/image/modal issues.
  Trigger on ANY mention of: maze game, interactive game, kids game, Bible game, Etsy game,
  QR code game, fix game, Moses maze, pharaoh escape, add questions, fix bugs, mobile
  controls, swipe, touch, copyright, random questions, or obstacle modal bug.
---

# Bible Kids Maze Game Builder & Fixer

You are helping **Bible Explorer Kids** — an Etsy shop selling digital printable activity bundles
based on Bible stories for children. The games are delivered as QR codes linking to GitHub Pages.

## What you're building

Interactive HTML5 maze games for kids (ages 5–12) themed around Bible stories. Each game:
- Lives as a single HTML file with a separate `assets/` folder (images + audio)
- Is hosted on GitHub Pages (QR codes link to the live URL)
- Works on all devices: iPhone, Android, iPad, Windows desktop, Mac desktop
- Has touch D-pad controls, swipe gestures, AND keyboard arrow keys
- Contains Bible checkpoint quiz questions kids must answer to progress
- Uses images and audio — NO EMOJIS anywhere in gameplay elements
- Has copyright protection header in the code

## Game context

Jane is working on **Part 1: Moses — The Deliverer is Born** (Exodus 1 & 2). Two games:

**Game 1: Baby Moses River Adventure** (`game/index.html`)
- Grid-based maze (20×16 CSS grid), river/ocean theme
- Baby Moses navigates Nile River to reach Pharaoh's daughter
- 10 randomly-selected checkpoints from a large question pool (difficulty-appropriate)
- Assets in `game/assets/images/` and `game/assets/audio/`

**Game 2: Moses' Pharaoh Escape** (desert escape, crimson theme)
- Text-based or grid maze, uses images not emojis
- Desert/Egyptian palace obstacles
- Same checkpoint/quiz structure as Game 1

**Store**: Bible Explorer Kids (Etsy)

## GitHub Pages structure

```
repository-root/
├── index.html              ← Game 1
├── pharaoh-escape/
│   └── index.html          ← Game 2
└── assets/
    ├── images/             ← All PNG/JPG
    └── audio/              ← All MP3
```

All asset paths must be relative (e.g., `assets/images/moses in basket.png`).

---

## STEP 1: Read first, then fix

Always read the full source file before writing anything. Identify all bugs present.

---

## STEP 2: All known bugs to fix

### Bug 1: Keyboard listener stacking
```javascript
// In initializeGame() — ALWAYS do this:
document.removeEventListener('keydown', handleKeyPress);
document.addEventListener('keydown', handleKeyPress);
```

### Bug 2: Fixed-width maze overflowing on mobile
Replace `repeat(20, 36px)` with responsive sizing:
```css
.maze-grid {
  display: grid;
  grid-template-columns: repeat(20, clamp(18px, 4.2vw, 34px));
  grid-template-rows: repeat(16, clamp(18px, 4.2vw, 34px));
  gap: 1px;
}
```

### Bug 3: Modal overflow cutting content on small screens
```css
.modal-content {
  overflow-y: auto;
  max-height: 88vh;
  -webkit-overflow-scrolling: touch; /* iOS smooth scroll */
}
```

### Bug 4: Cover page Start button unreachable on phones
```css
.cover-page {
  min-height: 100vh;
  height: auto;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
```

### Bug 5: Player image inconsistency
`resetPlayerPosition()` uses wrong image. Always use `assets/images/moses in basket.png` everywhere.

### Bug 6: No swipe gesture support
```javascript
let touchStartX = 0, touchStartY = 0;
document.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].clientX;
  touchStartY = e.changedTouches[0].clientY;
}, { passive: true });
document.addEventListener('touchend', e => {
  if (gameBlocked) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
  if (Math.abs(dx) > Math.abs(dy)) {
    movePlayerByButton(dx > 0 ? 'right' : 'left');
  } else {
    movePlayerByButton(dy > 0 ? 'down' : 'up');
  }
}, { passive: true });
```

### Bug 7: Audio references not declared
```javascript
// Declare ALL audio elements at top of script
const bgMusic = document.getElementById('bgMusic');
const moveSound = document.getElementById('moveSound');
// etc. — never rely on implicit HTML-id globals
```

### Bug 8: alert() calls — replace with modals
Replace any `alert()` or `confirm()` with styled modal messages.

### Bug 9: WRONG OBSTACLE IN DANGER MODAL (critical)
When Moses hits a squid obstacle, the danger message must say "squid" — not a random creature.
The bug is that `riverDangerImages[6]` (fish) paired with `dangerMessages[6]` ("Another alligator appeared!") is mismatched.

**Fix**: Keep images and messages in a single paired object array, never separate arrays:
```javascript
const riverDangers = [
  { src: "assets/images/color croc 5.png",    msg: "A hungry crocodile snapped up Moses!" },
  { src: "assets/images/shark 7.png",          msg: "A fierce shark attacked the basket!" },
  { src: "assets/images/octopus 5.png",        msg: "A giant octopus grabbed Moses with its tentacles!" },
  { src: "assets/images/squid 5.png",          msg: "A sneaky squid pulled Moses underwater!" },
  { src: "assets/images/crab 5.png",           msg: "A crab grabbed onto the basket!" },
  { src: "assets/images/orange lobster.png",   msg: "A giant lobster pinched Moses!" },
  { src: "assets/images/fish 7.png",           msg: "A large fish knocked Moses' basket!" },
  { src: "assets/images/big snake.png",        msg: "A slithery snake scared Moses!" }
];
// When assigning to a cell:
const danger = riverDangers[randomIndex];
cell.dataset.dangerIndex = randomIndex;
cell.dataset.dangerSrc = danger.src;
cell.dataset.dangerMsg = danger.msg;  // Store message WITH the cell

// When Moses hits that cell:
image = newCell.dataset.dangerSrc;
message = newCell.dataset.dangerMsg;  // Use the STORED message, not a re-looked-up one
```

### Bug 10: Mobile controls require scrolling
The D-pad is placed below the maze and requires scrolling to reach on phones.

**Fix**: Use a fixed layout — the game page should be exactly viewport height with the maze
taking the top portion and controls always visible at the bottom. Use CSS flex:
```css
.game-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}
.maze-wrapper {
  flex: 1;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.controls-bar {
  flex-shrink: 0;
  padding: 8px;
  background: rgba(255,255,255,0.95);
  border-top: 2px solid #4A90E2;
}
```

### Bug 11: D-pad button overflow (critical — learned from Game 1)
**Root cause**: Buttons with explicit `width: 54px` inside `grid-template-columns: 1fr 1fr 1fr` overflow when panel is too narrow.
**Fix**: Use `width: 100%` on buttons — let the grid's 1fr columns control width.
```css
.controls-panel { width: 182px; }
/* Math: inner = 182 - padding(20) - gap(4) = 158px; columns = (158-8)/3 = 50px ✓ */
.dpad { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 4px; }
.dpad-btn { width: 100%; height: 52px; } /* NOT explicit px width */
.dpad-spacer { width: 100%; height: 52px; }
```

### Bug 12: Controls panel action buttons too tall / not filling space correctly
```css
/* Section fills remaining height after d-pad, buttons spaced evenly */
.buttons-section {
    display: flex; flex-direction: column;
    flex: 1;
    justify-content: space-evenly;
    padding: 4px 0;
}
/* Fixed thin height per button — do NOT use flex:1 (makes them bloated) */
.action-btn { height: 48px; }
```

### Bug 13: Wave/decoration images not loading (path + directory mismatch)
- Filenames with spaces MUST be URL-encoded: `wave 1.png` → `wave%201.png`
- Always verify the ACTUAL directory before writing paths: `ls assets/images/ | grep -i wave`
- Common mistake: files are only in `assets/images/` but referenced from root `wave%201.png`

### Bug 14: Cover page scrolling waves overlap content
Using `position: fixed` or `position: absolute` decorative images on a scrolling cover page
causes them to stay fixed while content scrolls underneath — creating visual overlap.

**Solution — zero-height wave anchors** (scroll WITH content, no overlap, no wasted space):
```html
<!-- Place one of these between every content section on the cover page -->
<div class="wave-anchor" aria-hidden="true">
    <img src="assets/images/wave%201.png" alt="" style="width:90px;left:2%;top:-18px;animation-duration:3s;">
    <img src="assets/images/wave%202.png" alt="" style="width:80px;right:2%;top:-10px;animation-duration:2.7s;animation-delay:-0.9s;">
</div>
```
```css
.wave-anchor {
    position: relative; height: 0; width: 100%;
    pointer-events: none; overflow: visible; z-index: 2;
}
.wave-anchor img {
    position: absolute; object-fit: contain;
    animation: wavePulse ease-in-out infinite; opacity: 0.88;
}
```

### Bug 15: START label wrong position on first load
The label reads `offsetWidth` before the element has rendered (getting 0), then positions wrong.
**Fix**: Make visible FIRST, then read width:
```javascript
outerStart.style.display = 'block'; // show first
const labelW = outerStart.offsetWidth || 70; // now width is accurate
outerStart.style.left = (cRect.left - wRect.left - labelW - 6) + 'px';
```

### Bug 16: Start cell appears empty when Moses moves away
Add a CSS class applied when Moses leaves the start cell:
```css
.maze-cell.start.start-vacated {
    background: url("assets/images/new ocean.jpg") center/cover !important;
    border: 1px solid #a0c8f0 !important;
    animation: none !important;
    box-shadow: none !important;
}
```
In JS when Moses first moves: `document.querySelector('.maze-cell.start').classList.add('start-vacated');`

### Bug 17: Difficulty not required before starting
Never let users click Start without selecting a difficulty:
```javascript
function startGame() {
    const selected = document.querySelector('.difficulty-btn.selected');
    if (!selected) {
        const btns = document.querySelector('.difficulty-selector');
        btns.style.outline = '3px solid #FFD700';
        btns.style.borderRadius = '8px';
        setTimeout(() => { btns.style.outline = ''; }, 1800);
        document.getElementById('difficultyHint').style.display = 'block';
        setTimeout(() => { document.getElementById('difficultyHint').style.display = 'none'; }, 2500);
        return;
    }
    // ... proceed
}
```
```html
<div id="difficultyHint" style="display:none;color:#FFD700;font-size:15px;font-weight:700;margin-bottom:8px;
     text-shadow:0 1px 4px rgba(0,0,0,0.6);">⚠️ Please choose a difficulty level first!</div>
```

---

## STEP 3: Random question pools by difficulty

**This is required for Game 1.** Do NOT use fixed questions per checkpoint anymore.
Instead, maintain a large question bank (30+ questions) and randomly select 10 per game session.

### Question bank structure
```javascript
const questionBank = {
  easy: [
    {
      question: "What river did Moses float on?",
      answer: "NILE",
      clues: ["Egypt's famous river", "Starts with N", "Just 4 letters: N-I-L-E"]
    },
    // ... 15+ easy questions
  ],
  medium: [
    {
      question: "What plant material was Moses' basket made from?",
      answer: "PAPYRUS",
      clues: ["Made from river reeds", "Used for ancient writing", "Starts with P"]
    },
    // ... 15+ medium questions
  ],
  hard: [
    {
      question: "What does the name Moses mean? 'Because I _____ him out of the water'",
      answer: "DREW",
      clues: ["Past tense of draw", "To pull out", "Rhymes with 'new'"]
    },
    // ... 15+ hard questions
  ]
};
```

### Selecting questions for a session
```javascript
function selectQuestionsForSession(difficulty) {
  const pool = questionBank[difficulty];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 10); // Pick 10 random questions
}
```

### Question difficulty guidelines
- **Easy**: Direct "what" questions, answers in plain sight in the story (NILE, BASKET, CRYING)
- **Medium**: Requires understanding the story (PAPYRUS, MIRIAM, HEBREW, REEDS)
- **Hard**: Name meanings, context, implicit knowledge (DREW, PHARAOH, JOCHEBED, EXODUS)

Provide at least 15 questions per difficulty level so randomization feels fresh on replay.

---

## STEP 4: Fuzzy answer matching

Kids misspell things. Accept answers that are close enough:

```javascript
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({length: m+1}, (_, i) =>
    Array.from({length: n+1}, (_, j) => i === 0 ? j : j === 0 ? i : 0)
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}

function isAnswerCorrect(userAnswer, correctAnswer) {
  const user = userAnswer.trim().toUpperCase();
  const correct = correctAnswer.trim().toUpperCase();
  if (user === correct) return true;

  // Allow 1 error for short answers, 2 errors for longer ones
  const maxErrors = correct.length <= 4 ? 1 : 2;
  if (levenshtein(user, correct) <= maxErrors) return true;

  // Accept known synonyms
  const synonyms = {
    'CRYING': ['CRY', 'CRIED', 'WEEPING'],
    'REEDS': ['REED', 'BULRUSHES', 'RUSHES'],
    'HEBREW': ['HEBREWS', 'ISRAELITE', 'ISRAELITES', 'JEWISH'],
    'GOD': ['LORD', 'JESUS', 'HOLY SPIRIT'],
    'NILE': ['NILE RIVER'],
    'PAPYRUS': ['PAPYRI'],
    'BASKET': ['BASKETS', 'BOX'],
    'EGYPT': ['EGYPTIAN'],
  };
  const syns = synonyms[correct] || [];
  return syns.includes(user);
}
```

---

## STEP 5: Puzzle modal — "Exit to Main Menu" button

Every puzzle modal MUST have an exit option. Kids should never feel trapped:

```html
<div id="puzzleModal" class="modal puzzle-modal">
  <div class="modal-content">
    <div class="puzzle-title" id="puzzleTitle">Checkpoint Puzzle</div>
    <div class="puzzle-question" id="puzzleQuestion"></div>
    <div class="clue-box" id="clueBox" style="display:none"></div>
    <input type="text" class="answer-input" id="answerInput" placeholder="Type your answer here">
    <div class="puzzle-buttons">
      <button onclick="checkAnswer()" class="modal-button success-btn">Submit Answer</button>
      <button onclick="showClue()" class="clue-button" id="clueButton">Show Clue (-5 pts)</button>
      <button onclick="exitToMenu()" class="modal-button exit-btn" style="background:#888">
        Exit to Main Menu
      </button>
    </div>
    <div id="puzzleStatus"></div>
  </div>
</div>
```

```javascript
function exitToMenu() {
  document.getElementById('puzzleModal').style.display = 'none';
  gameBlocked = false;
  showCoverPage();
}
```

---

## STEP 6: Copyright protection

Add this to every game HTML file, as the first thing in the `<script>` block:

```javascript
/*
 * © 2025 Bible Explorer Kids. All rights reserved.
 * This interactive game is the intellectual property of Bible Explorer Kids.
 * Unauthorized copying, distribution, or reproduction of this game,
 * its questions, artwork, or code is strictly prohibited.
 * Licensed for personal, non-commercial use only with purchase.
 * Contact: [Bible Explorer Kids Etsy shop]
 */
```

Also add to the `<head>`:
```html
<meta name="copyright" content="© 2025 Bible Explorer Kids. All rights reserved.">
<meta name="author" content="Bible Explorer Kids">
```

And a subtle visible watermark on the cover page:
```html
<div style="font-size:11px; opacity:0.7; margin-top:20px;">
  © 2025 Bible Explorer Kids · For personal use only
</div>
```

Note: HTML/JS cannot be fully locked since browsers must read the code to run it.
The copyright notice establishes legal ownership. Content (questions, design, branding)
is what's truly protected — code structure is secondary.

---

## STEP 7: No emojis rule

**CRITICAL**: Every game output must use ZERO emojis in gameplay elements.
Emojis render differently across devices and look inconsistent.

Replace all emoji with:
- Image tags (`<img src="assets/images/...">`) for characters/creatures
- CSS-styled text badges (gold/colored divs) for numbers and labels
- Unicode text symbols are OK for: arrows (→), bullets, decorative typography

Check for emojis: scan the output for any character outside ASCII range 32–126 in HTML content.
Exception: Google Fonts icon characters are acceptable if explicitly requested.

---

## STEP 8: Mobile-first layout requirements

**D-pad always visible, no scrolling required:**

The game page layout must ensure the D-pad controls are ALWAYS visible on screen without
any scrolling. Use a fixed-height viewport layout:

```
┌─────────────────────┐  ← 100vh game page
│  Game header/HUD    │  ← ~60px
│  ─────────────────  │
│                     │
│      MAZE GRID      │  ← flexible, fills remaining space
│                     │
│  ─────────────────  │
│   D-PAD CONTROLS    │  ← fixed ~160px at bottom
└─────────────────────┘
```

The maze grid should scale DOWN to fit the remaining space after the header and controls
are allocated. Use CSS flex + overflow hidden on the game page.

**Touch target sizes**: All D-pad buttons must be at minimum 54×54px on mobile.

**iOS Safari**: Always include these in `<style>`:
```css
* { -webkit-tap-highlight-color: transparent; }
body { -webkit-text-size-adjust: 100%; }
input, button { font-size: 16px; } /* Prevents iOS auto-zoom on input focus */
```

**Cross-device testing targets**:
- iPhone SE (375px width, smallest modern iPhone)
- iPhone 14 Pro (393px width)
- iPad (768px width)
- Windows desktop Chrome (1024px+)
- Mac desktop Safari (1024px+)
- Android phone (360px width)

---

## STEP 9: Visual / audio standards

**Images available in `assets/images/`**:
- `moses in basket.png` — player (use ONLY this, never `color moses 3 new.png`)
- `newest princess.png` — finish
- `star 7.png` — checkpoints
- `black bomb.png` — bomb obstacles
- `color croc 5.png`, `shark 7.png`, `octopus 5.png`, `squid 5.png`,
  `crab 5.png`, `orange lobster.png`, `fish 7.png`, `big snake.png` — river creatures
- `new ocean.jpg` — water path background
- `logo 1.png` — Bible Explorer Kids shop logo (use on cover page)
- `wave 1.png`, `wave 2.png` — decorative wave images (light blue, use as pulsing accents)
- `moses in basket.png`, `newest princess.png` — cover page

**Audio in `assets/audio/`**:
- `bg music 2.mp3` — background loop (volume 0.22)
- `pop.mp3` — movement (volume 0.6)
- `magic button click 2.mp3` — button click
- `chime2.mp3` — checkpoint reached (volume 0.75)
- `success 4.mp3` — correct answer (volume 0.8)
- `error 3.mp3` — wrong answer (volume 0.8)
- `uh oh.mp3` — danger warning (volume 0.8)
- `water splash.mp3` — hitting obstacle (volume 0.75)
- `game over.mp3` — game over (volume 0.8)
- `win sound.mp3` + `success trumpet.mp3` — winning

**Wave images**: `wave 1.png` and `wave 2.png` are already light blue — do NOT apply
a `hue-rotate` / `sepia` filter (that's for making WHITE images blue). Use opacity only.

**Audio unlock pattern** (required for iOS/Android):
```javascript
let audioUnlocked = false;
document.addEventListener('touchstart', unlockAudio, { once: true });
document.addEventListener('click', unlockAudio, { once: true });
function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  bgMusic.volume = 0.22;
  bgMusic.play().catch(() => {});
}
```

---

## STEP 10: Modal animation standards (lively modals)

Both the danger and win modals must have movement. Static modals feel dull for kids.

### Danger modal — red design with shake + bouncing creature + pulsing rings + floating particles
```css
/* Entry shake */
@keyframes dangerShake {
    0%,100% { transform: translateX(0) rotate(0deg); }
    15%      { transform: translateX(-8px) rotate(-2deg); }
    30%      { transform: translateX(8px) rotate(2deg); }
    60%      { transform: translateX(6px) rotate(1deg); }
}
.danger-modal.active .modal-content { animation: dangerShake 0.55s ease-in-out; }

/* Pulsing rings inside danger-img-box */
@keyframes dangerRing {
    0%   { transform: scale(0.7); opacity: 0.8; }
    100% { transform: scale(1.9); opacity: 0; }
}
.danger-ring {
    position: absolute; width: 100%; height: 100%;
    border-radius: 50%; border: 4px solid rgba(255,200,0,0.6);
    top: 0; left: 0; animation: dangerRing 1.4s ease-out infinite;
}
.danger-ring:nth-child(2) { animation-delay: 0.7s; }

/* Creature bounce */
@keyframes dangerBounce {
    0%,100% { transform: scale(1) translateY(0); }
    25%     { transform: scale(1.12) translateY(-8px) rotate(-6deg); }
    50%     { transform: scale(0.95) translateY(4px) rotate(4deg); }
}
.danger-img-box img { animation: dangerBounce 1.6s ease-in-out infinite; position: relative; z-index: 1; }

/* Floating emoji particles at edges */
@keyframes floatDanger {
    0%,100% { transform: translateY(0) rotate(0deg); opacity: 0.9; }
    50%      { transform: translateY(-12px) rotate(15deg); opacity: 1; }
}
.danger-particles { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; overflow: hidden; }
.dp { position: absolute; font-size: 20px; animation: floatDanger ease-in-out infinite; }
/* Place 6 .dp spans at varying top/left/right positions with different durations */
```

### Danger modal HTML structure
```html
<div id="dangerModal" class="modal danger-modal">
    <div class="modal-content">
        <div class="danger-particles" aria-hidden="true">
            <span class="dp" style="top:8%;left:4%;animation-duration:2.1s;">💥</span>
            <span class="dp" style="top:12%;right:5%;animation-duration:2.6s;animation-delay:-0.8s;">⚠️</span>
            <span class="dp" style="top:70%;left:3%;animation-duration:2.3s;animation-delay:-1.2s;">🌊</span>
            <span class="dp" style="top:75%;right:4%;animation-duration:1.9s;animation-delay:-0.4s;">💦</span>
            <span class="dp" style="top:42%;left:2%;animation-duration:2.8s;animation-delay:-1.7s;">😱</span>
            <span class="dp" style="top:45%;right:3%;animation-duration:2.4s;animation-delay:-0.6s;">🔥</span>
        </div>
        <div class="danger-title">💥 Moses Hit an Obstacle! 💥</div>
        <div class="danger-message" id="dangerMessage"></div>
        <div class="danger-img-box" style="position:relative;">
            <div class="danger-ring"></div>
            <div class="danger-ring"></div>
            <img id="dangerImage" src="" alt="Danger">
        </div>
        <div class="danger-better-luck">Better Luck Next Time!</div>
        <button class="modal-button" onclick="closeDangerModal()">↩️ Try Again from Start</button>
    </div>
</div>
```

### Win modal — purple design with rising stars + floating princess + sparkles + glowing title
```css
@keyframes winTitlePop {
    0%,100% { transform: scale(1); text-shadow: 0 0 20px rgba(255,215,0,0.7); }
    50%      { transform: scale(1.08); text-shadow: 0 0 60px rgba(255,215,0,1); }
}
@keyframes winStar {
    0%   { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
    100% { transform: translateY(-120px) rotate(360deg) scale(0.3); opacity: 0; }
}
@keyframes princessFloat {
    0%,100% { transform: translateY(0) scale(1); }
    50%      { transform: translateY(-10px) scale(1.05); }
}
@keyframes winSparkle {
    0%,100% { opacity: 0; transform: scale(0); }
    50%      { opacity: 1; transform: scale(1.2) rotate(180deg); }
}
@keyframes winRingPulse {
    0%,100% { box-shadow: 0 0 20px rgba(255,215,0,0.4); }
    50%      { box-shadow: 0 0 40px rgba(255,215,0,0.9), 0 0 60px rgba(255,215,0,0.4); }
}
.win-title { animation: winTitlePop 1.8s ease-in-out infinite; display: inline-block; }
.princess-img-box { animation: winRingPulse 2s ease-in-out infinite; position: relative; }
.princess-img-box img { animation: princessFloat 2.4s ease-in-out infinite; }

/* 6 rising stars + 4 gold sparkle dots inside .win-stars-bg overlay */
.win-stars-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; overflow: hidden; }
.ws { position: absolute; font-size: 18px; animation: winStar linear infinite; bottom: 0; }
.win-sparkle { position: absolute; width: 10px; height: 10px; background: #FFD700; border-radius: 50%; animation: winSparkle ease-in-out infinite; }
```

---

## STEP 11: Etsy/QR code delivery checklist

Before marking any game done:
- [ ] All asset paths are relative (`assets/images/...`) with spaces URL-encoded (`%20`)
- [ ] No emojis anywhere in gameplay HTML
- [ ] Copyright header present in `<script>` block
- [ ] Keyboard listener de-duplicated on restart
- [ ] Maze responsive (no fixed pixel grid widths)
- [ ] D-pad visible without scrolling on 375px phone screen
- [ ] D-pad buttons use `width: 100%` inside `1fr 1fr 1fr` grid (no explicit px widths)
- [ ] Action buttons use fixed height (48px) + `justify-content: space-evenly` — not `flex:1`
- [ ] Swipe gestures implemented
- [ ] Modal content scrollable (`overflow-y: auto`)
- [ ] Cover page scrollable on small phones
- [ ] Cover page decorative waves use zero-height anchors (not fixed/absolute)
- [ ] Puzzle modal has "Exit to Main Menu" button
- [ ] Danger modal shows CORRECT creature image+message for obstacle hit
- [ ] Danger modal has red gradient, pulsing rings, bouncing creature, floating particles
- [ ] Win modal has rising stars, floating princess, sparkle dots, glowing title
- [ ] Difficulty selection REQUIRED before game start (validation + hint message)
- [ ] START outer label uses show-before-measure pattern for correct first-load position
- [ ] Start cell shows ocean background after Moses moves away (start-vacated class)
- [ ] Fuzzy answer matching implemented
- [ ] Questions randomly selected from difficulty-appropriate pool
- [ ] No `alert()` calls anywhere
- [ ] Audio plays (or gracefully skips if browser blocks)
- [ ] Win modal shows score, checkpoints, achievement level
- [ ] Game restarts cleanly without page refresh
- [ ] Works on iPhone SE (375px), Android (360px), iPad (768px), desktop

---

## STEP 12: Cell type reference for maze arrays

- `0` = river danger creature (random from riverDangers array)
- `1` = safe water path
- `2` = start position
- `3–12` = checkpoints 1–10
- `13` = finish (princess)
- `14` = bomb obstacle

Maze must be validated: path from 2 → 3 → 4 → ... → 12 → 13 must be walkable by adjacency.

---

## STEP 13: GitHub Pages deployment

### Folder structure for the repo
```
repository-root/         ← push the game/ folder contents as repo root
├── index.html           ← Game 1 (Baby Moses River Adventure)
├── assets/
│   ├── images/
│   └── audio/
└── pharaoh-escape/      ← Game 2 subfolder (when ready)
    └── index.html
```

### Filenames with spaces
GitHub handles filenames with spaces, but HTML must URL-encode them:
```html
<img src="assets/images/moses%20in%20basket.png">
<audio src="assets/audio/bg%20music%202.mp3">
```

### Deploy steps (command line)
```bash
cd game/   # the folder containing index.html
git init
git add .
git commit -m "Initial deploy: Baby Moses River Adventure"
git branch -M main
git remote add origin https://github.com/USERNAME/REPONAME.git
git push -u origin main
```
Then on GitHub: **Settings → Pages → Source: Deploy from branch → Branch: main / (root) → Save**

### Deploy via GitHub web UI (no command line needed)
1. github.com → New repository → name it (e.g. `bible-explorer-kids`)
2. Upload files: drag-and-drop `index.html` and the `assets/` folder
3. Settings → Pages → Source: main branch → Save
4. Wait ~2 min for: `https://USERNAME.github.io/bible-explorer-kids/`

### QR code generation
After the game is live, generate the QR code at: https://goqr.me or https://qr-code-generator.com
- URL: `https://USERNAME.github.io/REPONAME/`
- Size: at least 300×300px for print
- Error correction level: **H (High)** — survives up to 30% damage, best for print
- Format: PNG for digital embed, SVG for large-format print
