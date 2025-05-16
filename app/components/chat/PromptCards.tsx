import React from 'react';
import { PromptCard } from './PromptCard';

const PROMPT_ICONS = {
  'Build a VA landing page with a contact form': 'i-ph:layout-duotone',
  'VA Education Benefits Dashboard': 'i-ph:student-duotone',
  'VA claims tool and with document uploader': 'i-ph:cloud-arrow-up-duotone',
  'VA Health Records Viewer': 'i-ph:first-aid-duotone',
};
interface PromptCardsProps {
  prompts: {
    text: string;
    fullPrompt?: string;
  }[];
  sendMessage: (event: React.UIEvent, messageInput?: string) => void;
}

export function PromptCards({ prompts, sendMessage }: PromptCardsProps) {
  return (
    <div id="examples" className="relative w-full max-w-5xl mx-auto mt-8">
      <h2 className="text-center text-bolt-elements-textSecondary mb-6 text-lg">Try one of these examples</h2>
      <div className="flex flex-wrap gap-6 justify-center">
        {prompts.map((prompt, index) => {
          // Always use fullPrompt if available
          const messageToSend = prompt.fullPrompt || prompt.text;

          return (
            <PromptCard
              key={index}
              text={prompt.text}
              icon={PROMPT_ICONS[prompt.text as keyof typeof PROMPT_ICONS]}
              onClick={(event: React.MouseEvent) => {
                console.log('Card clicked, sending full prompt text of length:', messageToSend.length);

                // Cast event to React.UIEvent to match expected type
                sendMessage(event as unknown as React.UIEvent, messageToSend);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
