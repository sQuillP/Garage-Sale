import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";


@Injectable({providedIn:"root"})
export class MapsService {
    
    /*Track user lat and long */
    userLocation = new BehaviorSubject<{longitude:number, latitude:number}>({
        longitude: 41.8781,
        latitude: 87.6298
    });

    geocoder = new google.maps.Geocoder();

    constructor(private http:HttpClient){
        
    }


    /* Returns the first item in the results array from Google Maps API */
    geocode(location:string): Observable<any> {
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
                observer.next(results);
                observer.complete();
            });  
        });
    }


}