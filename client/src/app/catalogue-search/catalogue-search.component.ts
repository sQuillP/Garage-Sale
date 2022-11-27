import { Component, OnDestroy} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MapCircle, MapMarker } from '@angular/google-maps';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject,retry,Subscription,tap } from 'rxjs';
import { Item, Sale } from '../models/db.models';
import { DBService } from '../Services/db.service';
import { MapsService } from '../Services/maps.service';
import { validatePriceRanges} from '../util/validators';



@Component({
  selector: 'app-sale-search',
  templateUrl: './catalogue-search.component.html',
  styleUrls: ['./catalogue-search.component.css']
})
export class CatalogueSearch implements OnDestroy {


  readonly METERS_PER_MILE= 1609.34;

  saleResults$ = new BehaviorSubject<Sale[]>(null);
  itemResults$ = new BehaviorSubject<Item[]>(null);
  markers$ = new BehaviorSubject<MapMarker[]>(null);

  today = new Date();
  n:MapCircle
  //Units measured in kilometers
  radius:number = 100;
  address:string = "";
  errorStatus:number = 200;

  searchSales:boolean = true;
  serverError:boolean = false;
  noResults:boolean = false;
  displayError:boolean = false;
  isLoading:boolean = false;
  activateDropdownFilter:boolean = false;

  currentPosition = {lat: 0, lng: 0};
  locationSubscription:Subscription;


  circleOptions$ = new BehaviorSubject<any>( {
    center: {
      lat: this.map.userLocation.value.lat,
      lng: this.map.userLocation.value.long
    },
    radius: this.radius*this.METERS_PER_MILE,
    strokeColor: "#4285F4",
    fillColor: "#4285F4",
  });

  saleSection = new FormGroup({
    start_date: new FormControl(new Date(this.today.getFullYear(),this.today.getMonth(), this.today.getDate())),
    end_date: new FormControl(new Date(this.today.getFullYear()+1,this.today.getMonth(), this.today.getDate())),
    sortMostPopular: new FormControl(false)
  });

  itemSection = new FormGroup({
    priceFilters: new FormGroup({
      maxPrice: new FormControl(1000),
      minPrice: new FormControl(1,[Validators.min(1)]),
    },
      {validators: validatePriceRanges}
    ),
    sortByPrice: new FormControl("asc")
  })




  constructor(
    private db:DBService,
    private router:Router,
    private _snackbar:MatSnackBar,
    private map:MapsService
  ) { 

    this.locationSubscription = this.map.userLocation.subscribe(({long,lat})=> {
      this.currentPosition = {lat, lng:long};
      this.circleOptions$.next( {
        ...this.circleOptions$.value,
        center:{lat,lng:long}
      });
    });

    this.querySales({
      start_date:this.saleSection.get('start_date').value.toString(),
      end_date: this.saleSection.get('end_date').value.toString(),
      sortMostPopular: this.saleSection.get('sortMostPopular').value,
      limit: 15, 
      radius: this.radius, 
      lat: 0, 
      long: 0
    },
    null
    );

  }

  // Start a new query for searching a nearby sale.
  onNewQuery():void {
    if(!this.saleSection.valid || !this.itemSection.valid){
      // for(let str of Object.keys(this.saleSection.value))
        // console.log(str + " " +this.saleSection.get(str).value +" " + this.saleSection.get(str).valid);
      this.onShowSnackbar("Please apply correct filter fields");
      return;
    }
    if(this.searchSales) {
      this.querySales({
        start_date:this.saleSection.get('start_date').value.toString(),
        end_date: this.saleSection.get('end_date').value.toString(),
        sortMostPopular: this.saleSection.get('sortMostPopular').value,
        limit: 15,
        radius: this.radius,
        lat:0,
        long:0
      },this.address);
    }
    else {
      this.queryItems({
        ...this.itemSection.get('priceFilters').value,
        radius: this.radius,
        sortByPrice: this.itemSection.get('sortByPrice').value
      }, this.address);
    }
  }

