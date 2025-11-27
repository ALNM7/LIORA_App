import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../services/cart.service';
import { MatIconModule } from '@angular/material/icon';
import { JewelryService } from '../../services/jewelry.service';  
import { Router } from '@angular/router';


@Component({
  selector: 'app-cart-panel',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './cart-panel.component.html',
  styleUrls: ['./cart-panel.component.scss']
})
export class CartPanelComponent {
  @Output() close = new EventEmitter<void>();

  constructor(
    public cart: CartService,
    public jewelryService: JewelryService,
    private router: Router
 
  ) {}

  get items$() {
    return this.cart.items$;
  }

  getTotalPrice(): number {
    return this.cart.getTotalPrice();
  }

  trackById(index: number, ci: CartItem): number {
    return ci.item.id;
  }

  remove(ci: CartItem): void {
    this.cart.removeItem(ci.item.id);
  }

  decrease(ci: CartItem): void {
    const newQty = ci.quantity - 1;
    this.cart.updateQuantity(ci.item.id, newQty);
  }

  increase(ci: CartItem): void {
    this.cart.updateQuantity(ci.item.id, ci.quantity + 1);
  }

  onCloseClick(): void {
    this.close.emit();
  }
  goToCheckout(): void {
  this.close.emit();         
  this.router.navigate(['/checkout']);  
}


}

