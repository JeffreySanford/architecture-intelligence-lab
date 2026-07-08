// Jest setup to smooth jsdom chart rendering warnings in unit tests.
// The browser test environment uses jsdom, which does not implement
// HTMLCanvasElement.getContext(). Chart components guard against missing
// canvas contexts, but jsdom still warns unless the method exists.

declare global {
  interface HTMLCanvasElement {
    getContext(contextId: string): CanvasRenderingContext2D | null;
  }
}

if (typeof HTMLCanvasElement !== 'undefined' && !HTMLCanvasElement.prototype.getContext) {
  HTMLCanvasElement.prototype.getContext = function (contextId: string) {
    return null;
  };
}
