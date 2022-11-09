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

  @Input("dateInterval")dateInterval:any[];
  @Input("width")width:string;

  @ViewChild("progressRef")progressRef:ElementRef;

  interval:any;
  seconds:number = 0;
  minutes:number = 0;
  hours:number = 0;
  days:number = 0;
  constructor() {}

  /* Convert the end date to number of days, hours,
    minutes, and seconds and display the timer to the user. */
  ngOnInit(): void {

    this.dateInterval[0] = new Date(this.dateInterval[0]).getTime();
    this.dateInterval[1] = new Date(this.dateInterval[1]).getTime();

    let milliseconds = new Date(this.dateInterval[1]).getTime() - Date.now();//this.timeStamp - Date.now();

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
      let currentTime = Date.now();
      
      // Remaining % of time = 1-((tc-ts)/(te-ts))*100) -> tc = current time, ts = starting time, te = ending time
      const remainingPercentage = (1-((currentTime-this.dateInterval[0])/(this.dateInterval[1]-this.dateInterval[0])))*100;
      this.progressRef.nativeElement.style.width = `${remainingPercentage}%`;
    },1000);
  }

  ngAfterViewInit(): void {
      
  }

  ngOnDestroy(): void {
      clearInterval(this.interval);
  }

}
