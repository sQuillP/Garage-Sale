import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {


  @ViewChild('slickModal')slickModal:ElementRef

  slideCounter:number = 0;
  totalSlides:number = 4;

  // slideConfig={slidesToShow: 4, slidesToScroll: 1};
  slideConfig = {
    "slidesToShow": 3,
    "slidesToScroll": 1,
    "dots": false,
    "infinite": true,
    "autoplay" : true,
    "autoplaySpeed" : 3000,
    responsive: [
      {
        breakpoint: 1480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 990,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      }
    ]
  };


  constructor(
  ) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {

  }


  onHandleSlickCounter(modal){
    modal.slickGoTo((this.slideCounter+1));
    this.slideCounter = (this.slideCounter+1)%this.totalSlides;
  }


  // addSlide() {
  //   // this.slides.push({ img: 'http://placehold.it/350x150/777777' });
  // }
  // removeSlide() {
  //   // this.slides.length = this.slides.length - 1;
  // }
  // slickInit(e: any) {
  //   console.log('slick initialized');
  // }
  // breakpoint(e: any) {
  //   console.log('breakpoint');
  // }
  // afterChange(e: any) {
  //   console.log('afterChange');
  // }
  // beforeChange(e: any) {
  //   console.log('beforeChange');
  // }

}
