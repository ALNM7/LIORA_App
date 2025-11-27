import { Routes } from '@angular/router';
import { HomeComponent } from './screens/home/home.component';
import { ContactUsComponent } from './screens/contact-us/contact-us.component';
import { HighJComponent } from './screens/high-j/high-j.component';
import { JewelryDetailComponent } from './screens/jewelry-detail/jewelry-detail.component';
import { ProfileComponent } from './screens/profile/profile.component';
import { AdminHighJNewComponent } from './screens/admin-high-j-new/admin-high-j-new.component';
import { AccountComponent } from './screens/account/account.component';
import { AdminHighJManageComponent } from './screens/admin-high-j-manage/admin-high-j-manage.component';
import { authAdminGuard } from './guards/auth-admin.guard';
import { WatchesComponent } from './screens/watches/watches.component';
import { CheckoutComponent } from './screens/checkout/checkout.component';




export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'high-j', component: HighJComponent },
  { path: 'high-j/detail/:id', component: JewelryDetailComponent },
  { path: 'profile', component: ProfileComponent },
  {
  path: 'admin/high-j/new',
  component: AdminHighJNewComponent,
  canActivate: [authAdminGuard]
  },
  {
  path: 'admin/high-j/manage',
  component: AdminHighJManageComponent,
  canActivate: [authAdminGuard]
  },
  { path: 'account', component: AccountComponent },
   { path: 'watches', component: WatchesComponent },
   { path: 'checkout', component: CheckoutComponent },
  { path: '**', redirectTo: '' },
];
