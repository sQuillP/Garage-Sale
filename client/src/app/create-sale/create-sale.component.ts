import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { validateDate } from '../util/validators';
import {_getError} from "../util/validators"
@Component({
  selector: 'app-create-sale',
  templateUrl: './create-sale.component.html',
  styleUrls: ['./create-sale.component.css']
})
export class CreateSaleComponent implements OnInit {

  saleForm = new FormGroup({
    start_date: new FormControl("",[Validators.required,validateDate]),
    end_date: new FormControl("",[Validators.required, validateDate]),
    address:new FormControl("",[Validators.required]),
    description: new FormControl("",[Validators.required]),
    title: new FormControl("",[Validators.required]),
    terms_conditions: new FormControl("",[Validators.required]),
    gallery: new FormArray([new FormControl("",[Validators.required])])
  });

  showError = _getError(this.saleForm);


  constructor(
    private router:Router
  ) { }

  get gallery():FormArray{
    return (this.saleForm.get('gallery') as FormArray);
  }

  onAddNewImage():void{
    this.gallery.push(new FormControl("",[Validators.required]));
    
  
  }

  onNavigate(path:string[]){this.router.navigate(path)}

  onRemoveImage(index:number):void{
    this.gallery.removeAt(index);
  }

  hasError(field:string):boolean {
    const control = this.saleForm.get(field);
    return control.touched && !control.valid;
  }

  ngOnInit(): void {
  }

}
