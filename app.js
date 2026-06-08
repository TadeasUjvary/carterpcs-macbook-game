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
  MACBOOK: { emoji: '💻', points: 100, isGood: true, color: '#ffd700', speedMult: 0.9, size: 35 },
  KEYBOARD: { emoji: '⌨️', points: 50, isGood: true, color: '#9d4edd', speedMult: 1.1, size: 30 },
  CABLE: { emoji: '🔌', points: 30, isGood: true, color: '#00f2fe', speedMult: 1.0, size: 25 },
  WATER: { emoji: '💧', points: -20, isGood: false, color: '#0055ff', speedMult: 1.2, size: 20 },
  IMPOSTER: { emoji: '🤡', points: -100, isGood: false, color: '#ff0055', speedMult: 1.3, size: 32 },
  UPDATE: { emoji: '🔄', points: 0, isGood: false, color: '#ffb703', speedMult: 0.8, size: 30 }
};

const TIKTOK_USERNAMES = [
  'potato_coder', 'gaming_lord42', 'setup_critic', 'cz_dev_guy',
  'carterpcs_fanboy', 'tech_guy_dave', 'linus_helper', 'mechanical_clack',
  'wfh_survivor', 'apple_enthusiast', 'android_soldier', 'tiktok_scroller'
];

const TIKTOK_COMMENTS = {
  start: [
    "Bro is running a whole game for a laptop 💀",
    "Carter is shaking right now",
    "POV: begging Carter at 3 AM",
    "Will Carter actually see this?",
    "Nice CSS by the way!"
  ],
  catchMacbook: [
    "OMG is that an M3 Max?! 🤯",
    "SHEEEESH, MacBook caught!",
    "He's getting closer to the laptop",
    "Wait, that's +100 points!"
  ],
  catchGood: [
    "Smooth catch!",
    "RGB keyboard acquired +50",
    "Nice cable management",
    "Multiplier is going up!"
  ],
  hitWater: [
    "Liquid damage warranty voided 💧",
    "R.I.P. keyboard! 💀",
    "Put the keyboard in rice, quick!",
    "Combo reset... ouch."
  ],
  hitImposter: [
    "Wait, that's not CarterPCs! 🤡",
    "Fake Carter stole your points",
    "Get baited, red flag!"
  ],
  hitUpdate: [
    "Windows is updating, typical 😂",
    "Catcher frozen! Hit Ctrl+Alt+Del!",
    "Restarting system... 1.5s freeze"
  ],
  highCombo: [
    "Bro is cooking! ⚡",
    "Unstoppable keyboard warrior!",
    "Czech developer is built different",
    "Give this man a laptop already!"
  ],
  win: [
    "HE ACTUALLY GOT 1000 POINTS!",
    "Carter, buy him a MacBook!",
    "Legendary dedication",
    "We need to tag @carterpcs on TikTok now!"
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
    osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.1); // A5
    
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playPowerUp() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.3);
    
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(now + 0.35);
  }

  playHit() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(60, now + 0.2);
    
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(now + 0.25);
  }

  playFreeze() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.setValueAtTime(100, now + 0.1);
    osc.frequency.setValueAtTime(80, now + 0.2);
    
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(now + 0.4);
  }

  playVictory() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    
    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4, E4, G4, C5, E5, G5, C6
    
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      
      gain.gain.setValueAtTime(0.1, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.01, now + idx * 0.08 + 0.3);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.35);
    });
  }
}

const sound = new SoundManager();

/* ==========================================================================
   PARTICLE EFFECT SYSTEM
   ========================================================================== */
class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.vx = (Math.random() - 0.5) * 8;
    this.vy = (Math.random() - 0.5) * 8 - 3;
    this.alpha = 1.0;
    this.size = Math.random() * 4 + 2;
    this.decay = Math.random() * 0.03 + 0.02;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.1; // gravity
    this.alpha -= this.decay;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

/* ==========================================================================
   FALLING ITEMS CLASS
   ========================================================================== */
class FallingItem {
  constructor() {
    this.reset();
    // Start offscreen initially
    this.y = -50;
  }

