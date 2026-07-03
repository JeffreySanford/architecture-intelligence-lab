export interface ArchitectureLabRuntimeConfig {
  primeuiLicense?: string;
}

declare global {
  interface Window {
    __ARCHITECTURE_LAB_CONFIG__?: ArchitectureLabRuntimeConfig;
  }
}

export function getRuntimeConfig(): ArchitectureLabRuntimeConfig {
  return globalThis.window?.__ARCHITECTURE_LAB_CONFIG__ ?? {};
}
