import type { Meta, StoryObj } from '@storybook/angular';
import { ThemeGovernancePage } from './theme-governance.page';

const meta: Meta<ThemeGovernancePage> = {
  title: 'ThemeGovernance/PrimeNGStates',
  component: ThemeGovernancePage,
  args: {
    compactDensity: false,
    darkPreview: false,
    dialogVisible: false,
    selectedPattern: 'Commitments',
  },
  argTypes: {
    compactDensity: {
      control: 'boolean',
      description: 'Toggles compact density for the governed PrimeNG examples.',
    },
    darkPreview: {
      control: 'boolean',
      description: 'Applies the app dark preview class around the component set.',
    },
    dialogVisible: {
      control: 'boolean',
      description: 'Opens the governed PrimeNG dialog state.',
    },
    selectedPattern: {
      control: 'select',
      description: 'Sets the active capital markets pattern in the select example.',
      options: ['Commitments', 'Disclosures', 'Pricing'],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'PrimeNG component states governed by Zeroheight and implemented through ArchitecturePrimePreset.',
      },
    },
    designSystem: {
      zeroheight: 'Architecture Intelligence Lab Design System / Components',
      primeNgPreset: 'ArchitecturePrimePreset',
      tokenMap: 'documentation/design-system/02-md3-to-primeng-token-map.md',
      componentGuidelines: 'documentation/design-system/03-component-guidelines.md',
      accessibility: 'documentation/design-system/04-accessibility.md',
      storybookGuidance: 'documentation/design-system/07-storybook-integration.md',
    },
  },
};

export default meta;

type Story = StoryObj<ThemeGovernancePage>;

export const PrimeNGStates: Story = {};

export const DarkCompact: Story = {
  args: {
    compactDensity: true,
    darkPreview: true,
  },
};
