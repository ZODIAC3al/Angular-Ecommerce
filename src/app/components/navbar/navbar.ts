import { CommonModule } from '@angular/common';
import { Component, effect, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../services/authService';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar {
  constructor(
    public authService: AuthService,
    private router: Router,
  ) {
    // Apply theme to <html> whenever signal changes
    effect(() => {
      document.documentElement.setAttribute('data-theme', this.isDarkMode() ? 'dark' : 'light');
    });
  }

  // 🌙 Theme signal — reads from localStorage for persistence
  isDarkMode = signal<boolean>(localStorage.getItem('theme') === 'light' ? false : true);

  toggleTheme() {
    this.isDarkMode.update((v) => !v);
    localStorage.setItem('theme', this.isDarkMode() ? 'dark' : 'light');
  }

  searchTerm: string = '';
  isNavbarCollapsed: boolean = true;
  isDropdownOpen: boolean = false;

  @Output() search = new EventEmitter<string>();

  onSearch() {
    this.search.emit(this.searchTerm);
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
