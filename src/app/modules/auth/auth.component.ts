import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ApiService } from 'src/app/core/services/api.service';
import { NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  standalone: true,
  imports: [AngularSvgIconModule, RouterOutlet, TranslateModule, NgStyle, NgIf],
})
export class AuthComponent implements OnInit {
  isSmallScreen: boolean = false;

  constructor(private translateService: TranslateService, private apiService: ApiService) {
    this.checkScreenSize();
  }

  public changeLanguage(language: string): void {
    this.translateService.use(language);
  }

  async ngOnInit(): Promise<void> {
    // Código original comentado para referência futura
    // try {
    //   const ipInfo = await lastValueFrom(this.apiService.getIPInfo());
    //   console.log('IP Info:', ipInfo);
    // } catch (error) {
    //   console.error('Error fetching IP info:', error);
    // }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 1024; // Largura para lg do Tailwind
  }
}
