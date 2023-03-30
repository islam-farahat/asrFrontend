import { MaintenanceComponent } from './maintenance.component';
import { HomeComponent } from './pages/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoicesComponent } from './pages/invoices/invoices.component';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'invoices',
        component: InvoicesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceRoutingModule {}
