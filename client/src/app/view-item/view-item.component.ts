import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-view-item',
  templateUrl: './view-item.component.html',
  styleUrls: ['./view-item.component.css']
})
export class ViewItemComponent implements OnInit {

  @ViewChild('slickModal')slickModal:ElementRef;

  slideConfig = {
    "slidesToShow": 3,
    "slidesToScroll": 1,
    "dots": false,
    "infinite": true,
    "autoplay" : true,
    "autoplaySpeed" : 3000,
    responsive: [
      {
        breakpoint: 2800,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 990,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings:{
          slidesToShow:1,
          slidesToScroll:1
        }
      }
    ]
  };

  slideCounter:number = 0;
  totalSlides:number = 4;

  constructor() { }


  onHandleSlickCounter(modal){
    modal.slickGoTo((this.slideCounter+1));
    this.slideCounter = (this.slideCounter+1)%this.totalSlides;
  }


  ngOnInit(): void {
  }

}
