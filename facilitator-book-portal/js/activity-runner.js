/**
 * Activity Runner Engine
 * Launches activities for any of the 100 pages.
 * Handles mounting the full Forest Bubble Quest on Page 11 and dynamic mini-games on other pages.
 */

class ActivityRunner {
    constructor() {
        this.modal = document.getElementById('gameRunnerModal');
        this.titleEl = document.getElementById('runnerTitle');
        this.bodyEl = document.getElementById('runnerBody');
        this.btnClose = document.getElementById('btnCloseRunner');

        this.activePage = null;
        this.activeActivity = null;
        this.bubbleEngine = null;

        if (this.btnClose) {
            this.btnClose.addEventListener('click', () => this.closeRunner());
        }
    }

    launch(page, activity) {
        this.activePage = page;
        this.activeActivity = activity;
        this.titleEl.innerHTML = `${activity.icon} Page ${page.pageNumber}: ${activity.title}`;
        this.modal.classList.add('active');

        if (activity.gameEngineType === 'forest-bubble-quest' || page.pageNumber === 11) {
            this.mountPage11BubbleQuest();
        } else if (activity.type === 'quiz') {
            this.mountQuizActivity(page, activity);
        } else {
            this.mountStandardMiniGame(page, activity);
        }
    }

    mountPage11BubbleQuest() {
        this.bodyEl.innerHTML = `
            <div id="gameApp" style="width: 100%; height: 100%; position: relative;">
                <div class="game-hud">
                    <div class="hud-top-bar">
                        <div class="hud-pill">
                            <div class="score-display">⭐ <span id="scoreVal" class="score-value">0</span></div>
                            <div id="streakBadge" class="streak-badge hidden">Combo 2x 🔥</div>
                        </div>
                        <div class="hud-pill">
                            <div id="livesContainer" class="lives-container">
                                <span class="heart">❤️</span>
                                <span class="heart">❤️</span>
                                <span class="heart">❤️</span>
                            </div>
                        </div>
                    </div>
                    <div class="mission-banner">
                        <div class="mission-label" id="hudMissionLabel">PAGE 11 SPECIAL GAME</div>
                        <div class="mission-rule" id="hudMissionRule">Pop CONSONANTS before they hit the forest brambles!</div>
                        <div class="progress-container">
                            <div id="progressFill" class="progress-fill"></div>
                        </div>
                    </div>
                </div>

                <div id="feedbackToast" class="feedback-toast">
                    <div class="feedback-icon" id="feedbackIcon">💡</div>
                    <div class="feedback-text">
                        <h4 id="feedbackTitle" style="font-size: 0.9rem; font-weight: 800; color: #fef08a;">Phonics Tip</h4>
                        <p id="feedbackMsg" style="font-size: 0.85rem;">'A' is a vowel letter, not a consonant.</p>
                    </div>
                </div>

                <div class="game-area" id="gameAreaWrapper">
                    <canvas id="gameCanvas"></canvas>
                </div>

                <div id="startModal" class="overlay-screen active">
                    <div class="modal-card" style="text-align: center;">
                        <div style="font-size: 2.6rem; margin-bottom: 4px;">🦉 🌲 🫧</div>
                        <h2 class="modal-title">Page 11: Forest Bubble Quest</h2>
                        <p class="modal-subtitle">Consonant Bramble Glade Challenge</p>
                        
                        <div class="mode-selection-group">
                            <button type="button" class="mode-chip active" data-topic="consonants-quest">🔤 Pop Consonants</button>
                            <button type="button" class="mode-chip" data-topic="vowels-quest">⭐ Pop Vowels</button>
                        </div>

                        <div class="instructions-box">
                            <ul>
                                <li>🫧 <strong>Tap to Pop:</strong> Pop target letters before they touch the ground!</li>
                                <li>🌿 <strong>Watch Thorns:</strong> If matching letters hit thorns, you lose a heart!</li>
                                <li>⭐ <strong>Power-Ups:</strong> Catch ❄️ Slow-Time, 💖 Hearts, and 🌟 Star Pops!</li>
                            </ul>
                        </div>

                        <button id="btnStartGame" class="btn-primary" style="width: 100%; font-size: 1.15rem; padding: 10px;">🚀 Play Page 11 Game!</button>
                    </div>
                </div>

                <div id="victoryModal" class="overlay-screen">
                    <div class="modal-card" style="text-align: center;">
                        <div style="font-size: 2.8rem;">🎉 🦉 🌟 🏆</div>
                        <h2 class="modal-title">Page 11 Cleared!</h2>
                        <p class="modal-subtitle">Awesome consonant & vowel mastery!</p>
                        <button id="btnReplayLevel" class="btn-primary" style="width: 100%; margin-top: 10px;">Play Again 🔄</button>
                    </div>
                </div>

                <div id="gameOverModal" class="overlay-screen">
                    <div class="modal-card" style="text-align: center;">
                        <div style="font-size: 2.6rem;">🌱 💔 🦉</div>
                        <h2 class="modal-title" style="color: #f87171;">Try Again!</h2>
                        <p class="modal-subtitle">The brambles popped too many consonants!</p>
                        <button id="btnRetry" class="btn-primary" style="width: 100%; margin-top: 10px;">Retry Game 🔄</button>
                    </div>
                </div>
            </div>
        `;

        const container = document.getElementById('gameAreaWrapper');
        const canvas = document.getElementById('gameCanvas');
        this.bubbleEngine = new BubbleGameEngine(container, canvas);

        const scoreVal = document.getElementById('scoreVal');
        const streakBadge = document.getElementById('streakBadge');
        const livesContainer = document.getElementById('livesContainer');
        const progressFill = document.getElementById('progressFill');
        const startModal = document.getElementById('startModal');
        const victoryModal = document.getElementById('victoryModal');
        const gameOverModal = document.getElementById('gameOverModal');

        this.bubbleEngine.onScoreChange = (score, streak) => {
            if (scoreVal) scoreVal.textContent = score.toLocaleString();
            if (streakBadge) {
                if (streak >= 2) {
                    streakBadge.textContent = `Combo ${streak}x 🔥`;
                    streakBadge.classList.remove('hidden');
                } else {
                    streakBadge.classList.add('hidden');
                }
            }
        };

        this.bubbleEngine.onLivesChange = (lives, maxLives) => {
            if (!livesContainer) return;
            livesContainer.innerHTML = '';
            for (let i = 0; i < maxLives; i++) {
                const span = document.createElement('span');
                span.className = `heart ${i >= lives ? 'lost' : ''}`;
                span.textContent = '❤️';
                livesContainer.appendChild(span);
            }
        };

        this.bubbleEngine.onProgressChange = (collected, goal) => {
            if (progressFill) {
                progressFill.style.width = `${Math.min(100, Math.round((collected / goal) * 100))}%`;
            }
        };

        this.bubbleEngine.onStateChange = (state) => {
            if (startModal) startModal.classList.remove('active');
            if (victoryModal) victoryModal.classList.remove('active');
            if (gameOverModal) gameOverModal.classList.remove('active');

            if (state === 'LEVEL_CLEAR' && victoryModal) victoryModal.classList.add('active');
            else if (state === 'GAME_OVER' && gameOverModal) gameOverModal.classList.add('active');
            else if (state === 'IDLE' && startModal) startModal.classList.add('active');
        };

        let selectedTopic = 'consonants-quest';
        document.querySelectorAll('.mode-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                document.querySelectorAll('.mode-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                selectedTopic = chip.dataset.topic;
            });
        });

        document.getElementById('btnStartGame').addEventListener('click', () => {
            this.bubbleEngine.startLevel(selectedTopic, 0, false);
        });

        document.getElementById('btnReplayLevel').addEventListener('click', () => {
            this.bubbleEngine.startLevel(selectedTopic, 0, false);
        });

        document.getElementById('btnRetry').addEventListener('click', () => {
            this.bubbleEngine.startLevel(selectedTopic, 0, false);
        });

        setTimeout(() => this.bubbleEngine.resizeCanvas(), 50);
    }

    mountStandardMiniGame(page, activity) {
        const letters = ["B", "C", "D", "F", "G", "A", "E", "T", "S", "M"];
        this.bodyEl.innerHTML = `
            <div style="padding: 30px; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; color: #fff; gap: 20px;">
                <div style="font-size: 4rem;">${activity.icon}</div>
                <h2 style="font-family: 'Fredoka', sans-serif; font-size: 1.8rem; color: #facc15;">Page ${page.pageNumber}: ${page.title}</h2>
                <p style="font-size: 1.1rem; color: #94a3b8; max-width: 500px;">${activity.description}</p>
                <div style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; max-width: 480px;">
                    ${letters.map(l => `
                        <button class="mini-btn-letter" onclick="this.classList.toggle('popped'); if(window.soundEngine){window.soundEngine.playPop(); window.soundEngine.speakWordOrSound({text:'${l}'});}" style="width: 70px; height: 70px; background: rgba(255,255,255,0.12); border: 2px solid rgba(255,255,255,0.3); border-radius: 14px; color: #fff; font-size: 2rem; font-weight: 800; cursor: pointer; transition: all 0.15s ease;">${l}</button>
                    `).join('')}
                </div>
                <button class="btn-primary" onclick="if(window.soundEngine) window.soundEngine.playVictory(); alert('Great job! Activity for Page ${page.pageNumber} completed!');" style="margin-top: 10px;">⭐ Complete Challenge</button>
            </div>
        `;
    }

    mountQuizActivity(page, activity) {
        this.bodyEl.innerHTML = `
            <div style="padding: 30px; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; color: #fff; gap: 16px;">
                <div style="font-size: 3.5rem;">📝</div>
                <h2 style="font-family: 'Fredoka', sans-serif; font-size: 1.6rem; color: #facc15;">Page ${page.pageNumber} Comprehension Quiz</h2>
                <div style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 14px; padding: 18px 24px; max-width: 520px; text-align: left;">
                    <p style="font-size: 1.1rem; font-weight: 700; margin-bottom: 12px;">Question 1: What is the main phonics rule on Page ${page.pageNumber}?</p>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <button class="portal-btn" style="text-align: left; padding: 10px 14px;" onclick="if(window.soundEngine) window.soundEngine.playCombo(2); alert('Correct! 🌟');">A) ${page.title}</button>
                        <button class="portal-btn" style="text-align: left; padding: 10px 14px;" onclick="if(window.soundEngine) window.soundEngine.playError(); alert('Try again!');">B) Random sound pattern</button>
                    </div>
                </div>
            </div>
        `;
    }

    closeRunner() {
        if (this.bubbleEngine) {
            this.bubbleEngine.pauseGame();
        }
        this.modal.classList.remove('active');
        this.bodyEl.innerHTML = '';
    }
}

window.activityRunner = new ActivityRunner();
