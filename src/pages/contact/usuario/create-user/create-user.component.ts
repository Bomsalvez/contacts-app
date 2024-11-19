import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserService} from '../../../../shared/services/user/user.service';
import {NgIf} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent implements OnInit {
  userForm!: FormGroup;
  serverError: string | null = null;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService,
    private readonly router: Router) {
  }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      nameUser: [null, Validators.required],
      mailUser: [null, [Validators.required, Validators.email]],
      passwordUser: [null, Validators.required]
    })
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.userService.createUser(this.userForm.value).subscribe({
        next: () => {
          this.router.navigate(['/login']); // Redirect to login page
        },
        error: (err) => {
          console.error(err.error.error);
          if (err.error && err.error.fieldErrors) {
            this.setFieldErrors(err.error.fieldErrors);
          } else if (err.error && err.error.error) {
            this.serverError = err.error.error;
          } else {
            this.serverError = err.error.message || 'An error occurred. Please try again.';
          }
        }
      });
    } else {
      this.formValid(this.userForm);
    }
  }

  private setFieldErrors(fieldErrors: any) {
    for (const field in fieldErrors) {
      if (this.userForm.controls[field]) {
        this.userForm.controls[field].setErrors({serverError: fieldErrors[field]});
      }
    }
  }

  private formValid(userForm: FormGroup) {
    Object.keys(userForm.controls).forEach(campo => {
      const control = userForm.get(campo);
      control?.markAsTouched();
      control?.markAsDirty();
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.formValid(this.userForm);
      }
    });
  }

  fieldValid(field: string) {
    return this.userForm.get(field)?.invalid && this.userForm.get(field)?.touched;
  }

  getFieldError(field: string) {
    const control = this.userForm.get(field);
    return control?.errors?.['serverError'] || null;
  }
}
