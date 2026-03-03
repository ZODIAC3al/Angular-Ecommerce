import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

import { Footer } from './components/footer/footer';
import { Navbar } from './components/navbar/navbar';
// import { Home } from './components/home/home';
import { Products } from './components/products/products';
import { Slider } from './components/slider/slider';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, Navbar,Footer, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('angular-course');
  data = {
    title: 'angular-course',
  };
}
