import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  stories: ['./*.mdx', '../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {}
  },
  staticDirs: ['../public'],
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript'
  },
  viteFinal: async (config) => {
    const clientPort = process.env.STORYBOOK_HMR_CLIENT_PORT;
    if (clientPort) {
      config.server ??= {};
      config.server.hmr =
        typeof config.server.hmr === 'object' && config.server.hmr !== null
          ? { ...config.server.hmr, clientPort: Number(clientPort) }
          : { clientPort: Number(clientPort) };
    }
    return config;
  }
};

export default config;
