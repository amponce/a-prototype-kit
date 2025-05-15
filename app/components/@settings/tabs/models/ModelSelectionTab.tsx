import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { classNames } from '~/utils/classNames';
import { useSettings } from '~/lib/hooks/useSettings';
import { toast } from 'react-toastify';
import { TbBrain } from 'react-icons/tb';
import { logStore } from '~/lib/stores/logs';
import { Switch } from '~/components/ui/Switch';
import type { ModelInfo } from '~/lib/modules/llm/types';
import { CgSpinner } from 'react-icons/cg';

export default function ModelSelectionTab() {
  const { 
    selectedModel, 
    selectedProvider, 
    apiKeys, 
    providers,
    activeProviders,
    updateSelectedModel, 
    updateSelectedProvider, 
    updateApiKey 
  } = useSettings();
  
  const [modelList, setModelList] = useState<ModelInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredModels, setFilteredModels] = useState<ModelInfo[]>([]);
  const [editingApiKey, setEditingApiKey] = useState<string | null>(null);
  const [tempApiKey, setTempApiKey] = useState('');
  
  // Fetch models on initial load
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        console.log('Fetching models...');
        const response = await fetch('/api/models');
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Error fetching models. Status: ${response.status}`, errorText);
          toast.error(`Failed to load models. Server responded with ${response.status}`);
          setLoading(false);
          return;
        }
        
        const data = await response.json();
        console.log('Models loaded:', data);
        
        // Deduplicate models using a unique key (name + provider)
        const allModels = (data as { modelList: ModelInfo[] }).modelList || [];
        const uniqueModels: ModelInfo[] = [];
        const seenModelKeys = new Set<string>();
        
        allModels.forEach(model => {
          const modelKey = `${model.name}-${model.provider}`;
          if (!seenModelKeys.has(modelKey)) {
            seenModelKeys.add(modelKey);
            uniqueModels.push(model);
          } else {
            console.log(`Filtered duplicate model: ${model.name} (${model.provider})`);
          }
        });
        
        setModelList(uniqueModels);
      } catch (error) {
        console.error('Error fetching models:', error);
        toast.error(`Failed to load models: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchModels();
  }, []);
  
  // Update filtered models when selected provider changes
  useEffect(() => {
    if (modelList.length > 0) {
      console.log(`Filtering models for provider: ${selectedProvider}`);
      
      // Filter models by provider and sort by name for consistency
      const filtered = modelList
        .filter(model => model.provider === selectedProvider)
        .sort((a, b) => (a.label || a.name).localeCompare(b.label || b.name));
      
      console.log(`Found ${filtered.length} models for ${selectedProvider}`);
      setFilteredModels(filtered);
      
      // If there are models available for this provider but the current selected model 
      // doesn't belong to this provider, reset to the first available model
      if (filtered.length > 0 && !filtered.some(model => model.name === selectedModel)) {
        console.log(`Selected model ${selectedModel} not found in provider ${selectedProvider}. Resetting to ${filtered[0].name}`);
        updateSelectedModel(filtered[0].name);
      }
    }
  }, [selectedProvider, modelList, selectedModel, updateSelectedModel]);
  
  const handleProviderChange = (providerName: string) => {
    // First, find the models available for the new provider
    const newProviderModels = modelList.filter(model => model.provider === providerName);
    
    // Update the provider selection
    updateSelectedProvider(providerName);
    
    // If models are available for the new provider, automatically select the first one
    if (newProviderModels.length > 0) {
      // Only update the model if the current selected model isn't from this provider
      const currentModelInNewProvider = newProviderModels.some(model => model.name === selectedModel);
      
      if (!currentModelInNewProvider) {
        console.log(`Switching provider to ${providerName}. Auto-selecting model ${newProviderModels[0].name}`);
        updateSelectedModel(newProviderModels[0].name);
      }
    }
    
    logStore.logSystem(`Provider changed to ${providerName}`);
  };
  
  const handleModelChange = (modelName: string) => {
    updateSelectedModel(modelName);
    logStore.logSystem(`Model changed to ${modelName}`);
  };
  
  const handleApiKeyEdit = (provider: string) => {
    setEditingApiKey(provider);
    setTempApiKey(apiKeys[provider] || '');
  };
  
  const handleApiKeySave = () => {
    if (editingApiKey) {
      updateApiKey(editingApiKey, tempApiKey);
      setEditingApiKey(null);
      toast.success(`API key updated for ${editingApiKey}`);
    }
  };
  
  const currentProvider = activeProviders.find(p => p.name === selectedProvider);
  
  return (
    <div className="space-y-6">
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2 mt-8 mb-4">
          <div
            className={classNames(
              'w-8 h-8 flex items-center justify-center rounded-lg',
              'bg-bolt-elements-background-depth-3',
              'text-blue-500'
            )}
          >
            <TbBrain className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-md font-medium text-bolt-elements-textPrimary">Model Selection</h4>
            <p className="text-sm text-bolt-elements-textSecondary">Configure AI models and providers for chat</p>
          </div>
        </div>
        
        {/* Provider Selector */}
        <div className="p-4 bg-bolt-elements-background-depth-2 rounded-lg border border-bolt-elements-borderColor">
          <h5 className="text-sm font-medium text-bolt-elements-textPrimary mb-3">AI Provider</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeProviders.map(provider => (
              <div
                key={provider.name}
                className={classNames(
                  'flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all',
                  provider.name === selectedProvider
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-bolt-elements-borderColor hover:border-blue-400 hover:bg-bolt-elements-background-depth-3'
                )}
                onClick={() => handleProviderChange(provider.name)}
              >
                <div
                  className={classNames(
                    'w-8 h-8 flex items-center justify-center rounded-lg',
                    'bg-bolt-elements-background-depth-3',
                    provider.name === selectedProvider ? 'text-blue-500' : 'text-bolt-elements-textSecondary'
                  )}
                >
                  <span className={provider.icon || 'i-ph:brain'}></span>
                </div>
                <span className="text-sm font-medium text-bolt-elements-textPrimary">{provider.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Model Selector */}
        <div className="p-4 bg-bolt-elements-background-depth-2 rounded-lg border border-bolt-elements-borderColor">
          <h5 className="text-sm font-medium text-bolt-elements-textPrimary mb-3">AI Model</h5>
          {loading ? (
            <div className="flex justify-center items-center p-4">
              <CgSpinner className="w-6 h-6 text-blue-500 animate-spin" />
              <span className="ml-2 text-sm text-bolt-elements-textSecondary">Loading models...</span>
            </div>
          ) : filteredModels.length === 0 ? (
            <div className="text-center p-4 text-sm text-bolt-elements-textSecondary">
              No models available for {selectedProvider}. Please select another provider.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredModels.map(model => (
                <div
                  key={model.name}
                  className={classNames(
                    'flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all',
                    model.name === selectedModel
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-bolt-elements-borderColor hover:border-blue-400 hover:bg-bolt-elements-background-depth-3'
                  )}
                  onClick={() => handleModelChange(model.name)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-bolt-elements-textPrimary">{model.label || model.name}</div>
                    <div className="text-xs text-bolt-elements-textSecondary truncate">{model.name}</div>
                  </div>
                  {model.name === selectedModel && (
                    <div className="i-ph:check-circle-fill text-blue-500 w-5 h-5" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* API Key Management */}
        {currentProvider && (
          <div className="p-4 bg-bolt-elements-background-depth-2 rounded-lg border border-bolt-elements-borderColor">
            <h5 className="text-sm font-medium text-bolt-elements-textPrimary mb-3">
              {selectedProvider} API Key
            </h5>
            
            {editingApiKey === selectedProvider ? (
              <div className="flex gap-2 mt-2">
                <input 
                  type="password"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder="Enter API Key"
                  className="flex-1 px-3 py-2 text-sm rounded border border-bolt-elements-borderColor 
                          bg-bolt-elements-prompt-background text-bolt-elements-textPrimary 
                          focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  onClick={handleApiKeySave}
                  className="px-3 py-2 text-sm rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  Save
                </button>
                <button 
                  onClick={() => setEditingApiKey(null)}
                  className="px-3 py-2 text-sm rounded bg-bolt-elements-background-depth-3 text-bolt-elements-textPrimary hover:bg-bolt-elements-background-depth-4 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {apiKeys[selectedProvider] ? (
                    <>
                      <div className="i-ph:check-circle-fill text-green-500 w-4 h-4" />
                      <span className="text-xs text-green-500">API Key Set</span>
                    </>
                  ) : (
                    <>
                      <div className="i-ph:warning-circle-fill text-amber-500 w-4 h-4" />
                      <span className="text-xs text-amber-500">API Key Not Set</span>
                    </>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleApiKeyEdit(selectedProvider)}
                    className="px-3 py-1.5 text-xs rounded bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors flex items-center gap-1"
                  >
                    <span className="i-ph:pencil-simple w-3.5 h-3.5" />
                    Edit API Key
                  </button>
                  
                  {currentProvider.getApiKeyLink && (
                    <a 
                      href={currentProvider.getApiKeyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-xs rounded bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors flex items-center gap-1"
                    >
                      <span className="i-ph:key w-3.5 h-3.5" />
                      {currentProvider.labelForGetApiKey || 'Get API Key'}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
} 