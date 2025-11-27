import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { map, distinctUntilChanged } from 'rxjs';
import { NavBarComponent } from '../../partials/nav-bar/nav-bar.component';
import { FooterComponent } from '../../partials/footer/footer.component';
import {
  HighJewelryItem,
  HighJewelryQuery,
  JewelryService,
} from '../../services/jewelry.service';

@Component({
  selector: 'app-high-j',
  standalone: true,
  imports: [
    CommonModule,
    NavBarComponent,
    FooterComponent
  ],
  templateUrl: './high-j.component.html',
  styleUrls: ['./high-j.component.scss']
})
export class HighJComponent implements OnInit {
  items: HighJewelryItem[] = [];
  loading = false;

  // filtros UI
  sort: 'recommended' | 'price-asc' | 'price-desc' = 'recommended';
  selectedCategory: string | null = null;

  // índice actual de imagen por item (para las flechas del mini carrusel)
  imageIndex: Record<number, number> = {};

  // paginación
  pageSize = 9;
  currentPage = 1;

  constructor(
    public jewelryService: JewelryService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // Escucha cambios en ?category=
    this.route.queryParams
      .pipe(
        map((params) => (params['category'] as string | null) || null),
        distinctUntilChanged()
      )
      .subscribe((cat) => {
        this.selectedCategory = cat;
        this.currentPage = 1; // al cambiar categoría, volvemos a página 1
        this.loadItems();
      });

    // Si quieres que cargue algo incluso sin queryParam, podrías llamar loadItems()
    // aquí, pero la suscripción de arriba ya cubre el primer valor de params.
  }

  // --- Paginación getters ---

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.items.length / this.pageSize));
  }

  get paginatedItems(): HighJewelryItem[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.items.slice(start, start + this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  private buildQuery(): HighJewelryQuery {
    const query: HighJewelryQuery = {};

    if (this.selectedCategory) {
      query.category = this.selectedCategory;
    }

    if (this.sort === 'price-asc') {
      query.ordering = 'price';
    } else if (this.sort === 'price-desc') {
      query.ordering = '-price';
    }

    return query;
  }

  loadItems(): void {
    this.loading = true;
    const query = this.buildQuery();

    this.jewelryService.getHighJewelry(query).subscribe({
      next: (items) => {
        this.items = items;
        this.loading = false;
        this.imageIndex = {};
        this.currentPage = 1; // siempre que cambian los datos, arrancamos en página 1
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onSortChange(value: 'price-asc' | 'price-desc' | 'recommended'): void {
    this.sort = value;
    this.currentPage = 1;
    this.loadItems();
  }

  onCategoryChange(category: string | null): void {
    this.selectedCategory = category;

    this.router.navigate([], {
      queryParams: { category },
      queryParamsHandling: 'merge',
    });

    this.currentPage = 1;
    this.loadItems();
  }

  // --- Mini carrusel por tarjeta ---

  hasPrev(item: HighJewelryItem): boolean {
    const idx = this.imageIndex[item.id] ?? 0;
    return idx > 0;
  }

  hasNext(item: HighJewelryItem): boolean {
    const idx = this.imageIndex[item.id] ?? 0;
    return !!item.images && idx < item.images.length - 1;
  }

  prevImage(item: HighJewelryItem, event: MouseEvent): void {
    event.stopPropagation();
    const current = this.imageIndex[item.id] ?? 0;
    if (current > 0) {
      this.imageIndex[item.id] = current - 1;
    }
  }

  nextImage(item: HighJewelryItem, event: MouseEvent): void {
    event.stopPropagation();
    const current = this.imageIndex[item.id] ?? 0;
    if (item.images && current < item.images.length - 1) {
      this.imageIndex[item.id] = current + 1;
    }
  }

  getSliderTransform(item: HighJewelryItem): string {
    const idx = this.imageIndex[item.id] ?? 0;
    return `translateX(-${idx * 100}%)`;
  }

  // --- Navegación al detalle ---

  openDetail(item: HighJewelryItem): void {
    this.router.navigate(['/high-j/detail', item.id]);
  }

  formatPrice(price: number): string {
    return '$' + price.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }

  // --- Navegación del paginador ---

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.scrollToGridTop();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.scrollToGridTop();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.scrollToGridTop();
    }
  }

  private scrollToGridTop(): void {
    const el = document.querySelector('.hj-layout');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
