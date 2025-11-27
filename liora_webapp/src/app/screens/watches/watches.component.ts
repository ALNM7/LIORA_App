// src/app/screens/watches/watches.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { NavBarComponent } from '../../partials/nav-bar/nav-bar.component';
import { FooterComponent } from '../../partials/footer/footer.component';
import { WatchService } from '../../services/watch.service';
import { WatchItem } from '../../services/watch.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-watches',
  standalone: true,
  imports: [CommonModule, NavBarComponent, FooterComponent],
  templateUrl: './watches.component.html',
  styleUrls: ['./watches.component.scss']
})
export class WatchesComponent implements OnInit {

  items: WatchItem[] = [];
  loading = false;
  error = '';

  // filtros UI (igual que en HighJ)
  sort: 'recommended' | 'price-asc' | 'price-desc' = 'recommended';
  selectedCategory: string | null = null;

  // índice de imagen por reloj (para las flechas del mini carrusel)
  imageIndex: Record<number, number> = {};

  constructor(
    private watchService: WatchService,
    private cart: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadItems();
  }

  private buildQuery(): { category?: string; ordering?: string } {
    const params: { category?: string; ordering?: string } = {};

    if (this.selectedCategory) {
      params.category = this.selectedCategory;
    }

    if (this.sort === 'price-asc') {
      params.ordering = 'price';
    } else if (this.sort === 'price-desc') {
      params.ordering = '-price';
    }
    // 'recommended' -> sin ordering (usa el orden por defecto)

    return params;
  }

  loadItems(): void {
    this.loading = true;
    this.error = '';

    const params = this.buildQuery();

    this.watchService.getAll(params).subscribe({
      next: (data) => {
        this.items = data;
        this.loading = false;
        // reset carruseles
        this.imageIndex = {};
      },
      error: (err) => {
        console.error(err);
        this.error = 'Could not load watches.';
        this.loading = false;
      }
    });
  }

  // eventos de filtros
  onSortChange(value: 'price-asc' | 'price-desc' | 'recommended'): void {
    this.sort = value;
    this.loadItems();
  }

  onCategoryChange(category: string | null): void {
    this.selectedCategory = category;
    this.loadItems();
  }

  // imagen actual del mini carrusel
  getCurrentImage(item: WatchItem): string {
    const idx = this.imageIndex[item.id] ?? 0;

    const img = item.images && item.images.length > 0
      ? item.images[Math.min(idx, item.images.length - 1)]
      : null;

    if (!img) {
      // fallback por si todavía no hay imágenes
      return 'assets/placeholder_watch.png';
    }

    return this.watchService.fullImageUrl(img.image);
  }

  hasPrev(item: WatchItem): boolean {
    const idx = this.imageIndex[item.id] ?? 0;
    return idx > 0;
  }

  hasNext(item: WatchItem): boolean {
    const idx = this.imageIndex[item.id] ?? 0;
    return item.images && idx < item.images.length - 1;
  }

  prevImage(item: WatchItem, event: MouseEvent): void {
    event.stopPropagation();
    const current = this.imageIndex[item.id] ?? 0;
    if (current > 0) {
      this.imageIndex[item.id] = current - 1;
    }
  }

  nextImage(item: WatchItem, event: MouseEvent): void {
    event.stopPropagation();
    const current = this.imageIndex[item.id] ?? 0;
    if (item.images && current < item.images.length - 1) {
      this.imageIndex[item.id] = current + 1;
    }
  }

  // helper de precio (igual que en high-j)
  formatPrice(price: number | undefined): string {
    if (price == null) {
      return '';
    }
    return '$' + price.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }

  // 🔹 De momento seguimos permitiendo ADD TO CART desde el detalle o donde quieras.
  // Este método lo dejamos listo (aunque el botón ahora no lo usemos, por copiar el layout de high-j).
  addToCart(item: WatchItem): void {
    const firstImage = item.images && item.images.length > 0
      ? this.watchService.fullImageUrl(item.images[0].image)
      : 'assets/placeholder_watch.png';

    this.cart.addItem({
      // ahora mismo tu CartService está tipado para HighJewelryItem,
      // luego lo vamos a ajustar para soportar varios tipos (high-j, watches, etc.)
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category,
      // @ts-ignore: campo extra para la miniatura
      images: [{ id: 0, image: firstImage, order: 0 }]
    } as any);
  }

  openDetail(item: WatchItem): void {
    this.router.navigate(['/watches/detail', item.id]);
  }

  onViewPiece(item: WatchItem, event: MouseEvent): void {
    event.stopPropagation();
    this.openDetail(item);
  }
}
