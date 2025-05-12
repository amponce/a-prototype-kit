import React from 'react';
import { classNames } from '~/utils/classNames';
import styles from './PromptCard.module.scss';

interface PromptCardProps {
  text: string;
  icon?: string;
  onClick: (event: React.MouseEvent) => void;
}

export function PromptCard({ text, icon, onClick }: PromptCardProps) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        styles.PromptCard,
        'group flex flex-col items-center justify-center w-52 h-40 p-4 rounded-xl bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor shadow-sm hover:shadow-md transition-all text-bolt-elements-textTertiary hover:text-bolt-elements-textPrimary hover:border-bolt-elements-item-borderAccent hover:bg-bolt-elements-item-backgroundAccent',
      )}
    >
      <div className={classNames(styles.IconContainer, 'text-3xl mb-3', icon || 'i-ph:code')} />
      <p className="text-center font-medium">{text}</p>
      <div className="i-ph:arrow-bend-down-left opacity-0 group-hover:opacity-100 mt-2 transition-opacity duration-300" />
    </button>
  );
}
