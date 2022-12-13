import { AbstractControl, FormControl, FormGroup, ValidationErrors } from "@angular/forms"
import { Subscription } from "rxjs";


export const validatePriceRanges = (control:AbstractControl):ValidationErrors|null=>  {
    if(control.get('maxPrice').value <= control.get('minPrice').value){
        console.log('max price <= minprice error')
        return {invalidPriceRange: true};
    }
    return null;
}


export const validateDate = (control:AbstractControl):ValidationErrors|null=> {
    if(new Date(control.value).toString().toLowerCase() === 'invalid date'){
        return {invalidDateFormat:true};
    }
    return null;
}


export const validatePassword = (control:AbstractControl):ValidationErrors|null=> {
    if(
        !(/[a-z]/gi.test(control.value)&&
        /[0-9]/gi.test(control.value))
    )
        return {invalidPassword:true};
    
    return null;
    
}


export const validatePhone = (control:AbstractControl<string>):ValidationErrors| null => {
    if(!/^\(\d{3}\)\-\d{3}\-\d{4}$/g.test(control.value))
        return {invalidPhone:true};
    return null;
}


/* returns true if there is a value provided and it does not match the 
    provided extensions */
export  const validateImage = (control:AbstractControl<string>):ValidationErrors|null => {
    if(!control.value) return null;
    if(/\.(jpeg|jpg|gif|png)$/.test(control.value) === false)
        return {invalidImage:true};
    return null;
}




 /* Validate the user input as they type to perfectly format the 
  phone number. */
  export function formatPhoneInput(formRef:FormGroup):Subscription{
    const phoneRef = formRef.get('phone')
    return phoneRef.valueChanges.subscribe((value)=>{
        if(/\d{10}/gi.test(value)){
            const phoneMask:string = `(${value.substring(0,3)})-${value.substring(3,6)}-${value.substring(6)}`;
            phoneRef.setValue(phoneMask);
        } 

    })
  }



//Return an error message for a particular form input.
export function _getError(formGroup:FormGroup):(str)=> string| void {
    return (inputName:string):string|void=>{
        const error:any = Object.keys(formGroup.get(inputName).errors)[0];
        if(error === "required")
        return "This field is required";
        if(error === "invalidDateFormat")
        return "Please provide a valid date";
        if(error === "email")
        return "Please provide a valid email";
        if(error === "invalidPhone")
        return "Please provide a valid phone number";
        if(error==="invalidImage")
        return "Please provide a valid image URL"
        if(error === "invalidPassword")
        return "Must contain an uppercase letter and a number";
    }
}
 

export function _getItemFormError(formGroup:FormGroup):(str:string)=> string | void {
    return (inputName:string):string | void => {
        const error = Object.keys(formGroup.get(inputName).errors)[0];
        if(error ==='required')
            return "This field is required"
        if(error === 'name')
            return "Pleaes provide a name";
        if(error === 'price')
            return "Please provide a price"
        if(error === "min")
            return "Must be at least $1.00"
        if(error === "description")
            return "Please provide a description";
        if(error === 'imageLimit')
            return 'Please provide at most 5 images'
        if(error === 'invalidImage')
            return "Please provide an image URL"
    }
}


//Return an error message for a form array.
export function _getFormArrayError(formGroup:FormGroup):(control:FormControl)=> string|void {
    return (control:FormControl): string | void => {
        const error = Object.keys(control.errors)[0];
        if(error === "required")
            return "This field is required";
        //Add more case statements as more validations are required
    }
}