import type { StorybookConfig } from '@storybook/angular';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

function parseEnvFile(contents: string): Record<string, string> {
  return contents
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .reduce<Record<string, string>>((values, line) => {
      const separator = line.indexOf('=');
      if (separator === -1) {
        return values;
      }

      const key = line.slice(0, separator).trim();
      const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '');
      values[key] = value;
      return values;
    }, {});
}

function getPrimeUiLicense(): string {
  if (process.env['PRIMEUI_LICENSE_KEY']) {
    return process.env['PRIMEUI_LICENSE_KEY'];
  }

  const envPath = join(process.cwd(), '.env');
  if (!existsSync(envPath)) {
    return '';
  }

  return parseEnvFile(readFileSync(envPath, 'utf8'))['PRIMEUI_LICENSE_KEY'] ?? '';
}

const runtimeConfigScript = `window.__ARCHITECTURE_LAB_CONFIG__ = ${JSON.stringify({
  primeuiLicense: getPrimeUiLicense(),
})};`;

const config: StorybookConfig = {
  stories: ['../src/app/**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
  addons: [],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  previewHead: (head) => `
    ${head}
    <script>${runtimeConfigScript}</script>
    <style>
      :root {
        --color-bg: var(--p-surface-50);
        --color-surface: var(--p-surface-0);
        --color-text: var(--p-text-color);
        --color-text-muted: var(--p-text-muted-color);
        --color-primary-text: var(--p-primary-700);
        --color-border: var(--p-content-border-color);
        --radius-sm: 8px;
        --radius-md: 8px;
        --shadow-sm: 0 12px 30px rgba(23, 32, 51, 0.08);
      }

      html,
      body {
        min-height: 100%;
        margin: 0;
      }

      body {
        font-family: Inter, Roboto, "Helvetica Neue", Arial, sans-serif;
        background: var(--color-bg);
        color: var(--color-text);
      }

      * {
        box-sizing: border-box;
      }

      .icon-label {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }
    </style>
  `,
};

export default config;

// To customize your webpack configuration you can use the webpackFinal field.
// Check https://storybook.js.org/docs/react/builders/webpack#extending-storybooks-webpack-config
// and https://nx.dev/recipes/storybook/custom-builder-configs
