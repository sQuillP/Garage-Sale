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
    if(
        !(/[a-z]/gi.test(control.value)&&
        /[0-9]/gi.test(control.value)&&
        /[^a-z0-9]/g.test(control.value))
    )
        return {invalidPassword:true};
    
    return null;
    
}