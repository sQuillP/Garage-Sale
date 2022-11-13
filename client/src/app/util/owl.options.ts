import { OwlOptions } from "ngx-owl-carousel-o/public_api";

export const defaultOwlConfig: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: [ '<i class="fa-solid fa-chevron-left"></i>', '<i class="fa-solid fa-chevron-right"></i>' ],
    responsive: {
      0: {
        items: 1
      },
      720: {
        items: 2
      },
      1200: {
        items: 3
      },
      1600:{
        items: 4
      }
    },
    nav: true,
  }