import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms"


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
    // &&/[^a-z0-9]/g.test(control.value)
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