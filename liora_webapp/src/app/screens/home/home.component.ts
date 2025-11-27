import { Component } from '@angular/core';
import { NavBarComponent } from '../../partials/nav-bar/nav-bar.component';
import { FooterComponent } from '../../partials/footer/footer.component';
import { RevealOnScrollDirective } from './reveal-on-scroll.directive';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavBarComponent,
    RevealOnScrollDirective,
    FooterComponent,
    RouterModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private router: Router) {}

  // Versión genérica: si no pasas categoría, va a high-j normal
  goToHighJ(category: string | null = null): void {
    const extras = category
      ? { queryParams: { category } }
      : {};

    this.router.navigate(['/high-j'], extras).then(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }
}
