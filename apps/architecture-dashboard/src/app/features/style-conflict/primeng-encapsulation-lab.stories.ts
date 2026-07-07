import type { Meta, StoryObj } from '@storybook/angular';
import { PrimengEncapsulationLabComponent } from './primeng-encapsulation-lab.component';

const meta: Meta<PrimengEncapsulationLabComponent> = {
  title: 'ThemeGovernance/PrimeNGStates/PrimeNG Encapsulation Lab',
  component: PrimengEncapsulationLabComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Interactive lab showing PrimeNG styling leakage from ViewEncapsulation.None and the scoped design-system fix.',
      },
    },
    designSystem: {
      zeroheight: 'Architecture Intelligence Lab Design System / Components',
      primeNgPreset: 'ArchitecturePrimePreset',
      tokenMap: 'documentation/design-system/02-md3-to-primeng-token-map.md',
      componentGuidelines: 'documentation/design-system/03-component-guidelines.md',
      accessibility: 'documentation/design-system/04-accessibility.md',
      storybookGuidance: 'documentation/design-system/07-storybook-integration.md',
      labStory: 'documentation/design-system/08-primeng-encapsulation-lab.md',
    },
  },
};

export default meta;

type Story = StoryObj<PrimengEncapsulationLabComponent>;

export const Default: Story = {};
