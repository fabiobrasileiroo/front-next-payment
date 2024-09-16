import { Injectable, signal, effect } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  public language = signal<string>('pt-BR'); // Defina o idioma padrão aqui

  constructor(private translateService: TranslateService) {
    this.loadLanguage();
    effect(() => {
      this.setLanguage();
    });
  }

  private loadLanguage() {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      this.language.set(storedLanguage);
    } else {
      // Defina o idioma padrão se não houver idioma armazenado
      this.language.set('pt-BR');
    }
  }

  private setLanguage() {
    const lang = this.language();
    this.translateService.use(lang);
    localStorage.setItem('language', lang);
  }

  public changeLanguage(language: string): void {
    this.language.set(language);
  }

  public get currentLanguage(): string {
    return this.language();
  }
}
