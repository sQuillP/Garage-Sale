import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";


@Injectable({providedIn:"root"})
export class MapsService {
    
    /*Track user lat and long for each request. Set initial geolocation to Chicago, IL */
    userLocation = new BehaviorSubject<{long:number, lat:number}>({
        lat: 41.8781,
        long: -88
    });

    geocoder = new google.maps.Geocoder();

    constructor(private http:HttpClient){
        
    }


    /* Geocode an address/zipcode into lat, long coordinates.
    Returns the first item in the results array from Google Maps API */
    geocode(location:string): Observable<{lat:number, long:number}> {
        return new Observable((observer)=> {
            this.geocoder.geocode({
                address: location
            },(results:any, status:string)=> {
                if(status === "OVER_QUERY_LIMIT"){
                    observer.error("Query limit has been reached");
                }
                else if(status === "ERROR"){
                    observer.error("Unable to fetch the geocoding location");
                }
                console.log(results);
                const lat = results[0].geometry.location.lat();
                const long = results[0].geometry.location.lng();
                observer.next({lat, long});
                observer.complete();
            })
        })
        
    }


}