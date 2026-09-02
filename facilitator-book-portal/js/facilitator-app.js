/**
 * Facilitator Portal Application Controller
 * Powered reactively by TemplateManager so any template customization
 * updates the entire 100-page UI instantly.
 */

class FacilitatorApp {
    constructor() {
        this.templateManager = window.templateManager;
        this.currentFilterUnit = null; // null = all units
        this.searchQuery = "";
        this.selectedPage = null;

        this.initDOM();
        this.initEventListeners();
        this.renderAll();

        // Listen for template changes
        this.templateManager.onTemplateUpdated = () => {
            this.renderAll();
            if (this.selectedPage) {
                this.openPageActivities(this.selectedPage.pageNumber);
            }
        };

        // Initialize Template Editor
        this.templateEditor = new TemplateEditor(this.templateManager);

        // Check if hash points to a specific page (e.g. #page11)
        if (window.location.hash.startsWith('#page')) {
            const num = parseInt(window.location.hash.replace('#page', ''), 10);
            if (!isNaN(num) && num >= 1 && num <= 100) {
                this.openPageActivities(num);
            }
        }
    }

    initDOM() {
        // Top Header
        this.headerBookSubtitle = document.getElementById('headerBookSubtitle');
        this.headerClassBadge = document.getElementById('headerClassBadge');
        this.btnOpenTemplateEditor = document.getElementById('btnOpenTemplateEditor');

        // Views
        this.dashboardView = document.getElementById('dashboardView');
        this.pageDetailView = document.getElementById('pageDetailView');

        // Containers
        this.unitsTabsContainer = document.getElementById('unitsTabsContainer');
        this.pagesGridContainer = document.getElementById('pagesGridContainer');
        this.searchInput = document.getElementById('searchInput');

        // Page Detail View Elements
        this.btnBackToDashboard = document.getElementById('btnBackToDashboard');
        this.btnEditCurrentPage = document.getElementById('btnEditCurrentPage');
        this.pageDetailNum = document.getElementById('pageDetailNum');
        this.pageDetailTitle = document.getElementById('pageDetailTitle');
        this.pageDetailGuide = document.getElementById('pageDetailGuide');
        this.pageActivitiesList = document.getElementById('pageActivitiesList');
    }

