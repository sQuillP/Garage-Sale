import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";


@Injectable({providedIn:"root"})
export class MapsService {
    
    /*Track user lat and long for each request. Set initial geolocation to Chicago, IL */
    userLocation = new BehaviorSubject<{lng:number, lat:number}>({
        lat: 41.8781,
        lng: -88
    });

    geocoder = new google.maps.Geocoder();

    constructor(private http:HttpClient){}

    /* Geocode an address/zipcode into lat, long coordinates.
    Returns the first item in the results array from Google Maps API */
    geocode(location:string): Observable<{lat:number, lng:number}> {
        return new Observable((observer)=> {
            this._geocode(location).then(({lat,lng})=>{
                observer.next({lat,lng});
                observer.complete();
            }).catch((error:Error)=>{
                observer.error(error.message);
                observer.complete();
            })
        });
    }

    //Used for home component when user searches an arbitrary location in hero
    updateLocationAddress(location:string):Promise<any>{
        return this._geocode(location);
    }

    //Wrap geocoding coordinates into promise
    private _geocode(location):Promise<any> {
        return new Promise<any>((res,rej)=> {
            this.geocoder.geocode({
                address: location
            },(results:any, status:string)=> {
                if(status === "OVER_QUERY_LIMIT"){
                    rej("Query limit has been reached");
                }
                else if(status === "ERROR"){
                    rej("Unable to fetch the geocoding location");
                }
                //geocoding results
                const lat = results[0].geometry.location.lat();
                const lng = results[0].geometry.location.lng();
                this.userLocation.next({lng,lat});
                res({lat,lng});//resolve geolocation coordinates
            });
        })
    }
}