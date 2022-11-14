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
  items$ = new BehaviorSubject<Sale[]>(null);

  showDescription:boolean = false;

  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private db:DBService
    ) { 

      //Get the sale and  the items associated with the sale
      this.route.params.pipe(
        mergeMap((params:Params) => this.db.getSale(params['saleId'])),
        mergeMap((response:any) => {
          this.sale$.next(response.data);
          return this.db.findItems(response.data._id);
        }),
      )
      .subscribe({
        next:(res:any)=> this.items$.next(res.data),
        error: ()=> this.router.navigate(["home"])
      })
    }


    navigate(route):void{
      this.router.navigate(route);
    }

  ngOnInit(): void {
  }

}
