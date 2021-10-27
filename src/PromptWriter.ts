import { App, Notice, TFile, Vault } from "obsidian";
import { ExportSettings, PromptResult, PromptType } from "./types";

export default class PromptWriter {
  app: App
  exportSettings: ExportSettings

  constructor(app: App, exportSettings: ExportSettings) {
    this.app = app
    this.exportSettings = exportSettings
  }

  async writePrompt(promptResult: PromptResult): Promise<boolean> {
    const file = await this.createFile(promptResult)
    if (file) {
      const content = await this.app.vault.read(file)
      const replaced = content
        .replaceAll('((category))', promptResult.category)
        .replaceAll('((note1))', promptResult.note1)
        .replaceAll('((note2))', promptResult.note2 || '')
        .replaceAll('((prompt))', promptResult.prompt)
      await this.app.vault.modify(file, replaced)
      await this.app.workspace.openLinkText(file.basename, file.path, true)
      return true
    } else {
      return false
    }
  }

  async createFile(promptResult: PromptResult): Promise<TFile> {
    const fileName = this.fileName(promptResult)

    const newFileExists = await this.app.vault.adapter.exists(fileName)
    if (newFileExists) {
      new Notice(`Note already exists: ${fileName}`)
      return
    }

    const strategies = [
      () => { return this.copyFromTemplate(promptResult, fileName, PromptType.SINGLE, 'singleTemplate') },
      () => { return this.copyFromTemplate(promptResult, fileName, PromptType.DUAL, 'dualTemplate') },
      () => { return this.app.vault.create(fileName, promptResult.prompt) },
    ]

    for(let strategy of strategies){
      const result = await strategy()
      if(result){
        return result
      }
    }
  }

  async copyFromTemplate(promptResult: PromptResult, fileName: string, type: PromptType, templateProperty: 'singleTemplate' | 'dualTemplate'): Promise<TFile | undefined> {
    const template = this.exportSettings[templateProperty]

    if (promptResult.type == type && template) {
      const templateExists = await this.app.vault.adapter.exists(template)
      if (templateExists) {
        const file = this.app.vault.getAbstractFileByPath(template)
        if (file && file instanceof TFile) {
          return this.app.vault.copy(file, fileName)
        }
      } else {
        new Notice(`Template not found: ${template}`)
      }
    }
  }

  fileName(promptResult: PromptResult) {
    const fileName = `${promptResult.category} related to ${promptResult.note1}`
    const secondNote = promptResult.note2 && ` and ${promptResult.note2}` || ''
    return `${fileName}${secondNote}.md`
  }
}