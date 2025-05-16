import React, { useState, useEffect } from 'react';
import { openControlPanel } from '~/lib/stores/controlPanel';

interface ApiKeyNotificationProps {
  providerName: string;
}

export const ApiKeyNotification: React.FC<ApiKeyNotificationProps> = ({ providerName }) => {
  const [isDismissed, setIsDismissed] = useState(false);

  const storageKey = `dismissed_api_key_notification_${providerName}`;

  // Check if notification was previously dismissed
  useEffect(() => {
    const wasDismissed = localStorage.getItem(storageKey) === 'true';

    if (wasDismissed) {
      setIsDismissed(true);
    }
  }, [storageKey]);

  const handleDismiss = () => {
    setIsDismissed(true);

    // Store dismissal in localStorage to remember user preference
    localStorage.setItem(storageKey, 'true');
  };

  if (isDismissed) {
    return null;
  }

  return (
    <div className="mb-4 p-4 rounded-lg border border-bolt-elements-borderColor">
      <div className="flex items-start gap-3">
        <div className="i-ph:warning-circle-fill text-amber-500 flex-shrink-0 w-5 h-5 mt-0.5" />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium text-bolt-elements-textPrimary mb-1">API Key Required</h3>
            <button
              onClick={handleDismiss}
              className="text-bolt-elements-textTertiary hover:text-bolt-elements-textSecondary -mt-1 -mr-1 p-1 rounded-full transition-colors"
              aria-label="Dismiss notification"
            >
              <div className="i-ph:x w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-bolt-elements-textSecondary mb-2">
            {providerName === 'AI'
              ? 'You need to select a model and add an API key to use AI features. Please configure this in the Control Panel.'
              : `To use ${providerName}, please add your API key in the Control Panel (Model Selection). Without an API key, you won't be able to use the AI features.`}
          </p>
          <button
            onClick={() => {
              // Use the global function to open the control panel
              openControlPanel();
            }}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors bg-transparent"
          >
            <span>Open Control Panel</span>
            <span className="i-ph:arrow-right w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
