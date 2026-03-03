import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { IProducts } from '../../../models/iproducts';
import { ProductService } from '../../services/product-service';

interface Shop {
  name: string;
  location: string;
  rating: number;
  tag: string;
  products?: IProducts[];
}

@Component({
  selector: 'app-home',
  standalone: true, // Required when using 'imports'
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  allProducts: IProducts[] = [];
  isLoading = true;

  // State variables for filtering and displaying data
  selectedCategory: string | null = 'All';
  showAllNew = false;
  showAllFeatured = false;

  categories = [
    { label: 'All', icon: '🛒' }, // Added an 'All' option to clear filters
    { label: 'Electronics', icon: '🎙️' },
    { label: 'Televisions', icon: '📺' },
    { label: 'Men', icon: '👔' },
    { label: 'Jeans & Bottom wear', icon: '👖' },
    { label: 'Gaming Consoles', icon: '🎮' },
    { label: 'Laptops', icon: '💻' },
  ];

  featuredShops: Shop[] = [
    {
      name: "Kanwar's Shop",
      location: 'Surat, India',
      rating: 2.7,
      tag: 'AIR SPORT',
      products: [],
    },
    {
      name: 'Chromium Gallery',
      location: 'Chandigarh, India',
      rating: 2.8,
      tag: 'AIR SPORT',
      products: [],
    },
  ];

  constructor(
    private productService: ProductService,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getAllData();
  }

  getAllData() {
    this.productService.getAllProducts().subscribe({
      next: (response: any) => {
        const safeProducts = Array.isArray(response) ? response : response?.products || [];
        this.allProducts = safeProducts;

        // Assign static products to shops once
        this.featuredShops.forEach((shop, index) => {
          shop.products = safeProducts.slice(index * 2, index * 2 + 4);
        });

        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  // --- GETTERS FOR DYNAMIC FILTERING & SLICING ---

  get filteredProducts(): IProducts[] {
    if (!this.selectedCategory || this.selectedCategory === 'All') {
      return this.allProducts;
    }
    // Adjust logic depending on exactly how your API names categories
    return this.allProducts.filter((p) =>
      p.category?.toLowerCase().includes(this.selectedCategory!.toLowerCase()),
    );
  }

  get newCollection(): IProducts[] {
    const products = this.filteredProducts;
    return this.showAllNew ? products : products.slice(0, 4);
  }

  get featuredProducts(): IProducts[] {
    const products = this.filteredProducts;
    // Offset featured products so they don't exactly duplicate the new collection
    const offsetProducts = products.length > 4 ? products.slice(4) : products;
    return this.showAllFeatured ? offsetProducts : offsetProducts.slice(0, 3);
  }

  // --- ACTIONS ---

  toggleShowAllNew(event: Event) {
    event.preventDefault();
    this.showAllNew = !this.showAllNew;
  }

  toggleShowAllFeatured(event: Event) {
    event.preventDefault();
    this.showAllFeatured = !this.showAllFeatured;
  }

  filterByCategory(categoryLabel: string, event?: Event) {
    if (event) event.preventDefault();
    this.selectedCategory = categoryLabel;

    // Reset the "View All" limits when a new category is selected
    this.showAllNew = false;
    this.showAllFeatured = false;
  }

  getDiscountedPrice(price: number): number {
    return +(price * 0.8).toFixed(2);
  }

  stars(rating: number): number[] {
    return Array(5)
      .fill(0)
      .map((_, i) => (i < Math.round(rating) ? 1 : 0));
  }
}
