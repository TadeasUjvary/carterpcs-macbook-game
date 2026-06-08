/* ==========================================================================
   GAME CONFIGURATION & CONSTANTS
   ========================================================================== */
const LOGIC_WIDTH = 800;
const LOGIC_HEIGHT = 500;

// Game states
const STATE_INTRO = 'INTRO';
const STATE_PLAYING = 'PLAYING';
const STATE_GAMEOVER = 'GAMEOVER';
const STATE_VICTORY = 'VICTORY';

// Item catalog definition
const ITEM_TYPES = {
  MACBOOK: { emoji: '💻', points: 100, isGood: true, color: '#ffd700', speedMult: 0.9, size: 34 },
  KEYBOARD: { emoji: '⌨️', points: 50, isGood: true, color: '#9d4edd', speedMult: 1.1, size: 30 },
  CABLE: { emoji: '🔌', points: 30, isGood: true, color: '#00f2fe', speedMult: 1.0, size: 24 },
  WATER: { emoji: '💧', points: -20, isGood: false, color: '#0055ff', speedMult: 1.2, size: 20 },
  IMPOSTER: { emoji: '🤡', points: -100, isGood: false, color: '#ff0055', speedMult: 1.3, size: 32 },
  UPDATE: { emoji: '🔄', points: 0, isGood: false, color: '#ff9500', speedMult: 0.8, size: 28 }
};

const TIKTOK_USERNAMES = [
  'potato_coder', 'gaming_lord42', 'setup_critic', 'cz_dev_guy',
  'carterpcs_fanboy', 'tech_guy_dave', 'linus_helper', 'mechanical_clack',
  'wfh_survivor', 'apple_enthusiast', 'android_soldier', 'tiktok_scroller'
];

const TIKTOK_COMMENTS = {
  start: [
    "Bro spent $10 in hosting fees to ask for a laptop 💀",
    "Carter, look at this high-effort begging",
    "POV: You could have gotten a part-time job instead of coding this",
    "Will Carter actually watch a 3-minute video on this? Doubt it",
    "Czechoslovakia coding on a potato in 2026"
  ],
  catchMacbook: [
    "Catching M3 like he catches basic human needs",
    "Wow, virtual pixels. Still coding on a toaster though",
    "Clout multiplier increased",
    "Carter, he caught the laptop. Send it!"
  ],
  catchGood: [
    "Keyboard detected. Clack clack clack.",
    "Caught cable. Hopefully it's not a fire hazard.",
    "More digital junk caught +50",
    "Score goes up, electric bill goes up too"
  ],
  hitWater: [
    "Liquid damage warranty voided. Typical.",
    "RIP keyboard. Go dry it in a bag of rice.",
    "Wet mechanical switches sound even worse now",
    "Combo reset... cry about it"
  ],
  hitImposter: [
    "Hit a fake Carter. Imagine falling for internet bots.",
    "Stole your clout. Red flags everywhere.",
    "Get baited, bro.",
    "-100 points. Clout deficit."
  ],
  hitUpdate: [
    "Windows Update. Classic micro-soft torture.",
    "Catcher frozen. Go grab a coffee during reboot.",
    "BSOD freeze, should have used Linux 🐧"
  ],
  highCombo: [
    "Combo streak. Go touch some grass.",
    "Wasting electric bills like a pro.",
    "Bro's keyboard is screaming right now",
    "Czech developer trying not to code on a potato (impossible)"
  ],
  win: [
    "1000 points. Go put this on your resume under 'unemployed achievements'.",
    "Carter, buy him a MacBook. We've suffered enough.",
    "Time to copy the text and spam Carter's comments."
  ]
};

/* ==========================================================================
   AUDIO SYNTHESIZER (Web Audio API)
   ========================================================================== */
class SoundManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playScore() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playPowerUp() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(250, now);
    osc.frequency.linearRampToValueAtTime(900, now + 0.25);
    
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.28);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(now + 0.28);
  }

  playHit() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.linearRampToValueAtTime(40, now + 0.18);
    
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(now + 0.2);
  }

  playFreeze() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.setValueAtTime(70, now + 0.15);
    
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(now + 0.35);
  }

  playVictory() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    
    const now = this.ctx.currentTime;
    const notes = [130.81, 164.81, 196.00, 261.63, 329.63, 392.00, 523.25]; // Low C arpeggio
    
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      
      gain.gain.setValueAtTime(0.08, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.01, now + idx * 0.08 + 0.25);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.3);
    });
  }
}

