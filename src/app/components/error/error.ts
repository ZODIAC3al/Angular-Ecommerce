import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error',
  imports: [],
  templateUrl: './error.html',
  styleUrl: './error.css',
})
export class Error {
  constructor(
    private location: Location,
    private router: Router,
  ) {}
  Back() {
    this.location.back();
  }

  BackToHome() {
    this.router.navigateByUrl('/');
  }
}
