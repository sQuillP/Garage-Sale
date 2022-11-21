import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, map, retry, take, tap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { SaleParams } from '../models/API.model';
import { Item, Sale } from '../models/db.models';
import { DBService } from '../Services/db.service';




@Component({
  selector: 'app-sale-search',
  templateUrl: './catalogue-search.component.html',
  styleUrls: ['./catalogue-search.component.css']
})
export class CatalogueSearch {

  activateDropdownFilter:boolean = false;
  saleResults$ = new BehaviorSubject<Sale[]>(null);
  itemResults$ = new BehaviorSubject<Item[]>(null);

  today = new Date();

  //Units measured in kilometers
  radius:number = 100;
  errorStatus:number = 200;

  searchSales:boolean = true;
  serverError:boolean = false;

  saleSection = new FormGroup({
    address: new FormControl(""),
    start_date: new FormControl(`${this.today.getMonth()+1}/${this.today.getDate()}/${this.today.getFullYear()}`),
    end_date: new FormControl(`${this.today.getMonth()+1}/${this.today.getDate()}/${this.today.getFullYear()+1}`),
    sortMostPopular: new FormControl(false)
  });

  itemSection = new FormGroup({
    maxPrice: new FormControl(""),
    minPrice: new FormControl(""),
    sortByPrice: new FormControl("")
  })

  searchOptions:SaleParams ={
    limit:100,
    radius: this.radius,
    lat:0,
    long: 0,
    start_date: this.formatDate(0),
    end_date: this.formatDate(20)
  }

  constructor(
    private db:DBService,
    private router:Router
  ) { 
    console.log(this.searchOptions)
    console.log(this.formatDate(0))
    this.querySales(this.searchOptions,null);
  }


  // Return a flattened date. Offset is the number of days after today.
  formatDate(offset:number):Date {
    const todayDate = new Date();
    return new Date(todayDate.getFullYear(),todayDate.getMonth(),todayDate.getDate()+offset)
  }

  floorDate(date):Date{
    const tDate = new Date(date);
    return new Date(tDate.getFullYear(),tDate.getMonth(), tDate.getDate());
  }

  // Start a new query for searching a nearby sale.
  onNewQuery():void {
    const config =  {
      start_date: this.floorDate(this.saleSection.get('start_date').value),
      end_date: this.floorDate(this.saleSection.get('end_date').value),
      radius: this.radius
    };

    if(this.searchSales) {
      config['sort'] = this.saleSection.get('sortMostPopular').value;
      this.querySales(config,this.saleSection.get('address').value);
    }
    else {
      config['maxPrice'] = this.saleSection.get('maxPrice').value;
      config['minPrice']= this.saleSection.get('minPrice').value;
      this.queryItems(config);
    }
  }

  onNavigate(path:string[]):void{
    this.router.navigate(path);
  }
  

  /*
    Find a sale by passing in a configuation for query string and then optionally pass in a location
  */
  private querySales(config:any,location?:string):void{
      this.db.getNearbySales(location,config)
      .pipe(
        retry(3)
      )
      .subscribe({
        next:(res)=> {
          this.serverError = false;
          this.saleResults$.next(res.data);
        },
        error:(err)=> {
          this.serverError = true;
          this.errorStatus = err.status;
        }
      })
  }

  /* Perform a query for searching items */
  private queryItems(config:any):void{
    this.db.catalogueItems(config)
    .pipe(
      retry(3)
    )
    .subscribe({
      next: res => {
        this.serverError =false;
        this.itemResults$.next(res.data);
      },
      error:error=> {
        this.serverError = true;
        this.errorStatus = error.status;
      }
    })
  }

}
