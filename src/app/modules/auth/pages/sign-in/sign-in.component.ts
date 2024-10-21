import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from 'src/app/core/services/login.service';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuService } from 'src/app/modules/layout/services/menu.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  standalone: true,
  imports: [RouterLink,NgClass, NgIf, ReactiveFormsModule, FormsModule, ButtonComponent,AngularSvgIconModule],
})
export class SignInComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  passwordTextType = false;
  loading = false;
  loginError = false;

  @ViewChild('passwordInput', { static: false }) passwordInput!: ElementRef;
  relebrar!: string | null;

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _router: Router,
    private loginService: LoginService,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
     const savedEmail = localStorage.getItem('email');  // Retrieve the stored email if it exists
  this.form = this._formBuilder.group({
    email: [savedEmail !== null ? savedEmail : '', [Validators.required, Validators.email]],  // Conditionally set email value
    password: ['', Validators.required],
    rememberMe: [false],
  });
  }

  get f() {
    return this.form.controls;
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  focusNextInput(event: any, nextInputId?: string): void {
    if (event.key === 'Enter') {
      if (nextInputId) {
        const nextInput = document.getElementById(nextInputId);
        nextInput?.focus();
      } else {
        this.onSubmit(); // Submit form on last input (password field)
      }
    }
  }

  onSubmit() {
    this.submitted = true;
    this.loginError = false;

    const { email, password, rememberMe } = this.form.value;

    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    this.loginService.login(email, password).subscribe({
      next: (response) => {
        const menu = response.menu; // Get the menu from the response
        console.log("🚀 ~ SignInComponent ~ this.loginService.login ~ response:", response)
        const {token}= response;
        const {email,name,imageUrl} = response.user
        this.loginService.saveToken(token);

        // Save menu data to localStorage or a service
        localStorage.setItem('menu', JSON.stringify(menu));
              // Update the menu dynamically using MenuService
        this.menuService.setMenu(menu); // Set the menu in the service

        // if (rememberMe) {
        localStorage.setItem('email', email);
        localStorage.setItem('name', name);
        localStorage.setItem('imageUrl', imageUrl);
          // localStorage.setItem('password', password); // In production, avoid storing sensitive info like this.
        // }

        this._router.navigate(['/']);
        this.loading = false;
      },
      error: (err) => {
        
        this.loginError = true;
        this.loading = false;
        console.error('Login failed', err);
      },
    });
  }
}
