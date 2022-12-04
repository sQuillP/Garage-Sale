import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, mergeMap, Observable, tap } from "rxjs";
import { Item, Sale } from "src/app/models/db.models";
import { SaleParams } from "src/app/models/API.model";
import { MapsService } from "./maps.service";
import { AuthService } from "./auth.service";


@Injectable({providedIn:"root"})
export class DBService {

    private readonly URL:string = "http://localhost:5000/api/v1";

    constructor(
        private mapService:MapsService,
        private http:HttpClient,
        private auth:AuthService
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
        return sales near the users location. Append the user location if it hasn't */
    getNearbySales(location:string, params):Observable<any>{
        if(!location){
            params['lat']= this.mapService.userLocation.value.lat;
            params['long'] = this.mapService.userLocation.value.lng;
            return this.http.get<any>(`${this.URL}/sales`,{params})
        }
        return this.mapService.geocode(location).pipe(
            mergeMap(({lat, lng}) => {
                params['long'] = lng;
                params['lat'] = lat;
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


    /* Get a singlular sale from db */
    getSale(saleId:string):Observable<any> {
        return this.http.get<Sale>(`${this.URL}/sales/${saleId}`)
    }

    /* Get items associated with a sale */
    findItems(saleId:string):Observable<any> {
        return this.http.get<any>(`${this.URL}/sales/${saleId}/items`,{
            params:{
                limit:1000
            }
        })
    }


    /* Find an item using item id*/
    findItemById(itemId:string,params = {}):Observable<any> {
        return this.http.get<Item>(`${this.URL}/items/${itemId}`,{
            params
        });
    }



    /* 
    * @param:
    *   - lat:number latitude 
    *   - long: longitude
    *   - sortByPrice?: asc|desc -> sorts in either ascending or descending order
    *   - maxPrice?:number -> retrieve values <= to maxPrice
    *   - minPrice?:number -> retrieve values >= minPrice 
    *   - page?:number -> which page you would like to retrieve
    *   - limit?:number -> limit the number of items retrieved
    * 
    * @desc: If there is no location provided, it will grab last entered location
    *  and query the sales as such.
    */
    catalogueItems(params,location?:string):Observable<any> {
        if(!location){
            this.mapService.geocode(location).pipe(
                mergeMap(({lat, lng})=> {
                    return this.http.get(`${this.URL}/items`, {
                        params: {...params, lat, long:lng}
                    });
                })
            );
        }
        params['lat'] = this.mapService.userLocation.value.lat;
        params['long'] = this.mapService.userLocation.value.lng;
        return this.http.get(`${this.URL}/items`,{
            params
        })
    }



    updateUser(update:any):Observable<any> {
        return this.http
        .put<any>(`${this.URL}/users/${this.auth.currentUser$.value._id}`,update)

    }
}