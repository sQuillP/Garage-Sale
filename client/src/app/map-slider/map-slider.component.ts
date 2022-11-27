import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { debounceTime, filter, fromEvent, Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-map-slider',
  templateUrl: './map-slider.component.html',
  styleUrls: ['./map-slider.component.css']
})
export class MapSliderComponent implements AfterViewInit, OnDestroy {
  @Output("radius") radius = new EventEmitter<number>();
  @ViewChild("slider") slider:ElementRef;
  @Input('max')max:number = 100;
  @Input('value')value:number = 50;
  sliderSubscription:Subscription;

  
  constructor() { }

  ngAfterViewInit(): void {
      this.sliderSubscription = fromEvent(this.slider.nativeElement,'mouseup').pipe(
        filter((e:any)=> this.value !== e.target.value),
        tap((e:any)=>this.value = this.slider.nativeElement.value),
        debounceTime(1250),
      ).subscribe(()=> {
        this.radius.emit(this.slider.nativeElement.value);
      });
  }

  ngOnDestroy(): void {
      this.sliderSubscription.unsubscribe();
  }


}
