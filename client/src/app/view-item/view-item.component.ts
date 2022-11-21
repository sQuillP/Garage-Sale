import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { BehaviorSubject, catchError, map, mergeMap, Observable, tap } from 'rxjs';
import { Item, Sale } from '../models/db.models';
import { DBService } from '../Services/db.service';
import { defaultOwlConfig } from '../util/owl.options';


@Component({
  selector: 'app-view-item',
  templateUrl: './view-item.component.html',
  styleUrls: ['./view-item.component.css']
})
export class ViewItemComponent implements OnInit {


  customOptions: OwlOptions = { ...defaultOwlConfig,
    responsive:{
      0: {
        items: 1
      },
      620: {
        items: 2
      },
      800: {
        items: 3
      },
      1200: {
        items: 4
      },
    }
  };

  imageData = [
    "https://cloudfront-us-east-1.images.arcpublishing.com/advancelocal/Y5SVOBNZVBHDZDHVJQD4IJ77NU.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2048px-Google_%22G%22_Logo.svg.png",
    "https://na.rdcpix.com/4b5c1a3f5b62b1146984460bc8e138eew-c3944895653rd-w832_h468_r4_q80.jpg",
    "https://garagesalefinder.com/images/screenshotofusamap.jpg",
    "https://www.lakesaintlouis.com/ImageRepository/Document?documentId=1004"
  ];

  selectedImage:number = 0;
  item$ = new BehaviorSubject<Item>(null);
  featuredItems$ = new BehaviorSubject<Item[]>(null);
  featuredSales$: Observable<Sale[]>;


  viewContent:string = "terms";

  constructor(
    private db:DBService,
    private router:Router,
    private route:ActivatedRoute
  ) { 
    

    this.route.params.pipe(
      mergeMap((params:Params)=> this.db.findItemById(params['itemId'],{})),
      mergeMap((res:any)=> {
        this.item$.next(res.data);
        return this.db.findItems(res.data.saleId._id);
      })
    )
    .subscribe({
      next:(response:any)=> this.featuredItems$.next(response.data),
      error:(error)=> this.router.navigate(['home'])
    });
    this.featuredSales$ = this.db.getNearbySales(null,{}).pipe(
      map((res)=> res.data)
    );
  }


  onNavigate(route):void{this.router.navigate(route)}


  onSelectImage(direction:string):void{
    if(!this.item$.value) return;

    if(direction === 'right')
      this.selectedImage =  (this.selectedImage + 1) % this.item$.value.gallery.length;
    else if(direction === 'left')
      if(this.selectedImage === 0)
        this.selectedImage = this.item$.value.gallery.length-1;
      else
        this.selectedImage--;
  }

  ngOnInit(): void {

  }


}
