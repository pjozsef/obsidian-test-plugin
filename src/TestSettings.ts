import { App, PluginSettingTab, Setting } from 'obsidian'
import MyPlugin from '../main'

export default class TestSettings extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Settings for my awesome plugin.' });

		new Setting(containerEl)
			.setName('Categories')
			.setDesc('Define your categories separated by commas. ","')
			.addTextArea(text => text
				.setPlaceholder('category1, category2')
				.setValue(this.plugin.settings.categories.join(', '))
				.onChange(async (value) => {
					this.plugin.settings.categories = value.split(',').map(v => v.trim());
					await this.plugin.saveSettings();
				}))

		new Setting(containerEl)
			.setName('Default search')
			.setDesc('Define a search term to used as default.')
			.addText(text => text
				.setValue(this.plugin.settings.defaultSearchTerm)
				.onChange(async (value) => {
					this.plugin.settings.defaultSearchTerm = value;
					await this.plugin.saveSettings();
				}))

		new Setting(containerEl)
			.setName('Single template path')
			.setDesc('Leave empty to turn off templating.')
			.addText(text => text
				.setValue(this.plugin.settings.exportSettings.singleTemplate)
				.onChange(async (value) => {
					this.plugin.settings.exportSettings.singleTemplate = value;
					await this.plugin.saveSettings();
				}))

		new Setting(containerEl)
			.setName('Dual template path')
			.setDesc('Leave empty to turn off templating.')
			.addText(text => text
				.setValue(this.plugin.settings.exportSettings.dualTemplate)
				.onChange(async (value) => {
					this.plugin.settings.exportSettings.dualTemplate = value;
					await this.plugin.saveSettings();
				}))
	}
}