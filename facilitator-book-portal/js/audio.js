/**
 * Clean Single-Pronunciation Audio Engine
 * Plays exactly ONE clear audio pronunciation for whatever letter, sound, or word is in the popped bubble.
 * Supports direct audio file URLs (.mp3/.wav) and native SpeechSynthesis voice pronunciation.
 */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.sfxEnabled = true;
        this.speechEnabled = true;
        this.synth = window.speechSynthesis || null;
        this.isInitialized = false;
        this.bestVoice = null;
        this.activeAudio = null;

        if (this.synth && this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = () => this.selectBestVoice();
        }
    }

    init() {
        if (this.isInitialized) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
            this.selectBestVoice();
            this.isInitialized = true;
        } catch (e) {
            console.warn("Web Audio API not supported", e);
        }
    }

    ensureContext() {
        this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    selectBestVoice() {
        if (!this.synth) return;
        try {
            const voices = this.synth.getVoices();
            if (!voices || voices.length === 0) return;
            this.bestVoice = voices.find(v => 
                v.lang.startsWith('en') && 
                (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Jenny') || v.name.includes('Zira'))
            ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
        } catch (e) {}
    }

    playPop(pitchMod = 1.0) {
        if (!this.sfxEnabled || !this.ctx) return;
        this.ensureContext();
        const now = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        const baseFreq = 420 * pitchMod;

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(baseFreq, now);
        osc1.frequency.exponentialRampToValueAtTime(baseFreq * 2.4, now + 0.07);
        gain1.gain.setValueAtTime(0.35, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc1.connect(gain1);
        gain1.connect(this.ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.09);
    }

    playCombo(streak = 1) {
        if (!this.sfxEnabled || !this.ctx) return;
        this.ensureContext();
        const pentatonic = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
        const idx = Math.min((streak - 1) % pentatonic.length, pentatonic.length - 1);
        const freq = pentatonic[idx];
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.36);
    }

    playError() {
        if (!this.sfxEnabled || !this.ctx) return;
        this.ensureContext();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.18);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
    }

    playThornBurst() {
        if (!this.sfxEnabled || !this.ctx) return;
        this.ensureContext();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
    }

    playSafeDodge() {
        if (!this.sfxEnabled || !this.ctx) return;
        this.ensureContext();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
    }

    playVictory() {
        if (!this.sfxEnabled || !this.ctx) return;
        this.ensureContext();
        const fanfareNotes = [392.00, 493.88, 587.33, 783.99, 987.77, 1174.66, 1567.98];
        fanfareNotes.forEach((freq, i) => {
            const time = this.ctx.currentTime + (i * 0.08);
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = i === fanfareNotes.length - 1 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, time);
            const dur = i === fanfareNotes.length - 1 ? 0.7 : 0.25;
            gain.gain.setValueAtTime(0.25, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(time);
            osc.stop(time + dur + 0.05);
        });
    }

    /**
     * Pronounce EXACTLY ONE audio sound for whatever is in this bubble
     */
    speakWordOrSound(item, rate = 0.92) {
        if (!this.speechEnabled) return;

        // 1. If a direct audio file URL is specified (e.g. 'sounds/b.mp3'), play that exact single file
        if (item && item.audioUrl) {
            try {
                if (this.activeAudio) {
                    this.activeAudio.pause();
                    this.activeAudio.currentTime = 0;
                }
                this.activeAudio = new Audio(item.audioUrl);
                this.activeAudio.play().catch(() => {});
                return;
            } catch (e) {}
        }

        // 2. Otherwise, pronounce the single letter or sound using SpeechSynthesis
        if (!this.synth) return;
        setTimeout(() => {
            try {
                // Exactly what is in the bubble: "B", "C", "D", "A", etc.
                const singleText = (item.text || item.sound || '').trim();
                if (!singleText) return;

                if (this.synth.speaking) {
                    this.synth.cancel();
                }

                const utterance = new SpeechSynthesisUtterance(singleText);
                utterance.rate = rate;
                utterance.pitch = 1.15; // Clean, natural, clear pitch

                if (this.bestVoice) {
                    utterance.voice = this.bestVoice;
                }
                utterance.lang = 'en-US';

                this.synth.speak(utterance);
            } catch (e) {}
        }, 0);
    }

    toggleSfx() {
        this.sfxEnabled = !this.sfxEnabled;
        return this.sfxEnabled;
    }

    toggleSpeech() {
        this.speechEnabled = !this.speechEnabled;
        if (!this.speechEnabled) {
            if (this.synth) this.synth.cancel();
            if (this.activeAudio) {
                this.activeAudio.pause();
                this.activeAudio.currentTime = 0;
            }
        }
        return this.speechEnabled;
    }
}

window.soundEngine = new SoundEngine();
