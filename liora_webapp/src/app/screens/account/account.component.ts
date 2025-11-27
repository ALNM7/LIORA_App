import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavBarComponent } from '../../partials/nav-bar/nav-bar.component';
import { FooterComponent } from '../../partials/footer/footer.component';

import { AuthService } from '../../services/auth.service';
import { AuthUserService } from '../../services/auth-user.service';
import { CartService } from '../../services/cart.service';
import { CartUiService } from '../../services/cart-ui.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule, NavBarComponent, FooterComponent],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  username = '';
  password = '';

  user: any = null;
  loadingUser = false;
  userError = '';
  loginError = '';

  redirectUrl: string | null = null;

  constructor(
    private auth: AuthService,
    private authUser: AuthUserService,
    private router: Router,
    private route: ActivatedRoute,
    private cart: CartService,
    private cartUi: CartUiService
  ) {}

  ngOnInit(): void {
    // leer ?redirect=/admin/...
    this.redirectUrl = this.route.snapshot.queryParamMap.get('redirect');

    // si ya hay token, cargamos usuario de una vez
    if (this.auth.isLoggedIn()) {
      this.loadUser();
    }
  }

  onLogin(): void {
    this.loginError = '';

    if (!this.username || !this.password) {
      this.loginError = 'Please enter username and password.';
      return;
    }

    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        // si venimos desde un redirect, mandamos directo a esa ruta
        if (this.redirectUrl) {
          const target = this.redirectUrl;
          this.redirectUrl = null;
          this.router.navigateByUrl(target);
        } else {
          // si no hay redirect, simplemente mostramos el perfil
          this.loadUser();
        }
      },
      error: (err) => {
        console.error(err);
        this.loginError = 'Invalid credentials. Please try again.';
      }
    });
  }

  loadUser(): void {
    this.loadingUser = true;
    this.userError = '';

    this.authUser.getCurrentUser().subscribe({
      next: (u) => {
        this.user = u;
        this.loadingUser = false;

        // asociar carrito a este usuario
        if (u && u.id != null) {
          this.cart.setUser(u.id);
        } else {
          this.cart.setUser(null);
        }
      },
      error: (err) => {
        console.error(err);
        this.userError = 'Could not load account information.';
        this.loadingUser = false;
      }
    });
  }

  onLogout(): void {
    this.auth.clearToken();
    this.user = null;
    this.username = '';
    this.password = '';
    this.cart.setUser(null);
    this.cart.clear();
  }

  // mini resumen de carrito
  get cartCount(): number {
    return this.cart.getTotalCount();
  }

  get cartTotal(): number {
    return this.cart.getTotalPrice();
  }

  openCart(): void {
    this.cartUi.open();
  }

  goToAdminHighJ(): void {
    this.router.navigate(['/admin/high-j/manage']);
  }
}
