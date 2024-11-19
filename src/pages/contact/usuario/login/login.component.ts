import {Component} from '@angular/core';
import {AuthService} from '../../../../shared/services/authentication/auth.service';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ErrorMessages} from '../../../../shared/constants/messages';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  errorLogin!: string;
  loginForm!: FormGroup;


  constructor(
    private readonly authService: AuthService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      mail: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required]
    });
  }

  startSection() {
    this.authService.loginUser(this.loginForm.value).subscribe({
        next: (token) => {
          localStorage.setItem('token', token.token);
           this.router.navigate(['/user']);
          // Handle successful login, e.g., store token, navigate to another page, etc.
        },
        error: (err) => {
          this.errorLogin = this.getErrorMessage(err.status);
        }
      });
  }


  getErrorMessage(status: number): string {
    switch (status) {
      case 401:
        return ErrorMessages.InvalidCredentials;
      case 404:
        return ErrorMessages.InvalidCredentials;
      case 403:
        return ErrorMessages.AccountLocked;
      default:
        return ErrorMessages.UnexpectedError;
    }
  }
}
