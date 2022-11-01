import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';


const MILLISECONDS_PER_DAY = 86400000;
const MILLISECONDS_PER_HOUR = 3600000;
const MILLISECONDS_PER_MINUTE = 60000;

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent implements OnInit, AfterViewInit ,OnDestroy {

  @Input("remainingTime") remainingTime:Date;
  @Input("width")width:string;

  @ViewChild("progressRef")progressRef:ElementRef;
  @ViewChild("mainRef")mainRef:ElementRef;

  interval:any;
  seconds:number = 0;
  minutes:number = 0;
  hours:number = 0;
  days:number = 0;
  totalTime:number = 0;
  timeStamp:number = 0;

  constructor() {}

  /* Convert the end date to number of days, hours,
    minutes, and seconds and display the timer to the user. */
  ngOnInit(): void {
    this.timeStamp = new Date(this.remainingTime).getTime();
    let milliseconds = this.timeStamp - Date.now();

    this.days = Math.floor(milliseconds / MILLISECONDS_PER_DAY);
    milliseconds %= MILLISECONDS_PER_DAY;
    this.hours = Math.floor(milliseconds / MILLISECONDS_PER_HOUR);
    milliseconds %= MILLISECONDS_PER_HOUR;
    this.minutes = Math.floor(milliseconds / MILLISECONDS_PER_MINUTE);
    milliseconds %= MILLISECONDS_PER_MINUTE;
    this.seconds = Math.floor(milliseconds / 1000);

    this.interval = setInterval(()=> {
      if(this.seconds === 0 && this.hours === 0 && this.minutes === 0){
        this.days--;
        this.hours = 23;
        this.minutes = 59;
        this.seconds = 60;
      }
      else if(this.seconds === 0 && this.minutes === 0){
        this.hours--;
        this.seconds = 60;
        this.minutes = 59;
      }
      else if(this.seconds === 0){
        this.minutes--;
        this.seconds = 60;
      }
      this.seconds --;
      this.progressRef.nativeElement.style.width = `${100-Date.now()/this.timeStamp}%`
      console.log(100-Date.now()/new Date(this.remainingTime).getTime());
      // console.log(this.mainRef)
    },1000);
  }

  ngAfterViewInit(): void {
      
  }

  ngOnDestroy(): void {
      clearInterval(this.interval);
  }

}
