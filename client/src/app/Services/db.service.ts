import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MapsService } from "./maps.service";


@Injectable({providedIn:"root"})
export class DBService {


    constructor(
        private mapService:MapsService,
        private http:HttpClient
    ){

    }

    /*
    *  - page: which page the user would like to see
 *  - limit?: how many items per query
 *  - radius: distance in miles to view other garage sales.
 *  - long: longitude coordinate reference point 
 *  - lat: latitude coordinate reference point 
 *  - dayRange?:Object -> Get sales within the day range.
 *      - start: the first day the sale begins
 *      - end: the last day of the garage sale.
 */
    getNearbySales(options):void{

    }
}