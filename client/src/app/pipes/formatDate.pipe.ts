import { Pipe, PipeTransform } from "@angular/core";


const MS_IN_DAY:number = 8.64e7;

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
        const tokenizedDate:string[] = new Date(input).toString().split(" ")
        return tokenizedDate[1] + " " + tokenizedDate[2];
    }
}