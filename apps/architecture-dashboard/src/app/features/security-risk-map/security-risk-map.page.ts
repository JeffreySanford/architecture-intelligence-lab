import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  standalone: true,
  selector: 'app-security-risk-map-page',
  imports: [CommonModule, CardModule],
  templateUrl: './security-risk-map.page.html',
  styleUrls: ['./security-risk-map.page.scss'],
})
export class SecurityRiskMapPage {}