const sound = new SoundManager();

/* ==========================================================================
   PARTICLE EFFECT SYSTEM (FLAT COLOR BLOCKS)
   ========================================================================== */
class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.vx = (Math.random() - 0.5) * 6;
    this.vy = (Math.random() - 0.5) * 6 - 2;
    this.alpha = 1.0;
    this.size = Math.random() * 3 + 1.5;
    this.decay = Math.random() * 0.04 + 0.03;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.12; // gravity
    this.alpha -= this.decay;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size); // Flat square pixels
    ctx.restore();
  }
}

/* ==========================================================================
   FALLING ITEMS CLASS
   ========================================================================== */
class FallingItem {
  constructor() {
    this.reset();
    this.y = -50;
  }

  reset() {
    this.x = Math.random() * (LOGIC_WIDTH - 80) + 40;
    this.y = -40;
    
    // Choose item type
    const rand = Math.random();
    if (rand < 0.20) {
      this.type = ITEM_TYPES.MACBOOK;
    } else if (rand < 0.40) {
      this.type = ITEM_TYPES.KEYBOARD;
    } else if (rand < 0.65) {
      this.type = ITEM_TYPES.CABLE;
    } else if (rand < 0.80) {
      this.type = ITEM_TYPES.WATER;
    } else if (rand < 0.92) {
      this.type = ITEM_TYPES.IMPOSTER;
    } else {
      this.type = ITEM_TYPES.UPDATE;
    }

    const baseSpeed = Math.random() * 2.5 + 2.5;
    this.speed = baseSpeed * this.type.speedMult;
    this.vx = (Math.random() - 0.5) * 1.5;
    
    this.angle = 0;
    this.spinSpeed = (Math.random() - 0.5) * 0.04;
  }

