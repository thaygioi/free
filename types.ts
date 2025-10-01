export interface FileDetails {
  base64: string;
  dataUrl: string;
  mimeType: string;
}

export type RestorationMode = 'repair' | 'enhance' | 'colorize' | 'comprehensive';

export interface PresetPrompt {
  name: string;
  prompt: string;
}

export type Gender = 'male' | 'female';
