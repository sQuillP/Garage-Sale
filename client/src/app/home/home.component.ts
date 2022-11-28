import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { BehaviorSubject, catchError, filter, fromEvent, map, mergeMap, Observable, retry, Subject, Subscription, tap} from 'rxjs';
import { Sale } from 'src/app/models/db.models';
import { SaleParams } from 'src/app/models/API.model';
import { DBService } from '../Services/db.service';
import { MapsService } from '../Services/maps.service';
import { defaultOwlConfig } from '../util/owl.options';
import { MapMarker } from '@angular/google-maps';
import { mapPoints } from '../util/map.util';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  readonly METERS_PER_MILE= 1609.34;

  @ViewChild("searchAddressRef")searchAddressRef:ElementRef;
  searchAddress:string = "";
  searchListener:Subscription;

  saleSearchResults$ = new Subject<Sale[]>();
  topSaleSearchResults$:Observable<Sale[]>;
  markers$ = new BehaviorSubject<MapMarker[]>(null);
  currentLocation$:Observable<any>;
  customOptions:OwlOptions = defaultOwlConfig;

  /* Default options for a search config. */
  searchConfig:SaleParams = {
    lat: 0,
    long: 0,
    radius: 100,
  };


  constructor(
    private router:Router,
    private db:DBService,
    private locationService:MapsService,
    private _snackbar:MatSnackBar
  ) { 
    this.queryTopSales();
    this.querySales();

    //Prompt the user for their location.
    navigator.geolocation.getCurrentPosition((data)=> {
      this.locationService.userLocation.next({
        lat: data.coords.latitude,
        lng: data.coords.longitude
      });
    });
    this.currentLocation$ = this.locationService.userLocation;
  }


  onNavigate(route:string[]):void{
    this.router.navigate(route);
  }


  //Make new query whenever radius is updated
  onRadiusUpdate(radius:number):void{
    this.searchConfig['radius'] = +radius;
    this.querySales(null);
  }


  ngOnInit(): void {}


  //search the api to convert the address to geolocation, then make request to api.
  ngAfterViewInit(): void {
    this.searchListener = fromEvent(this.searchAddressRef.nativeElement,'keypress')
    .pipe(
      filter((event:any) => event.key === "Enter"),
      filter(results => results.length !==0)
    )
    .subscribe((res:any)=> {
      this.querySales(this.searchAddress);
    });
  }


  ngOnDestroy(): void {
    this.searchListener.unsubscribe();
  }

  private querySales(address?:string):void{
    this.db.getNearbySales(address,this.searchConfig)
    .pipe(
      retry(3)
    )
    .subscribe({
      next:(res:any)=>{
        this.saleSearchResults$.next(res.data);
        this.markers$.next(mapPoints(res));
      },
      error:(error)=>{
        this._snackbar.open("Unable to query sales","OK",{
          horizontalPosition:"center",
          verticalPosition:"bottom",
          duration: 5000
        });
      }
    })
  }

  private queryTopSales():void{
    this.topSaleSearchResults$ = this.db.getMostPopularSales().pipe(
      map((res:any)=> res.data),
      catchError((error)=> {
        this._snackbar.open("Unable to query top sales","OK",{
          horizontalPosition:"center",
          verticalPosition:"bottom",
          duration:5000
        });
        return [];
      })
    );
  }

}
