import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'regis', component: RegisterComponent },
  { path: 'about', component: AboutComponent },
  { path: 'dashboard', loadChildren: './organizer/organizer.module#OrganizerModule' },
  { path: 'create', loadChildren: './create-event/create-event.module#CreateEventModule' },
  //
  { path: 'yourevent', loadChildren: './delivery/delivery.module#DeliveryModule' },
  { path: 'payment', loadChildren: './payment/payment.module#PaymentModule' },
  { path: 'setting', loadChildren: './setting/setting.module#SettingModule' }
];

@NgModule({
  // , {useHash: true}
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
