import { AuthResetService } from './core/auth/auth-reset.service';

export function initializeApp(): void {
  const resetService = new AuthResetService();
  resetService.resetAuth();
}
