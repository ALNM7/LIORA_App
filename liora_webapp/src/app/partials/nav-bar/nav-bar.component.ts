import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { CartService } from '../../services/cart.service';
import { CartUiService } from '../../services/cart-ui.service';
import { CartPanelComponent } from '../cart-panel/cart-panel.component';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, CartPanelComponent],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {

  constructor(
    private cart: CartService,
    public cartUi: CartUiService   
  ) {}

  getTotalCount(): number {
    return this.cart.getTotalCount();
  }

  toggleCart(): void {
    this.cartUi.toggle();
  }

  handleCartClose(): void {
    this.cartUi.close();
  }
}
