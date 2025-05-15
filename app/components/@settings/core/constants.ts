import type { TabType } from './types';

export const TAB_ICONS: Record<TabType, string> = {
  profile: 'i-ph:user-circle-duotone',
  settings: 'i-ph:gear-six-duotone',
  notifications: 'i-ph:bell-duotone',
  features: 'i-ph:star-duotone',
  data: 'i-ph:database-duotone',
  'cloud-providers': 'i-ph:cloud-duotone',
  'local-providers': 'i-ph:desktop-duotone',
  'service-status': 'i-ph:activity-duotone',
  connection: 'i-ph:wifi-high-duotone',
  debug: 'i-ph:bug-duotone',
  'event-logs': 'i-ph:clipboard-text-duotone',
  update: 'i-ph:cloud-arrow-down-duotone',
  'task-manager': 'i-ph:chart-line-duotone',
  'model-selection': 'i-ph:brain-duotone',
  'tab-management': 'i-ph:tabs-duotone',
};

export const TAB_LABELS: Record<TabType, string> = {
  profile: 'Profile',
  settings: 'Settings',
  notifications: 'Notifications',
  features: 'Features',
  data: 'Data Management',
  'cloud-providers': 'Cloud Providers',
  'local-providers': 'Local Providers',
  'service-status': 'Service Status',
  connection: 'Connection',
  debug: 'Debug',
  'event-logs': 'Event Logs',
  update: 'Updates',
  'task-manager': 'Task Manager',
  'model-selection': 'Model Selection',
  'tab-management': 'Tab Management',
};

export const TAB_DESCRIPTIONS: Record<TabType, string> = {
  profile: 'Manage your profile and account settings',
  settings: 'Configure application preferences',
  notifications: 'View and manage your notifications',
  features: 'Explore new and upcoming features',
  data: 'Manage your data and storage',
  'cloud-providers': 'Configure cloud AI providers and models',
  'local-providers': 'Configure local AI providers and models',
  'service-status': 'Monitor cloud LLM service status',
  connection: 'Check connection status and settings',
  debug: 'Debug tools and system information',
  'event-logs': 'View system events and logs',
  update: 'Check for updates and release notes',
  'task-manager': 'Monitor system resources and processes',
  'model-selection': 'Select and configure AI models',
  'tab-management': 'Configure visible tabs and their order',
};

export const DEFAULT_TAB_CONFIG = [
  // User Window Tabs (Always visible by default)
  { id: 'features', visible: true, window: 'user' as const, order: 0 },
  { id: 'data', visible: true, window: 'user' as const, order: 1 },
  { id: 'cloud-providers', visible: true, window: 'user' as const, order: 2 },
  { id: 'local-providers', visible: true, window: 'user' as const, order: 3 },
  { id: 'model-selection', visible: true, window: 'user' as const, order: 4 },
  { id: 'connection', visible: true, window: 'user' as const, order: 5 },
  { id: 'notifications', visible: true, window: 'user' as const, order: 6 },
  { id: 'event-logs', visible: true, window: 'user' as const, order: 7 },

  // User Window Tabs (In dropdown, initially hidden)
  { id: 'profile', visible: false, window: 'user' as const, order: 8 },
  { id: 'settings', visible: false, window: 'user' as const, order: 9 },
  { id: 'task-manager', visible: false, window: 'user' as const, order: 10 },
  { id: 'service-status', visible: false, window: 'user' as const, order: 11 },

  // User Window Tabs (Hidden, controlled by TaskManagerTab)
  { id: 'debug', visible: false, window: 'user' as const, order: 12 },
  { id: 'update', visible: false, window: 'user' as const, order: 13 },

  // Developer Window Tabs (All visible by default)
  { id: 'features', visible: true, window: 'developer' as const, order: 0 },
  { id: 'data', visible: true, window: 'developer' as const, order: 1 },
  { id: 'cloud-providers', visible: true, window: 'developer' as const, order: 2 },
  { id: 'local-providers', visible: true, window: 'developer' as const, order: 3 },
  { id: 'model-selection', visible: true, window: 'developer' as const, order: 4 },
  { id: 'connection', visible: true, window: 'developer' as const, order: 5 },
  { id: 'notifications', visible: true, window: 'developer' as const, order: 6 },
  { id: 'event-logs', visible: true, window: 'developer' as const, order: 7 },
  { id: 'profile', visible: true, window: 'developer' as const, order: 8 },
  { id: 'settings', visible: true, window: 'developer' as const, order: 9 },
  { id: 'task-manager', visible: true, window: 'developer' as const, order: 10 },
  { id: 'service-status', visible: true, window: 'developer' as const, order: 11 },
  { id: 'debug', visible: true, window: 'developer' as const, order: 12 },
  { id: 'update', visible: true, window: 'developer' as const, order: 13 },
];