  onNavigate(path:string[]):void{
    this.router.navigate(path);
  }
  

  onUpdateRadius(event:number):void{
    this.radius = event;
    this.circleOptions$.next( {
      ...this.circleOptions$.value,
      radius: event
    });
  }


  /* Fire whenever searching for sales or items is selected. 
    Perform a query if there are no results/data in the sale or 
    item observables. */
  onToggleSearchType(searchType:string):void{
    if(!this.saleSection.valid || !this.itemSection.valid){
      this.onShowSnackbar("Please apply correct filter fields");
      return;
    }
    if(searchType === 'sales'){
      this.searchSales = true;
      //return only when there is a non-null value in the sale results.
      if(this.saleResults$.value!==null && !this.saleResults$.value.length) return;
      this.querySales({
        start_date:this.saleSection.get('start_date').value.toString(),
        end_date: this.saleSection.get('end_date').value.toString(),
        sortMostPopular: this.saleSection.get('sortMostPopular').value,
        limit: 15,
        radius: +this.radius,
        lat:0,
        long:0
      },this.address);
    } else {
      this.searchSales =false;
      //Return only when there are values present
      if(this.itemResults$.value !==null && !this.itemResults$.value.length) return;
        this.queryItems({
          ...this.itemSection.get('priceFilters').value,
          limit: 15,
          radius: this.radius,
          lat:0,
          long:0
        }, this.address)
    }
  }


  /* Open a snackbar with desired message. Currently used to 
  notify of a user made error. */
  onShowSnackbar(message:string):void{
    this._snackbar.open(message,"OK",{
      horizontalPosition:"center",
      verticalPosition:"bottom",
      duration: 2500
    })
  }


  ngOnDestroy(){
    this.locationSubscription.unsubscribe();
  }



 


 /* Perform a query for searching items.
  If the call is successful, remove any errors from the page.
  Otherwise, set the error flag to true. If there are no results,
  set the no results flag to true. */
  private querySales(config:any,location?:string):void{
    this.isLoading = true;
      this.db.getNearbySales(location,config)
      .pipe(
        retry(3)
      )
      .subscribe({
        next:(res)=> {
          this.markers$.next(this.mapPoints(res)); //map the markers
          console.log(this.markers$.value)
          this.isLoading =false;
          this.serverError = false;
          console.log(res.data.length)
          if(res.data.length === 0)
            this.noResults = true;
          else
            this.noResults = false;
          this.saleResults$.next(res.data);
        },
        error:(err)=> {
          this.isLoading = false;
          this.serverError = true;
          this.errorStatus = err.status;
        }
      })
  }


  /* Perform a query for searching items.
  If the call is successful, remove any errors from the page.
  Otherwise, set the error flag to true. If there are no results,
  set the no results flag to true. */
  private queryItems(config:any, location?:string):void{
    this.isLoading = true;
    this.db.catalogueItems(config)
    .pipe(
      retry(3),
      tap(data => console.log(data)),
    )
    .subscribe({
      next: res => {
        this.markers$.next(this.mapPoints(res)); //map the markers
        console.log(this.markers$.value)
        this.isLoading = false;
        this.serverError =false;
        if(res.data.length === 0)
          this.noResults = true;
        else
          this.noResults = false;
        this.itemResults$.next(res.data);
        console.log(this.itemResults$.value)
      },
      error:error=> {
        this.isLoading = false;
        this.serverError = true;
        this.errorStatus = error.status;
      }
    })
  }


  /* Return a list of points gathered from the response object in API call
  to display to the google map */
  private mapPoints(res):MapMarker[]{

    return res.data.map(point => {
      return {
        title:res.data.description,
        info:"Some info here",
        position: {
          lat: point.location.coordinates[1], 
          lng: point.location.coordinates[0]
        },
        options: google.maps.Animation.BOUNCE
      }
    });
  }
  
}
