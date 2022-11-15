import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map, tap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { SaleParams } from '../models/API.model';
import { Item, Sale } from '../models/db.models';
import { DBService } from '../Services/db.service';


const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();

@Component({
  selector: 'app-sale-search',
  templateUrl: './catalogue-search.component.html',
  styleUrls: ['./catalogue-search.component.css']
})
export class CatalogueSearch implements OnInit {

  activateDropdownFilter:boolean = false;
  saleResults$:Observable<Sale[]>;
  itemResults$:Observable<Item[]>;
  //Units measured in kilometers
  radius:number = 100;



  saleSection = new FormGroup({
    address: new FormControl(""),
    dateRange: new FormControl(""),
    startDate: new FormControl(""),
    endDate: new FormControl("")
  })

  searchOptions:SaleParams ={
    limit:100,
    radius: this.radius,
    lat:0,
    long: 0,
    start_date: this.formatDate(0),
    end_date: this.formatDate(30)
  }

  constructor(
    private db:DBService
  ) { 
    this.saleResults$ = this.db.getNearbySales(null,this.searchOptions).pipe(
      map((res) => res.data),
      tap(data => console.log(data))
    );
  }


  formatDate(offset:number):Date {
    const todayDate = new Date();
    return new Date(today.getFullYear(),todayDate.getMonth(),todayDate.getDay()+offset)
  }

  ngOnInit(): void {
  }

}
