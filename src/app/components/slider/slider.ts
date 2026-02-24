import { Component, OnDestroy, OnInit } from '@angular/core';

import { ISlider } from '../../../models/islider';

@Component({
  selector: 'app-slider',
  imports: [],
  templateUrl: './slider.html',
  styleUrl: './slider.css',
})
export class Slider implements OnInit, OnDestroy {
  currentIndex = 0;
  autoPlayInterval: any;
  items: ISlider[] = [
    {
      id: 1,
      image:
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop',
      title: 'Summer Collection',
      subtitle: 'Discover the new arrivals for the season.',
      buttonText: 'Shop Now',
    },
    {
      id: 2,
      image:
        'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=2070&auto=format&fit=crop',
      title: 'Modern Essentials',
      subtitle: 'Curated styles for everyday living.',
      buttonText: 'View Lookbook',
    },
    {
      id: 3,
      image:
        'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop',
      title: 'Exclusive Deals',
      subtitle: 'Limited time offers on selected items.',
      buttonText: 'Browse Sale',
    },
  ];

  ngOnInit() {
    this.startAutoPlay();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }


  goToSlide(index: number): void {
    this.currentIndex = index;
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  next(): void {
    if (this.currentIndex < this.items.length - 1) {
      this.currentIndex++;
    } else {
      // Loop back to start
      this.currentIndex = 0;
    }
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      this.next();
    }, 5000);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }
}
