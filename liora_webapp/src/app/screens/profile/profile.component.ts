import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthUserService, CurrentUser } from '../../services/auth-user.service';
import { Router } from '@angular/router';
import { NavBarComponent } from '../../partials/nav-bar/nav-bar.component'; 
import { FooterComponent } from '../../partials/footer/footer.component'; 

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    NavBarComponent,
    FooterComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: CurrentUser | null = null;
  loading = true;
  error = '';

  constructor(
    private auth: AuthUserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.auth.getCurrentUser().subscribe({
      next: (u) => {
        this.user = u;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Could not load profile.';
        this.loading = false;
      }
    });
  }

  goToAdmin(): void {
    this.router.navigate(['/admin/high-j/new']);
  }
}
