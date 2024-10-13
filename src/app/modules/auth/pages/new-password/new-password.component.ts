import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';  // Add ActivatedRoute to access route params
import { PasswordResetService } from 'src/app/core/services/password-reset.service';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss'],
  standalone: true,
  imports: [NgClass, NgIf, FormsModule, ReactiveFormsModule, RouterLink, AngularSvgIconModule, ButtonComponent],
})
export class NewPasswordComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  errorMessage = '';
  successMessage = '';
  loading: boolean = false;
  senhasIguais: boolean = false;
  email!: string;   // To store the email from the route or user input
  token!: string;   // To store the token from the route or user input

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly passwordResetService: PasswordResetService,
    private readonly router: Router,
    private readonly route: ActivatedRoute   // To access route parameters
  ) {}

  ngOnInit(): void {
  // Fetch token and email from route query params or URL
  this.email = this.route.snapshot.queryParamMap.get('email') || '';
  this.token = this.route.snapshot.queryParamMap.get('token') || '';

  this.form = this._formBuilder.group(
    {
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: this.passwordsMatchValidator, // Apply custom validator here
    }
  );
}

  // Custom validator to check if passwords match
  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    console.log("🚀 ~ NewPasswordComponent ~ passwordsMatchValidator ~ password:", password)
    const confirmPassword = control.get('confirmPassword')?.value;
    console.log("🚀 ~ NewPasswordComponent ~ passwordsMatchValidator ~ confirmPassword:", confirmPassword)
    if(password == confirmPassword)  {
      this.senhasIguais = true
      console.log(' iguais')
    } else {
      this.senhasIguais = false
      console.log('nao iguais')
    }
    return password === confirmPassword ? null : { mismatch: true };
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
  this.submitted = true;
  this.errorMessage = '';
  this.successMessage = '';
  this.loading = true;
  console.log(this.token)

  if (this.form.invalid) {
    return;
  }

  const newPassword: string = this.form.get('password')?.value;

  // Send email, token, and newPassword to the PasswordResetService
  const payload = {
    email: this.email,
    token: this.token, // This is the token captured from the URL or route params
    newPassword: newPassword,
  };

  this.passwordResetService.resetPassword(payload).subscribe({
    next: (response) => {
      this.successMessage = 'Password has been successfully updated!';
      setTimeout(() => {
        this.router.navigate(['/auth/sign-in']);
      }, 3000);
    },
    error: (err) => {
      this.errorMessage = 'Failed to update password. Please try again.';
      console.error(err);
    },
    complete: () => {
      this.loading = false;
    },
  });
}
}
