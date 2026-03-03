import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { IProducts } from '../../../models/iproducts';
import { AuthService, AuthUser } from '../../services/authService';
import { ProductService } from '../../services/product-service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  currentUser: AuthUser | null = null;
  isAdmin = false;
  activeTab: 'overview' | 'edit' | 'security' = 'overview';

  // Admin stats
  totalProducts = 0;
  totalCategories = 0;
  isLoadingStats = false;

  // Edit form
  editForm = { firstName: '', lastName: '', email: '' };
  saveSuccess = false;
  isSaving = false;

  // Password form
  passwordForm = { current: '', newPass: '', confirm: '' };
  passwordError = '';
  passwordSuccess = false;

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    this.isAdmin = this.authService.isAdmin();

    if (this.currentUser) {
      this.editForm = {
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
        email: this.currentUser.email,
      };
    }

    if (this.isAdmin) {
      this.isLoadingStats = true;
      this.productService.getAllProducts().subscribe({
        next: (products: IProducts[]) => {
          this.totalProducts = products.length;
          this.totalCategories = new Set(products.map((p) => p.category)).size;
          this.isLoadingStats = false;
        },
        error: () => {
          this.isLoadingStats = false;
        },
      });
    }
  }

  saveProfile(): void {
    if (!this.currentUser) return;
    this.isSaving = true;
    setTimeout(() => {
      const updated: AuthUser = { ...this.currentUser!, ...this.editForm };
      localStorage.setItem('auth_user', JSON.stringify(updated));
      this.currentUser = updated;
      this.isSaving = false;
      this.saveSuccess = true;
      setTimeout(() => (this.saveSuccess = false), 3000);
    }, 600);
  }

  changePassword(): void {
    this.passwordError = '';
    this.passwordSuccess = false;
    if (!this.passwordForm.current) {
      this.passwordError = 'Please enter your current password.';
      return;
    }
    if (this.passwordForm.newPass.length < 6) {
      this.passwordError = 'Password must be at least 6 characters.';
      return;
    }
    if (this.passwordForm.newPass !== this.passwordForm.confirm) {
      this.passwordError = 'New passwords do not match.';
      return;
    }
    this.passwordSuccess = true;
    this.passwordForm = { current: '', newPass: '', confirm: '' };
    setTimeout(() => (this.passwordSuccess = false), 3000);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

  get initials(): string {
    const f = this.currentUser?.firstName?.charAt(0) ?? '';
    const l = this.currentUser?.lastName?.charAt(0) ?? '';
    return `${f}${l}`.toUpperCase();
  }

  get fullName(): string {
    return `${this.currentUser?.firstName ?? ''} ${this.currentUser?.lastName ?? ''}`.trim();
  }
}
