import { atom } from 'nanostores';

console.log('[Cloudflare Diagnostic] Initializing streaming state');
export const streamingState = atom<boolean>(false);
console.log('[Cloudflare Diagnostic] Streaming state initialized successfully');
