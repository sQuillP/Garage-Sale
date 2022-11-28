import { MapMarker } from "@angular/google-maps";

  /* Return a list of points gathered from the response object in API call
  to display to the google map */
  export function mapPoints(res):MapMarker[]{
    return res.data.map(point => {
      return {
        title:"this is some information",
        info:"Some info here",
        position: {
          lat: point.location.coordinates[1], 
          lng: point.location.coordinates[0]
        },
        options: google.maps.Animation.BOUNCE
      }
    });
  }