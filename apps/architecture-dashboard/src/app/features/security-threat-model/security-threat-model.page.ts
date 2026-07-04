import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-security-threat-model-page',
  imports: [CommonModule, CardModule, ButtonModule, RouterLink],
  templateUrl: './security-threat-model.page.html',
  styleUrls: ['./security-threat-model.page.scss'],
})
export class SecurityThreatModelPage {}
