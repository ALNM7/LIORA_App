import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HighJewelryItem } from './jewelry.service';

export interface CartItem {
  item: HighJewelryItem;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  // user key
  private userKey = 'guest';

  constructor() {
    this.loadFromStorage();
  }

  // set key woth user id
  setUser(userId: number | null): void {
    this.userKey = userId ? `user_${userId}` : 'guest';
    this.loadFromStorage();
  }

  private get storageKey(): string {
    return `liora_cart_${this.userKey}`;
  }

  private loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) {
        this.itemsSubject.next([]);
        return;
      }
      const parsed: CartItem[] = JSON.parse(raw);
      this.itemsSubject.next(parsed);
    } catch {
      this.itemsSubject.next([]);
    }
  }

  private saveToStorage(): void {
    const items = this.itemsSubject.value;
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  getItems(): CartItem[] {
    return this.itemsSubject.value;
  }

  addItem(item: HighJewelryItem, quantity: number = 1): void {
    const items = [...this.itemsSubject.value];
    const idx = items.findIndex(ci => ci.item.id === item.id);

    if (idx >= 0) {
      items[idx] = {
        ...items[idx],
        quantity: items[idx].quantity + quantity
      };
    } else {
      items.push({ item, quantity });
    }

    this.itemsSubject.next(items);
    this.saveToStorage();
  }

  updateQuantity(itemId: number, quantity: number): void {
    const items = [...this.itemsSubject.value];
    const idx = items.findIndex(ci => ci.item.id === itemId);
    if (idx === -1) return;

    if (quantity <= 0) {
      items.splice(idx, 1);
    } else {
      items[idx] = { ...items[idx], quantity };
    }

    this.itemsSubject.next(items);
    this.saveToStorage();
  }

  removeItem(itemId: number): void {
    const items = this.itemsSubject.value.filter(ci => ci.item.id !== itemId);
    this.itemsSubject.next(items);
    this.saveToStorage();
  }

  clear(): void {
    this.itemsSubject.next([]);
    this.saveToStorage();
  }

  getTotalCount(): number {
    return this.itemsSubject.value.reduce((sum, ci) => sum + ci.quantity, 0);
  }

  getTotalPrice(): number {
    return this.itemsSubject.value.reduce(
      (sum, ci) => sum + ci.quantity * ci.item.price,
      0
    );
  }

    getItemsSnapshot(): CartItem[] {
    // copia para no mutar directamente el BehaviorSubject
    return [...this.itemsSubject.value];
  }
}
