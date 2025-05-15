import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { PROVIDER_LIST } from '~/utils/constants';
import type { ModelInfo } from '~/lib/modules/llm/types';

export async function loader({ request: _request }: LoaderFunctionArgs) {
  try {
    // Collect static models from all providers
    const staticModels: ModelInfo[] = [];

    PROVIDER_LIST.forEach((provider) => {
      if (provider.staticModels) {
        provider.staticModels.forEach((model) => {
          staticModels.push({
            ...model,
            provider: provider.name,
          });
        });
      }
    });

    return json({
      modelList: staticModels,
      status: 'success',
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    return json(
      {
        modelList: [],
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const body = (await request.json()) as {
    apiKeys?: Record<string, string>;
    providerSettings?: Record<string, any>;
  };

  const { apiKeys, providerSettings } = body;

  try {
    // Collect static models from all providers
    const staticModels: ModelInfo[] = [];

    // Also collect dynamic models if API keys are provided
    const dynamicModelsPromises: Promise<ModelInfo[]>[] = [];

    PROVIDER_LIST.forEach((provider) => {
      // Add static models
      if (provider.staticModels) {
        provider.staticModels.forEach((model) => {
          staticModels.push({
            ...model,
            provider: provider.name,
          });
        });
      }

      // Add dynamic models if API key exists and provider has a getDynamicModels method
      if (provider.getDynamicModels && apiKeys && apiKeys[provider.name]) {
        dynamicModelsPromises.push(
          provider
            .getDynamicModels(
              apiKeys,
              providerSettings?.[provider.name],
              Object.fromEntries(Object.entries(process.env).filter(([_, v]) => v !== undefined)) as Record<
                string,
                string
              >,
            )
            .then((models) =>
              models.map((model) => ({
                ...model,
                provider: provider.name,
              })),
            )
            .catch((error) => {
              console.error(`Error fetching dynamic models for ${provider.name}:`, error);
              return [];
            }),
        );
      }
    });

    // Wait for all dynamic models to be fetched
    const dynamicModelsArrays = await Promise.all(dynamicModelsPromises);
    const dynamicModels = dynamicModelsArrays.flat();

    // Combine static and dynamic models
    const allModels = [...staticModels, ...dynamicModels];

    return json({
      modelList: allModels,
      status: 'success',
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    return json(
      {
        modelList: [],
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
