import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';


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

  constructor() { 
  }

  ngOnInit(): void {
  }

}
