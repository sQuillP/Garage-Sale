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
import { mapPoints } from '../util/map.util';


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

    this.locationSubscription = this.map.userLocation.subscribe(({lng,lat})=> {
      this.currentPosition = {lat, lng};
    });

    this.querySales({
      start_date:this.saleSection.get('start_date').value.toString(),
      end_date: this.saleSection.get('end_date').value.toString(),
      sortMostPopular: this.saleSection.get('sortMostPopular').value,
      limit: 15, 
      radius: this.radius, 
    },
    null
    );

  }

  // Start a new query for searching a nearby sale.
  onNewQuery():void {
    if(!this.saleSection.valid || !this.itemSection.valid){
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
      },this.address);
    } else {
      this.searchSales =false;
      //Return only when there are values present
      if(this.itemResults$.value !==null && !this.itemResults$.value.length) return;
        this.queryItems({
          ...this.itemSection.get('priceFilters').value,
          limit: 15,
          radius: this.radius,
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
          this.markers$.next(mapPoints(res)); //map the markers
          this.isLoading =false;
          this.serverError = false;
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
      next: (res) => {
        this.markers$.next(mapPoints(res));//map the markers
        this.isLoading = false;
        this.serverError = false;
        if(res.data.length === 0)
          this.noResults = true;
        else
          this.noResults = false;
        this.itemResults$.next(res.data);
      },
      error:error=> {
        this.isLoading = false;
        this.serverError = true;
        this.errorStatus = error.status;
      }
    })
  }

}
