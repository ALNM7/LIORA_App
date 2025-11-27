import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { JewelryService, HighJewelryItem } from '../../services/jewelry.service';
import { AuthUserService } from '../../services/auth-user.service';
import { NavBarComponent } from '../../partials/nav-bar/nav-bar.component';
import { FooterComponent } from '../../partials/footer/footer.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-high-j-manage',
  standalone: true,
  imports: [CommonModule, NavBarComponent, FooterComponent, MatIconModule],
  templateUrl: './admin-high-j-manage.component.html',
  styleUrls: ['./admin-high-j-manage.component.scss']
})
export class AdminHighJManageComponent implements OnInit {
  items: HighJewelryItem[] = [];
  loading = false;
  error = '';
  deletingId: number | null = null;

  constructor(
    private jewelryService: JewelryService,
    private authUser: AuthUserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // opcional: verificar que el usuario es admin
    this.authUser.getCurrentUser().subscribe({
      next: (u) => {
        if (!u.is_admin) {
          this.error = 'You are not authorized to manage high jewelry.';
          return;
        }
        this.loadItems();
      },
      error: () => {
        this.error = 'Please sign in to access this page.';
      }
    });
  }

  loadItems(): void {
    this.loading = true;
    this.error = '';

    this.jewelryService.getHighJewelry().subscribe({
      next: (data) => {
        this.items = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Could not load high jewelry pieces.';
        this.loading = false;
      }
    });
  }

  getThumb(item: HighJewelryItem): string {
    const img = item.images && item.images.length > 0 ? item.images[0] : null;
    return img ? this.jewelryService.fullImageUrl(img.image) : 'assets/placeholder.png';
  }

  onEdit(item: HighJewelryItem): void {
    this.router.navigate(['/admin/high-j/new'], {
      queryParams: { id: item.id }
    });
  }

  onDelete(item: HighJewelryItem): void {
    if (!confirm(`Delete "${item.name}"? This cannot be undone.`)) {
      return;
    }

    this.deletingId = item.id;

    this.jewelryService.deleteHighJewelryItem(item.id).subscribe({
      next: () => {
        this.items = this.items.filter((i) => i.id !== item.id);
        this.deletingId = null;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error deleting item.';
        this.deletingId = null;
      }
    });
  }

  goToCreate(): void {
    this.router.navigate(['/admin/high-j/new']);
  }
}
