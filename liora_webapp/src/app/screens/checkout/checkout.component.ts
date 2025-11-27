import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';

import { NavBarComponent } from '../../partials/nav-bar/nav-bar.component';
import { FooterComponent } from '../../partials/footer/footer.component';
import { CartService, CartItem } from '../../services/cart.service';
import { JewelryService, HighJewelryImage } from '../../services/jewelry.service';

interface LioraOrder {
  id: number;
  createdAt: string;
  items: CartItem[];
  totalAmount: number;
  customer: {
    fullName: string;
    email: string;
    country?: string;
    city?: string;
    notes?: string;
  };
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavBarComponent, FooterComponent],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  items: CartItem[] = [];
  totalAmount = 0;
  placed = false;

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public cart: CartService,
    private router: Router,
    private jewelryService: JewelryService
  ) {
    // aquí ya fb está disponible y TypeScript está feliz
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      country: [''],
      city: [''],
      notes: [''],
    });
  }

  ngOnInit(): void {
    // snapshot del carrito al entrar
    this.items = this.cart.getItemsSnapshot();
    this.totalAmount = this.cart.getTotalPrice();

    // si el carrito está vacío, redirigimos
    if (this.items.length === 0) {
      this.router.navigate(['/high-j']);
    }
  }

  formatPrice(price: number): string {
    return '$' + price.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }

  getItemSubtotal(ci: CartItem): number {
    return ci.quantity * ci.item.price;
  }

  thumb(ci: CartItem): string {
    const item = ci.item as any;
    const images = (item.images || []) as HighJewelryImage[];
    if (!images.length) {
      return 'assets/placeholder_highj.png';
    }
    const img = images[0];
    return this.jewelryService.fullImageUrl(img.image);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;

    const newOrder: LioraOrder = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      items: this.items,
      totalAmount: this.totalAmount,
      customer: {
        fullName: v.fullName || '',
        email: v.email || '',
        country: v.country || '',
        city: v.city || '',
        notes: v.notes || '',
      },
    };

    const raw = localStorage.getItem('liora_orders');
    const existing: LioraOrder[] = raw ? JSON.parse(raw) : [];
    existing.push(newOrder);
    localStorage.setItem('liora_orders', JSON.stringify(existing));

    this.cart.clear();
    this.placed = true;
  }

  goBackToHighJ(): void {
    this.router.navigate(['/high-j']);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
