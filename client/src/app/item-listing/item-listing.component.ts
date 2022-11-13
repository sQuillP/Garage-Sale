import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../models/db.models';

@Component({
  selector: 'app-item-listing',
  templateUrl: './item-listing.component.html',
  styleUrls: ['./item-listing.component.css']
})
export class ItemListingComponent implements OnInit {

  @Input("itemData")itemData:Item;

  // Receive all data related to the item in this component
  /* @Input the main data */

  constructor() { }

  ngOnInit(): void {
  }

}
