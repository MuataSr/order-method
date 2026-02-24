'use client';

import { useEffect, useCallback, useRef } from 'react';

type KeyboardShortcut = {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  action: () => void;
  description?: string;
};

interface UseKeyboardNavigationOptions {
  shortcuts?: KeyboardShortcut[];
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onEscape?: () => void;
  onEnter?: () => void;
  onSpace?: () => void;
  onQuestionMark?: () => void;
  enabled?: boolean;
}

export function useKeyboardNavigation(options: UseKeyboardNavigationOptions = {}) {
  const {
    shortcuts = [],
    onArrowLeft,
    onArrowRight,
    onArrowUp,
    onArrowDown,
    onEscape,
    onEnter,
    onSpace,
    onQuestionMark,
    enabled = true,
  } = options;

  const shortcutsRef = useRef(shortcuts);
  
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    const target = event.target as HTMLElement;
    const isInput = target.tagName === 'INPUT' || 
                    target.tagName === 'TEXTAREA' || 
                    target.isContentEditable;

    for (const shortcut of shortcutsRef.current) {
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const ctrlMatch = !shortcut.ctrl || event.ctrlKey;
      const shiftMatch = !shortcut.shift || event.shiftKey;
      const altMatch = !shortcut.alt || event.altKey;
      const metaMatch = !shortcut.meta || event.metaKey;

      if (keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch) {
        event.preventDefault();
        shortcut.action();
        return;
      }
    }

    if (isInput) return;

    switch (event.key) {
      case 'ArrowLeft':
        onArrowLeft?.();
        break;
      case 'ArrowRight':
        onArrowRight?.();
        break;
      case 'ArrowUp':
        event.preventDefault();
        onArrowUp?.();
        break;
      case 'ArrowDown':
        event.preventDefault();
        onArrowDown?.();
        break;
      case 'Escape':
        onEscape?.();
        break;
      case 'Enter':
        onEnter?.();
        break;
      case ' ':
        event.preventDefault();
        onSpace?.();
        break;
      case '?':
        onQuestionMark?.();
        break;
    }
  }, [enabled, onArrowLeft, onArrowRight, onArrowUp, onArrowDown, onEscape, onEnter, onSpace, onQuestionMark]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

interface UseLessonNavigationOptions {
  hasNext: boolean;
  hasPrevious: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onComplete?: () => void;
  onToggleFullscreen?: () => void;
  enabled?: boolean;
}

export function useLessonNavigation(options: UseLessonNavigationOptions) {
  const {
    hasNext,
    hasPrevious,
    onNext,
    onPrevious,
    onComplete,
    onToggleFullscreen,
    enabled = true,
  } = options;

  useKeyboardNavigation({
    enabled,
    onArrowLeft: hasPrevious ? onPrevious : undefined,
    onArrowRight: hasNext ? onNext : undefined,
    onSpace: () => {
      const video = document.querySelector('video');
      if (video) {
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
      }
    },
    shortcuts: [
      {
        key: 'f',
        description: 'Toggle fullscreen',
        action: () => onToggleFullscreen?.(),
      },
      {
        key: 'm',
        description: 'Toggle mute',
        action: () => {
          const video = document.querySelector('video');
          if (video) {
            video.muted = !video.muted;
          }
        },
      },
      {
        key: 'c',
        action: () => {
          if (onComplete) {
            onComplete();
          }
        },
        description: 'Mark as complete',
      },
    ],
  });
}

interface ShortcutHelpItem {
  keys: string[];
  description: string;
}

export const LESSON_SHORTCUTS: ShortcutHelpItem[] = [
  { keys: ['←'], description: 'Previous lesson' },
  { keys: ['→'], description: 'Next lesson' },
  { keys: ['Space'], description: 'Play/Pause video' },
  { keys: ['F'], description: 'Toggle fullscreen' },
  { keys: ['M'], description: 'Toggle mute' },
  { keys: ['C'], description: 'Mark as complete' },
  { keys: ['?'], description: 'Show keyboard shortcuts' },
  { keys: ['Esc'], description: 'Close dialogs' },
];

export const NAVIGATION_SHORTCUTS: ShortcutHelpItem[] = [
  { keys: ['?'], description: 'Show keyboard shortcuts' },
  { keys: ['Esc'], description: 'Close dialogs/modals' },
  { keys: ['Ctrl', 'K'], description: 'Search' },
];
