import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// import { Home } from './components/home/home';
import { Products } from './components/products/products';
import { Slider } from './components/slider/slider';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Products, Slider],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('angular-course');
  data = {
    title: 'angular-course',
  };
}
