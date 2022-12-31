import { NgModule } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavigationComponent } from './navigation/navigation.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule} from '@angular/material/button';
import { SaleFeatureComponent } from './sale-feature/sale-feature.component';
import { SaleListingComponent } from './sale-listing/sale-listing.component';
import { SaleDetailComponent } from './sale-detail/sale-detail.component';
import { ItemListingComponent } from './item-listing/item-listing.component';
import { ViewItemComponent } from './view-item/view-item.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { CatalogueSearch } from './catalogue-search/catalogue-search.component';
import { MapSliderComponent } from './map-slider/map-slider.component';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormatDatePipe } from './pipes/formatDate.pipe';
import { formatSuperScriptPipe } from './pipes/formatSuperscript.pipe';
import { FormatPhonePipe } from './pipes/formatPhone.pipe';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { LoadingComponent } from './loading/loading.component';
import { SignupComponent } from './signup/signup.component';
import { MyDashboardComponent } from './my-dashboard/my-dashboard.component';
import { PopupMenuComponent } from './popup-menu/popup-menu.component';
import {MatDialogModule} from '@angular/material/dialog';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { CreateSaleComponent } from './create-sale/create-sale.component';
import { AuthGuardComponent } from './guards/auth.guard';
import { AuthService } from './Services/auth.service';
import { PopupAddItemComponent } from './popup-add-item/popup-add-item.component';
import {MatMenuModule} from '@angular/material/menu';
import { MessengerComponent } from './messenger/messenger.component';
import { MessageBoxComponent } from './message-box/message-box.component';
import { SocketService } from './Services/socket.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';



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
    CatalogueSearch,
    MapSliderComponent,
    LoginComponent,
    FormatDatePipe,
    FormatPhonePipe,
    formatSuperScriptPipe,
    LoadingComponent,
    SignupComponent,
    MyDashboardComponent,
    PopupMenuComponent,
    CreateSaleComponent,
    PopupAddItemComponent,
    MessengerComponent,
    MessageBoxComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    GoogleMapsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    BrowserModule,
    MatRippleModule,
    CarouselModule,
    MatIconModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatRadioModule,
    MatSnackBarModule,
    MatDialogModule,
    MatMenuModule,
    MatProgressBarModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    AuthGuardComponent,
    AuthService,
    SocketService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
