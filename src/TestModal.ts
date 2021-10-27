import { App, Modal, Notice, Setting, TAbstractFile, TFile, TFolder, Vault } from "obsidian";
import PromptProvider from "./PromptProvider";
import PromptWriter from "./PromptWriter";
import { MyPluginSettings } from "./types";

export default class TestModal extends Modal {

	settings: MyPluginSettings
	folderPath: string
	addToHistory: (prompt: string) => void
	promptProvider: PromptProvider
	promptWriter: PromptWriter

	constructor(app: App, settigns: MyPluginSettings, addToHistory: (prompt: string) => void) {
		super(app);
		this.settings = settigns
		this.addToHistory = addToHistory
		this.promptProvider = new PromptProvider(this.app.vault)
		this.promptWriter = new PromptWriter(this.app, this.settings.exportSettings)
	}

	onOpen() {
		const { contentEl } = this;

		if (!this.folderPath || this.folderPath == '') {
			this.folderPath = this.settings.defaultSearchTerm
		}

		const promptResult = this.promptProvider.randomPrompt(this.folderPath, this.settings.categories)
		if (promptResult) {
			const { prompt } = promptResult
			contentEl.setText(prompt)

			this.addToHistory(prompt)

			new Setting(contentEl)
				.addButton(btn => btn
					.setButtonText('Re-roll!')
					.onClick(async (evt) => {
						this.close()
						new TestModal(this.app, this.settings, this.addToHistory).open()
					}))

			new Setting(contentEl)
				.addButton(btn => btn
					.setButtonText('Print history')
					.onClick(async (evt) => {
						this.settings.history.forEach(e => console.log(e))
					}))

			new Setting(contentEl)
				.addButton(btn => btn
					.setButtonText('Create note!')
					.setCta()
					.onClick(async (evt) => {
						const res = await this.promptWriter.writePrompt(promptResult)
						if(res){
							this.close()
						}
					}))
		} else {
			new Notice(`'${this.folderPath}' is not a folder! Check your settings!`)
			this.close()
		}
	}

	onClose() {
		let { contentEl } = this;
		contentEl.empty();
	}
}