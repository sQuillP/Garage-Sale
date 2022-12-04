import { AbstractControl, FormGroup, ValidationErrors } from "@angular/forms"
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
        console.log('invalid date error')
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
    if(control.value&&!control.value.match(/\.(jpeg|jpg|gif|png)$/) !== null)
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


  /* Return error message of a particular field  */
export function _getError(formGroup:FormGroup):(str)=> string |void {
    return (inputName:string):string|void=>{
        console.log(formGroup.get(inputName).errors)
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