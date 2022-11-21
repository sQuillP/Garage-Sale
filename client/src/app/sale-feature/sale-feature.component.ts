import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Sale } from 'src/app/models/db.models';

@Component({
  selector: 'app-sale-feature',
  templateUrl: './sale-feature.component.html',
  styleUrls: ['./sale-feature.component.css']
})
export class SaleFeatureComponent implements OnInit, AfterViewInit {

  @Input('sale')saleData:Sale;

  constructor() { }

  ngOnInit(): void {
    console.log(this.saleData)
  }


  ngAfterViewInit(): void {
  }

}
