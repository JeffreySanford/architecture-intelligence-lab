import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthStore } from '../auth/auth.store';
import { LAB_NAV_ITEMS, visibleLabNavItems } from './navigation';

@Component({
  standalone: true,
  selector: 'app-lab-shell',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    ButtonModule,
  ],
  templateUrl: './lab-shell.component.html',
  styleUrl: './lab-shell.component.scss',
})
export class LabShellComponent {
  private readonly authStore = inject(AuthStore);

  protected readonly currentUser = this.authStore.currentUser;
  protected readonly visibleNavItems = computed(() =>
    visibleLabNavItems(this.currentUser(), this.authStore.hasPermission.bind(this.authStore)),
  );

  protected readonly navItems = LAB_NAV_ITEMS;

}
