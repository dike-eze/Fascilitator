/**
 * Optimized Bubble Game Engine with pre-computed font sizing,
 * collision-free lane spawning, and active repulsion physics.
 */
class BubbleGameEngine {
    constructor(container, canvas) {
        this.container = container;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.particleEngine = new ForestWorldEngine(this.ctx, this.canvas.width, this.canvas.height);

        this.state = 'IDLE';
        this.score = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.lives = 3;
        this.maxLives = 3;

        this.currentTopic = null;
        this.currentLevelIndex = 0;
        this.targetGoal = 10;
        this.targetsCollected = 0;
        this.gameSpeedMultiplier = 1.0;

        this.bubbles = [];
        this.lastFrameTime = 0;
        this.lastSpawnTime = 0;
        this.spawnInterval = 1400;
        this.animFrameId = null;

        this.isSlowMoActive = false;
        this.slowMoTimer = 0;
        this.thornsHeight = 70;

        this.onScoreChange = null;
        this.onLivesChange = null;
        this.onProgressChange = null;
        this.onStateChange = null;
        this.onFeedbackMessage = null;

        this.initEvents();
        this.resizeCanvas();
    }

    initEvents() {
        window.addEventListener('resize', () => this.resizeCanvas());

        const handlePointer = (e) => {
            if (this.state !== 'PLAYING') return;
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const x = (clientX - rect.left) * (this.canvas.width / rect.width);
            const y = (clientY - rect.top) * (this.canvas.height / rect.height);
            this.handleTap(x, y);
        };

        this.canvas.addEventListener('mousedown', handlePointer);
        this.canvas.addEventListener('touchstart', handlePointer, { passive: false });
    }

    resizeCanvas() {
        const rect = this.container.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return;
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.thornsHeight = Math.max(65, Math.min(85, this.canvas.height * 0.12));
        this.particleEngine.resize(this.canvas.width, this.canvas.height);
    }

    startLevel(topicId, levelIndex = 0, keepScore = false) {
        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
        }

        this.currentTopic = window.topicManager.getTopic(topicId);
        this.currentLevelIndex = 0;
        const levelData = this.currentTopic.levels[0];

        if (!keepScore) {
            this.score = 0;
            this.streak = 0;
            this.maxStreak = 0;
            this.lives = this.maxLives;
        }

        this.targetsCollected = 0;
        this.targetGoal = levelData.targetGoal || 10;
        this.gameSpeedMultiplier = levelData.speedMultiplier || 1.0;
        this.bubbles = [];
        this.lastSpawnTime = performance.now() + 400;
        this.isSlowMoActive = false;
        this.slowMoTimer = 0;

        this.state = 'PLAYING';
        this.notifyUI();

