import { PipeTransform, Pipe } from "@angular/core";


@Pipe({name: "formatSup"})
export class formatSuperScriptPipe implements PipeTransform {
    transform(date:Date|string) {
        const day: string = new Date(date).toString().split(" ")[2];
        if(day[0]==='1' && day.length ===2) return "th";
        else if(day === "1"|| day[1] === "1") return "st";
        else if(day === "2" || day[1] === "2") return "nd";
        else if(day === "3" || day[1] ==="3") return "rd";
        return "th";
    }
}
