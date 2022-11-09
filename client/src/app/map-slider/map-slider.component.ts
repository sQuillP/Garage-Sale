import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { debounceTime, delay, fromEvent, interval, Observable, of, Subscription, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-map-slider',
  templateUrl: './map-slider.component.html',
  styleUrls: ['./map-slider.component.css']
})
export class MapSliderComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output("radius") radius = new EventEmitter<number>();
  @ViewChild("slider") slider:ElementRef;

  sliderSubscription:Subscription;
  sliderValue:number = 25;
  constructor() { }


  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.slider.nativeElement.value = this.sliderValue;
    
      this.sliderSubscription = fromEvent(this.slider.nativeElement,'mouseup').pipe(
        tap(()=>this.sliderValue = this.slider.nativeElement.value),
        debounceTime(1500),
      ).subscribe(()=> {
        this.radius.emit(this.slider.nativeElement.value);
      });
  }

  ngOnDestroy(): void {
      this.sliderSubscription.unsubscribe();
  }


}
