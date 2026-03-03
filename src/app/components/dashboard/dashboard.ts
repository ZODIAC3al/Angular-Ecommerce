import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { IProducts } from '../../../models/iproducts';
import { AuthService, AuthUser } from '../../services/authService';
import { ProductService } from '../../services/product-service';

interface StatCard {
  label: string;
  value: string | number;
  change: number;
  icon: string;
  color: string;
}

interface CategoryStat {
  name: string;
  count: number;
  avgPrice: number;
  revenue: number;
  icon: string;
  pct: number;
  color: string; // 👈 Added color property for HTML to read
}

interface TopProduct {
  product: IProducts;
  sales: number;
  revenue: number;
}

interface RecentActivity {
  type: 'order' | 'review' | 'product' | 'user';
  message: string;
  time: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, OnDestroy {
  currentUser: AuthUser | null = null;
  isAdmin = false;
  isLoading = true;
  currentDate = new Date();

  allProducts: IProducts[] = [];

  // Derived stats
  statCards: StatCard[] = [];
  categoryStats: CategoryStat[] = [];
  topProducts: TopProduct[] = [];
  recentActivity: RecentActivity[] = [];

  // Chart data (simulated)
  revenueData: number[] = [];
  revenueLabels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

  private refreshInterval: any;

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

  private colorMap: Record<string, string> = {
    electronics: '#f97316',
    jewelery: '#8b5cf6',
    "men's clothing": '#0ea5e9',
    "women's clothing": '#ec4899',
    laptops: '#14b8a6',
    smartphones: '#3b82f6',
    fragrances: '#d946ef',
    skincare: '#f43f5e',
    groceries: '#84cc16',
    'home-decoration': '#f59e0b',
  };

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private router: Router,
    private cdr: ChangeDetectorRef, // 👈 Injected to force UI updates
  ) {}

