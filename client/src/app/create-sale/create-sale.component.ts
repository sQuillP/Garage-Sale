import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PopupAddItemComponent } from '../popup-add-item/popup-add-item.component';
import { PopupMenuComponent } from '../popup-menu/popup-menu.component';
import { DBService } from '../Services/db.service';
import { validateDate, _getFormArrayError } from '../util/validators';
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
  showFormArrayError = _getFormArrayError(this.saleForm);

  constructor(
    private router:Router,
    private db:DBService,
    private dialog:MatDialog,
  ) { 

  }

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

  imgFieldError(imgControl:FormControl):boolean{
    return imgControl.touched && !imgControl.valid;
  }


  //create a sale
  onCreateSale():void{
    if(!this.saleForm.valid){
      console.log('sale form not valid');
      this.dialog.open(PopupMenuComponent,{
        data:{
          title:"Unable to Create Garage Sale",
          content: "Please make sure all fields are filled out correctly.",
          type:"error"
        }
      })
      return;
    }
    const saleObj = {...this.saleForm.value};
  }


  onAddItem():void{
    const addItemRef = this.dialog.open(PopupAddItemComponent,{
      width: "1100px"
    });


    addItemRef.afterClosed().subscribe(data => {
      console.log(data);
    })
  }

  ngOnInit(): void {
  }

}
