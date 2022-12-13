import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { validateImage, _getItemFormError } from '../util/validators';
@Component({
  selector: 'app-popup-add-item',
  templateUrl: './popup-add-item.component.html',
  styleUrls: ['./popup-add-item.component.css']
})
export class PopupAddItemComponent implements OnInit {

  gallery:string[] = [];
  currentPicture:number = 0;

  itemForm = new FormGroup({ 
    name: new FormControl("",[Validators.required]),
    price: new FormControl("",[Validators.required,Validators.min(1),Validators.max(9999)]),
    description: new FormControl("", [Validators.required]),
    gallery: new FormControl("")
  });

  getError:(str:string)=>string|void = _getItemFormError(this.itemForm);

  /**
   * https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2048px-Google_%22G%22_Logo.svg.png
   * https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500
   * https://ichef.bbci.co.uk/news/976/cpsprodpb/13F00/production/_95146618_bills.jpg
   * https://images.ctfassets.net/hrltx12pl8hq/3AnnkVqrlhrqb9hjlMBzKX/693a8e5d40b4b6c55a7673ca4c807eef/Girl-Stock?fit=fill&w=480&h=270
   *  https://www.apimages.com/Images/Ap_Creative_Stock_Header.jpg
  */

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
  ) { 
    console.log(data);
    if(!data) return;

    this.gallery = data.item.gallery;
    this.itemForm.patchValue({
      name:data.item.name,
      price: data.item.price,
      description: data.item.description,
    })
  } 

 
  /* Add item to list of pictures */
  onAddImage():void{

    for(const image of this.gallery)
      if(this.itemForm.get('gallery').value === image)
        return;
      
    if(this.itemForm.get('gallery').value === ''){
      return;
    }
    if( this.gallery.length === 5){
      this.itemForm.get('gallery').setErrors({imageLimit: true});
      return;
    }
    this.gallery.push(this.itemForm.get('gallery').value);
    this.itemForm.get('gallery').reset();
    this.onNextImage('forwards');
  }

  ngOnInit(): void {
  }


  /*go to the next image if specified, 
  otherwise go to previous image*/
  onNextImage(direction){
    console.log(this.currentPicture);
    if(direction === 'forwards'){
      this.currentPicture = (this.currentPicture+1)%this.gallery.length;
      return;
    }
    
    this.currentPicture--;
    if(this.currentPicture<0)
      this.currentPicture = this.gallery.length-1;  
  }


  onRemoveImage(){
    this.gallery.splice(this.currentPicture,1);
    if(this.currentPicture === this.gallery.length)
      this.currentPicture--;
  }

  hasError(control:string):boolean  {
    const ctrlRef = this.itemForm.get(control);
    return !ctrlRef.valid&&ctrlRef.touched
  }

  onSubmit():any{
    if(this.gallery.length === 0 || !this.itemForm.valid){
      return;
    }
    const dataSend = this.itemForm.value;
    dataSend.gallery = this.gallery as any;
    dataSend['_id'] = null;
    return dataSend;
  }

  
  
}
