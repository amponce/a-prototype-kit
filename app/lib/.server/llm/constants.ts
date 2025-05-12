// see https://docs.anthropic.com/en/docs/about-claude/models
// Default max tokens to use if not specified in model config
export const MAX_TOKENS = 64000;

// Map of models to their maximum context window sizes
export const MODEL_MAX_TOKENS: Record<string, number> = {
  'claude-3-7-sonnet-20250219': 128000,
  'claude-3-5-sonnet-latest': 200000,
  'anthropic.claude-3-5-sonnet-20241022-v2:0': 200000,
  'default': 64000,
};

// limits the number of model responses that can be returned in a single request
export const MAX_RESPONSE_SEGMENTS = 2;

export interface File {
  type: 'file';
  content: string;
  isBinary: boolean;
}

export interface Folder {
  type: 'folder';
}

type Dirent = File | Folder;

export type FileMap = Record<string, Dirent | undefined>;

export const IGNORE_PATTERNS = [
  'node_modules/**',
  '.git/**',
  'dist/**',
  'build/**',
  '.next/**',
  'coverage/**',
  '.cache/**',
  '.vscode/**',
  '.idea/**',
  '**/*.log',
  '**/.DS_Store',
  '**/npm-debug.log*',
  '**/yarn-debug.log*',
  '**/yarn-error.log*',
  '**/*lock.json',
  '**/*lock.yml',
];
