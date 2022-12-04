import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-menu',
  templateUrl: './popup-menu.component.html',
  styleUrls: ['./popup-menu.component.css']
})
export class PopupMenuComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {title:string, content:string, type:string}
  ) { }

  ngOnInit(): void {
  }

}
