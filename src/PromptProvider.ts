import { Notice, TFile, TFolder, Vault } from "obsidian"
import { PromptResult, PromptType } from "./types"

export default class PromptProvider {

  vault: Vault

  constructor(vault: Vault) {
    this.vault = vault
  }

  randomPrompt(folderPath: string, categories: string[]): PromptResult | undefined {
    const folder = this.vault.getAbstractFileByPath(folderPath)
    if (folder instanceof TFolder) {
      const files: TFile[] = []
      Vault.recurseChildren(folder, (f) => {
        if (f instanceof TFile && f.extension == 'md') {
          files.push(f)
        }
      })
      const promptFn = this.randomElement([this.randomSingle.bind(this), this.randomDual.bind(this)])
      const prompt = promptFn(files, categories)
      console.log(prompt);
      return prompt
    }
  }

  randomSingle(files: TFile[], categories: string[]): PromptResult {
    const chosenElement = this.randomElement(files)
    const chosenCategory = this.randomElement(categories)

    return {
      prompt: `Tell me of a(n) [[${chosenCategory}]] that is related to [[${chosenElement.basename}]]`,
      category: chosenCategory,
      type: PromptType.SINGLE,
      note1: chosenElement.basename
    }
  }

  randomDual(files: TFile[], categories: string[]): PromptResult {
    const firstElement = this.randomElement(files)
    const secondlement = this.randomElement(files, (item) => item.basename === firstElement.basename)
    const chosenCategory = this.randomElement(categories)

    return {
      prompt: `Tell me of a(n) [[${chosenCategory}]] that connects [[${firstElement.basename}]] to [[${secondlement.basename}]]`,
      category: chosenCategory,
      type: PromptType.DUAL,
      note1: firstElement.basename,
      note2: secondlement.basename,
    }
  }

  randomElement<T>(arr: T[], taboo?: (item: T) => boolean, iter?: number): T {
    iter = iter || 1
    const index = Math.floor(Math.random() * arr.length)
    const result = arr[index]
    if (taboo && taboo(result) && iter < 1000) {
      return this.randomElement(arr, taboo, iter && iter + 1)
    } else {
      return result
    }
  }
}