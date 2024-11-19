import {Component, OnInit} from '@angular/core';
import {UserCreated, UserSummarize} from '../../../../model/User';
import {UserService} from '../../../../shared/services/user/user.service';
import {KeyValuePipe, NgForOf, NgIf} from '@angular/common';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  user!: UserCreated;
  users: UserSummarize[] | null = null;
  filterForm!: FormGroup;

  constructor(
    private readonly userService: UserService,
    private readonly titleService: Title,
    private readonly router: Router,
    private readonly fb: FormBuilder) {
  }

  ngOnInit(): void {
    if (localStorage.getItem('token') === null) {
      this.router.navigate(['/login']); // Redirect to login page
    }
    this.titleService.setTitle('Home');
    this.userService.findUserByToken().subscribe(value => {
      this.user = value;
    });

    this.filterForm = this.fb.group({
      nameUser: [null],
      mailUser: [null]
    });
  }

  getRole(): boolean {
    return this.user.permissions.some(permission => permission.namePermission === 'ADMIN');
  }

  getUsers(): void {
    const {nameUser, mailUser} = this.filterForm.value;
    const pageable = {page: 0, size: 10};
    this.userService.findListUser(pageable, nameUser, mailUser).subscribe({
      next: (response) => {
        this.users = response.content;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  deleteUser(pkUser: number) {
    this.userService.deleteUser(pkUser).subscribe({
      next: () => {
        this.getUsers();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

}
