import { Component } from '@angular/core';
import { NavBarComponent } from '../../partials/nav-bar/nav-bar.component'; 
import { MatIconModule } from '@angular/material/icon';
import { FooterComponent } from '../../partials/footer/footer.component'; 


@Component({
  selector: 'app-contact-us',
  imports: [
    NavBarComponent,
    MatIconModule,
    FooterComponent,
  ],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent {

}
