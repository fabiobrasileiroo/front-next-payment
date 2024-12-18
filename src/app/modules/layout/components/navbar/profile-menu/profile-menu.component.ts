import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { ClickOutsideDirective } from '../../../../../shared/directives/click-outside.directive';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ThemeService } from '../../../../../core/services/theme.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { LanguageService } from 'src/app/core/services/language.service';
import { LoginService } from 'src/app/core/services/login.service';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss'],
  standalone: true,
  imports: [ClickOutsideDirective, NgClass, RouterLink, AngularSvgIconModule],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          opacity: 1,
          transform: 'translateY(0)',
          visibility: 'visible',
        }),
      ),
      state(
        'closed',
        style({
          opacity: 0,
          transform: 'translateY(-20px)',
          visibility: 'hidden',
        }),
      ),
      transition('open => closed', [animate('0.2s')]),
      transition('closed => open', [animate('0.2s')]),
    ]),
  ],
})
export class ProfileMenuComponent implements OnInit {
  public isOpen = false;
  public profileMenu = [
    {
      title: 'Seu perfil',
      icon: './assets/icons/heroicons/outline/user-circle.svg',
      link: '/settings/profile',
    },
    {
      title: 'Settings',
      icon: './assets/icons/heroicons/outline/cog-6-tooth.svg',
      link: '/settings/profile',
    },
    {
      title: 'Log out',
      icon: './assets/icons/heroicons/outline/logout.svg',
      // link: '/auth',
    },
  ];

  public themeColors = [
    {
      name: 'base',
      code: '#e11d48',
    },
    {
      name: 'yellow',
      code: '#f59e0b',
    },
    {
      name: 'green',
      code: '#22c55e',
    },
    {
      name: 'blue',
      code: '#3b82f6',
    },
    {
      name: 'orange',
      code: '#ea580c',
    },
    {
      name: 'red',
      code: '#cc0022',
    },
    {
      name: 'violet',
      // code: '#6d28d9',
      code: '#323396',
    },
  ];

  public themeMode = ['light', 'dark'];
  public currentLanguage!: string; // localStorage.getItem("language")
  name: string | null = 'Sem nome';
  email: string | null = 'Sem email';
  imageUrl: string | null = 'Sem email';

  constructor(
    public themeService: ThemeService,
    private languageService: LanguageService,
    private router: Router,
    private loginService: LoginService,
  ) {}

  ngOnInit(): void {
    this.name = localStorage.getItem('name');
    this.email = localStorage.getItem('email');
    this.imageUrl = localStorage.getItem('imageUrl');
  }

  setLanguage(language: string) {
    this.languageService.changeLanguage(language);
    this.currentLanguage = language;
  }
  public toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  toggleThemeMode() {
    this.themeService.theme.update((theme) => {
      const mode = !this.themeService.isDark ? 'dark' : 'light';
      return { ...theme, mode: mode };
    });
  }

  toggleThemeColor(color: string) {
    this.themeService.theme.update((theme) => {
      return { ...theme, color: color };
    });
  }
  // Método para lidar com logout
  onLogout(): void {
    // LoginService.logout(); // Remove o token do localStorage
    this.loginService.logout();
    localStorage.removeItem('token');
    console.log('Token removed:', localStorage.getItem('token'));
    this.router.navigate(['/auth/sign-in']); // Redirecionar para a tela de login
  }

  // Verifica se o item do menu é logout e chama o método adequado
  onMenuClick(action: string): void {
    console.log(' chamou', action);
    if (action === 'Log out') {
      this.onLogout();
    }
  }
}
