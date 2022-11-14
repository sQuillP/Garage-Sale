import { Pipe, PipeTransform } from "@angular/core";


const MS_IN_DAY:number = 8.64e7;

const DAYS_OF_WEEK: string[] = [
    "Sunday", 
    "Monday", 
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

/*
    -Pipe will return the stagnated day and the day of month
    when no args are provided.
    @arg "difference" it will return the number of days
    difference from today.
    @arg "day" will return the full day
*/

@Pipe({name: "formatDate"})
export class FormatDatePipe implements PipeTransform  {
    transform(input:string|Date, ...args) {
        if(args[0] === "difference"){
            const difference:number = Date.now() - Number(new Date(input));
            const days:number = Math.floor(difference / MS_IN_DAY);
            if(days === 0)
                return "today"
            return `${days} days ago`
        }
        else if(args[0] === "day"){
            return DAYS_OF_WEEK[
                new Date(input).getDay()
            ];
        }
        const tokenizedDate:string[] = new Date(input).toString().split(" ")
        return tokenizedDate[1] + " " + tokenizedDate[2];
    }
}