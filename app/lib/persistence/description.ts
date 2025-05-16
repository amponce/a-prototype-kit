import { atom } from 'nanostores';

// This atom is extracted to break circular dependency between workbench and useChatHistory
export const description = atom<string | undefined>(undefined);
