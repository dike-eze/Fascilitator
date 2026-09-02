/**
 * Visual Template Customizer Studio
 * Allows facilitators to edit book meta, customize any of the 100 pages,
 * and import/export JSON template configurations.
 */

class TemplateEditor {
    constructor(templateManager) {
        this.manager = templateManager;
        this.modal = document.getElementById('templateEditorModal');
        this.activeTab = 'book-info';
        this.selectedPageNumber = 11; // Default to Page 11 for immediate editing!

        this.initDOM();
        this.initEventListeners();
    }

    initDOM() {
        this.btnOpenModal = document.getElementById('btnOpenTemplateEditor');
        this.btnCloseModal = document.getElementById('btnCloseTemplateEditor');
        this.tabButtons = document.querySelectorAll('.editor-tab-btn');
        this.tabContents = document.querySelectorAll('.editor-tab-content');

        // Tab 1: Book Meta
        this.inputBookTitle = document.getElementById('editBookTitle');
        this.inputBookSubtitle = document.getElementById('editBookSubtitle');
        this.inputSubject = document.getElementById('editSubject');
        this.inputFacilitator = document.getElementById('editFacilitator');
        this.inputClassName = document.getElementById('editClassName');
        this.btnSaveBookMeta = document.getElementById('btnSaveBookMeta');

        // Tab 2: Page Editor
        this.selectPageNum = document.getElementById('selectEditPageNum');
        this.inputPageTitle = document.getElementById('editPageTitle');
        this.inputPageObjective = document.getElementById('editPageObjective');
        this.inputPageTips = document.getElementById('editPageTips');
        this.editorActivitiesContainer = document.getElementById('editorActivitiesContainer');
        this.btnAddPageActivity = document.getElementById('btnAddPageActivity');
        this.btnSavePageDetails = document.getElementById('btnSavePageDetails');

        // Tab 3: JSON Import/Export
        this.jsonTextArea = document.getElementById('jsonTemplateArea');
        this.btnDownloadJson = document.getElementById('btnDownloadJson');
        this.btnUploadJsonFile = document.getElementById('btnUploadJsonFile');
        this.fileInputJson = document.getElementById('fileInputJson');
        this.btnApplyJsonText = document.getElementById('btnApplyJsonText');
        this.btnResetDefaultTemplate = document.getElementById('btnResetDefaultTemplate');

        // Populate 100 page dropdown
        this.populatePageDropdown();
    }

