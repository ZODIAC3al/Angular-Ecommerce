import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { CardHoverDirective } from '../../directives/card-hover';
import { ThreeWordsPipe } from '../../pipes/three-words-pipe-pipe';
import { ProductService } from '../../services/product-service';
import { Slider } from '../slider/slider';

// --- INTERFACES ---
export interface IProducts {
  id: number; // Product ID
  name: string; // Product name (maps from 'title')
  description: string; // Product description
  category: string; // Product category
  price: number; // Product price
  rating?: number; // Optional rating
  stock?: number; // Optional stock
  brand?: string; // Optional brand
  image: string; // Single main image (maps from 'thumbnail')
  images?: string[]; // Array of all images
  artisan?: {
    // Optional artisan info
    name: string;
    bio: string;
    location: string;
  };
  isBought?: boolean; // Track if user bought the product
  showFullDesc?: boolean; // Track if full description is visible
}

export interface IProductApiResponse {
  products?: any[];
  [key: string]: any;
}

// --- COMPONENT ---
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ThreeWordsPipe, CardHoverDirective, Slider, FormsModule],
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
})
export class Products implements OnInit {
  totalPrice: number = 0;

  productsList: IProducts[] = [];
  filteredProducts: IProducts[] = [];

  // Filters
  activeDropdown: string | null = null;
  selectedCategory: string = 'All Categories';
  selectedPrice: string = 'All Prices';
  categories = ['All Categories', 'Clothing', 'Home Decor', 'Stationery', 'Art', 'Accessories'];
  prices = ['All Prices', 'Under $20', '$20 - $50', 'Over $50'];

  // Form Initial State
  private initialProductState: IProducts = {
    id: 0,
    name: '',
    category: '',
    price: 0,
    image: '',
    images: [],
    description: '',
    artisan: { name: '', bio: '', location: '' },
    isBought: false,
    showFullDesc: false,
  };

  newProduct: IProducts = { ...this.initialProductState };

  constructor(
    private productService: ProductService,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getAllData();
  }

  getAllData() {
    this.productService.getAllProducts().subscribe({
      next: (response: IProductApiResponse | any[]) => {
        const safeProducts = Array.isArray(response) ? response : response?.products || [];

        this.productsList = safeProducts
          .filter((p: any) => p != null)
          .map((p: any) => ({
            id: p.id,
            name: p.title,
            category: p.category,
            price: p.price,
            description: p.description,
            image: p.thumbnail,
            images: p.images || [],
            rating: p.rating,
            stock: p.stock,
            brand: p.brand,
            artisan: { name: '', bio: '', location: '' },
            isBought: false,
            showFullDesc: false,
          }));

        this.filteredProducts = [...this.productsList];

        // ⚡ Manually trigger change detection
        this.changeDetector.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }
  // ========================
  // FILTER FUNCTIONS
  // ========================
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
    this.applyFilters();
    this.activeDropdown = null; // Close dropdown after selection
  }

  selectPrice(price: string) {
    this.selectedPrice = price;
    this.applyFilters();
    this.activeDropdown = null; // Close dropdown after selection
  }

  applyFilters() {
    let temp = [...this.productsList];

    if (this.selectedCategory !== 'All Categories') {
      temp = temp.filter((p) => p.category === this.selectedCategory);
    }

    if (this.selectedPrice !== 'All Prices') {
      if (this.selectedPrice === 'Under $20') temp = temp.filter((p) => p.price < 20);
      else if (this.selectedPrice === '$20 - $50')
        temp = temp.filter((p) => p.price >= 20 && p.price <= 50);
      else if (this.selectedPrice === 'Over $50') temp = temp.filter((p) => p.price > 50);
    }

    this.filteredProducts = temp;
  }

  // ========================
  // BUY BUTTON
  // ========================
  toggleBuy(product: IProducts) {
    if (product.isBought) {
      this.totalPrice -= product.price;
      product.isBought = false;
    } else {
      this.totalPrice += product.price;
      product.isBought = true;
    }

    // Fix JS floating point math errors (e.g., 19.99 + 10.05 = 30.040000000000003)
    this.totalPrice = Math.round(this.totalPrice * 100) / 100;
  }

  // ========================
  // ADD PRODUCT
  // ========================
  addProduct(form: NgForm) {
    const payload = {
      title: this.newProduct.name,
      description: this.newProduct.description,
      category: this.newProduct.category,
      price: Number(this.newProduct.price), // Ensure it sends as a number
      thumbnail: this.newProduct.image,
      images: this.newProduct.images || [],
      rating: 0,
      stock: 0,
      brand: this.newProduct.brand || '',
    };

    this.productService.postProduct(payload as any).subscribe({
      next: (res: any) => {
        // Map response to interface with fallbacks in case API only returns ID
        const mapped: IProducts = {
          id: res.id || Math.floor(Math.random() * 10000),
          name: res.title || this.newProduct.name,
          category: res.category || this.newProduct.category,
          price: res.price || Number(this.newProduct.price),
          description: res.description || this.newProduct.description,
          image: res.thumbnail || this.newProduct.image,
          images: res.images || this.newProduct.images || [],
          rating: res.rating || 0,
          stock: res.stock || 0,
          brand: res.brand || '',
          artisan: { name: '', bio: '', location: '' },
          isBought: false,
          showFullDesc: false,
        };

        this.productsList.push(mapped);
        this.applyFilters();

        // Properly reset the NgForm to clear validation states
        form.resetForm();

        // Reset local model to initial state
        this.newProduct = { ...this.initialProductState };
      },
      error: (err) => console.error(err),
    });
  }
}