  update(speedMultiplier) {
    this.y += this.speed * speedMultiplier;
    this.x += this.vx;
    this.angle += this.spinSpeed;

    if (this.x < 20 || this.x > LOGIC_WIDTH - 20) {
      this.vx = -this.vx;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Flat rendering, no shadowBlur shadows
    ctx.font = `${this.type.size}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.type.emoji, 0, 0);

    ctx.restore();
  }
}

/* ==========================================================================
   THE KEYBOARD CATCHER CLASS
   ========================================================================== */
class Catcher {
  constructor() {
    this.width = 110;
    this.height = 24;
    this.x = LOGIC_WIDTH / 2;
    this.y = LOGIC_HEIGHT - 40;
    this.speed = 9;
    
    this.freezeTimer = 0;
    this.slowTimer = 0;
  }

  update(keys, targetX) {
    if (this.freezeTimer > 0) {
      this.freezeTimer--;
      return;
    }

    if (this.slowTimer > 0) {
      this.slowTimer--;
    }

    let currentSpeed = this.speed;
    if (this.slowTimer > 0) {
      currentSpeed = this.speed * 0.45;
    }

    if (keys['ArrowLeft'] || keys['a']) {
      this.x -= currentSpeed;
    }
    if (keys['ArrowRight'] || keys['d']) {
      this.x += currentSpeed;
    }

    if (targetX !== null) {
      const dx = targetX - this.x;
      this.x += dx * 0.25;
    }

    const halfW = this.width / 2;
    if (this.x < halfW + 10) this.x = halfW + 10;
    if (this.x > LOGIC_WIDTH - halfW - 10) this.x = LOGIC_WIDTH - halfW - 10;
  }

  draw(ctx) {
    const isFrozen = this.freezeTimer > 0;
    const isSlowed = this.slowTimer > 0;
    
    ctx.save();
    ctx.translate(this.x - this.width / 2, this.y);

    // Flat box borders, no radial glow
    ctx.lineWidth = 1;
    if (isFrozen) {
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#3b82f6';
    } else if (isSlowed) {
      ctx.fillStyle = '#18181b';
      ctx.strokeStyle = '#60a5fa';
    } else {
      ctx.fillStyle = '#18181b';
      ctx.strokeStyle = '#52525b';
    }

    ctx.beginPath();
    ctx.roundRect(0, 0, this.width, this.height, 4);
    ctx.fill();
    ctx.stroke();

    // Draw simple flat keycap blocks
    const cols = 5;
    const keyWidth = (this.width - 12) / cols;
    const keyHeight = this.height - 8;
    
    for (let i = 0; i < cols; i++) {
      if (isFrozen) {
        ctx.fillStyle = '#2563eb';
      } else if (isSlowed) {
        ctx.fillStyle = '#1d4ed8';
      } else {
        ctx.fillStyle = '#27272a';
      }
      ctx.fillRect(6 + i * keyWidth + 1, 4, keyWidth - 2, keyHeight);
    }

    // Label Badge
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px Share Tech Mono';
    ctx.textAlign = 'center';
    
    let label = 'POTATO CATCHER';
    if (isFrozen) label = 'SYS ERROR 🔄';
    else if (isSlowed) label = 'POTATO IS WET 💧';
    
    ctx.fillText(label, this.width / 2, this.height - 7);

    // The Potato Emoji on top
    ctx.font = '20px Arial';
    ctx.fillText('🥔', this.width / 2, -8);

    ctx.restore();
  }
}

/* ==========================================================================
   GAME MAIN CONTROLLER
   ========================================================================== */
class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    
    this.state = STATE_INTRO;
    this.score = 0;
    this.comboCount = 0;
    this.comboMultiplier = 1.0;
    
    this.catcher = new Catcher();
    this.items = [];
    this.particles = [];
    
    this.keys = {};
    this.targetX = null;
    
    this.gameSpeedMultiplier = 1.0;
    this.spawnInterval = 75;
    this.frameCount = 0;
    
    this.screenShakeTime = 0;
    this.screenShakeIntensity = 0;
    this.animationFrameId = null; // Stored to prevent concurrent runs

    this.setupListeners();
    this.setupTicker();
  }

  setupListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
    });
    
    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });

    const getCanvasMouseX = (clientX) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = LOGIC_WIDTH / rect.width;
      return (clientX - rect.left) * scaleX;
    };

    const handleMove = (clientX) => {
      if (this.state === STATE_PLAYING) {
        this.targetX = getCanvasMouseX(clientX);
      }
    };

    this.canvas.addEventListener('mousemove', (e) => handleMove(e.clientX));
    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        handleMove(e.touches[0].clientX);
      }
      e.preventDefault();
    }, { passive: false });

    this.canvas.addEventListener('mouseleave', () => { this.targetX = null; });
    this.canvas.addEventListener('touchend', () => { this.targetX = null; });

    // Sound toggle
    const muteBtn = document.getElementById('mute-btn');
    muteBtn.addEventListener('click', () => {
      sound.isMuted = !sound.isMuted;
      muteBtn.textContent = sound.isMuted ? '🔇 Muted' : '🔊 Sound';
      muteBtn.blur();
    });

    // Exit Game button (Fixes menu navigation)
    const exitBtn = document.getElementById('exit-game-btn');
    exitBtn.addEventListener('click', () => {
      this.resetToMenu();
    });
  }

  setupTicker() {
    this.tickerWrapper = document.getElementById('ticker-messages');
  }

  addTickerComment(category) {
    const list = TIKTOK_COMMENTS[category];
    if (!list) return;

    const username = TIKTOK_USERNAMES[Math.floor(Math.random() * TIKTOK_USERNAMES.length)];
    const messageText = list[Math.floor(Math.random() * list.length)];
    
    const commentHtml = `<div class="ticker-log">&gt; <span class="username">@${username}</span>: ${messageText}</div>`;
    
    this.tickerWrapper.innerHTML = commentHtml + this.tickerWrapper.innerHTML;
    
    if (this.tickerWrapper.children.length > 3) {
      this.tickerWrapper.removeChild(this.tickerWrapper.lastChild);
    }
  }

  triggerScreenShake(intensity, duration) {
    this.screenShakeIntensity = intensity;
    this.screenShakeTime = duration;
  }

  start() {
    // Prevent multiple active loops
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.state = STATE_PLAYING;
    this.score = 0;
    this.comboCount = 0;
    this.comboMultiplier = 1.0;
    this.catcher = new Catcher();
    this.items = [];
    this.particles = [];
    this.frameCount = 0;
    this.gameSpeedMultiplier = 1.0;
    this.spawnInterval = 75;
    
    sound.init();
    
    document.getElementById('intro-screen').classList.remove('active');
    document.getElementById('game-screen').classList.add('active');

    this.tickerWrapper.innerHTML = '';
    this.addTickerComment('start');

    this.loop();
  }

  resetToMenu() {
    // 1. Cancel the active loop
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // 2. Clear state variables
    this.state = STATE_INTRO;
    this.items = [];
    this.particles = [];
    this.score = 0;
    this.comboCount = 0;
    this.comboMultiplier = 1.0;

    // 3. Toggle DOM visibility
    document.getElementById('game-screen').classList.remove('active');
    document.getElementById('intro-screen').classList.add('active');
  }

  spawnItems() {
    this.frameCount++;
    
    if (this.frameCount % 450 === 0) {
      this.gameSpeedMultiplier += 0.08;
      this.spawnInterval = Math.max(35, this.spawnInterval - 5);
    }

    if (this.frameCount % this.spawnInterval === 0) {
      this.items.push(new FallingItem());
    }
  }

  update() {
    if (this.screenShakeTime > 0) {
      this.screenShakeTime--;
    }

    this.catcher.update(this.keys, this.targetX);

    // Particles update
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      if (this.particles[i].alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Falling items update & collision
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      item.update(this.gameSpeedMultiplier);

      if (item.y > LOGIC_HEIGHT + 20) {
        if (item.type === ITEM_TYPES.MACBOOK) {
          this.comboCount = 0;
          this.comboMultiplier = 1.0;
          this.updateHUD();
          this.addTickerComment('hitWater');
        }
        this.items.splice(i, 1);
        continue;
      }

      const catcherHalfW = this.catcher.width / 2;
      const collisionDistanceX = Math.abs(item.x - this.catcher.x);
      const collisionY = item.y + item.type.size / 2 >= this.catcher.y &&
                         item.y - item.type.size / 2 <= this.catcher.y + this.catcher.height;

      if (collisionDistanceX < catcherHalfW + 8 && collisionY) {
        this.handleCatch(item);
        this.items.splice(i, 1);
      }
    }

    if (this.score >= 1000 && this.state !== STATE_VICTORY) {
      this.winGame();
    }
  }

  handleCatch(item) {
    for (let p = 0; p < 8; p++) {
      this.particles.push(new Particle(item.x, item.y, item.type.color));
    }

    if (item.type.isGood) {
      this.comboCount++;
      this.comboMultiplier = Math.min(4.0, 1.0 + Math.floor(this.comboCount / 4) * 0.5);
      
      const earned = Math.round(item.type.points * this.comboMultiplier);
      this.score += earned;

      if (item.type === ITEM_TYPES.KEYBOARD) {
        this.catcher.slowTimer = 0;
        sound.playPowerUp();
        this.addTickerComment('catchGood');
      } else if (item.type === ITEM_TYPES.MACBOOK) {
        sound.playPowerUp();
        this.triggerScreenShake(6, 12);
        this.addTickerComment('catchMacbook');
      } else {
        sound.playScore();
      }

      if (this.comboCount > 0 && this.comboCount % 6 === 0) {
        this.addTickerComment('highCombo');
      }

    } else {
      this.comboCount = 0;
      this.comboMultiplier = 1.0;
      
      this.score = Math.max(0, this.score + item.type.points);
      this.triggerScreenShake(10, 16);

      if (item.type === ITEM_TYPES.WATER) {
        this.catcher.slowTimer = 180;
        sound.playHit();
        this.addTickerComment('hitWater');
      } else if (item.type === ITEM_TYPES.IMPOSTER) {
        sound.playHit();
        this.addTickerComment('hitImposter');
      } else if (item.type === ITEM_TYPES.UPDATE) {
        this.catcher.freezeTimer = 90;
        sound.playFreeze();
        this.addTickerComment('hitUpdate');
      }
    }

    this.updateHUD();
  }

  updateHUD() {
    document.getElementById('game-score').textContent = String(this.score).padStart(4, '0');
    document.getElementById('game-combo').textContent = `${this.comboMultiplier.toFixed(1)}x`;
  }

  draw() {
    this.ctx.save();
    
    if (this.screenShakeTime > 0) {
      const dx = (Math.random() - 0.5) * this.screenShakeIntensity;
      const dy = (Math.random() - 0.5) * this.screenShakeIntensity;
      this.ctx.translate(dx, dy);
    }

    // Flat solid canvas background
    this.ctx.fillStyle = '#0a0a0c';
    this.ctx.fillRect(0, 0, LOGIC_WIDTH, LOGIC_HEIGHT);

    // Draw subtle grid lines (very faint)
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    this.ctx.lineWidth = 1;
    for (let x = 0; x < LOGIC_WIDTH; x += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, LOGIC_HEIGHT);
      this.ctx.stroke();
    }

    // Draw entities (without drop shadows)
    this.catcher.draw(this.ctx);
    this.items.forEach(item => item.draw(this.ctx));
    this.particles.forEach(p => p.draw(this.ctx));

    // Freeze overlay
    if (this.catcher.freezeTimer > 0) {
      this.ctx.fillStyle = 'rgba(255, 149, 0, 0.12)'; // Orange BSOD tint
      this.ctx.fillRect(0, 0, LOGIC_WIDTH, LOGIC_HEIGHT);
      
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = '22px Share Tech Mono';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('🔄 WINDOWS IS FORCING AN UPDATE...', LOGIC_WIDTH / 2, LOGIC_HEIGHT / 2 - 15);
      
      this.ctx.font = '13px Share Tech Mono';
      this.ctx.fillStyle = '#a1a1aa';
      this.ctx.fillText(`Catcher locked: ${(this.catcher.freezeTimer / 60).toFixed(1)}s`, LOGIC_WIDTH / 2, LOGIC_HEIGHT / 2 + 15);
    }

    this.ctx.restore();
  }

  loop() {
    if (this.state !== STATE_PLAYING) return;

    this.update();
    this.draw();
    this.spawnItems();

    this.animationFrameId = requestAnimationFrame(() => this.loop());
  }

  winGame() {
    this.state = STATE_VICTORY;
    sound.playVictory();
    this.addTickerComment('win');

    const certCodeVal = `MCB-${Math.floor(Math.random() * 900 + 100)}-${TIKTOK_USERNAMES[Math.floor(Math.random() * TIKTOK_USERNAMES.length)].toUpperCase().substring(0, 4)}`;
    document.getElementById('cert-code').textContent = certCodeVal;
    document.getElementById('cert-score').textContent = this.score;

    const shareUrl = window.location.href.split('?')[0];
    const copyTextarea = document.getElementById('copy-text');
    copyTextarea.value = `Hey @carterpcs! I spent 6 hours writing a custom game on my potato to petition you for a MacBook. I scored ${this.score} pts! Play it here: ${shareUrl} Do I get an upgrade? 💻 (Verification: ${certCodeVal})`;

    const tweetLink = document.getElementById('twitter-share-link');
    const tweetText = encodeURIComponent(`Yo @carterpcs! I built a custom game on a potato because I need a MacBook. Play here: ${shareUrl}`);
    tweetLink.href = `https://twitter.com/intent/tweet?text=${tweetText}`;

    const modal = document.getElementById('victory-modal');
    modal.showModal();
  }
}

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();

  const startBtn = document.getElementById('start-game-btn');
  startBtn.addEventListener('click', () => {
    game.start();
  });

  const restartBtn = document.getElementById('restart-game-btn');
  const modal = document.getElementById('victory-modal');
  restartBtn.addEventListener('click', () => {
    modal.close();
    game.start();
  });

  const copyBtn = document.getElementById('copy-btn');
  const copyBtnText = document.getElementById('copy-btn-text');
  const copyTextarea = document.getElementById('copy-text');

  copyBtn.addEventListener('click', () => {
    copyTextarea.select();
    copyTextarea.setSelectionRange(0, 99999);
    
    navigator.clipboard.writeText(copyTextarea.value).then(() => {
      copyBtnText.textContent = 'Copied! ✅';
      setTimeout(() => {
        copyBtnText.textContent = 'Copy Text 📋';
      }, 2000);
    }).catch(err => {
      console.error('Copy failed: ', err);
    });
  });
});
