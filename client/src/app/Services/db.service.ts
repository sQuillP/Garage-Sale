import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { mergeMap, Observable, tap } from "rxjs";
import { Item, Sale } from "src/app/models/db.models";
import { SaleParams } from "src/app/models/API.model";
import { MapsService } from "./maps.service";


@Injectable({providedIn:"root"})
export class DBService {

    URL:string = "http://localhost:5000/api/v1";

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
    /*If there is no location specified, 
        return sales near the users location */
    getNearbySales(location:string, params):Observable<any>{
        if(!location){
            console.log('making api request')
            console.log(params)
            params.lat = this.mapService.userLocation.value.lat;
            params.long = this.mapService.userLocation.value.long
            return this.http.get<any>(`${this.URL}/sales`,{params})
        }
        return this.mapService.geocode(location).pipe(
            mergeMap(({lat, long}) => {
                params.long = long;
                params.lat = lat;
                return this.http.get<Sale[]>(`${this.URL}/sales`,{params})
            })
        );
    }

    /* Get the most viewed sales */
    getMostPopularSales():Observable<any>{
        console.log('calling getmostpopularsales')
        return this.http.get<any>(`${this.URL}/sales`,{
            params:{
                mostPopular: true,
                page: 1,
                limit: 10
            }
        }).pipe(tap(data => console.log(data)));
    }


    /* Get items associated with a sale */
    findItems(saleId:string):Observable<Item[]> {
        return this.http.get<Item[]>(`${this.URL}/sales/${saleId}/items`,{
            params:{
                limit:1000
            }
        })
    }
}