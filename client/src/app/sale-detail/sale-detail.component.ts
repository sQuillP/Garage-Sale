import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject, catchError, map, mergeMap, Observable, Subject, tap } from 'rxjs';
import { Item, Sale } from '../models/db.models';
import { DBService } from '../Services/db.service';

@Component({
  selector: 'app-sale-detail',
  templateUrl: './sale-detail.component.html',
  styleUrls: ['./sale-detail.component.css']
})
export class SaleDetailComponent implements OnInit {

  sale$ = new BehaviorSubject<Sale>(null);
  items$:Observable<Item[]>;


  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private db:DBService
    ) { 

      //Get the sale and  the items associated with the sale
       this.items$ = this.route.params.pipe(
        mergeMap((params:Params)=> this.db.getSale(params['saleId'])),
        catchError((error)=> this.router.navigate(["home"])),
        mergeMap((res:any)=> {
          this.sale$.next(res.data);
          return this.db.findItems(this.sale$.value._id)
        })
      )
    }


  ngOnInit(): void {
  }

}
