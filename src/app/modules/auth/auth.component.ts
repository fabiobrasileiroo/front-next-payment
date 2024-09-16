import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ApiService } from 'src/app/core/services/api.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  standalone: true,
  imports: [AngularSvgIconModule, RouterOutlet, TranslateModule],
})
export class AuthComponent implements OnInit {
  constructor(private translateService: TranslateService, private apiService: ApiService ) {}
  
   public changeLanguage(language: string): void {

    this.translateService.use(language);
  }
  async ngOnInit(): Promise<void> {
    try {
      const ipInfo = await lastValueFrom(this.apiService.getIPInfo());
      console.log('IP Info:', ipInfo);
      // Aqui você pode fazer algo com os dados
    } catch (error) {
      console.error('Error fetching IP info:', error);
    }
  }
    //  const ipInfo$ = this.apiService.getIPInfo();
    //  console.log("🚀 ~ AuthComponent ~ ngOnInit ~ ipInfo$:", ipInfo$)
    // const ipInfo = await lastValueFrom(ipInfo$)
}
