import { getRuntimeConfig } from './runtime-config';

describe('runtime config', () => {
  const originalConfig = window.__ARCHITECTURE_LAB_CONFIG__;

  afterEach(() => {
    window.__ARCHITECTURE_LAB_CONFIG__ = originalConfig;
  });

  it('should expose the PrimeUI license from the runtime config script', () => {
    window.__ARCHITECTURE_LAB_CONFIG__ = {
      primeuiLicense: 'primeui-test-key',
    };

    expect(getRuntimeConfig().primeuiLicense).toBe('primeui-test-key');
  });

  it('should return an empty config when env.js is not present', () => {
    window.__ARCHITECTURE_LAB_CONFIG__ = undefined;

    expect(getRuntimeConfig()).toEqual({});
  });
});
