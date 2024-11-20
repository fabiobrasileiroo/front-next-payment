import { Component } from '@angular/core';
import { ThemeService } from './core/services/theme.service';
import { RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { ResponsiveHelperComponent } from './shared/components/responsive-helper/responsive-helper.component';
import { PrimeNGConfig } from 'primeng/api';
import { Aura } from 'primeng/themes/aura'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [NgClass, RouterOutlet, ResponsiveHelperComponent],
})
export class AppComponent {
  title = 'NEXT PAYMENT';

  constructor(public themeService: ThemeService, private config: PrimeNGConfig) {
    this.config.theme.set({preset: Aura,
      options: {
            prefix: 'p',
            darkModeSelector: '.dark',
            cssLayer: false
        } 
    })
  }
}
