import { NgModule } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavigationComponent } from './navigation/navigation.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButton, MatButtonModule} from '@angular/material/button';
import { SaleFeatureComponent } from './sale-feature/sale-feature.component';
import { SaleListingComponent } from './sale-listing/sale-listing.component';
import { SaleDetailComponent } from './sale-detail/sale-detail.component';
import { ItemListingComponent } from './item-listing/item-listing.component';
import { ViewItemComponent } from './view-item/view-item.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { CarouselModule } from 'ngx-owl-carousel-o';

import {MatRippleModule} from '@angular/material/core';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavigationComponent,
    SaleFeatureComponent,
    SaleListingComponent,
    SaleDetailComponent,
    ItemListingComponent,
    ViewItemComponent,
    ProgressBarComponent,
  ],
  imports: [
    // BrowserModule,
    AppRoutingModule,
    GoogleMapsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    BrowserModule,
    MatRippleModule,
    CarouselModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
