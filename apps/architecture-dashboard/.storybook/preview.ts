import type { Preview } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { providePrimeNG } from 'primeng/config';
import { ArchitecturePrimePreset } from '../src/app/core/theme/architecture-prime-preset';
import { getRuntimeConfig } from '../src/app/core/config/runtime-config';

const runtimeConfig = getRuntimeConfig();

const preview: Preview = {
  decorators: [
    applicationConfig({
      providers: [
        provideAnimations(),
        providePrimeNG({
          license: runtimeConfig.primeuiLicense,
          theme: {
            preset: ArchitecturePrimePreset,
            options: {
              darkModeSelector: '.app-dark',
            },
          },
        }),
      ],
    }),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      description: {
        component:
          'Storybook renders PrimeNG components with the same ArchitecturePrimePreset used by the Angular app.',
      },
    },
  },
};

export default preview;