    initEventListeners() {
        // Search Input
        this.searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase().trim();
            this.render100PagesGrid();
        });

        // Back button from Page Detail View
        this.btnBackToDashboard.addEventListener('click', () => {
            this.showDashboardView();
        });

        // Edit current page button in detail view
        if (this.btnEditCurrentPage) {
            this.btnEditCurrentPage.addEventListener('click', () => {
                if (this.selectedPage) {
                    this.templateEditor.openEditor(this.selectedPage.pageNumber);
                    // Switch to page tab
                    document.querySelector('[data-tab="page-edit"]').click();
                }
            });
        }

        // Brand logo returns to dashboard
        document.getElementById('brandLogo').addEventListener('click', () => {
            this.showDashboardView();
        });
    }

    renderAll() {
        this.renderHeaderMeta();
        this.renderUnitTabs();
        this.render100PagesGrid();
    }

    renderHeaderMeta() {
        const meta = this.templateManager.template.meta || {};
        if (this.headerBookSubtitle) {
            this.headerBookSubtitle.textContent = `${meta.bookTitle} (${meta.totalPages || 100} Pages)`;
        }
        if (this.headerClassBadge) {
            this.headerClassBadge.innerHTML = `<span>👩‍🏫</span> ${meta.className || 'Class 1-A'}`;
        }
    }

    renderUnitTabs() {
        this.unitsTabsContainer.innerHTML = '';
        const units = this.templateManager.template.units || [];

        // All Units Tab
        const allBtn = document.createElement('button');
        allBtn.className = `unit-tab-btn ${this.currentFilterUnit === null ? 'active' : ''}`;
        allBtn.textContent = '📚 All 100 Pages';
        allBtn.addEventListener('click', () => {
            this.currentFilterUnit = null;
            this.updateActiveUnitTab();
            this.render100PagesGrid();
        });
        this.unitsTabsContainer.appendChild(allBtn);

        // Individual Unit Tabs
        units.forEach(unit => {
            const btn = document.createElement('button');
            btn.className = `unit-tab-btn ${this.currentFilterUnit === unit.id ? 'active' : ''}`;
            btn.innerHTML = `<span>${unit.id}</span> ${unit.title.split(':')[0]} (${unit.pages})`;
            btn.addEventListener('click', () => {
                this.currentFilterUnit = unit.id;
                this.updateActiveUnitTab();
                this.render100PagesGrid();
            });
            this.unitsTabsContainer.appendChild(btn);
        });
    }

    updateActiveUnitTab() {
        document.querySelectorAll('.unit-tab-btn').forEach((btn, idx) => {
            if (idx === 0) {
                btn.classList.toggle('active', this.currentFilterUnit === null);
            } else {
                btn.classList.toggle('active', this.currentFilterUnit === idx);
            }
        });
    }

    render100PagesGrid() {
        this.pagesGridContainer.innerHTML = '';
        const pages = this.templateManager.template.pages || [];

        let filtered = pages;

        // Filter by Unit
        if (this.currentFilterUnit !== null) {
            filtered = filtered.filter(p => p.unitId === this.currentFilterUnit);
        }

        // Filter by Search Query
        if (this.searchQuery) {
            filtered = filtered.filter(p => 
                p.pageNumber.toString() === this.searchQuery ||
                p.title.toLowerCase().includes(this.searchQuery) ||
                (p.unitTitle && p.unitTitle.toLowerCase().includes(this.searchQuery))
            );
        }

        if (filtered.length === 0) {
            this.pagesGridContainer.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #94a3b8;">
                    <div style="font-size: 3rem; margin-bottom: 8px;">🔍</div>
                    <h3>No pages found matching "${this.searchQuery}"</h3>
                    <p style="font-size: 0.9rem;">Try searching for a page number (e.g. 11) or a topic keyword.</p>
                </div>
            `;
            return;
        }

        filtered.forEach(page => {
            const card = document.createElement('div');
            card.className = `page-card ${page.isPage11 || page.pageNumber === 11 ? 'page-11-special' : ''}`;
            
            card.innerHTML = `
                <div>
                    <div class="page-card-top">
                        <span class="page-num-pill">Page ${page.pageNumber}</span>
                        ${page.isPage11 || page.pageNumber === 11 ? '<span class="page-special-tag">⭐ BUBBLE QUEST</span>' : ''}
                    </div>
                    <h3 class="page-card-title">${page.title}</h3>
                    <div class="page-card-unit">${page.unitTitle || `Unit ${Math.ceil(page.pageNumber / 10)}`}</div>
                </div>

                <div class="page-card-footer">
                    <div class="page-activity-count">
                        <span>🎮</span> ${page.activitiesCount || (page.activities ? page.activities.length : 1)} ${(page.activitiesCount === 1 || (page.activities && page.activities.length === 1)) ? 'Activity' : 'Activities'}
                    </div>
                    <button class="btn-card-select">Select Activities ▶</button>
                </div>
            `;

            card.addEventListener('click', () => {
                this.openPageActivities(page.pageNumber);
            });

            this.pagesGridContainer.appendChild(card);
        });
    }

    openPageActivities(pageNum) {
        const page = this.templateManager.getPage(pageNum);
        if (!page) return;

        this.selectedPage = page;
        window.location.hash = `page${pageNum}`;

        // Populate detail view
        this.pageDetailNum.textContent = `Page ${page.pageNumber} • ${page.unitTitle || `Unit ${Math.ceil(page.pageNumber / 10)}`}`;
        this.pageDetailTitle.textContent = page.title;
        this.pageDetailGuide.textContent = `${page.facilitatorObjective || ''} ${page.facilitatorTips || ''}`;

        this.renderPageActivitiesList(page);

        // Switch view
        this.dashboardView.style.display = 'none';
        this.pageDetailView.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (window.soundEngine) window.soundEngine.playSafeDodge();
    }

    renderPageActivitiesList(page) {
        this.pageActivitiesList.innerHTML = '';
        const activities = page.activities || [];

        activities.forEach(activity => {
            const card = document.createElement('div');
            card.className = `activity-card ${activity.isFeatured ? 'featured-game' : ''}`;

            card.innerHTML = `
                <div>
                    <div class="activity-card-header">
                        <div class="activity-card-icon">${activity.icon || '🎮'}</div>
                        <div>
                            <span class="activity-badge">${activity.badge || 'Activity'}</span>
                            <h3 class="activity-card-title">${activity.title}</h3>
                            <div style="font-size: 0.8rem; color: #34d399; font-weight: 700;">⏱️ ${activity.estimatedTime || '3 mins'} • Difficulty: ${activity.difficulty || 'Medium'}</div>
                        </div>
                    </div>
                    <p class="activity-desc" style="margin: 12px 0;">${activity.description || ''}</p>
                    <div class="activity-skills-tags">
                        ${(activity.skills || ['Phonics']).map(s => `<span class="skill-tag">🏷️ ${s}</span>`).join('')}
                    </div>
                </div>

                <div class="activity-card-actions" style="margin-top: 16px;">
                    <button class="btn-launch-game">
                        <span>🚀</span> Launch ${(page.isPage11 || page.pageNumber === 11) ? 'Page 11 Bubble Game' : 'Activity'}
                    </button>
                </div>
            `;

            const launchBtn = card.querySelector('.btn-launch-game');
            launchBtn.addEventListener('click', () => {
                if (window.activityRunner) {
                    window.activityRunner.launch(page, activity);
                }
            });

            this.pageActivitiesList.appendChild(card);
        });
    }

    showDashboardView() {
        this.pageDetailView.classList.remove('active');
        this.dashboardView.style.display = 'block';
        window.location.hash = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.facilitatorApp = new FacilitatorApp();
});
