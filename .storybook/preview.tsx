import '../src/app/globals.css';

import type { Decorator, Preview } from '@storybook/nextjs-vite';
import type { ReactNode } from 'react';
import React, { useEffect } from 'react';

import { mono, sans, serif } from '../src/app/fonts';

const FONT_VARIABLE_CLASSES = [sans.variable, serif.variable, mono.variable];

type Theme = 'light' | 'dark';

function ThemeWrapper({ theme, children }: { theme: Theme; children: ReactNode }) {
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add(...FONT_VARIABLE_CLASSES);
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
    }
    return () => {
      html.classList.remove(...FONT_VARIABLE_CLASSES);
    };
  }, [theme]);

  return <>{children}</>;
}

const withTheme: Decorator = (Story, context) => (
  <ThemeWrapper theme={(context.globals.theme as Theme) ?? 'light'}>
    <Story />
  </ThemeWrapper>
);

const preview: Preview = {
  parameters: {
    viewport: {
      options: {
        mobile: { name: 'Mobile (390px)', styles: { width: '390px', height: '844px' } },
        desktop: { name: 'Desktop (1280px)', styles: { width: '1280px', height: '800px' } }
      }
    },
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
