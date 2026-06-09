import '../src/app/globals.css';

import type { Decorator, Preview } from '@storybook/nextjs-vite';
import type { ReactNode } from 'react';
import React, { useEffect } from 'react';

import { mono, sans, serif } from '../src/app/fonts';

const FONT_CLASSES = `${sans.variable} ${serif.variable} ${mono.variable} font-sans`;

type Theme = 'light' | 'dark';

function ThemeWrapper({ theme, children }: { theme: Theme; children: ReactNode }) {
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  return <div className={FONT_CLASSES}>{children}</div>;
}

const withTheme: Decorator = (Story, context) => (
  <ThemeWrapper theme={(context.globals.theme as Theme) ?? 'light'}>
    <Story />
  </ThemeWrapper>
);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    },
    a11y: {
      test: 'todo'
    }
  },
  globalTypes: {
    theme: {
      description: 'Theme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' }
        ],
        dynamicTitle: true
      }
    }
  },
  decorators: [withTheme]
};

export default preview;