        if (window.soundEngine) window.soundEngine.ensureContext();
        this.lastFrameTime = performance.now();
        this.animFrameId = requestAnimationFrame((ts) => this.gameLoop(ts));
    }

    notifyUI() {
        if (this.onScoreChange) this.onScoreChange(this.score, this.streak);
        if (this.onLivesChange) this.onLivesChange(this.lives, this.maxLives);
        if (this.onProgressChange) this.onProgressChange(this.targetsCollected, this.targetGoal);
        if (this.onStateChange) this.onStateChange(this.state, this.getCurrentLevelData());
    }

    getCurrentLevelData() {
        if (!this.currentTopic) return null;
        return {
            topicTitle: this.currentTopic.title,
            subject: this.currentTopic.subject,
            levelIndex: 0,
            totalLevels: 1,
            ...this.currentTopic.levels[0]
        };
    }

    calculateBubbleFontSize(text, radius) {
        const len = (text || '').length;
        if (len <= 1) return Math.floor(radius * 1.30);
        if (len <= 3) return Math.floor(radius * 0.92);
        return Math.floor(radius * 0.65);
    }

    spawnBubble() {
        const levelData = this.currentTopic.levels[0];
        const items = levelData.items;
        if (!items || items.length === 0) return;

        const isMobile = this.canvas.width < 600;
        const radius = isMobile
            ? Math.min(Math.max(this.canvas.width * 0.13, 54), 74)
            : Math.min(Math.max(this.canvas.width * 0.09, 62), 86);

        const spawnX = this.findClearSpawnPosition(radius);
        if (spawnX === null) return;

        let bubbleItem = null;
        let isPowerup = false;
        let powerupType = null;

        if (Math.random() < 0.14) {
            isPowerup = true;
            const types = ['freeze', 'star'];
            if (this.lives < this.maxLives) types.push('heart');
            powerupType = types[Math.floor(Math.random() * types.length)];
            if (powerupType === 'freeze') bubbleItem = { text: "Slow-Mo", isTarget: true, icon: "❄️", isPowerup: true, powerupType: 'freeze' };
            else if (powerupType === 'heart') bubbleItem = { text: "+1 Heart", isTarget: true, icon: "💖", isPowerup: true, powerupType: 'heart' };
            else bubbleItem = { text: "Star Pop", isTarget: true, icon: "🌟", isPowerup: true, powerupType: 'star' };
        } else {
            const wantTarget = Math.random() < 0.58;
            const candidates = items.filter(it => it.isTarget === wantTarget);
            const pool = candidates.length > 0 ? candidates : items;
            bubbleItem = pool[Math.floor(Math.random() * pool.length)];
        }

        const y = -radius - 20;
        const baseSpeed = (1.0 + Math.random() * 0.35) * this.gameSpeedMultiplier;
        const displayText = bubbleItem.text;
        const fontSize = this.calculateBubbleFontSize(displayText, radius);

        const bubble = {
            id: 'b_' + Math.random().toString(36).substr(2, 9),
            x: spawnX, y: y, baseX: spawnX, radius: radius,
            item: bubbleItem, displayText: displayText, fontSize: fontSize,
            speed: baseSpeed, driftAmplitude: Math.random() * 8 + 4,
            driftSpeed: Math.random() * 0.02 + 0.01, driftPhase: Math.random() * Math.PI * 2,
            isPopping: false, popProgress: 0, wobblePhase: Math.random() * Math.PI * 2,
            glowHue: isPowerup ? 45 : 195
        };

        this.bubbles.push(bubble);
    }

    findClearSpawnPosition(radius) {
        const padding = radius + 24;
        const usableWidth = this.canvas.width - padding * 2;
        if (usableWidth <= 0) return this.canvas.width / 2;

        const numLanes = Math.max(3, Math.min(6, Math.floor(usableWidth / (radius * 2.4))));
        const laneWidth = usableWidth / numLanes;
        const lanes = [];

        for (let i = 0; i < numLanes; i++) {
            const laneCenterX = padding + i * laneWidth + laneWidth / 2;
            let isClear = true;
            for (const b of this.bubbles) {
                if (b.y < radius * 2.8) {
                    const dist = Math.abs(b.x - laneCenterX);
                    if (dist < (radius + b.radius + 35)) {
                        isClear = false;
                        break;
                    }
                }
            }
            if (isClear) lanes.push(laneCenterX);
        }

        if (lanes.length === 0) return null;
        return lanes[Math.floor(Math.random() * lanes.length)];
    }

    handleTap(clickX, clickY) {
        let tappedBubble = null;
        let minTapDist = Infinity;

        for (let i = this.bubbles.length - 1; i >= 0; i--) {
            const b = this.bubbles[i];
            if (b.isPopping) continue;
            const dist = Math.hypot(b.x - clickX, b.y - clickY);
            if (dist <= b.radius * 1.25 && dist < minTapDist) {
                minTapDist = dist;
                tappedBubble = b;
            }
        }

        if (!tappedBubble) return;

        const item = tappedBubble.item;
        tappedBubble.isPopping = true;

        if (item.isPowerup) {
            this.handlePowerupTap(tappedBubble);
            return;
        }

        if (item.isTarget) {
            this.streak++;
            if (this.streak > this.maxStreak) this.maxStreak = this.streak;
            const pointsEarned = 100 + (this.streak > 1 ? (this.streak - 1) * 25 : 0);
            this.score += pointsEarned;
            this.targetsCollected++;

            if (window.soundEngine) {
                window.soundEngine.playPop(1.0 + Math.min(this.streak * 0.05, 0.5));
                if (this.streak >= 2) window.soundEngine.playCombo(this.streak);
                window.soundEngine.speakWordOrSound(item);
            }

            this.particleEngine.addPopBurst(tappedBubble.x, tappedBubble.y, '#38bdf8', true);
            this.particleEngine.addFloatingText(tappedBubble.x, tappedBubble.y - 20, `+${pointsEarned}`);

            this.notifyUI();
            if (this.targetsCollected >= this.targetGoal) {
                setTimeout(() => this.completeLevel(), 400);
            }
        } else {
            this.streak = 0;
            this.lives = Math.max(0, this.lives - 1);
            if (window.soundEngine) window.soundEngine.playError();
            this.particleEngine.addPopBurst(tappedBubble.x, tappedBubble.y, '#f87171', false);
            this.particleEngine.addFloatingText(tappedBubble.x, tappedBubble.y - 20, `-1 Heart 💔`, '#f87171');

            if (this.onFeedbackMessage) {
                this.onFeedbackMessage({
                    type: 'error',
                    title: 'Dodge Non-Consonants!',
                    message: item.explanation || `Let non-consonants drop into the brambles.`
                });
            }

            this.notifyUI();
            if (this.lives <= 0) setTimeout(() => this.triggerGameOver(), 300);
        }
    }

    handlePowerupTap(b) {
        const type = b.item.powerupType;
        if (type === 'freeze') {
            this.isSlowMoActive = true;
            this.slowMoTimer = 4.5;
            this.particleEngine.addFloatingText(b.x, b.y - 20, `❄️ Slow-Time!`, '#38bdf8');
            if (window.soundEngine) window.soundEngine.playCombo(4);
        } else if (type === 'heart') {
            this.lives = Math.min(this.maxLives, this.lives + 1);
            this.particleEngine.addFloatingText(b.x, b.y - 20, `💖 +1 Heart!`, '#f43f5e');
            if (window.soundEngine) window.soundEngine.playCombo(5);
        } else {
            this.score += 250;
            this.particleEngine.addFloatingText(b.x, b.y - 20, `🌟 +250 Stars!`, '#facc15');
            if (window.soundEngine) window.soundEngine.playCombo(3);
        }
        this.particleEngine.addPopBurst(b.x, b.y, '#facc15', true);
        this.notifyUI();
    }

    completeLevel() {
        this.state = 'LEVEL_CLEAR';
        if (window.soundEngine) window.soundEngine.playVictory();
        this.notifyUI();
    }

    triggerGameOver() {
        this.state = 'GAME_OVER';
        this.notifyUI();
    }

    pauseGame() {
        if (this.state === 'PLAYING') {
            this.state = 'PAUSED';
            this.notifyUI();
        }
    }

    resumeGame() {
        if (this.state === 'PAUSED') {
            this.state = 'PLAYING';
            this.lastFrameTime = performance.now();
            this.animFrameId = requestAnimationFrame((ts) => this.gameLoop(ts));
            this.notifyUI();
        }
    }

    gameLoop(timestamp) {
        if (this.state !== 'PLAYING') return;
        const dt = Math.min((timestamp - this.lastFrameTime) / 1000, 0.05);
        this.lastFrameTime = timestamp;

        if (this.isSlowMoActive) {
            this.slowMoTimer -= dt;
            if (this.slowMoTimer <= 0) this.isSlowMoActive = false;
        }

        const effectiveSpawnInterval = this.isSlowMoActive ? this.spawnInterval * 1.6 : this.spawnInterval;
        if (timestamp - this.lastSpawnTime >= effectiveSpawnInterval) {
            this.spawnBubble();
            this.lastSpawnTime = timestamp;
        }

        this.updateBubbles(dt);
        this.render();

        this.animFrameId = requestAnimationFrame((ts) => this.gameLoop(ts));
    }

    updateBubbles(dt) {
        const effectiveDt = this.isSlowMoActive ? dt * 0.45 : dt;
        const thornY = this.canvas.height - this.thornsHeight;

        for (let i = this.bubbles.length - 1; i >= 0; i--) {
            const b = this.bubbles[i];

            if (b.isPopping) {
                b.popProgress += dt * 5.0;
                if (b.popProgress >= 1.0) {
                    this.bubbles.splice(i, 1);
                    continue;
                }
            } else {
                b.y += b.speed * 60 * effectiveDt;
                b.driftPhase += b.driftSpeed;
                b.x = b.baseX + Math.sin(b.driftPhase) * b.driftAmplitude;

                if (b.y + b.radius >= thornY) {
                    b.isPopping = true;
                    if (b.item.isTarget && !b.item.isPowerup) {
                        this.streak = 0;
                        this.lives = Math.max(0, this.lives - 1);
                        if (window.soundEngine) window.soundEngine.playThornBurst();
                        this.particleEngine.addPopBurst(b.x, thornY, '#f87171', false);
                        this.particleEngine.addFloatingText(b.x, thornY - 30, `Missed! -1 ❤️`, '#f87171');
                        this.notifyUI();
                        if (this.lives <= 0) setTimeout(() => this.triggerGameOver(), 200);
                    } else {
                        if (window.soundEngine) window.soundEngine.playSafeDodge();
                        this.particleEngine.addPopBurst(b.x, thornY, '#a7f3d0', false);
                    }
                }
            }
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particleEngine.updateAndRender();

        for (const b of this.bubbles) {
            this.drawBubble(b);
        }

        this.drawBrambles();
    }

    drawBubble(b) {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(b.x, b.y);

        if (b.isPopping) {
            const scale = 1.0 + b.popProgress * 0.4;
            const alpha = Math.max(0, 1.0 - b.popProgress);
            ctx.scale(scale, scale);
            ctx.globalAlpha = alpha;
        }

        const r = b.radius;
        const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.1, 0, 0, r);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        grad.addColorStop(0.4, 'rgba(186, 230, 253, 0.6)');
        grad.addColorStop(0.85, 'rgba(56, 189, 248, 0.45)');
        grad.addColorStop(1, 'rgba(2, 132, 199, 0.7)');

        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = Math.max(2, r * 0.05);
        ctx.stroke();

        ctx.font = '900 ' + b.fontSize + 'px "Fredoka", "Nunito", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.lineWidth = Math.max(3, b.fontSize * 0.12);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.strokeText(b.displayText, 0, 0);

        ctx.fillStyle = '#ffffff';
        ctx.fillText(b.displayText, 0, 0);

        ctx.restore();
    }

    drawBrambles() {
        const ctx = this.ctx;
        const h = this.thornsHeight;
        const y = this.canvas.height - h;
        const w = this.canvas.width;

        const grad = ctx.createLinearGradient(0, y, 0, this.canvas.height);
        grad.addColorStop(0, '#14532d');
        grad.addColorStop(0.5, '#064e3b');
        grad.addColorStop(1, '#022c22');
        ctx.fillStyle = grad;
        ctx.fillRect(0, y, w, h);

        ctx.strokeStyle = '#052e16';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let x = 0; x < w; x += 18) {
            const spikeH = (x % 36 === 0) ? h * 0.55 : h * 0.35;
            ctx.moveTo(x, y + 10);
            ctx.lineTo(x + 9, y - spikeH);
            ctx.lineTo(x + 18, y + 10);
        }
        ctx.stroke();
    }
}

window.BubbleGameEngine = BubbleGameEngine;
