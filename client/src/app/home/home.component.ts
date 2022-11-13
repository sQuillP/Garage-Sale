import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { filter, fromEvent, map, mergeMap, Observable, Subject, Subscription, tap} from 'rxjs';
import { Sale } from 'src/app/models/db.models';
import { SaleParams } from 'src/app/models/API.model';
import { DBService } from '../Services/db.service';
import { MapsService } from '../Services/maps.service';
import { defaultOwlConfig } from '../util/owl.options';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("searchAddressRef")searchAddressRef:ElementRef;
  searchAddress:string = "";
  searchListener:Subscription;


  saleSearchResults$ = new Subject<Sale[]>();
  topSaleSearchResults$:Observable<Sale[]>;

  customOptions:OwlOptions = defaultOwlConfig;


  /* Default options for a search config. */
  searchConfig:SaleParams = {
    lat: 0,
    long: 0,
    radius: 200,
    start_date: new Date("11/12/2022"),
    end_date: new Date("02/20/2023")
  };


  constructor(
    private router:Router,
    private db:DBService,
    private locationService:MapsService
  ) { 
    this.topSaleSearchResults$ = this.db.getMostPopularSales()
    .pipe(
      map((res:any)=>res.data),
      tap(data => console.log(data))
    );

    this.db.getNearbySales(null,this.searchConfig)
    .pipe(
      tap((res)=> console.log(res)),
      map((res:any)=>res.data)
    )
    .subscribe((data:Sale[])=> this.saleSearchResults$.next(data));


    navigator.geolocation.getCurrentPosition((data)=> {
      this.locationService.userLocation.next({
        lat: data.coords.latitude,
        long: data.coords.longitude
      });
    });
  }


  onNavigate(route:string[]):void{
    this.router.navigate(route);
  }


  onRadiusUpdate(radius:number):void{
    // fetch the latest radius distance and connect to the api
    this.searchConfig['radius'] = +radius;
    console.log(this.searchConfig)
    this.db.getNearbySales(null,this.searchConfig)
    .pipe(
      filter(results => results.length !==0),
      map(results => results.data)
    )
    .subscribe((data:Sale[])=> this.saleSearchResults$.next(data));

  }


  ngOnInit(): void {

  }


  //search the api to convert the address to geolocation, then make request to api.
  ngAfterViewInit(): void {
    this.searchListener = fromEvent(this.searchAddressRef.nativeElement,'keypress')
    .pipe(
      filter((event:any) => event.key === "Enter"),
      mergeMap(event=> this.db.getNearbySales(this.searchAddress,this.searchConfig)),
      map(results => results.data),
      tap(data => console.log(data)),
      filter(results => results.length !==0)
    )
    .subscribe((data:Sale[])=> this.saleSearchResults$.next(data));
  }


  ngOnDestroy(): void {
    this.searchListener.unsubscribe();
  }
}
