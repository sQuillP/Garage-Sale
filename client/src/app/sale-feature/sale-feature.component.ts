import { Component, Input } from '@angular/core';
import { Sale } from 'src/app/models/db.models';

@Component({
  selector: 'app-sale-feature',
  templateUrl: './sale-feature.component.html',
  styleUrls: ['./sale-feature.component.css']
})
export class SaleFeatureComponent  {
  @Input('sale')saleData:Sale;
  constructor() { }
}