    initEventListeners() {
        if (this.btnOpenModal) {
            this.btnOpenModal.addEventListener('click', () => this.openEditor());
        }
        if (this.btnCloseModal) {
            this.btnCloseModal.addEventListener('click', () => this.closeEditor());
        }

        // Tab switching
        this.tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.tabButtons.forEach(b => b.classList.remove('active'));
                this.tabContents.forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                const tabId = btn.dataset.tab;
                document.getElementById(`tab-${tabId}`).classList.add('active');
                if (tabId === 'json-io') {
                    this.jsonTextArea.value = this.manager.exportJSON();
                }
            });
        });

        // Save Book Meta
        if (this.btnSaveBookMeta) {
            this.btnSaveBookMeta.addEventListener('click', () => {
                this.manager.updateBookMeta({
                    bookTitle: this.inputBookTitle.value.trim(),
                    bookSubtitle: this.inputBookSubtitle.value.trim(),
                    subject: this.inputSubject.value.trim(),
                    facilitatorName: this.inputFacilitator.value.trim(),
                    className: this.inputClassName.value.trim()
                });
                alert('✅ Book details saved successfully!');
            });
        }

        // Page selector change
        if (this.selectPageNum) {
            this.selectPageNum.addEventListener('change', (e) => {
                this.selectedPageNumber = parseInt(e.target.value, 10);
                this.loadPageIntoEditor(this.selectedPageNumber);
            });
        }

        // Save Page Details
        if (this.btnSavePageDetails) {
            this.btnSavePageDetails.addEventListener('click', () => {
                this.saveCurrentPageDetails();
            });
        }

        // Add Activity Button
        if (this.btnAddPageActivity) {
            this.btnAddPageActivity.addEventListener('click', () => {
                this.addNewActivityToCurrentPage();
            });
        }

        // Export JSON File
        if (this.btnDownloadJson) {
            this.btnDownloadJson.addEventListener('click', () => {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(this.manager.exportJSON());
                const downloadAnchor = document.createElement('a');
                downloadAnchor.setAttribute("href", dataStr);
                downloadAnchor.setAttribute("download", `book-template-100-pages.json`);
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                downloadAnchor.remove();
            });
        }

        // Import JSON File
        if (this.btnUploadJsonFile && this.fileInputJson) {
            this.btnUploadJsonFile.addEventListener('click', () => this.fileInputJson.click());
            this.fileInputJson.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => {
                    const result = this.manager.importJSON(event.target.result);
                    if (result.success) {
                        alert('✅ Template JSON imported and applied successfully!');
                        this.loadMetaIntoEditor();
                        this.loadPageIntoEditor(this.selectedPageNumber);
                        this.jsonTextArea.value = this.manager.exportJSON();
                    } else {
                        alert('❌ Import Failed: ' + result.error);
                    }
                };
                reader.readAsText(file);
            });
        }

        // Apply JSON Text from Textarea
        if (this.btnApplyJsonText) {
            this.btnApplyJsonText.addEventListener('click', () => {
                const result = this.manager.importJSON(this.jsonTextArea.value);
                if (result.success) {
                    alert('✅ Custom JSON template applied successfully!');
                    this.loadMetaIntoEditor();
                    this.loadPageIntoEditor(this.selectedPageNumber);
                } else {
                    alert('❌ Failed to apply JSON: ' + result.error);
                }
            });
        }

        // Reset to Default
        if (this.btnResetDefaultTemplate) {
            this.btnResetDefaultTemplate.addEventListener('click', () => {
                if (confirm('Are you sure you want to reset the entire template back to the default 100-Page Phonics Book?')) {
                    this.manager.resetToDefault();
                    this.loadMetaIntoEditor();
                    this.loadPageIntoEditor(this.selectedPageNumber);
                    this.jsonTextArea.value = this.manager.exportJSON();
                    alert('🔄 Template reset to default.');
                }
            });
        }
    }

    populatePageDropdown() {
        if (!this.selectPageNum) return;
        this.selectPageNum.innerHTML = '';
        for (let i = 1; i <= 100; i++) {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = `Page ${i}${i === 11 ? ' (⭐ Bubble Quest Game)' : ''}`;
            if (i === this.selectedPageNumber) opt.selected = true;
            this.selectPageNum.appendChild(opt);
        }
    }

    openEditor(defaultPageNum = 11) {
        this.selectedPageNumber = defaultPageNum;
        if (this.selectPageNum) this.selectPageNum.value = defaultPageNum;
        this.loadMetaIntoEditor();
        this.loadPageIntoEditor(this.selectedPageNumber);
        this.modal.classList.add('active');
        if (window.soundEngine) window.soundEngine.playSafeDodge();
    }

    closeEditor() {
        this.modal.classList.remove('active');
    }

    loadMetaIntoEditor() {
        const meta = this.manager.template.meta || {};
        if (this.inputBookTitle) this.inputBookTitle.value = meta.bookTitle || "";
        if (this.inputBookSubtitle) this.inputBookSubtitle.value = meta.bookSubtitle || "";
        if (this.inputSubject) this.inputSubject.value = meta.subject || "";
        if (this.inputFacilitator) this.inputFacilitator.value = meta.facilitatorName || "";
        if (this.inputClassName) this.inputClassName.value = meta.className || "";
    }

    loadPageIntoEditor(pageNum) {
        const page = this.manager.getPage(pageNum);
        if (!page) return;

        if (this.inputPageTitle) this.inputPageTitle.value = page.title;
        if (this.inputPageObjective) this.inputPageObjective.value = page.facilitatorObjective || "";
        if (this.inputPageTips) this.inputPageTips.value = page.facilitatorTips || "";

        this.renderActivitiesEditorList(page);
    }

    renderActivitiesEditorList(page) {
        if (!this.editorActivitiesContainer) return;
        this.editorActivitiesContainer.innerHTML = '';

        page.activities.forEach((act, idx) => {
            const card = document.createElement('div');
            card.className = 'editor-activity-row';
            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <div style="font-weight: 800; color: #facc15; font-size: 0.95rem;">
                        Activity #${idx + 1} (${act.badge || 'Activity'})
                    </div>
                    ${page.activities.length > 1 ? `<button type="button" class="btn-remove-act" data-idx="${idx}" style="background: rgba(239,68,68,0.2); border: 1px solid #ef4444; color: #fca5a5; padding: 2px 8px; border-radius: 6px; cursor: pointer; font-size: 0.75rem;">✕ Remove</button>` : ''}
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
                    <div>
                        <label style="font-size: 0.8rem; color: #94a3b8; display: block; margin-bottom: 2px;">Activity Title</label>
                        <input type="text" class="act-title-input" data-idx="${idx}" value="${escapeHtml(act.title)}" style="width: 100%; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 6px 10px; border-radius: 8px; font-size: 0.88rem;">
                    </div>
                    <div>
                        <label style="font-size: 0.8rem; color: #94a3b8; display: block; margin-bottom: 2px;">Game Engine Type</label>
                        <select class="act-type-select" data-idx="${idx}" style="width: 100%; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 6px 10px; border-radius: 8px; font-size: 0.88rem;">
                            <option value="forest-bubble-quest" ${act.gameEngineType === 'forest-bubble-quest' || page.pageNumber === 11 ? 'selected' : ''}>🫧 Forest Bubble Quest Game</option>
                            <option value="mini-catcher" ${act.gameEngineType === 'mini-catcher' ? 'selected' : ''}>🎮 Letter / Sound Catcher</option>
                            <option value="quiz" ${act.type === 'quiz' ? 'selected' : ''}>📝 Comprehension Quiz</option>
                            <option value="soundboard" ${act.type === 'soundboard-practice' ? 'selected' : ''}>🗣️ Audio Flashcards Soundboard</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label style="font-size: 0.8rem; color: #94a3b8; display: block; margin-bottom: 2px;">Description & Instructions</label>
                    <input type="text" class="act-desc-input" data-idx="${idx}" value="${escapeHtml(act.description)}" style="width: 100%; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 6px 10px; border-radius: 8px; font-size: 0.88rem;">
                </div>
            `;

            this.editorActivitiesContainer.appendChild(card);
        });

        // Attach remove buttons
        this.editorActivitiesContainer.querySelectorAll('.btn-remove-act').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.dataset.idx, 10);
                page.activities.splice(idx, 1);
                this.renderActivitiesEditorList(page);
            });
        });
    }

    addNewActivityToCurrentPage() {
        const page = this.manager.getPage(this.selectedPageNumber);
        if (!page) return;

        page.activities.push({
            id: `act-${page.pageNumber}-${page.activities.length + 1}`,
            title: `Custom Practice Game`,
            type: "interactive-game",
            gameEngineType: "mini-catcher",
            isFeatured: false,
            badge: "Custom Activity",
            icon: "⭐",
            description: "Custom learner activity for this page.",
            skills: ["Phonics", "Practice"],
            difficulty: "Medium",
            estimatedTime: "3 mins"
        });

        this.renderActivitiesEditorList(page);
    }

    saveCurrentPageDetails() {
        const page = this.manager.getPage(this.selectedPageNumber);
        if (!page) return;

        page.title = this.inputPageTitle.value.trim();
        page.facilitatorObjective = this.inputPageObjective.value.trim();
        page.facilitatorTips = this.inputPageTips.value.trim();

        // Read activity row edits
        const titleInputs = this.editorActivitiesContainer.querySelectorAll('.act-title-input');
        const typeSelects = this.editorActivitiesContainer.querySelectorAll('.act-type-select');
        const descInputs = this.editorActivitiesContainer.querySelectorAll('.act-desc-input');

        titleInputs.forEach((inp, i) => {
            if (page.activities[i]) {
                page.activities[i].title = inp.value.trim();
                page.activities[i].gameEngineType = typeSelects[i].value;
                if (typeSelects[i].value === 'quiz') page.activities[i].type = 'quiz';
                page.activities[i].description = descInputs[i].value.trim();
            }
        });

        page.activitiesCount = page.activities.length;
        this.manager.updatePage(this.selectedPageNumber, page);
        alert(`✅ Page ${this.selectedPageNumber} updated and saved to template!`);
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

window.TemplateEditor = TemplateEditor;
