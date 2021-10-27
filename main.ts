import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, prepareFuzzySearch, Setting } from 'obsidian';
import TestModal from 'src/TestModal';
import TestSettings from 'src/TestSettings';
import { MyPluginSettings } from 'src/types';

const DEFAULT_SETTINGS: MyPluginSettings = {
	defaultSearchTerm: '',
	categories: [],
	history: [],
	exportSettings: {}
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		this.addRibbonIcon('plus-with-circle', 'Test Plugin', (evt: MouseEvent) => {
			this.showModal()
		});

		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Tell me more',
			callback: () => {
				this.showModal()
			}
		});

		this.addSettingTab(new TestSettings(this.app, this));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async addToHistory(prompt: string) {
		this.settings.history.push(prompt)
		this.saveSettings()
	}

	showModal() {
		new TestModal(this.app, this.settings, this.addToHistory.bind(this)).open();
	}
}
