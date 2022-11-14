import { Component, Input, OnInit } from '@angular/core';
import { Sale } from 'src/app/models/db.models';

@Component({
  selector: 'app-sale-listing',
  templateUrl: './sale-listing.component.html',
  styleUrls: ['./sale-listing.component.css']
})
export class SaleListingComponent implements OnInit {

  @Input('sale')saleData:Sale;

  constructor() { }

  ngOnInit(): void {
  }

}
