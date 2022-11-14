import { Pipe, PipeTransform } from "@angular/core";



@Pipe({name:"formatPhone"})
export class FormatPhonePipe implements PipeTransform{
    transform(value: any, ...args: any[]) {
        if(/\d{10}/gi.test(value)){
            return `(${value.substring(0,3)})-${value.substring(3,6)}-${value.substring(6)}`
        }
        return value;
    }
}