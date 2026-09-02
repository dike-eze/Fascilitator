/**
 * Template Manager for 100-Page Facilitator Portal
 * Handles template state, localStorage persistence, JSON import/export, and schema validation.
 */

class TemplateManager {
    constructor() {
        this.storageKey = 'eduquest_custom_book_template';
        this.template = this.loadTemplate();
        this.onTemplateUpdated = null;
    }

    getDefaultTemplate() {
        return {
            version: "1.0",
            meta: {
                bookTitle: "The Secret of the Phonics Forest",
                bookSubtitle: "100-Page Core Phonics & Literacy Curriculum Book",
                subject: "Early Elementary Phonics",
                facilitatorName: "Teacher Alex",
                className: "Class 1-A (24 Learners)",
                totalPages: 100,
                themeColor: "#10b981"
            },
            units: window.CURRICULUM_UNITS ? [...window.CURRICULUM_UNITS] : [],
            pages: window.FULL_100_PAGES_DATA ? JSON.parse(JSON.stringify(window.FULL_100_PAGES_DATA)) : []
        };
    }

    loadTemplate() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed && parsed.pages && parsed.pages.length === 100) {
                    return parsed;
                }
            }
        } catch (e) {
            console.warn("Could not parse saved template from localStorage, using default.", e);
        }
        return this.getDefaultTemplate();
    }

    saveTemplate(newTemplate) {
        if (!newTemplate || !newTemplate.pages || newTemplate.pages.length !== 100) {
            throw new Error("Invalid template: Must contain exactly 100 pages.");
        }
        this.template = newTemplate;
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.template));
        } catch (e) {
            console.error("Failed to save template to localStorage", e);
        }
        if (this.onTemplateUpdated) {
            this.onTemplateUpdated(this.template);
        }
        return true;
    }

    updateBookMeta(metaUpdates) {
        this.template.meta = { ...this.template.meta, ...metaUpdates };
        this.saveTemplate(this.template);
    }

    updatePage(pageNumber, pageUpdates) {
        const idx = this.template.pages.findIndex(p => p.pageNumber === pageNumber);
        if (idx !== -1) {
            this.template.pages[idx] = { ...this.template.pages[idx], ...pageUpdates };
            this.saveTemplate(this.template);
            return true;
        }
        return false;
    }

    getPage(pageNumber) {
        return this.template.pages.find(p => p.pageNumber === pageNumber) || null;
    }

    resetToDefault() {
        const def = this.getDefaultTemplate();
        this.saveTemplate(def);
        return def;
    }

    exportJSON() {
        return JSON.stringify(this.template, null, 2);
    }

    importJSON(jsonString) {
        try {
            const parsed = JSON.parse(jsonString);
            if (!parsed.pages || parsed.pages.length !== 100) {
                return { success: false, error: "JSON template must contain an array of exactly 100 pages." };
            }
            if (!parsed.meta) {
                parsed.meta = this.getDefaultTemplate().meta;
            }
            if (!parsed.units || parsed.units.length === 0) {
                parsed.units = this.getDefaultTemplate().units;
            }
            this.saveTemplate(parsed);
            return { success: true };
        } catch (e) {
            return { success: false, error: "Invalid JSON syntax: " + e.message };
        }
    }
}

window.templateManager = new TemplateManager();
