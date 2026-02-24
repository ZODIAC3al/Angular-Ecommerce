import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';

import { IProducts } from '../../../models/iproducts';
// import { ProductsData } from '../../../models/products-data';
import { CardHoverDirective } from '../../directives/card-hover';
import { ThreeWordsPipe } from '../../pipes/three-words-pipe-pipe';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ThreeWordsPipe, CardHoverDirective],
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
})
export class Products {
  productsList: IProducts[] = [
    {
      id: 'p1',
      name: 'Handwoven Cotton Scarf',
      category: 'Clothing',
      price: 25.99,
      image: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?q=80&w=800',
      artisan: {
        name: 'Layla Hassan',
        bio: 'A skilled weaver from Cairo who uses traditional handloom techniques.',
        location: 'Cairo, Egypt',
      },
      description: 'Soft, handwoven cotton scarf with vibrant patterns. Perfect for all seasons.',
    },
    {
      id: 'p2',
      name: 'Ceramic Coffee Mug',
      category: 'Home Decor',
      price: 18.5,
      image: 'https://images.unsplash.com/photo-1484402628941-0bb40fc029e7?q=80&w=800',
      artisan: {
        name: 'Omar Naguib',
        bio: 'Ceramic artist creating functional and decorative pottery inspired by nature.',
        location: 'Alexandria, Egypt',
      },
      description: 'Handmade ceramic coffee mug, dishwasher safe, with a rustic finish.',
    },
    {
      id: 'p3',
      name: 'Leather Journal',
      category: 'Stationery',
      price: 32.0,
      image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=800',
      artisan: {
        name: 'Sara Adel',
        bio: 'Passionate about sustainable leathercraft, creating timeless journals.',
        location: 'Giza, Egypt',
      },
      description: 'Premium leather-bound journal with 200 pages of recycled paper.',
    },
    {
      id: 'p4',
      name: 'Hand-painted Wall Art',
      category: 'Art',
      price: 75.0,
      image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=800',
      artisan: {
        name: 'Khaled Samir',
        bio: 'Contemporary painter blending traditional and modern Egyptian motifs.',
        location: 'Aswan, Egypt',
      },
      description: 'Acrylic hand-painted canvas. Adds a vibrant touch to your living space.',
    },
    {
      id: 'p5',
      name: 'Beaded Bracelet',
      category: 'Accessories',
      price: 15.0,
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800',
      artisan: {
        name: 'Nour Farid',
        bio: 'Jewelry maker specializing in colorful, handcrafted beaded designs.',
        location: 'Luxor, Egypt',
      },
      description: 'Colorful hand-beaded bracelet, adjustable size, perfect for gifting.',
    },
  ];

  totalPrice: number = 0;

  filteredProducts = [...this.productsList];

  activeDropdown: string | null = null;
  selectedCategory: string = 'All Categories';
  selectedPrice: string = 'All Prices';

  categories = ['All Categories', 'Clothing', 'Home Decor', 'Stationery', 'Art', 'Accessories'];
  prices = ['All Prices', 'Under $20', '$20 - $50', 'Over $50'];

  toggleDropdown(menu: string, event?: Event) {
    event?.stopPropagation();
    this.activeDropdown = this.activeDropdown === menu ? null : menu;
  }

  @HostListener('document:click')
  closeDropdowns() {
    this.activeDropdown = null;
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.activeDropdown = null;
    this.applyFilters();
  }

  selectPrice(price: string) {
    this.selectedPrice = price;
    this.activeDropdown = null;
    this.applyFilters();
  }

  applyFilters() {
    let tempResults = [...this.productsList];

    // Filter by Category (if it's not 'All')
    if (this.selectedCategory !== 'All Categories') {
      tempResults = tempResults.filter((p) => p.category === this.selectedCategory);
    }

    // Filter by Price (if it's not 'All')
    if (this.selectedPrice !== 'All Prices') {
      if (this.selectedPrice === 'Under $20') {
        tempResults = tempResults.filter((p) => p.price < 20);
      } else if (this.selectedPrice === '$20 - $50') {
        tempResults = tempResults.filter((p) => p.price >= 20 && p.price <= 50);
      } else if (this.selectedPrice === 'Over $50') {
        tempResults = tempResults.filter((p) => p.price > 50);
      }
    }

    // Update the UI array with the final filtered list
    this.filteredProducts = tempResults;
  }

  // Requirement: Dynamic Buy Button Functionality
  toggleBuy(product: any) {
    if (product.isBought) {
      this.totalPrice -= product.price;
      product.isBought = false;
    } else {
      this.totalPrice += product.price;
      product.isBought = true;
    }
  }
}
