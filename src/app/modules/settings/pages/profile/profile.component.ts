import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService } from 'src/app/core/services/settings.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  settings: any = null; // Holds the settings data
  loading: boolean = true; // Tracks loading state
  errorMessage: string | null = null; // Tracks any error messages

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.fetchSettings();
  }

  fetchSettings(): void {
    this.settingsService.getSettings().subscribe({
      next: (data) => {
        this.settings = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load settings.';
        this.loading = false;
      },
    });
  }
}
