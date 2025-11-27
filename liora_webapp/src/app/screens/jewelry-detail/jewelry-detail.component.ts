import { NavBarComponent } from '../../partials/nav-bar/nav-bar.component';
import { FooterComponent } from '../../partials/footer/footer.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  HighJewelryItem,
  HighJewelryImage,
  JewelryService
} from '../../services/jewelry.service';
import { CartService } from '../../services/cart.service'; 

@Component({
  selector: 'app-jewelry-detail',
  templateUrl: './jewelry-detail.component.html',
  styleUrls: ['./jewelry-detail.component.scss'],
  standalone: true,
  imports: [FooterComponent, NavBarComponent, CommonModule],
})
export class JewelryDetailComponent implements OnInit {
  item: HighJewelryItem | null = null;
  currentIndex = 0;

  cartMessage = ''; 

  constructor(
    private route: ActivatedRoute,
    public jewelryService: JewelryService,
    private cart: CartService             
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.jewelryService.getHighJewelryItem(id).subscribe({
        next: (item) => {
          this.item = item;
          this.currentIndex = 0;
        }
      });
    }
  }

  get currentImage(): string {
    if (!this.item || !this.item.images || this.item.images.length === 0) {
      return '';
    }
    const img: HighJewelryImage = this.item.images[this.currentIndex];
    return this.jewelryService.fullImageUrl(img.image);
  }

  selectThumb(idx: number): void {
    this.currentIndex = idx;
  }

  formatPrice(price: number | undefined): string {
    if (price == null) { return ''; }
    return '$' + price.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }

  
  addToCart(): void {
    if (!this.item) return;

    this.cart.addItem(this.item, 1);
    this.cartMessage = 'Added to your cart.';

    
    setTimeout(() => {
      this.cartMessage = '';
    }, 2500);
  }
}
