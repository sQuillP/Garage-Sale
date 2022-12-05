import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SaleDetailComponent } from './sale-detail/sale-detail.component';
import { CatalogueSearch } from './catalogue-search/catalogue-search.component';
import { ViewItemComponent } from './view-item/view-item.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { MyDashboardComponent } from './my-dashboard/my-dashboard.component';
import { CreateSaleComponent } from './create-sale/create-sale.component';

const routes: Routes = [
  {path:"home", component: HomeComponent},
  {path: "sale/:saleId", component: SaleDetailComponent},
  {path: "viewItem/:itemId",component:ViewItemComponent},
  {path:"signup", component:SignupComponent},
  {path: "login", component:LoginComponent},
  {path: "catalogue-search", component: CatalogueSearch},
  {path:"dashboard/:userId", component: MyDashboardComponent},
  {path: "create-sale", component: CreateSaleComponent},
  {path:"**", redirectTo:"/home", pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
