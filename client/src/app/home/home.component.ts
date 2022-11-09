import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { filter, fromEvent, mergeMap, Observable, Subscription, take } from 'rxjs';
import { DBService } from '../Services/db.service';
import { MapsService } from '../Services/maps.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {


  @ViewChild("searchAddressRef")searchAddressRef:ElementRef;

  searchAddress:string = "";

  searchListener:Subscription;

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: [ '<i class="fa-solid fa-chevron-left"></i>', '<i class="fa-solid fa-chevron-right"></i>' ],
    responsive: {
      0: {
        items: 1
      },
      720: {
        items: 2
      },
      1200: {
        items: 3
      },
      1600:{
        items: 4
      }
    },
    nav: true,
  }

  searchConfig = {
    lat: 0,
    long: 0,
    radius: 10,
  };

  constructor(
    private router:Router,
    private db:DBService,
    private locationService:MapsService
  ) { 

    //Get the users current position
    navigator.geolocation.getCurrentPosition((data)=> {
      console.log(data)
      this.locationService.userLocation.next({
        latitude: data.coords.latitude,
        longitude: data.coords.longitude
      });
    });
  }



  onNavigate(route:string[]):void{
    this.router.navigate(route);
  }


  onRadiusUpdate(radius:number):void{
    // fetch the latest radius distance and connect to the api
    this.searchConfig['radius'] = +radius;
    console.log(this.searchConfig);

  }

  ngOnInit(): void {

  }

  //search the api to convert the address to geolocation, then make request to api.
  ngAfterViewInit(): void {
    this.searchListener = fromEvent(this.searchAddressRef.nativeElement,'keypress')
    .pipe(
      filter((event:any) => event.key === "Enter"),
      mergeMap((event)=> this.locationService.geocode(this.searchAddress)),
      take(1)
    )
    .subscribe((geocodeResult:any) => {
      this.searchConfig.lat = geocodeResult[0].geometry.location.lat();
      this.searchConfig.long = geocodeResult[0].geometry.location.lng();
    });
  }

  ngOnDestroy(): void {
    this.searchListener.unsubscribe();
  }

}
