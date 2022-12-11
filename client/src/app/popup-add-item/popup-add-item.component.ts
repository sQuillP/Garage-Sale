import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { validateImage } from '../util/validators';

@Component({
  selector: 'app-popup-add-item',
  templateUrl: './popup-add-item.component.html',
  styleUrls: ['./popup-add-item.component.css']
})
export class PopupAddItemComponent implements OnInit {

  itemForm = new FormGroup({ 
    name: new FormControl("",[Validators.required]),
    price: new FormControl("",[Validators.required]),
    description: new FormControl("", [Validators.required]),
    gallery: new FormArray([new FormControl("",[validateImage])])
  });

  constructor() { }

  get gallery(){
    return this.itemForm.get('gallery') as FormArray
  }

  onAddImage():void{
    this.gallery.push(new FormControl("",[Validators.required]));
  }

  ngOnInit(): void {
  }

}
