/**
 * Forest World Graphics & Particle System for Bubble Sorting Game
 */
class ForestWorldEngine {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.particles = [];
        this.clouds = [];
        this.birds = [];
        this.butterflies = [];
        this.fireflies = [];
        this.floatingLeaves = [];
        this.floatingTextEffects = [];
        this.time = 0;
        this.initWorld();
    }

    initWorld() {
        this.clouds = [
            { x: this.width * 0.1, y: 35, speed: 0.2, scale: 0.85, alpha: 0.8 },
            { x: this.width * 0.55, y: 55, speed: 0.15, scale: 1.1, alpha: 0.85 },
            { x: this.width * 0.85, y: 25, speed: 0.25, scale: 0.75, alpha: 0.75 }
        ];

        this.birds = [
            { x: -50, y: 50, speed: 1.2, size: 10, wingPhase: 0, wingSpeed: 0.18, angle: -0.05 },
            { x: -160, y: 80, speed: 1.4, size: 8, wingPhase: 1.5, wingSpeed: 0.22, angle: 0.02 }
        ];

        this.fireflies = [];
        for (let i = 0; i < 14; i++) {
            this.fireflies.push({
                x: Math.random() * this.width,
                y: this.height * 0.35 + Math.random() * (this.height * 0.55),
                size: Math.random() * 2.5 + 1.5,
                phase: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.03 + 0.02,
                driftX: (Math.random() - 0.5) * 0.3,
                driftY: (Math.random() - 0.5) * 0.3
            });
        }
    }

    resize(w, h) {
        this.width = w;
        this.height = h;
    }

    addPopBurst(x, y, color = '#38bdf8', isTarget = true) {
        const count = isTarget ? 18 : 10;
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4.5 + 1.5;
            this.particles.push({
                x: x, y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1.2,
                size: Math.random() * 4.5 + 2,
                color: isTarget ? '#facc15' : color,
                alpha: 1,
                decay: Math.random() * 0.025 + 0.015,
                type: 'spark'
            });
        }
    }

    addFloatingText(x, y, text, color = '#fef08a') {
        this.floatingTextEffects.push({
            x: x, y: y, text: text, color: color,
            alpha: 1.0, vy: -1.4, scale: 1.0
        });
    }

    updateAndRender(dt = 0.016) {
        this.time += dt;
        const ctx = this.ctx;

        // Sky gradient
        const skyGrad = ctx.createLinearGradient(0, 0, 0, this.height);
        skyGrad.addColorStop(0, '#38bdf8');
        skyGrad.addColorStop(0.35, '#7dd3fc');
        skyGrad.addColorStop(0.7, '#bae6fd');
        skyGrad.addColorStop(1, '#e0f2fe');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, this.width, this.height);

        // Clouds
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        this.clouds.forEach(c => {
            c.x += c.speed;
            if (c.x > this.width + 100) c.x = -100;
            this.drawCloud(ctx, c.x, c.y, c.scale);
        });

        // Birds
        this.birds.forEach(b => {
            b.x += b.speed;
            b.wingPhase += b.wingSpeed;
            if (b.x > this.width + 100) {
                b.x = -100;
                b.y = Math.random() * 90 + 30;
            }
            this.drawBird(ctx, b.x, b.y, b.size, Math.sin(b.wingPhase));
        });

        // Fireflies
        this.fireflies.forEach(f => {
            f.x += f.driftX;
            f.y += f.driftY;
            f.phase += f.speed;
            if (f.x < 0) f.x = this.width;
            if (f.x > this.width) f.x = 0;
            const alpha = 0.4 + 0.6 * Math.sin(f.phase);
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(250, 204, 21, ${Math.max(0, alpha)})`;
            ctx.shadowColor = '#facc15';
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
        });

        // Particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1;
            p.alpha -= p.decay;
            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
                continue;
            }
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(250, 204, 21, ${p.alpha})`;
            ctx.fill();
        }

        // Floating Text
        for (let i = this.floatingTextEffects.length - 1; i >= 0; i--) {
            const t = this.floatingTextEffects[i];
            t.y += t.vy;
            t.alpha -= 0.02;
            if (t.alpha <= 0) {
                this.floatingTextEffects.splice(i, 1);
                continue;
            }
            ctx.font = '900 20px "Fredoka", sans-serif';
            ctx.fillStyle = `rgba(254, 240, 138, ${t.alpha})`;
            ctx.strokeStyle = `rgba(0, 0, 0, ${t.alpha * 0.8})`;
            ctx.lineWidth = 4;
            ctx.textAlign = 'center';
            ctx.strokeText(t.text, t.x, t.y);
            ctx.fillText(t.text, t.x, t.y);
        }
    }

    drawCloud(ctx, x, y, scale = 1) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.beginPath();
        ctx.arc(0, 0, 22, 0, Math.PI * 2);
        ctx.arc(18, -8, 18, 0, Math.PI * 2);
        ctx.arc(36, 0, 20, 0, Math.PI * 2);
        ctx.arc(18, 10, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    drawBird(ctx, x, y, size, wingOffset) {
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-size, wingOffset * 4);
        ctx.quadraticCurveTo(-size * 0.4, -size * 0.4 + wingOffset * 2, 0, 0);
        ctx.quadraticCurveTo(size * 0.4, -size * 0.4 + wingOffset * 2, size, wingOffset * 4);
        ctx.stroke();
        ctx.restore();
    }
}

window.ForestWorldEngine = ForestWorldEngine;
