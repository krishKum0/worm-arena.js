
(function () {
  'use strict';

  const RESET_STYLE = {
    margin: '0',
    padding: '0',
    boxSizing: 'border-box',
    userSelect: 'none',
    webkitUserSelect: 'none',
    webkitTouchCallout: 'none',
    touchAction: 'none',
    overscrollBehavior: 'none',
  };

 
  
  function createElement(tag, style, parent, text, id) {
    const element = document.createElement(tag);
    Object.assign(element.style, RESET_STYLE, style || {});

    if (id) {
      element.id = id;
    }
    if (text !== undefined && text !== null) {
      element.textContent = text;
    }
    if (parent) {
      parent.appendChild(element);
    }
    return element;
  }

  function showElement(element, display) {
    element.style.display = display || 'block';
  }

  function hideElement(element) {
    element.style.display = 'none';
  }

 

  let body = document.body;
  if (!body) {
    body = document.createElement('body');
    document.documentElement.appendChild(body);
  }

  document.title = 'Worm Arena';

  const viewportMeta = document.createElement('meta');
  viewportMeta.name = 'viewport';
  viewportMeta.content =
    'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
  document.head.appendChild(viewportMeta);

  Object.assign(document.documentElement.style, {
    height: '100%',
    margin: '0',
    padding: '0',
    overscrollBehavior: 'none',
  });

  Object.assign(body.style, RESET_STYLE, {
    height: '100%',
    background: '#041a5c',
    overflow: 'hidden',
    fontFamily: "'Segoe UI', Arial, sans-serif",
    color: '#fff',
  });


 
  const canvas = createElement(
    'canvas',
    { display: 'block', position: 'absolute', top: '0', left: '0' },
    body,
    null,
    'gameCanvas'
  );
  const ctx = canvas.getContext('2d');


  const hud = createElement(
    'div',
    {
      position: 'absolute',
      top: '0',
      left: '0',
      pointerEvents: 'none',
      zIndex: '5',
      padding: '10px',
      display: 'none',
      flexDirection: 'column',
      gap: '8px',
    },
    body,
    null,
    'hud'
  );

  
  const leaderboardBox = createElement(
    'div',
    {
      minWidth: '200px',
      background: 'rgba(4, 10, 46, 0.55)',
      padding: '8px 12px',
      borderRadius: '6px',
      backdropFilter: 'blur(3px)',
    },
    hud
  );

  const leaderboardTitle = createElement(
    'div',
    { fontSize: '0.7rem', color: '#ffe98a', fontWeight: 'bold', marginBottom: '4px' },
    leaderboardBox,
    'TOP ROLLERS'
  );

  const leaderboardList = createElement('div', {}, leaderboardBox);

  // Rank badge
  const rankBadge = createElement(
    'div',
    {
      background: 'rgba(0, 0, 0, 0.5)',
      padding: '6px 12px',
      borderRadius: '8px',
      fontSize: '0.85rem',
      fontWeight: 'bold',
    },
    hud,
    'Rank #-'
  );

  
  const statsPanel = createElement(
    'div',
    {
      background: 'rgba(0, 0, 0, 0.5)',
      padding: '7px 12px',
      borderRadius: '8px',
      display: 'flex',
      gap: '16px',
      border: '1px solid rgba(255, 255, 255, 0.12)',
    },
    hud
  );

  function createStat(label, initialValue) {
    const block = createElement('div', {}, statsPanel);
    createElement('div', { fontSize: '0.65rem', color: '#aaaacc' }, block, label);
    return createElement(
      'div',
      { fontSize: '1.15rem', fontWeight: 'bold', color: '#4ade80' },
      block,
      initialValue
    );
  }

  const scoreValue = createStat('SCORE', '0');
  const lengthValue = createStat('LENGTH', '15');

 
  const powerupPanel = createElement(
    'div',
    { display: 'flex', flexDirection: 'column', gap: '4px' },
    hud
  );

 
  const topBanner = createElement(
    'div',
    {
      position: 'absolute',
      top: '16%',
      left: '50%',
      transform: 'translateX(-50%)',
      fontSize: '1.6rem',
      fontWeight: 'bold',
      color: '#ffd700',
      textShadow: '0 0 10px rgba(255, 215, 0, 0.8)',
      zIndex: '8',
      pointerEvents: 'none',
      opacity: '0',
      transition: 'opacity 0.4s',
    },
    body,
    '🏆 YOU ARE #1'
  );


  const controlsHint = createElement(
    'div',
    {
      position: 'absolute',
      bottom: '18px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(0, 0, 0, 0.5)',
      padding: '7px 14px',
      borderRadius: '20px',
      fontSize: '0.85rem',
      color: '#cccccc',
      pointerEvents: 'none',
      zIndex: '5',
      whiteSpace: 'nowrap',
      display: 'none',
    },
    body,
    'Move mouse to steer · Hold click to boost'
  );

  
  const boostButton = createElement(
    'div',
    {
      position: 'absolute',
      bottom: '36px',
      right: '36px',
      width: '86px',
      height: '86px',
      background: 'rgba(220, 38, 38, 0.6)',
      border: '3px solid rgba(248, 113, 113, 0.8)',
      borderRadius: '50%',
      zIndex: '6',
      display: 'none',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
    },
    body,
    'BOOST',
    'boostBtn'
  );

  
  const SCREEN_STYLE = {
    position: 'absolute',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'radial-gradient(circle at 50% 40%, rgba(10, 40, 120, 0.95), rgba(0, 10, 40, 0.97))',
    zIndex: '20',
    textAlign: 'center',
    padding: '20px',
  };

  const PARAGRAPH_STYLE = {
    marginBottom: '8px',
    color: '#cfe0ff',
    maxWidth: '480px',
    fontSize: '0.95rem',
  };

  function createMenuButton(parent, label) {
    const button = createElement(
      'button',
      {
        padding: '14px 36px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        color: '#fff',
        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        marginTop: '18px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
      },
      parent,
      label
    );

    const release = function () {
      button.style.transform = '';
    };
    button.addEventListener('pointerdown', function () {
      button.style.transform = 'scale(0.95)';
    });
    button.addEventListener('pointerup', release);
    button.addEventListener('pointerleave', release);
    return button;
  }


  const startScreen = createElement('div', SCREEN_STYLE, body);

  createElement(
    'h1',
    {
      fontSize: '2.6rem',
      marginBottom: '14px',
      color: '#4ade80',
      textShadow: '0 0 10px rgba(74, 222, 128, 0.6), 0 0 30px rgba(74, 222, 128, 0.3)',
      letterSpacing: '2px',
    },
    startScreen,
    'WORM ARENA'
  );

  createElement(
    'p',
    PARAGRAPH_STYLE,
    startScreen,
    "Grow by eating food and power-ups. Cut off other worms — if your head touches another body, you're out."
  );

  createElement('p', PARAGRAPH_STYLE, startScreen, 'Choose your worm type:');

  const characterRow = createElement(
    'div',
    {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginTop: '10px',
      maxWidth: '520px',
    },
    startScreen
  );

  const playButton = createMenuButton(startScreen, 'PLAY');

  // ---- Game over screen ----
  const gameOverScreen = createElement('div', SCREEN_STYLE, body);
  hideElement(gameOverScreen);

  createElement(
    'h2',
    { fontSize: '2rem', marginBottom: '12px', color: '#f87171' },
    gameOverScreen,
    'GAME OVER'
  );

  const resultsBox = createElement(
    'div',
    { fontSize: '1.1rem', marginBottom: '16px', lineHeight: '1.8' },
    gameOverScreen
  );

  function createResultLine(label) {
    createElement('span', {}, resultsBox, label);
    return createElement('b', { color: '#4ade80' }, resultsBox, '0');
  }

  const finalScoreText = createResultLine('Final Score: ');
  createElement('br', {}, resultsBox);
  const finalLengthText = createResultLine('Max Length: ');
  createElement('br', {}, resultsBox);
  const finalRankText = createResultLine('Rank: ');
  createElement('span', {}, resultsBox, ' / ');
  const finalTotalText = createElement('span', {}, resultsBox, '35');

  const restartButton = createMenuButton(gameOverScreen, 'PLAY AGAIN');

 
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const CONFIG = {
    WORLD: 9000,          
    VIEW: 900,            
    WORMS: 35,            
    START_LENGTH: 15,
    START_FOOD: 1600,
    MAX_FOOD: 2000,
    MAX_DROPPED: 700,     
    MAX_TOTAL: 2400,
    HEAD_RADIUS: 10,
    BODY_RADIUS: 8,
    SPACING: 14,         
    SPEED: 2.5,
    BOOST: 1.7,          
    POWERUP_MAX: 15,
    POWERUP_INTERVAL: 200,
    CELL: 90,            
    TILE: 120,            
    NPCS: 40,             
  };

  const CHARACTERS = {
    classic: 'Classic',
    cute: 'Cute',
    monster: 'Monster',
    robot: 'Robot',
    space: 'Space',
    animal: 'Alien',
  };

  const POWERUPS = {
    magnet: { icon: '🧲', label: 'Magnet', color: '#ef4444', duration: 600 },
    multiplier: { icon: '✖️', label: 'x2 Food', color: '#3b82f6', duration: 480 },
    speed: { icon: '⚡', label: 'Speed', color: '#22c55e', duration: 360 },
    maneuver: { icon: '🎯', label: 'Maneuver', color: '#16a34a', duration: 600 },
    radar: { icon: '📡', label: 'Radar', color: '#a855f7', duration: 600 },
    vision: { icon: '🔭', label: 'Vision', color: '#eab308', duration: 600 },
  };
  const POWERUP_KEYS = Object.keys(POWERUPS);

  const FOOD_TIERS = [
    { name: 'small', weight: 55, radius: [4, 6], value: [1, 3] },
    { name: 'medium', weight: 28, radius: [7, 10], value: [5, 10] },
    { name: 'large', weight: 13, radius: [11, 15], value: [15, 30] },
    { name: 'rare', weight: 4, radius: [15, 20], value: [40, 100] },
  ];

  const FOOD_SKINS = [
    ['#ef4444', '#22c55e'],
    ['#f97316', '#fdba74'],
    ['#a855f7', '#c084fc'],
    ['#16a34a', '#ec4899'],
    ['#e9c46a', '#8b5a2b'],
    ['#f97316', '#16a34a'],
    ['#e11d48', '#ffffff'],
    ['#dc2626', '#16a34a'],
    ['#facc15', '#16a34a'],
    ['#dc2626', '#ffffff'],
    ['#fbcfe8', '#f9a8d4'],
    ['#84cc16', '#f7fee7'],
  ];

  const PERSONALITIES = ['calm', 'aggressive', 'defensive', 'collector', 'hunter', 'trickster', 'giant'];

  const BOT_NAMES = [
    'Bart', 'ShyMammoth', 'Bman', 'Cobra', 'Viper', 'Python', 'Mamba', 'Boa', 'Asp',
    'Nash', 'Reece', 'Ethan', 'James', 'Oliver', 'Scruffy', 'Kilo', 'Rusty', 'Fang',
    'Nova', 'Blitz', 'Comet', 'Drex', 'Toxo', 'Zed', 'Atlas', 'Pixel', 'Rio', 'Echo',
    'Juno', 'Milo', 'Sage', 'Otto', 'Luna', 'Kai', 'Tango',
  ];

  const TWO_PI = Math.PI * 2;
  const STEP_MS = 1000 / 60; 

  let selectedCharacter = 'classic';
  let nameIndex = 0;
  let mouseX = width / 2;
  let mouseY = height / 2;
  let isBoosting = false;
  let isTouchDevice = false;

  const camera = { x: CONFIG.WORLD / 2, y: CONFIG.WORLD / 2, zoom: 1, targetZoom: 1 };

  const game = {
    state: 'menu', 
    player: null,
    worms: [],
    food: [],
    powerups: [],
    texts: [],
    pops: [],
    npcs: [],
    deaths: [],
    frame: 0,
    grid: new Map(),
  };


  function randomRange(min, max) {
    return min + Math.random() * (max - min);
  }


  function distanceSquared(ax, ay, bx, by) {
    const dx = ax - bx;
    const dy = ay - by;
    return dx * dx + dy * dy;
  }

 
  function hashTile(x, y) {
    let h = (x * 374761393 + y * 668265263) | 0;
    h = ((h ^ (h >>> 13)) * 1274126177) | 0;
    return (h ^ (h >>> 16)) >>> 0;
  }

  function nextBotName() {
    const name = BOT_NAMES[nameIndex % BOT_NAMES.length];
    nameIndex++;
    return name;
  }

  function randomWorldPosition(margin) {
    return randomRange(margin, CONFIG.WORLD - margin);
  }


  function styleCharacterButton(button, isSelected) {
    Object.assign(button.style, {
      border: '2px solid ' + (isSelected ? '#4ade80' : 'transparent'),
      background: isSelected ? 'rgba(74, 222, 128, 0.18)' : 'rgba(255, 255, 255, 0.08)',
      color: isSelected ? '#fff' : '#dce8ff',
    });
  }

  const characterButtons = [];

  Object.keys(CHARACTERS).forEach(function (key) {
    const button = createElement(
      'button',
      {
        padding: '8px 14px',
        fontSize: '0.85rem',
        borderRadius: '8px',
        cursor: 'pointer',
        margin: '0',
        boxShadow: 'none',
      },
      characterRow,
      CHARACTERS[key]
    );

    characterButtons.push(button);
    styleCharacterButton(button, key === selectedCharacter);

    button.onclick = function () {
      selectedCharacter = key;
      characterButtons.forEach(function (other) {
        styleCharacterButton(other, other === button);
      });
    };
  });

  class Npc {
    constructor() {
      this.x = randomWorldPosition(50);
      this.y = randomWorldPosition(50);
      this.angle = randomRange(0, 6.28);
      this.speed = randomRange(0.25, 0.5);
      this.hue = Math.floor(randomRange(0, 360));
      this.bob = randomRange(0, 6);
      this.turnTimer = randomRange(60, 200);
    }

    update() {
      this.turnTimer--;
      if (this.turnTimer <= 0) {
        this.angle += randomRange(-1, 1);
        this.turnTimer = randomRange(60, 200);
      }

      this.bob += 0.12;
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;

      // Bounce off the world edges
      if (this.x < 30 || this.x > CONFIG.WORLD - 30) {
        this.angle = Math.PI - this.angle;
      }
      if (this.y < 30 || this.y > CONFIG.WORLD - 30) {
        this.angle = -this.angle;
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y + Math.sin(this.bob) * 2);

      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.beginPath();
      ctx.ellipse(0, 11, 7, 3, 0, 0, TWO_PI);
      ctx.fill();

      // Legs
      ctx.fillStyle = 'hsl(' + ((this.hue + 180) % 360) + ', 40%, 35%)';
      ctx.fillRect(-4, 4, 3, 7);
      ctx.fillRect(1, 4, 3, 7);

      // Body
      ctx.fillStyle = 'hsl(' + this.hue + ', 70%, 55%)';
      ctx.beginPath();
      ctx.roundRect(-5, -6, 10, 11, 3);
      ctx.fill();

      // Head
      ctx.fillStyle = '#ffd9b3';
      ctx.beginPath();
      ctx.arc(0, -11, 5, 0, TWO_PI);
      ctx.fill();

      // Hair
      ctx.fillStyle = '#3a2a1a';
      ctx.beginPath();
      ctx.arc(0, -13, 5, Math.PI, 0);
      ctx.fill();

      ctx.restore();
    }
  }

  
  class PowerUp {
    constructor() {
      this.x = randomWorldPosition(80);
      this.y = randomWorldPosition(80);
      this.type = POWERUP_KEYS[Math.floor(Math.random() * POWERUP_KEYS.length)];
      this.definition = POWERUPS[this.type];
      this.bob = randomRange(0, 6);
      this.radius = 15;
    }

    update() {
      this.bob += 0.04;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y + Math.sin(this.bob) * 3);

      ctx.shadowColor = this.definition.color;
      ctx.shadowBlur = 18;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.roundRect(-10.5, -15, 21, 30, 8);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.strokeStyle = this.definition.color;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.definition.icon, 0, 1);

      ctx.restore();
    }
  }

 
  class Food {
   
    
    constructor(x, y, kind, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.pulse = randomRange(0, 6);
      this.phase = randomRange(0, 6);
      this.spawnProgress = 0;

      if (kind === 'dropped') {
        this.tier = 'dropped';
        this.radius = 5;
        this.value = 2;
        this.amplitude = 1.2;
        return;
      }

      
      const roll = Math.random() * 100;
      let cumulative = 0;
      let tier = FOOD_TIERS[0];
      for (const candidate of FOOD_TIERS) {
        cumulative += candidate.weight;
        if (roll <= cumulative) {
          tier = candidate;
          break;
        }
      }

      this.tier = tier.name;
      this.radius = randomRange(tier.radius[0], tier.radius[1]);
      this.value = Math.round(randomRange(tier.value[0], tier.value[1]));
      this.skin = tier.name === 'rare' ? -1 : Math.floor(Math.random() * FOOD_SKINS.length);
      this.amplitude = this.radius * 0.25 + 0.8;
    }

    update() {
      this.pulse += 0.03;
      if (this.spawnProgress < 1) {
        this.spawnProgress = Math.min(1, this.spawnProgress + 0.04);
      }
    }

    draw() {
      const bobOffset = Math.sin(this.pulse * 0.8 + this.phase) * this.amplitude;
      const scale = 0.5 + 0.5 * this.spawnProgress;
      const radius = this.radius;

     
      ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
      ctx.beginPath();
      ctx.ellipse(this.x, this.y + radius * 0.7, radius * 0.8 * scale, radius * 0.35 * scale, 0, 0, TWO_PI);
      ctx.fill();

      ctx.save();
      ctx.translate(this.x, this.y + bobOffset);
      ctx.scale(scale, scale);

   
      ctx.fillStyle = this.tier === 'rare' ? 'rgba(255, 235, 150, 0.45)' : 'rgba(255, 255, 255, 0.3)';
      ctx.beginPath();
      ctx.arc(0, 0, radius + 3 + Math.sin(this.pulse), 0, TWO_PI);
      ctx.fill();

      if (this.tier === 'dropped') {
        this.drawDropped(radius);
      } else if (this.skin < 0) {
        this.drawStar(radius);
      } else {
        this.drawFruit(radius);
      }

      ctx.restore();
    }

    drawDropped(radius) {
      ctx.fillStyle = this.color || '#fff';
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, TWO_PI);
      ctx.fill();
    }

    drawStar(radius) {
      ctx.rotate(this.pulse * 0.1);
      ctx.fillStyle = '#facc15';
      ctx.shadowColor = '#fde047';
      ctx.shadowBlur = 14;

      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = -Math.PI / 2 + i * 1.2566;
        ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        ctx.lineTo(Math.cos(angle + 0.628) * radius * 0.45, Math.sin(angle + 0.628) * radius * 0.45);
      }
      ctx.closePath();
      ctx.fill();
    }

    drawFruit(radius) {
      const colors = FOOD_SKINS[this.skin];
      ctx.rotate(Math.sin(this.pulse * 0.5 + this.phase) * 0.1);

    
      ctx.fillStyle = colors[0];
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, TWO_PI);
      ctx.fill();

    
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.beginPath();
      ctx.arc(-radius * 0.3, -radius * 0.3, radius * 0.25, 0, TWO_PI);
      ctx.fill();

   
      ctx.fillStyle = colors[1];
      ctx.beginPath();
      ctx.ellipse(radius * 0.35, -radius * 0.95, radius * 0.3, radius * 0.15, 0.7, 0, TWO_PI);
      ctx.fill();
    }
  }


  class Pop {
    constructor(x, y, color, isBig) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.isBig = isBig;
      this.maxLife = isBig ? 26 : 16;
      this.life = this.maxLife;
    }

    update() {
      this.life--;
    }

    draw() {
      const progress = 1 - Math.max(0, this.life) / this.maxLife;
      const eased = 1 - Math.pow(1 - progress, 3);
      const radius = (this.isBig ? 6 : 3) + eased * (this.isBig ? 34 : 20);

      ctx.globalAlpha = Math.max(0, 1 - progress);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.isBig ? 3 : 2;
      ctx.beginPath();
      ctx.arc(this.x, this.y, radius, 0, TWO_PI);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

 
  class FloatingText {
    constructor(x, y, text, color) {
      this.x = x;
      this.y = y;
      this.text = text;
      this.color = color;
      this.life = 50;
    }

    update() {
      this.y -= 1;
      this.life--;
    }

    draw() {
      ctx.globalAlpha = this.life / 50;
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.strokeText(this.text, this.x, this.y);
      ctx.fillStyle = this.color;
      ctx.fillText(this.text, this.x, this.y);
      ctx.globalAlpha = 1;
    }
  }

 
  class Worm {
    constructor(x, y, isPlayer, name, characterType) {
      this.isPlayer = isPlayer;
      this.name = name;
      this.x = x;
      this.y = y;
      this.angle = Math.random() * 6.28;
      this.targetAngle = this.angle;
      this.speed = CONFIG.SPEED;
      this.speedNow = this.speed;
      this.length = CONFIG.START_LENGTH + (isPlayer ? 0 : randomRange(-3, 10));
      this.history = []; // trail of past head positions (forms the body)
      this.score = 0;
      this.alive = true;
      this.powerups = {}; // active power-ups: type -> frames remaining

      
      this.personality = PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)];
      this.homeX = x;
      this.homeY = y;
      this.aiTimer = 0;
      this.evadeDirection = Math.random() < 0.5 ? 1 : -1;
      this.wantsBoost = false;

      this.setupAppearance(characterType);

     
      const trailLength = this.length * CONFIG.SPACING;
      for (let i = 0; i < trailLength; i++) {
        this.history.push({
          x: x - Math.cos(this.angle) * i,
          y: y - Math.sin(this.angle) * i,
        });
      }

      if (this.personality === 'giant') {
        this.length += 15;
      }
    }

    setupAppearance(characterType) {
      const keys = Object.keys(CHARACTERS);
      this.characterType = characterType || keys[Math.floor(Math.random() * 6)];
      this.eyeScale = 1;

      switch (this.characterType) {
        case 'cute':
          this.pattern = 'solid';
          this.color = 'hsl(' + randomRange(280, 340) + ', 75%, 70%)';
          this.eyeScale = 1.35;
          break;

        case 'monster':
          this.pattern = 'solid';
          this.color = 'hsl(' + randomRange(0, 20) + ', 55%, 30%)';
          this.eyeScale = 0.9;
          this.hasTeeth = true;
          break;

        case 'robot':
          this.pattern = 'robot';
          this.color = '#94a3b8';
          this.eyeScale = 0.8;
          this.hasGlowingEyes = true;
          break;

        case 'space':
          this.pattern = 'space';
          this.color = '#312e81';
          break;

        case 'animal':
          this.pattern = 'alien';
          this.color = '#22c55e';
          break;

        default: {
        
          const palettes = [
            ['#f4a6c1', '#ffffff', '#6b7280'],
            ['#fca5a5', '#ffffff', '#7c2d2d'],
            ['#93c5fd', '#ffffff', '#1e3a8a'],
            ['#fde68a', '#ffffff', '#92400e'],
          ];
          const palette = palettes[Math.floor(Math.random() * palettes.length)];
          this.pattern = 'checkered';
          this.color = palette[0];
          this.color2 = palette[1];
          this.color3 = palette[2];
          break;
        }
      }

     
      if (this.isPlayer && this.characterType === 'classic') {
        this.pattern = 'checkered';
        this.color = '#f4a6c1';
        this.color2 = '#ffffff';
        this.color3 = '#6b7280';
      }
    }

    get headRadius() {
      return CONFIG.HEAD_RADIUS * (1 + Math.min(this.length, 300) / 900);
    }

    get bodyRadius() {
      return CONFIG.BODY_RADIUS * (1 + Math.min(this.length, 300) / 1000);
    }

    hasPowerup(type) {
      return (this.powerups[type] || 0) > 0;
    }

   
    turnRate() {
      let factor = Math.max(0.5, 1 - Math.min(this.length, 400) / 800);
      if (this.hasPowerup('maneuver')) {
        factor *= 1.4;
      }
      return 0.075 * factor;
    }

    update() {
      if (!this.alive) {
        return;
      }

      this.tickPowerups();
      this.steer();
      this.move();

      if (!this.alive) {
        return;
      }

      this.updateTrail();

      if (this.hasPowerup('magnet')) {
        this.attractFood();
      }
    }

    tickPowerups() {
      for (const type in this.powerups) {
        this.powerups[type]--;
        if (this.powerups[type] <= 0) {
          delete this.powerups[type];
        }
      }
    }

   
    steer() {
      let difference = this.targetAngle - this.angle;
      while (difference > Math.PI) {
        difference -= TWO_PI;
      }
      while (difference < -Math.PI) {
        difference += TWO_PI;
      }

      const maxTurn = this.turnRate();
      const turnStep = Math.sign(difference) * Math.min(Math.abs(difference) * 0.35 + 0.004, maxTurn);

      if (Math.abs(difference) < Math.abs(turnStep)) {
        this.angle += difference;
      } else {
        this.angle += turnStep;
      }
    }

    move() {
      const boosting = this.isPlayer ? isBoosting : this.wantsBoost;

      let targetSpeed = this.speed;
      if (boosting) {
        targetSpeed *= CONFIG.BOOST;
      }
      if (this.hasPowerup('speed')) {
        targetSpeed *= 1.3;
      }
      this.speedNow += (targetSpeed - this.speedNow) * 0.12;

      
      if (boosting && this.length > 15 && Math.random() < 0.14) {
        this.length = Math.max(14, this.length - 1);
        const tail = this.history[this.history.length - 1];
        pushDroppedFood(new Food(tail.x, tail.y, 'dropped', this.color));
      }

      this.x += Math.cos(this.angle) * this.speedNow;
      this.y += Math.sin(this.angle) * this.speedNow;

      
      const radius = this.headRadius;
      const hitWall =
        this.x < radius ||
        this.x > CONFIG.WORLD - radius ||
        this.y < radius ||
        this.y > CONFIG.WORLD - radius;

      if (hitWall) {
        this.die();
      }
    }

    updateTrail() {
      this.history.unshift({ x: this.x, y: this.y });

      const maxPoints = Math.floor(this.length * CONFIG.SPACING);
      while (this.history.length > maxPoints) {
        this.history.pop();
      }
    }

    attractFood() {
      for (const food of game.food) {
        const dist2 = distanceSquared(this.x, this.y, food.x, food.y);
        if (dist2 < 16900 && dist2 > 4) {
          const dist = Math.sqrt(dist2);
          food.x += ((this.x - food.x) / dist) * 3;
          food.y += ((this.y - food.y) / dist) * 3;
        }
      }
    }

   
    die() {
      if (!this.alive) {
        return;
      }
      this.alive = false;

      const dropCount = Math.max(20, Math.min(150, Math.round(this.length * 1.6)));
      const stride = Math.max(1, Math.floor(this.history.length / dropCount));

      for (let i = 0; i < this.history.length; i += stride) {
        const point = this.history[i];
        pushDroppedFood(new Food(point.x, point.y, 'dropped', this.color));
      }

      game.deaths.push({ x: this.x, y: this.y, life: 600 });
    }

    drawFace() {
      const radius = this.headRadius;
      const eyeOffset = radius * 0.55;
      const eyeRadius = radius * 0.6 * this.eyeScale;
      const heading = this.angle;

      const eyes = [heading - 0.6, heading + 0.6].map(function (angle) {
        return [this.x + Math.cos(angle) * eyeOffset, this.y + Math.sin(angle) * eyeOffset];
      }, this);

      
      ctx.fillStyle = this.hasGlowingEyes ? '#0ff' : '#fff';
      if (this.hasGlowingEyes) {
        ctx.shadowColor = '#0ff';
        ctx.shadowBlur = 8;
      }
      ctx.beginPath();
      for (const eye of eyes) {
        ctx.moveTo(eye[0] + eyeRadius, eye[1]);
        ctx.arc(eye[0], eye[1], eyeRadius, 0, TWO_PI);
      }
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.lineWidth = 1;
      ctx.stroke();

     
      if (!this.hasGlowingEyes) {
        ctx.fillStyle = '#000';
        ctx.beginPath();
        for (const eye of eyes) {
          const pupilX = eye[0] + Math.cos(heading) * 2.5;
          const pupilY = eye[1] + Math.sin(heading) * 2.5;
          ctx.moveTo(pupilX + eyeRadius * 0.45, pupilY);
          ctx.arc(pupilX, pupilY, eyeRadius * 0.45, 0, TWO_PI);
        }
        ctx.fill();
      }

      
      if (this.hasTeeth) {
        this.drawTeeth(radius, heading);
      } else {
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(
          this.x + Math.cos(heading) * radius * 0.5,
          this.y + Math.sin(heading) * radius * 0.5,
          radius * 0.4,
          heading - 0.4,
          heading + 0.4
        );
        ctx.stroke();
      }
    }

    drawTeeth(radius, heading) {
      ctx.fillStyle = '#fff';

      const mouthX = this.x + Math.cos(heading) * radius * 0.7;
      const mouthY = this.y + Math.sin(heading) * radius * 0.7;
      const sideX = Math.cos(heading + 1.57);
      const sideY = Math.sin(heading + 1.57);

      for (let i = -1; i <= 1; i++) {
        const toothX = mouthX + sideX * i * 4;
        const toothY = mouthY + sideY * i * 4;
        ctx.beginPath();
        ctx.moveTo(toothX, toothY);
        ctx.lineTo(toothX + 2, toothY + 2);
        ctx.lineTo(toothX - 2, toothY + 2);
        ctx.fill();
      }
    }

    draw() {
      if (!this.alive) {
        return;
      }

      const radius = this.bodyRadius;
      const trail = this.history;
      const spacing = CONFIG.SPACING;

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const tracePath = function () {
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        for (let i = 3; i < trail.length; i += 3) {
          ctx.lineTo(trail[i].x, trail[i].y);
        }
      };

  
      tracePath();
      ctx.strokeStyle = '#0b1220';
      ctx.lineWidth = radius * 2 + 4;
      ctx.stroke();

    
      tracePath();
      ctx.strokeStyle = this.color;
      ctx.lineWidth = radius * 2;
      if (this.speedNow > this.speed * 1.1) {
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      this.drawPattern(radius, trail, spacing);
      this.drawFace();
      this.drawPowerupRing();
    }

    drawPattern(radius, trail, spacing) {
      switch (this.pattern) {
        case 'checkered':
          for (let i = trail.length - 1; i >= 0; i -= spacing) {
            const segment = Math.floor(i / spacing) % 3;
            ctx.fillStyle = segment === 0 ? this.color : segment === 1 ? this.color2 : this.color3;
            ctx.beginPath();
            ctx.arc(trail[i].x, trail[i].y, radius * 0.85, 0, TWO_PI);
            ctx.fill();
          }
          break;

        case 'robot':
          ctx.fillStyle = '#22d3ee';
          for (let i = trail.length - 1; i >= 0; i -= spacing * 2) {
            ctx.beginPath();
            ctx.arc(trail[i].x, trail[i].y, radius * 0.25, 0, TWO_PI);
            ctx.fill();
          }
          break;

        case 'space':
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          for (let i = trail.length - 1; i >= 0; i -= spacing) {
            if (Math.random() < 0.25) {
              ctx.beginPath();
              ctx.arc(
                trail[i].x + randomRange(-radius * 0.6, radius * 0.6),
                trail[i].y + randomRange(-radius * 0.6, radius * 0.6),
                0.9,
                0,
                TWO_PI
              );
              ctx.fill();
            }
          }
          break;

        case 'alien':
          ctx.fillStyle = '#0f172a';
          for (let i = trail.length - 1; i > 0; i -= spacing * 2) {
            const current = trail[i];
            const next = trail[i - 1];
            const angle = Math.atan2(next.y - current.y, next.x - current.x);

            ctx.save();
            ctx.translate(current.x, current.y);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.ellipse(radius * 0.3, -radius * 0.15, radius * 0.22, radius * 0.34, 0, 0, TWO_PI);
            ctx.ellipse(radius * 0.3, radius * 0.15, radius * 0.22, radius * 0.34, 0, 0, TWO_PI);
            ctx.fill();
            ctx.restore();
          }
          break;
      }
    }

   
    drawPowerupRing() {
      const active = Object.keys(this.powerups);
      if (active.length === 0) {
        return;
      }

      ctx.strokeStyle = POWERUPS[active[0]].color;
      ctx.globalAlpha = 0.5 + Math.sin(game.frame * 0.2) * 0.2;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.headRadius + 6, 0, TWO_PI);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }



  function findNearestFood(worm, maxDistance) {
    let best = null;
    let bestDist2 = maxDistance * maxDistance;

    for (const food of game.food) {
      const dist2 = distanceSquared(worm.x, worm.y, food.x, food.y);
      if (dist2 < bestDist2) {
        bestDist2 = dist2;
        best = food;
      }
    }
    return best;
  }

  function findNearestEnemy(worm, maxDistance) {
    let best = null;
    let bestDist2 = maxDistance * maxDistance;

    for (const other of game.worms) {
      if (other === worm || !other.alive) {
        continue;
      }
      const dist2 = distanceSquared(worm.x, worm.y, other.x, other.y);
      if (dist2 < bestDist2) {
        bestDist2 = dist2;
        best = other;
      }
    }
    return best;
  }

  
  function isBodyAhead(worm, lookAhead) {
    const probeX = worm.x + Math.cos(worm.angle) * lookAhead;
    const probeY = worm.y + Math.sin(worm.angle) * lookAhead;
    const cellX = Math.floor(probeX / CONFIG.CELL);
    const cellY = Math.floor(probeY / CONFIG.CELL);

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const bucket = game.grid.get(cellX + dx + '_' + (cellY + dy));
        if (!bucket) {
          continue;
        }

        for (const segment of bucket) {
          if (segment.worm === worm) {
            continue;
          }
          const reach = segment.radius + worm.headRadius + 10;
          if (distanceSquared(probeX, probeY, segment.x, segment.y) < reach * reach) {
            return true;
          }
        }
      }
    }
    return false;
  }

  function updateGiantAI(worm, enemy) {
    const distanceFromHome = Math.sqrt(distanceSquared(worm.x, worm.y, worm.homeX, worm.homeY));

    if (distanceFromHome > 350) {
    
      worm.targetAngle = Math.atan2(worm.homeY - worm.y, worm.homeX - worm.x);
    } else if (
      enemy &&
      enemy.length < worm.length &&
      distanceSquared(worm.x, worm.y, enemy.x, enemy.y) < 32400
    ) {
      
      worm.targetAngle = Math.atan2(enemy.y - worm.y, enemy.x - worm.x);
      worm.wantsBoost = Math.random() < 0.3;
    } else {
      const food = findNearestFood(worm, 250);
      if (food) {
        worm.targetAngle = Math.atan2(food.y - worm.y, food.x - worm.x);
      } else if (Math.random() < 0.3) {
        worm.targetAngle += Math.random() - 0.5;
      }
    }
  }

  function updateHunterAI(worm) {
   
    let bestFood = null;
    let bestScore = -1;

    for (const food of game.food) {
      const dist2 = distanceSquared(worm.x, worm.y, food.x, food.y);
      if (dist2 > 122500) {
        continue;
      }
      const score = food.value - Math.sqrt(dist2) * 0.05;
      if (score > bestScore) {
        bestScore = score;
        bestFood = food;
      }
    }

    if (bestFood) {
      worm.targetAngle = Math.atan2(bestFood.y - worm.y, bestFood.x - worm.x);
    } else if (Math.random() < 0.03) {
      worm.targetAngle += (Math.random() - 0.5) * 1.5;
    }
  }

  function updateAI() {
    const edgeMargin = 250;
    const world = CONFIG.WORLD;

    for (const worm of game.worms) {
      if (!worm.alive || worm.isPlayer) {
        continue;
      }

      worm.aiTimer--;
      worm.wantsBoost = false;

   
      let nearEdge = false;
      if (worm.x < edgeMargin) {
        worm.targetAngle = 0;
        nearEdge = true;
      } else if (worm.x > world - edgeMargin) {
        worm.targetAngle = Math.PI;
        nearEdge = true;
      }
      if (worm.y < edgeMargin) {
        worm.targetAngle = Math.PI / 2;
        nearEdge = true;
      } else if (worm.y > world - edgeMargin) {
        worm.targetAngle = -Math.PI / 2;
        nearEdge = true;
      }
      if (nearEdge) {
        continue;
      }

    
      if (isBodyAhead(worm, 60)) {
        worm.targetAngle = worm.angle + worm.evadeDirection * 1.3;
        if (Math.random() < 0.02) {
          worm.evadeDirection *= -1;
        }
        continue;
      }

   
      if (worm.aiTimer > 0) {
        continue;
      }
      worm.aiTimer = Math.floor(randomRange(12, 25));

      const personality = worm.personality;
      const senseRange = personality === 'defensive' ? 260 : personality === 'aggressive' ? 400 : 220;
      const enemy = findNearestEnemy(worm, senseRange);

      if (personality === 'giant') {
        updateGiantAI(worm, enemy);
        continue;
      }

      if (personality === 'aggressive' && enemy && enemy.length < worm.length * 1.1) {
      
        const aimX = enemy.x + Math.cos(enemy.angle) * 40;
        const aimY = enemy.y + Math.sin(enemy.angle) * 40;
        worm.targetAngle = Math.atan2(aimY - worm.y, aimX - worm.x);
        worm.wantsBoost = Math.random() < 0.15;
        continue;
      }

      if (personality === 'defensive' && enemy) {
       
        worm.targetAngle = Math.atan2(worm.y - enemy.y, worm.x - enemy.x);
        continue;
      }

      if (personality === 'trickster' && enemy) {
        
        worm.targetAngle = Math.atan2(worm.y - enemy.y, worm.x - enemy.x) + worm.evadeDirection * 0.9;
        if (Math.random() < 0.05) {
          worm.evadeDirection *= -1;
        }
        continue;
      }

      if (personality === 'hunter') {
        updateHunterAI(worm);
        continue;
      }

      const food = findNearestFood(worm, personality === 'collector' ? 320 : 260);
      if (food) {
        worm.targetAngle = Math.atan2(food.y - worm.y, food.x - worm.x);
      } else if (Math.random() < 0.02) {
        worm.targetAngle += (Math.random() - 0.5) * 1.5;
      }
    }
  }


  function buildCollisionGrid() {
    const grid = new Map();

    for (const worm of game.worms) {
      if (!worm.alive) {
        continue;
      }

      
      for (let i = Math.floor(CONFIG.SPACING * 1.5); i < worm.history.length; i += 2) {
        const point = worm.history[i];
        const key = Math.floor(point.x / CONFIG.CELL) + '_' + Math.floor(point.y / CONFIG.CELL);

        let bucket = grid.get(key);
        if (!bucket) {
          bucket = [];
          grid.set(key, bucket);
        }
        bucket.push({ x: point.x, y: point.y, radius: worm.bodyRadius, worm: worm });
      }
    }
    return grid;
  }

  function eatFood(worm) {
    for (let i = game.food.length - 1; i >= 0; i--) {
      const food = game.food[i];
      const reach = worm.headRadius + food.radius;

      if (distanceSquared(worm.x, worm.y, food.x, food.y) >= reach * reach) {
        continue;
      }

      const multiplier = worm.hasPowerup('multiplier') ? 2 : 1;
      const points = Math.floor(food.value * 10 * multiplier);

      worm.length += food.value * 0.22 * multiplier;
      worm.score += points;

      game.food.splice(i, 1);
      spawnFood();

      const popColor = food.tier === 'rare' ? '#facc15' : food.color || '#fff';
      game.pops.push(new Pop(food.x, food.y, popColor, food.tier === 'rare'));

      if (worm.isPlayer) {
        game.texts.push(new FloatingText(food.x, food.y, '+' + points, '#4ade80'));
      }
    }
  }

  function collectPowerups(worm) {
    for (let i = game.powerups.length - 1; i >= 0; i--) {
      const powerup = game.powerups[i];
      const reach = worm.headRadius + powerup.radius;

      if (distanceSquared(worm.x, worm.y, powerup.x, powerup.y) >= reach * reach) {
        continue;
      }

      worm.powerups[powerup.type] = powerup.definition.duration;
      game.powerups.splice(i, 1);
      game.pops.push(new Pop(powerup.x, powerup.y, powerup.definition.color, true));

      if (worm.isPlayer) {
        game.texts.push(
          new FloatingText(powerup.x, powerup.y, powerup.definition.label + '!', powerup.definition.color)
        );
      }
    }
  }

 
  function checkWormCollisions() {
    for (const worm of game.worms) {
      if (!worm.alive) {
        continue;
      }

      const cellX = Math.floor(worm.x / CONFIG.CELL);
      const cellY = Math.floor(worm.y / CONFIG.CELL);
      let collided = false;

      for (let dx = -1; dx <= 1 && !collided; dx++) {
        for (let dy = -1; dy <= 1 && !collided; dy++) {
          const bucket = game.grid.get(cellX + dx + '_' + (cellY + dy));
          if (!bucket) {
            continue;
          }

          for (const segment of bucket) {
            if (segment.worm === worm) {
              continue;
            }
            const reach = worm.headRadius * 0.85 + segment.radius;
            if (distanceSquared(worm.x, worm.y, segment.x, segment.y) < reach * reach) {
              worm.die();
              collided = true;
              break;
            }
          }
        }
      }
    }
  }

  function checkCollisions() {
    for (const worm of game.worms) {
      if (!worm.alive) {
        continue;
      }
      eatFood(worm);
      collectPowerups(worm);
    }

    game.grid = buildCollisionGrid();
    checkWormCollisions();
  }

 
  function pushDroppedFood(food) {
    game.food.push(food);

    let droppedCount = 0;
    for (const item of game.food) {
      if (item.tier === 'dropped') {
        droppedCount++;
      }
    }

    while (droppedCount > CONFIG.MAX_DROPPED || game.food.length > CONFIG.MAX_TOTAL) {
      const index = game.food.findIndex(function (item) {
        return item.tier === 'dropped';
      });
      if (index < 0) {
        break;
      }
      game.food.splice(index, 1);
      droppedCount--;
    }
  }

  function spawnFood() {
    let naturalCount = 0;
    for (const food of game.food) {
      if (food.tier !== 'dropped') {
        naturalCount++;
      }
    }

    if (naturalCount >= CONFIG.MAX_FOOD || game.food.length >= CONFIG.MAX_TOTAL) {
      return;
    }

    game.food.push(new Food(randomWorldPosition(20), randomWorldPosition(20)));
  }

 

  function initGame() {
    Object.assign(game, {
      worms: [],
      food: [],
      powerups: [],
      texts: [],
      pops: [],
      npcs: [],
      deaths: [],
      frame: 0,
      grid: new Map(),
    });
    nameIndex = 0;


    game.player = new Worm(CONFIG.WORLD / 2, CONFIG.WORLD / 2, true, 'You', selectedCharacter);
    game.worms.push(game.player);

   
    for (let i = 0; i < CONFIG.WORMS - 1; i++) {
      game.worms.push(new Worm(randomWorldPosition(300), randomWorldPosition(300), false, nextBotName()));
    }

    for (let i = 0; i < CONFIG.START_FOOD; i++) {
      spawnFood();
    }
    for (let i = 0; i < 8; i++) {
      game.powerups.push(new PowerUp());
    }
    for (let i = 0; i < CONFIG.NPCS; i++) {
      game.npcs.push(new Npc());
    }

    camera.x = game.player.x;
    camera.y = game.player.y;
    camera.zoom = 1;
    camera.targetZoom = 1;
  }


  function drawMap(viewBounds) {
    const tileSize = CONFIG.TILE;
    const world = CONFIG.WORLD;

    const firstTileX = Math.max(0, Math.floor(viewBounds.left / tileSize));
    const lastTileX = Math.min(world / tileSize - 1, Math.floor(viewBounds.right / tileSize));
    const firstTileY = Math.max(0, Math.floor(viewBounds.top / tileSize));
    const lastTileY = Math.min(world / tileSize - 1, Math.floor(viewBounds.bottom / tileSize));

    const centre = world / 2;

    for (let tileY = firstTileY; tileY <= lastTileY; tileY++) {
      for (let tileX = firstTileX; tileX <= lastTileX; tileX++) {
        const px = tileX * tileSize;
        const py = tileY * tileSize;
        const midX = px + tileSize / 2;
        const midY = py + tileSize / 2;
        const distanceFromCentre = Math.hypot(midX - centre, midY - centre) / (world / 2);

      
        let base;
        if (distanceFromCentre < 0.25) {
          base = [16, 70, 190];
        } else if (distanceFromCentre < 0.6) {
          base = [10, 60, 175];
        } else {
          base = [8, 48, 150];
        }

      
        const shade = (tileX + tileY) & 1 ? 10 : 0;
        ctx.fillStyle = 'rgb(' + (base[0] + shade) + ',' + (base[1] + shade) + ',' + (base[2] + shade) + ')';
        ctx.fillRect(px, py, tileSize + 1, tileSize + 1);

        
        const hash = hashTile(tileX, tileY);
        const decorX = px + (hash % 90) + 15;
        const decorY = py + ((hash >> 8) % 90) + 15;
        drawTileDecoration(hash % 17, decorX, decorY);
      }
    }

   
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 6;
    for (const ringRadius of [300, 520, 760]) {
      ctx.beginPath();
      ctx.arc(centre, centre, ringRadius, 0, TWO_PI);
      ctx.stroke();
    }

    drawDangerZone();
    drawWall();
  }

  function drawTileDecoration(type, x, y) {
    if (type === 0) {
      // Ripples
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(x, y, 22, 9, 0, 0, TWO_PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(x, y, 12, 5, 0, 0, TWO_PI);
      ctx.stroke();
    } else if (type === 1 || type === 2) {
   
      ctx.fillStyle = '#1f9d55';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.arc(x, y, 17, 0.4, 6.0);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.arc(x - 4, y - 5, 4, 0, TWO_PI);
      ctx.fill();

      if (type === 2) {
        ctx.fillStyle = '#f9a8d4';
        ctx.beginPath();
        ctx.arc(x + 3, y + 1, 4, 0, TWO_PI);
        ctx.fill();

        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(x + 3, y + 1, 1.5, 0, TWO_PI);
        ctx.fill();
      }
    } else if (type === 3) {
     
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.ellipse(x, y, 14, 10, 0.3, 0, TWO_PI);
      ctx.fill();

      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.ellipse(x - 3, y - 3, 8, 5, 0.3, 0, TWO_PI);
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.beginPath();
      ctx.ellipse(x, y + 12, 18, 4, 0, 0, TWO_PI);
      ctx.fill();
    } else if (type === 4 || type === 5) {
      // Bubbles
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(x + i * 9, y - i * 7, 2 + i, 0, TWO_PI);
        ctx.stroke();
      }
    } else if (type === 6) {
      
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 2;
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(x + i * 5, y + 14);
        ctx.quadraticCurveTo(x + i * 8, y, x + i * 3, y - 14);
        ctx.stroke();
      }
    }
  }


  function drawDangerZone() {
    const world = CONFIG.WORLD;
    const depth = 260;

    function fadeStrip(x1, y1, x2, y2, rectX, rectY, rectW, rectH) {
      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, 'rgba(239, 68, 68, 0.45)');
      gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(rectX, rectY, rectW, rectH);
    }

    fadeStrip(0, 0, depth, 0, 0, 0, depth, world); // left
    fadeStrip(world, 0, world - depth, 0, world - depth, 0, depth, world); 
    fadeStrip(0, 0, 0, depth, 0, 0, world, depth); // top
    fadeStrip(0, world, 0, world - depth, 0, world - depth, world, depth); 
  }


  function drawWall() {
    const world = CONFIG.WORLD;

    ctx.lineWidth = 18;
    ctx.strokeStyle = '#111827';
    ctx.strokeRect(0, 0, world, world);

    ctx.setLineDash([40, 40]);
    ctx.strokeStyle = '#facc15';
    ctx.strokeRect(0, 0, world, world);
    ctx.setLineDash([]);

    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 14;
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.strokeRect(-10, -10, world + 20, world + 20);
    ctx.shadowBlur = 0;
  }

  function drawMinimap(visibleHalfWidth, visibleHalfHeight) {
    const player = game.player;
    const size = 150;
    const left = width - size - 14;
    const top = 14;
    const scale = size / CONFIG.WORLD;

    
    ctx.fillStyle = 'rgba(8, 40, 130, 0.8)';
    ctx.fillRect(left, top, size, size);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.strokeRect(left, top, size, size);

   
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.strokeRect(
      left + (camera.x - visibleHalfWidth) * scale,
      top + (camera.y - visibleHalfHeight) * scale,
      visibleHalfWidth * 2 * scale,
      visibleHalfHeight * 2 * scale
    );

   
    for (const worm of game.worms) {
      if (!worm.alive) {
        continue;
      }
      ctx.fillStyle = worm.isPlayer ? '#4ade80' : worm.color;
      ctx.beginPath();
      ctx.arc(left + worm.x * scale, top + worm.y * scale, worm.isPlayer ? 4 : 2.5, 0, TWO_PI);
      ctx.fill();
    }

  
    if (player && player.hasPowerup('radar')) {
      ctx.fillStyle = 'rgba(168, 85, 247, 0.9)';
      for (const death of game.deaths) {
        ctx.beginPath();
        ctx.arc(left + death.x * scale, top + death.y * scale, 3, 0, TWO_PI);
        ctx.fill();
      }
    }
  }

  function render() {
    ctx.fillStyle = '#02103a';
    ctx.fillRect(0, 0, width, height);

    const player = game.player;

    
    if (player && player.alive) {
      camera.x += (player.x - camera.x) * 0.25;
      camera.y += (player.y - camera.y) * 0.25;

      const sizeZoom = 1 + Math.min(player.length, 500) / 2000;
      camera.targetZoom = player.hasPowerup('vision') ? Math.max(1.55, sizeZoom) : sizeZoom;
    }
    camera.zoom += (camera.targetZoom - camera.zoom) * 0.06;

    const scale = Math.min(width, height) / CONFIG.VIEW / camera.zoom;
    const halfWidth = width / 2 / scale;
    const halfHeight = height / 2 / scale;

    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(scale, scale);
    ctx.translate(-camera.x, -camera.y);

    
    const viewBounds = {
      left: camera.x - halfWidth - 60,
      top: camera.y - halfHeight - 60,
      right: camera.x + halfWidth + 60,
      bottom: camera.y + halfHeight + 60,
    };
    const isVisible = function (x, y) {
      return x > viewBounds.left && x < viewBounds.right && y > viewBounds.top && y < viewBounds.bottom;
    };

    drawMap(viewBounds);

    for (const npc of game.npcs) {
      if (isVisible(npc.x, npc.y)) {
        npc.draw();
      }
    }
    for (const food of game.food) {
      if (isVisible(food.x, food.y)) {
        food.draw();
      }
    }
    for (const powerup of game.powerups) {
      if (isVisible(powerup.x, powerup.y)) {
        powerup.draw();
      }
    }
    for (const worm of game.worms) {
      if (!worm.alive) {
        continue;
      }
      const tail = worm.history[worm.history.length - 1];
      if (isVisible(worm.x, worm.y) || (tail && isVisible(tail.x, tail.y))) {
        worm.draw();
      }
    }
    for (const pop of game.pops) {
      if (isVisible(pop.x, pop.y)) {
        pop.draw();
      }
    }
    for (const text of game.texts) {
      if (isVisible(text.x, text.y)) {
        text.draw();
      }
    }

    ctx.restore();

    drawMinimap(halfWidth, halfHeight);
  }



  function addLeaderboardRow(position, name, score, isPlayer, extraStyle) {
    const rowStyle = Object.assign(
      {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '14px',
        fontSize: '0.8rem',
        padding: '1px 0',
      },
      isPlayer ? { color: '#4ade80', fontWeight: 'bold' } : {},
      extraStyle || {}
    );

    const row = createElement('div', rowStyle, leaderboardList);
    const nameCell = createElement('span', {}, row);

    createElement(
      'span',
      { color: '#ffd966', width: '18px', display: 'inline-block' },
      nameCell,
      position + '.'
    );
    nameCell.appendChild(document.createTextNode(name));

    createElement('span', {}, row, String(Math.floor(score)));
  }

  function updateLeaderboard(player, aliveWorms, rank) {
    const sorted = aliveWorms.slice().sort(function (a, b) {
      return b.score - a.score;
    });

    leaderboardTitle.textContent = 'TOP ROLLERS (' + aliveWorms.length + ' IN ARENA)';
    leaderboardList.replaceChildren();

    sorted.slice(0, 5).forEach(function (worm, index) {
      addLeaderboardRow(index + 1, worm.name, worm.score, worm.isPlayer);
    });

  
    if (rank > 5) {
      addLeaderboardRow(rank, 'You', player.score, true, {
        marginTop: '5px',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        paddingTop: '5px',
      });
    }
  }

  function updatePowerupPanel(player) {
    powerupPanel.replaceChildren();

    for (const type in player.powerups) {
      const definition = POWERUPS[type];
      const framesLeft = player.powerups[type];
      const percent = Math.min(100, (framesLeft / definition.duration) * 100);

      const row = createElement(
        'div',
        {
          background: 'rgba(0, 0, 0, 0.5)',
          padding: '4px 10px',
          borderRadius: '14px',
          fontSize: '0.75rem',
          display: 'flex',
          gap: '6px',
          alignItems: 'center',
        },
        powerupPanel,
        definition.icon + ' ' + definition.label + ' '
      );

      createElement('span', {}, row, (framesLeft / 60).toFixed(1) + 's');

      const bar = createElement(
        'div',
        {
          width: '50px',
          height: '5px',
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '3px',
          overflow: 'hidden',
        },
        row
      );
      createElement('div', { height: '100%', width: percent + '%', background: definition.color }, bar);
    }
  }

  function updateUI() {
    const player = game.player;

    scoreValue.textContent = Math.floor(player.score);
    lengthValue.textContent = Math.floor(player.length);

    const aliveWorms = game.worms.filter(function (worm) {
      return worm.alive;
    });
    const sorted = aliveWorms.slice().sort(function (a, b) {
      return b.score - a.score;
    });
    const rank = sorted.indexOf(player) + 1;

    updateLeaderboard(player, aliveWorms, rank);
    updatePowerupPanel(player);

    rankBadge.textContent = 'Rank #' + (rank > 0 ? rank : '-') + ' / ' + aliveWorms.length;
    topBanner.style.opacity = rank === 1 ? '1' : '0';
  }

 
  function step() {
    game.frame++;
    const player = game.player;

    
    if (player.alive) {
      const dx = mouseX - width / 2;
      const dy = mouseY - height / 2;
      if (dx * dx + dy * dy > 18 * 18) {
        player.targetAngle = Math.atan2(dy, dx);
      }
    }

    updateAI();

    for (const worm of game.worms) {
      worm.update();
    }
    for (const npc of game.npcs) {
      npc.update();
    }
    for (const powerup of game.powerups) {
      powerup.update();
    }
    for (const food of game.food) {
      food.update();
    }

    checkCollisions();

    
    if (game.powerups.length < CONFIG.POWERUP_MAX && game.frame % CONFIG.POWERUP_INTERVAL === 0) {
      game.powerups.push(new PowerUp());
    }

    
    for (const list of [game.texts, game.pops]) {
      for (let i = list.length - 1; i >= 0; i--) {
        list[i].update();
        if (list[i].life <= 0) {
          list.splice(i, 1);
        }
      }
    }
    for (let i = game.deaths.length - 1; i >= 0; i--) {
      game.deaths[i].life--;
      if (game.deaths[i].life <= 0) {
        game.deaths.splice(i, 1);
      }
    }

  
    for (let i = game.worms.length - 1; i >= 0; i--) {
      const worm = game.worms[i];
      if (worm.alive) {
        continue;
      }

      if (worm.isPlayer) {
        endGame();
        return;
      }
      game.worms[i] = new Worm(randomWorldPosition(300), randomWorldPosition(300), false, nextBotName());
    }
  }

  let lastTime = 0;
  let accumulator = 0;

 
  function loop(time) {
    const delta = Math.min(100, time - lastTime);
    lastTime = time;

    if (game.state === 'playing') {
      accumulator += delta;

      let stepsThisFrame = 0;
      while (accumulator >= STEP_MS && stepsThisFrame < 4) {
        step();
        accumulator -= STEP_MS;
        stepsThisFrame++;

        if (game.state !== 'playing') {
          break;
        }
      }

  
      if (stepsThisFrame === 4) {
        accumulator = 0;
      }

      if (game.state === 'playing') {
        updateUI();
      }
    }

    render();
    requestAnimationFrame(loop);
  }


  function startGame() {
    hideElement(startScreen);
    hideElement(gameOverScreen);
    showElement(hud, 'flex');

    boostButton.style.display = isTouchDevice ? 'flex' : 'none';
    controlsHint.style.display = isTouchDevice ? 'none' : 'block';

    initGame();
    accumulator = 0;
    game.state = 'playing';
  }

  function endGame() {
    game.state = 'gameover';
    isBoosting = false;

    hideElement(hud);
    hideElement(controlsHint);
    hideElement(boostButton);
    topBanner.style.opacity = '0';

    const ranked = game.worms.slice().sort(function (a, b) {
      return b.score - a.score;
    });

    finalScoreText.textContent = Math.floor(game.player.score);
    finalLengthText.textContent = Math.floor(game.player.length);
    finalRankText.textContent = ranked.indexOf(game.player) + 1;
    finalTotalText.textContent = CONFIG.WORMS;

    showElement(gameOverScreen, 'flex');
  }


  window.addEventListener('mousemove', function (event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  window.addEventListener('mousedown', function () {
    if (game.state === 'playing') {
      isBoosting = true;
    }
  });

  window.addEventListener('mouseup', function () {
    isBoosting = false;
  });

 
  function updateSteeringFromTouches(event) {
    for (const touch of event.touches) {
      if (touch.target.id !== 'boostBtn') {
        mouseX = touch.clientX;
        mouseY = touch.clientY;
        return;
      }
    }
  }

  window.addEventListener(
    'touchstart',
    function (event) {
      isTouchDevice = true;
      if (game.state !== 'playing') {
        return;
      }

      if (event.target.id === 'boostBtn') {
        isBoosting = true;
      } else {
        updateSteeringFromTouches(event);
      }
    },
    { passive: false }
  );

  window.addEventListener(
    'touchmove',
    function (event) {
      event.preventDefault();
      if (game.state === 'playing') {
        updateSteeringFromTouches(event);
      }
    },
    { passive: false }
  );

  window.addEventListener(
    'touchend',
    function (event) {
      if (game.state !== 'playing') {
        return;
      }

    
      let stillOnBoost = false;
      for (const touch of event.touches) {
        if (touch.target.id === 'boostBtn') {
          stillOnBoost = true;
        }
      }
      isBoosting = stillOnBoost;
    },
    { passive: false }
  );

 
  window.addEventListener('resize', function () {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

 
  playButton.onclick = startGame;
  restartButton.onclick = startGame;

  
  requestAnimationFrame(loop);
})();