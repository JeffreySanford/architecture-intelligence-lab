import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { appConfig } from './app.config';

describe('appConfig', () => {
  it('provides router configuration', () => {
    TestBed.configureTestingModule({
      providers: [...(appConfig.providers ?? [])],
    });

    const router = TestBed.inject(Router);
    expect(router).toBeDefined();
  });

  it('registers the expected application providers', () => {
    expect(appConfig.providers).toBeDefined();
    expect(appConfig.providers?.length).toBeGreaterThanOrEqual(6);
  });
});