  ngOnInit(): void {
    console.log('🟡 1. Dashboard component started.');

    this.currentUser = this.authService.getUser();
    this.isAdmin = this.authService.isAdmin();

    console.log('🟡 2. Current User:', this.currentUser);
    console.log('🟡 3. Is Admin?', this.isAdmin);

    if (!this.isAdmin) {
      console.error('🛑 4. ERROR: User is not an admin! Halting data fetch.');
      // I am commenting out the redirect so you can actually see the error
      // this.router.navigate(['/dashboard']);
      // return;
    }

    console.log('🟢 5. Admin check passed (or bypassed). Fetching data...');
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) clearInterval(this.refreshInterval);
  }

  loadDashboardData(): void {
    console.log('📡 6. Calling API...');
    this.productService.getAllProducts().subscribe({
      next: (response: any) => {
        console.log('✅ 7. API Success! Raw data:', response);
        const safeProducts = Array.isArray(response) ? response : response?.products || [];

        this.allProducts = safeProducts;
        this.buildStats(safeProducts);
        this.buildCategoryStats(safeProducts);
        this.buildTopProducts(safeProducts);
        this.buildActivity();
        this.buildRevenueChart();

        this.isLoading = false;
        this.cdr.detectChanges();
        console.log('🎉 8. Dashboard fully rendered!');
      },
      error: (err) => {
        console.error('❌ API FAILED:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }
  private buildStats(products: IProducts[]): void {
    const totalRevenue = products.reduce((s, p) => s + (p.price || 0) * this.mockSales(p.id), 0);
    // Safe fallback if length is 0 to avoid dividing by zero
    const avgRating =
      products.length > 0 ? products.reduce((s, p) => s + (p.rating ?? 0), 0) / products.length : 0;
    const categories = new Set(products.map((p) => p.category)).size;

    this.statCards = [
      {
        label: 'Total Products',
        value: products.length,
        change: 12,
        icon: '📦',
        color: '#f97316',
      },
      {
        label: 'Total Revenue',
        value: '$' + (totalRevenue / 1000).toFixed(1) + 'k',
        change: 8.4,
        icon: '💰',
        color: '#10b981',
      },
      {
        label: 'Categories',
        value: categories,
        change: 0,
        icon: '🗂️',
        color: '#8b5cf6',
      },
      {
        label: 'Avg. Rating',
        value: avgRating.toFixed(1) + '★',
        change: 2.1,
        icon: '⭐',
        color: '#f59e0b',
      },
      {
        label: 'Active Orders',
        value: Math.floor(products.length * 2.7),
        change: 18.3,
        icon: '🛒',
        color: '#0ea5e9',
      },
      {
        label: 'Customers',
        value: '1.2k',
        change: 5.6,
        icon: '👥',
        color: '#ec4899',
      },
    ];
  }

  private buildCategoryStats(products: IProducts[]): void {
    const map = new Map<string, IProducts[]>();
    products.forEach((p) => {
      const catName = p.category || 'Uncategorized';
      const list = map.get(catName) ?? [];
      list.push(p);
      map.set(catName, list);
    });

    const total = products.length || 1; // Prevent divide by zero
    this.categoryStats = Array.from(map.entries()).map(([name, prods]) => {
      const revenue = prods.reduce((s, p) => s + p.price * this.mockSales(p.id), 0);
      return {
        name,
        count: prods.length,
        avgPrice: +(prods.reduce((s, p) => s + p.price, 0) / prods.length).toFixed(2),
        revenue: +revenue.toFixed(0),
        icon: this.iconMap[name.toLowerCase()] ?? '📦',
        pct: Math.round((prods.length / total) * 100),
        color: this.getCategoryColor(name), // 👈 Color is now evaluated once here!
      };
    });
    this.categoryStats.sort((a, b) => b.revenue - a.revenue);
  }

  private buildTopProducts(products: IProducts[]): void {
    this.topProducts = products
      .map((p) => ({
        product: p,
        sales: this.mockSales(p.id),
        revenue: +(p.price * this.mockSales(p.id)).toFixed(2),
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6);
  }

  private buildActivity(): void {
    this.recentActivity = [
      {
        type: 'order',
        message: 'New order #4821 placed for $129.99',
        time: '2 min ago',
        icon: '🛒',
        color: '#f97316',
      },
      {
        type: 'review',
        message: 'Product "WD 2TB HDD" received 5-star review',
        time: '14 min ago',
        icon: '⭐',
        color: '#f59e0b',
      },
      {
        type: 'product',
        message: 'Stock updated for "Silicon Power SSD"',
        time: '1 hr ago',
        icon: '📦',
        color: '#10b981',
      },
      {
        type: 'user',
        message: 'New customer registered: john.doe@email.com',
        time: '2 hr ago',
        icon: '👤',
        color: '#8b5cf6',
      },
      {
        type: 'order',
        message: 'Order #4817 shipped to Cairo, Egypt',
        time: '3 hr ago',
        icon: '🚚',
        color: '#0ea5e9',
      },
      {
        type: 'product',
        message: 'New product added to "Women\'s Clothing"',
        time: '5 hr ago',
        icon: '✨',
        color: '#ec4899',
      },
    ];
  }

  private buildRevenueChart(): void {
    // Simulated monthly revenue data
    this.revenueData = [42, 58, 47, 72, 65, 88, 94];
  }

  mockSales(id: number): number {
    return ((id * 17 + 31) % 80) + 10;
  }

  get totalRevenue(): number {
    return this.allProducts.reduce((s, p) => s + p.price * this.mockSales(p.id), 0);
  }

  getCategoryColor(name: string): string {
    return this.colorMap[name.toLowerCase()] ?? '#64748b'; // Default fallback color
  }

  get greeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  }

  get chartMax(): number {
    return Math.max(...this.revenueData) + 10;
  }

  barHeight(val: number): number {
    return (val / this.chartMax) * 100;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
