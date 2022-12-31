import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PopupAddItemComponent } from '../popup-add-item/popup-add-item.component';
import { PopupMenuComponent } from '../popup-menu/popup-menu.component';
import { DBService } from '../Services/db.service';
import { validateDate, _getFormArrayError } from '../util/validators';
import {_getError} from "../util/validators";
import { ObjectID } from 'bson';
import { MapsService } from '../Services/maps.service';
import { UserService } from '../Services/user.service';
import { AuthService } from '../Services/auth.service';
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


  items:any[] = [];

  docId:string = new ObjectID().toString();

  showError = _getError(this.saleForm);
  showFormArrayError = _getFormArrayError(this.saleForm);

  constructor(
    private router:Router,
    private db:DBService,
    private dialog:MatDialog,
    private _snackbar:MatSnackBar,
    private mapService:MapsService,
    private user:UserService,
    private auth:AuthService
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
  async onCreateSale():Promise<boolean>{
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
    const saleObj:any = {...this.saleForm.value};
    saleObj["_id"] = this.docId;
    saleObj["userId"] = this.auth.decodedToken$.getValue()._id//this.user.currentUser$.getValue()._id;
    saleObj["location"] = {
      type: "Point",
      coordinates: []
    };
    
    try {

      const {lat,lng} = await new Promise<{lat:number, lng:number}>((resolve,reject)=>{
        this.mapService.geocode(saleObj.address)
        .subscribe(data=> resolve(data))
      });

      saleObj.location.coordinates = [lng,lat];
      console.log(saleObj);
      await this.db.createSale(saleObj);

      const updatedItems = this.items.map(item => {
        item.location.coordinates = [lng,lat];
        item['saleId'] = this.docId;
        item['highestBidder'] = null;
        return item;
      });
      console.log(updatedItems);
      await this.db.addItemsToSale(updatedItems);
      this.router.navigate(['dashboard']);
    } catch(error) {
      this._snackbar.open("Unable to create sale","OK",{
        duration: 2000
      });
    }
  }


  onAddItem():void{
    const addItemRef = this.dialog.open(PopupAddItemComponent,{
      width: "1100px"
    });

    addItemRef.afterClosed().subscribe(createdItem => {

      if(!createdItem) return;
      createdItem["location"] = {
        type:"Point",
        coordinates: []
      };
      this.items.push(createdItem);
    })
  }

  onEditItem(index:number):void{

    const editItemRef = this.dialog.open(PopupAddItemComponent,{
      width:"1100px",
      data: {
        item:this.items[index]
      }
    });

    editItemRef.afterClosed().subscribe((data)=> {
      if(!data) return;
      const temp = [...this.items];
      temp.splice(index,1,data);
      this.items = temp;
    });
  }


  onDeleteItem(index:number):void{
    this.items.splice(index,1);
  }

  ngOnInit(): void {
  }

}
