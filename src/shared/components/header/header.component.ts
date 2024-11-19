import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isLoggedIn: boolean = false;

  constructor(private readonly titleService: Title, private readonly router: Router) {
    this.checkAuthStatus();
  }

  checkAuthStatus() {
    this.isLoggedIn = !!localStorage.getItem('authToken');
  }

  handleAuthAction() {
    if (this.isLoggedIn) {
      localStorage.removeItem('authToken');
      this.isLoggedIn = false;
    } else {
      this.router.navigate(['/login']); // Redirect to login page
    }
  }

  currentPage() {
    return this.titleService.getTitle();
  }
}
