import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { selectedApiKeysStore } from '~/lib/stores/settings';
import Cookies from 'js-cookie';

interface ApiKeyNotificationProps {
  providerName: string;
}

export const ApiKeyNotification: React.FC<ApiKeyNotificationProps> = ({ providerName }) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const apiKeys = useStore(selectedApiKeysStore);
  
  const storageKey = `dismissed_api_key_notification_${providerName}`;

  // Check if notification was previously dismissed or if API key exists
  useEffect(() => {
    try {
      // Check if previously dismissed
      const wasDismissed = localStorage.getItem(storageKey) === 'true';
      
      // Check if API key exists in store
      const hasApiKey = !!apiKeys && apiKeys[providerName] && apiKeys[providerName].length > 0;
      
      // Check if API key exists in cookies (in case store isn't initialized yet)
      const storedApiKeysString = Cookies.get('apiKeys');
      const storedApiKeys = storedApiKeysString ? JSON.parse(storedApiKeysString) : {};
      const hasApiKeyInCookies = !!storedApiKeys[providerName] && storedApiKeys[providerName].length > 0;
      
      if (wasDismissed || hasApiKey || hasApiKeyInCookies) {
        setIsDismissed(true);
      }
    } catch (e) {
      console.error('Error checking notification state:', e);
    }
  }, [storageKey, apiKeys, providerName]);

  const handleDismiss = () => {
    setIsDismissed(true);

    // Store dismissal in localStorage to remember user preference
    localStorage.setItem(storageKey, 'true');
  };

  if (isDismissed) {
    return null;
  }

  return (
    <div className="mb-4 p-4 rounded-lg border border-bolt-elements-borderColor bg-bolt-elements-background-depth-0">
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
            To use {providerName}, please add your API key in settings. Without an API key, you won't be able to use the
            AI features.
          </p>
          <p className="text-sm font-medium text-blue-500 mb-2">
            Click the settings gear icon ⚙️ in the bottom left corner to add your API key
          </p>
        </div>
      </div>
    </div>
  );
};
