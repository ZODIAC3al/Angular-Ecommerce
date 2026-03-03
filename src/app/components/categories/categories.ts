import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { IProducts } from '../../../models/iproducts';
import { ProductService } from '../../services/product-service';

interface CategoryGroup {
  name: string;
  icon: string;
  products: IProducts[];
  avgPrice: number;
  topRated: IProducts | null;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories implements OnInit {
  categoryGroups: CategoryGroup[] = [];
  allProducts: IProducts[] = [];
  isLoading = true;
  selectedCategory: CategoryGroup | null = null;
  searchQuery = '';

  private iconMap: Record<string, string> = {
    electronics: '💻',
    jewelery: '💎',
    "men's clothing": '👔',
    "women's clothing": '👗',
    laptops: '💻',
    smartphones: '📱',
    fragrances: '✨',
    skincare: '🧴',
    groceries: '🛒',
    'home-decoration': '🏡',
  };

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef, // 👈 Added to force instant UI updates
  ) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (response: any) => {
        const safeProducts = Array.isArray(response) ? response : response?.products || [];

        this.allProducts = safeProducts;
        this.buildGroups(safeProducts);

        this.isLoading = false;
        this.cdr.detectChanges(); // 👈 Tells Angular to draw the screen immediately
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  // ⚡ Optimized buildGroups: Does all sorting and math in one pass for massive speed boost
  buildGroups(products: IProducts[]): void {
    const groupMap = new Map<string, CategoryGroup>();

    // 1. Single pass to group products and find the top-rated item
    products.forEach((p) => {
      const catName = p.category || 'Uncategorized';

      // If category doesn't exist yet, create its template
      if (!groupMap.has(catName)) {
        groupMap.set(catName, {
          name: catName,
          icon: this.iconMap[catName.toLowerCase()] ?? '📦',
          products: [],
          avgPrice: 0,
          topRated: p, // Start by assuming the first item is the best
        });
      }

      const group = groupMap.get(catName)!;
      group.products.push(p);

      // Instantly check if this new product has a higher rating
      if ((p.rating ?? 0) > (group.topRated?.rating ?? 0)) {
        group.topRated = p;
      }
    });

    // 2. Final pass just to calculate the average price for each group
    this.categoryGroups = Array.from(groupMap.values()).map((group) => {
      group.avgPrice = +(
        group.products.reduce((sum, p) => sum + p.price, 0) / group.products.length
      ).toFixed(2);

      return group;
    });
  }

  get filteredProducts(): IProducts[] {
    if (!this.selectedCategory) return [];
    if (!this.searchQuery.trim()) return this.selectedCategory.products;

    const query = this.searchQuery.toLowerCase().trim();
    return this.selectedCategory.products.filter((p) => p.name.toLowerCase().includes(query));
  }

  selectCategory(group: CategoryGroup): void {
    this.selectedCategory = group;
    this.searchQuery = '';
  }

  closePanel(): void {
    this.selectedCategory = null;
    this.searchQuery = '';
  }

  stars(rating: number): boolean[] {
    return Array(5)
      .fill(false)
      .map((_, i) => i < Math.round(rating || 0));
  }
}