  reset() {
    this.x = Math.random() * (LOGIC_WIDTH - 80) + 40;
    this.y = -40;
    
    // Choose item type with weighted probabilities
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

    // Dynamic speeds (faster over time)
    const baseSpeed = Math.random() * 2.5 + 2.5;
    this.speed = baseSpeed * this.type.speedMult;
    
    // Slight horizontal drift
    this.vx = (Math.random() - 0.5) * 1.5;
    
    // Spin angle
    this.angle = 0;
    this.spinSpeed = (Math.random() - 0.5) * 0.05;
  }

  update(speedMultiplier) {
    this.y += this.speed * speedMultiplier;
    this.x += this.vx;
    this.angle += this.spinSpeed;

    // Keep within bounds horizontally
    if (this.x < 20 || this.x > LOGIC_WIDTH - 20) {
      this.vx = -this.vx;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Glowing aura for important items
    if (this.type === ITEM_TYPES.MACBOOK) {
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ffd700';
    } else if (this.type.isGood) {
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.type.color;
    }

    // Draw Emoji icon
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
    this.width = 120;
    this.height = 30;
    this.x = LOGIC_WIDTH / 2;
    this.y = LOGIC_HEIGHT - 50;
    this.speed = 10;
    
    // Catcher status effects
    this.freezeTimer = 0;
    this.slowTimer = 0;
  }

  update(keys, targetX) {
    // 1. Handle Status Timers
    if (this.freezeTimer > 0) {
      this.freezeTimer--;
      return; // Catcher cannot move when frozen
    }

    if (this.slowTimer > 0) {
      this.slowTimer--;
    }

    // Calculate current speed
    let currentSpeed = this.speed;
    if (this.slowTimer > 0) {
      currentSpeed = this.speed * 0.45; // 55% slower
    }

    // 2. Keyboard Control
    if (keys['ArrowLeft'] || keys['a']) {
      this.x -= currentSpeed;
    }
    if (keys['ArrowRight'] || keys['d']) {
      this.x += currentSpeed;
    }

    // 3. Mouse/Touch Control (smooth transition to targeted coordinates)
    if (targetX !== null) {
      const dx = targetX - this.x;
      this.x += dx * 0.25; // Interpolate smooth tracking
    }

    // Keep catcher in canvas bounds
    const halfW = this.width / 2;
    if (this.x < halfW + 10) this.x = halfW + 10;
    if (this.x > LOGIC_WIDTH - halfW - 10) this.x = LOGIC_WIDTH - halfW - 10;
  }

  draw(ctx) {
    const isFrozen = this.freezeTimer > 0;
    const isSlowed = this.slowTimer > 0;
    
    ctx.save();
    ctx.translate(this.x - this.width / 2, this.y);

    // Glowing border effects based on status
    ctx.shadowBlur = 15;
    if (isFrozen) {
      ctx.shadowColor = '#0055ff'; // Frozen blue glow
      ctx.fillStyle = '#1e3a8a';
      ctx.strokeStyle = '#0055ff';
    } else if (isSlowed) {
      ctx.shadowColor = '#3b82f6';
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#60a5fa';
    } else {
      ctx.shadowColor = '#00f2fe'; // Tech cyan glow
      ctx.fillStyle = '#111827';
      ctx.strokeStyle = '#00f2fe';
    }

    // Draw glowing chassis box (representing a custom keyboard casing)
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(0, 0, this.width, this.height, 8);
    ctx.fill();
    ctx.stroke();

    // Draw decorative glowing keycaps inside catcher
    const cols = 6;
    const keyWidth = (this.width - 16) / cols;
    const keyHeight = this.height - 12;
    
    ctx.shadowBlur = 0; // disable heavy shadow for tiny keys
    for (let i = 0; i < cols; i++) {
      if (isFrozen) {
        ctx.fillStyle = '#3b82f6';
      } else {
        // RGB keycap color cycle effect
        const hue = (Date.now() / 15 + i * 40) % 360;
        ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.9)`;
      }
      ctx.beginPath();
      ctx.roundRect(8 + i * keyWidth + 1, 6, keyWidth - 2, keyHeight, 3);
      ctx.fill();
    }

    // Draw the Catcher Name badge
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px Share Tech Mono';
    ctx.textAlign = 'center';
    
    let label = 'CARTER CATCHER v1.0';
    if (isFrozen) label = 'SYSTEM CRASHED 🔄';
    else if (isSlowed) label = 'KEYBOARD DRYING 💧';
    
    ctx.fillText(label, this.width / 2, this.height - 6);

    // Draw the Potato on top if playing on a potato!
    ctx.font = '22px Arial';
    ctx.fillText('🥔', this.width / 2, -10);

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
    this.targetX = null; // tracking mouse/touch logic X coord
    
    this.gameSpeedMultiplier = 1.0;
    this.spawnInterval = 75; // frames between spawns
    this.frameCount = 0;
    
    this.screenShakeTime = 0;
    this.screenShakeIntensity = 0;

    this.setupListeners();
    this.setupTicker();
  }

  setupListeners() {
    // Keyboard inputs
    window.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
      if (e.key === ' ' && this.state === STATE_INTRO) {
        this.start();
      }
    });
    
    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });

    // Handle Mouse / Touch tracking inside canvas
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
      e.preventDefault(); // prevent scrolling while playing
    }, { passive: false });

    // Cancel mouse target control when cursor leaves canvas
    this.canvas.addEventListener('mouseleave', () => {
      this.targetX = null;
    });

    this.canvas.addEventListener('touchend', () => {
      this.targetX = null;
    });

    // Mute/Unmute audio button
    const muteBtn = document.getElementById('mute-btn');
    const muteIcon = document.getElementById('mute-icon');
    
    muteBtn.addEventListener('click', () => {
      sound.isMuted = !sound.isMuted;
      muteIcon.textContent = sound.isMuted ? '🔇' : '🔊';
      muteBtn.blur(); // remove keyboard focus outline
    });
  }

  setupTicker() {
    this.tickerWrapper = document.getElementById('ticker-messages');
    this.activeComments = [];
  }

  addTickerComment(category) {
    const list = TIKTOK_COMMENTS[category];
    if (!list) return;

    const username = TIKTOK_USERNAMES[Math.floor(Math.random() * TIKTOK_USERNAMES.length)];
    const messageText = list[Math.floor(Math.random() * list.length)];
    
    const commentHtml = `<div class="ticker-message"><span class="username">@${username}:</span>${messageText}</div>`;
    
    this.tickerWrapper.innerHTML = commentHtml + this.tickerWrapper.innerHTML;
    
    // Prune ticker items to prevent memory bloat
    if (this.tickerWrapper.children.length > 5) {
      this.tickerWrapper.removeChild(this.tickerWrapper.lastChild);
    }
  }

  triggerScreenShake(intensity, duration) {
    this.screenShakeIntensity = intensity;
    this.screenShakeTime = duration;
  }

  start() {
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
    
    // Switch screens in DOM
    document.getElementById('intro-screen').classList.remove('active');
    document.getElementById('game-screen').classList.add('active');

    // Display initial ticker messages
    this.tickerWrapper.innerHTML = '';
    this.addTickerComment('start');
    setTimeout(() => this.addTickerComment('start'), 1500);

    // Trigger game loop
    this.loop();
  }

  spawnItems() {
    this.frameCount++;
    
    // Progressively increase game speed and spawn rates
    if (this.frameCount % 500 === 0) {
      this.gameSpeedMultiplier += 0.08;
      this.spawnInterval = Math.max(38, this.spawnInterval - 4);
    }

    if (this.frameCount % this.spawnInterval === 0) {
      this.items.push(new FallingItem());
    }
  }

  update() {
    // Apply screen shake decay
    if (this.screenShakeTime > 0) {
      this.screenShakeTime--;
    }

    // Update Catcher
    this.catcher.update(this.keys, this.targetX);

    // Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      if (this.particles[i].alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Update Falling Items and Check Collisions
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      item.update(this.gameSpeedMultiplier);

      // Check boundary collision at bottom
      if (item.y > LOGIC_HEIGHT + 20) {
        // Punish player if they let a MacBook hit the ground!
        if (item.type === ITEM_TYPES.MACBOOK) {
          this.comboCount = 0;
          this.comboMultiplier = 1.0;
          this.updateHUD();
          this.addTickerComment('hitWater'); // general tragedy comment
        }
        this.items.splice(i, 1);
        continue;
      }

      // Check collision with the Catcher
      const catcherHalfW = this.catcher.width / 2;
      const collisionDistanceX = Math.abs(item.x - this.catcher.x);
      const collisionY = item.y + item.type.size / 2 >= this.catcher.y &&
                         item.y - item.type.size / 2 <= this.catcher.y + this.catcher.height;

      if (collisionDistanceX < catcherHalfW + 10 && collisionY) {
        // COLLISION DETECTED!
        this.handleCatch(item);
        this.items.splice(i, 1);
      }
    }

    // Check Win/Victory Condition
    if (this.score >= 1000 && this.state !== STATE_VICTORY) {
      this.winGame();
    }
  }

  handleCatch(item) {
    // 1. Spawn Particle Sparks
    for (let p = 0; p < 12; p++) {
      this.particles.push(new Particle(item.x, item.y, item.type.color));
    }

    // 2. Process Item Type Effects
    if (item.type.isGood) {
      // Catching MacBook/Keyboard/Cable
      this.comboCount++;
      // Increment combo multiplier every 4 catches, cap at 4x
      this.comboMultiplier = Math.min(4.0, 1.0 + Math.floor(this.comboCount / 4) * 0.5);
      
      const earned = Math.round(item.type.points * this.comboMultiplier);
      this.score += earned;

      // Special item effects
      if (item.type === ITEM_TYPES.KEYBOARD) {
        // Speed up catcher slow effect recovery, or act as speed boost
        this.catcher.slowTimer = 0;
        sound.playPowerUp();
        this.addTickerComment('catchGood');
      } else if (item.type === ITEM_TYPES.MACBOOK) {
        sound.playPowerUp();
        this.triggerScreenShake(8, 15);
        this.addTickerComment('catchMacbook');
      } else {
        sound.playScore();
      }

      // High combo chatter
      if (this.comboCount > 0 && this.comboCount % 8 === 0) {
        this.addTickerComment('highCombo');
      }

    } else {
      // Catching Bad Item (Water, Imposter, Update)
      this.comboCount = 0;
      this.comboMultiplier = 1.0;
      
      // Inflict penalty
      this.score = Math.max(0, this.score + item.type.points);
      this.triggerScreenShake(12, 20);

      if (item.type === ITEM_TYPES.WATER) {
        this.catcher.slowTimer = 200; // Slow down catcher for 200 frames
        sound.playHit();
        this.addTickerComment('hitWater');
      } else if (item.type === ITEM_TYPES.IMPOSTER) {
        sound.playHit();
        this.addTickerComment('hitImposter');
      } else if (item.type === ITEM_TYPES.UPDATE) {
        this.catcher.freezeTimer = 90; // Freeze catcher for 90 frames (1.5s)
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
    
    // Apply Screen Shake transformation if active
    if (this.screenShakeTime > 0) {
      const dx = (Math.random() - 0.5) * this.screenShakeIntensity;
      const dy = (Math.random() - 0.5) * this.screenShakeIntensity;
      this.ctx.translate(dx, dy);
    }

    // Clear Canvas and Draw Background Grid
    this.ctx.fillStyle = '#05070a';
    this.ctx.fillRect(0, 0, LOGIC_WIDTH, LOGIC_HEIGHT);

    // Canvas styling decoration (retro matrix vertical lines)
    this.ctx.strokeStyle = 'rgba(0, 242, 254, 0.02)';
    this.ctx.lineWidth = 1;
    for (let x = 0; x < LOGIC_WIDTH; x += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, LOGIC_HEIGHT);
      this.ctx.stroke();
    }

    // Draw Entities
    this.catcher.draw(this.ctx);
    
    this.items.forEach(item => item.draw(this.ctx));
    this.particles.forEach(p => p.draw(this.ctx));

    // Custom Canvas Overlays (BSOD Freeze text screen overlay)
    if (this.catcher.freezeTimer > 0) {
      this.ctx.fillStyle = 'rgba(0, 85, 255, 0.12)';
      this.ctx.fillRect(0, 0, LOGIC_WIDTH, LOGIC_HEIGHT);
      
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = '24px Share Tech Mono';
      this.ctx.textAlign = 'center';
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = '#0055ff';
      this.ctx.fillText('🔄 SYSTEM RUNNING WINDOWS UPDATE...', LOGIC_WIDTH / 2, LOGIC_HEIGHT / 2 - 20);
      
      this.ctx.font = '14px Share Tech Mono';
      this.ctx.fillStyle = '#94a3b8';
      this.ctx.fillText(`Catcher lock duration: ${(this.catcher.freezeTimer / 60).toFixed(1)}s`, LOGIC_WIDTH / 2, LOGIC_HEIGHT / 2 + 10);
    }

    this.ctx.restore();
  }

  loop() {
    if (this.state !== STATE_PLAYING) return;

    this.update();
    this.draw();
    this.spawnItems();

    requestAnimationFrame(() => this.loop());
  }

  winGame() {
    this.state = STATE_VICTORY;
    sound.playVictory();
    this.addTickerComment('win');

    // Generate Verification Certificate details
    const certCodeVal = `MCB-${Math.floor(Math.random() * 900 + 100)}-${TIKTOK_USERNAMES[Math.floor(Math.random() * TIKTOK_USERNAMES.length)].toUpperCase().substring(0, 4)}`;
    document.getElementById('cert-code').textContent = certCodeVal;
    document.getElementById('cert-score').textContent = this.score;

    // Craft custom petition clipboard text
    const shareUrl = window.location.href.split('?')[0]; // strip query parameters
    const copyTextarea = document.getElementById('copy-text');
    copyTextarea.value = `Yo @carterpcs! I was coding on a literal potato, so I built a whole interactive game to prove my dedication. I scored ${this.score} points! Check it out: ${shareUrl} Do I get a MacBook? 💻🔥 (Verification: ${certCodeVal})`;

    // Configure Twitter Web intent link
    const tweetLink = document.getElementById('twitter-share-link');
    const tweetText = encodeURIComponent(`Yo @carterpcs! I built a custom game because I'm coding on a potato. Can I get a MacBook? 💻🔥\nPlay it here: ${shareUrl}`);
    tweetLink.href = `https://twitter.com/intent/tweet?text=${tweetText}`;

    // Open Victory Modal using native dialog API
    const modal = document.getElementById('victory-modal');
    modal.showModal();
  }
}

/* ==========================================================================
   INITIALIZATION & PAGE LOAD
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();

  const startBtn = document.getElementById('start-game-btn');
  startBtn.addEventListener('click', () => {
    game.start();
  });

  // Dialog Restart button
  const restartBtn = document.getElementById('restart-game-btn');
  const modal = document.getElementById('victory-modal');
  restartBtn.addEventListener('click', () => {
    modal.close();
    game.start();
  });

  // Copy Clipboard Button
  const copyBtn = document.getElementById('copy-btn');
  const copyBtnText = document.getElementById('copy-btn-text');
  const copyTextarea = document.getElementById('copy-text');

  copyBtn.addEventListener('click', () => {
    copyTextarea.select();
    copyTextarea.setSelectionRange(0, 99999); // for mobile devices
    
    navigator.clipboard.writeText(copyTextarea.value).then(() => {
      copyBtnText.textContent = 'Copied! ✅';
      copyBtn.classList.add('green-pulse');
      setTimeout(() => {
        copyBtnText.textContent = 'Copy Pitch 📋';
        copyBtn.classList.remove('green-pulse');
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  });
});
