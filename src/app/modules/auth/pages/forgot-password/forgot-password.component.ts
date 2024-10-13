import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ForgotPasswordService } from 'src/app/core/services/forgot-password.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, ButtonComponent, NgClass, NgIf],
})
export class ForgotPasswordComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(
    private readonly forgotPasswordService: ForgotPasswordService,
    private readonly _formBuilder: FormBuilder,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // Access form controls
  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.form.invalid) {
      return;
    }

    this.loading = true; // Enable loading state

    // Access form control using get method
    const email = this.form.get('email')?.value;

    this.forgotPasswordService.sendResetLink(email).subscribe({
      next: () => {
        this.successMessage = 'A reset link has been sent to your email.';
        this.loading = false; // Disable loading after success
        // setTimeout(() => {
        //   this.router.navigate(['/auth/new-password']);
        // }, 1000); // Redirect to sign-in after 3 seconds
      },
      error: (err) => {
        this.errorMessage = 'Failed to send reset link. Please try again.';
        this.loading = false; // Disable loading in case of an error
        console.error(err);
      }
    });
  }
}
