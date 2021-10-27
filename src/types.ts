export interface MyPluginSettings {
	defaultSearchTerm: string;
	categories: string[],
	history: string[],
	exportSettings: ExportSettings
}

export type ExportSettings = {
	singleTemplate?: string
	dualTemplate?: string
}

export type PromptResult = {
  prompt: string
  category: string
  type: PromptType
  note1: string
  note2?: string
}

export enum PromptType {SINGLE, DUAL}