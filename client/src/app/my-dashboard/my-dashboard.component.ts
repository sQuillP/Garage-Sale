import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, fromEvent, map, Observable, Subscription } from 'rxjs';
import { User } from '../models/db.models';
import { PopupMenuComponent } from '../popup-menu/popup-menu.component';
import { AuthService } from '../Services/auth.service';
import { DBService } from '../Services/db.service';
import { UserService } from '../Services/user.service';
import { formatPhoneInput, validatePassword, validatePhone, _getError } from '../util/validators';

@Component({
  selector: 'app-my-dashboard',
  templateUrl: './my-dashboard.component.html',
  styleUrls: ['./my-dashboard.component.css']
})
export class MyDashboardComponent implements OnInit, OnDestroy {

  /* Input field references */
  @ViewChild('fullName')fullName:ElementRef;
  @ViewChild('email')email:ElementRef;
  @ViewChild('password')password:ElementRef;
  @ViewChild('profileImage')profileImage:ElementRef;
  @ViewChild('phone')phone:ElementRef;


  mySales$ = new BehaviorSubject<any>(null);

  /* Form validation/contents */
  userInfo = new FormGroup({
    fullName: new FormControl("",[Validators.required]),
    email: new FormControl("",[Validators.required, Validators.email]),
    password: new FormControl("",[Validators.required, validatePassword]),
    profileImg: new FormControl("",[Validators.required]),
    phone: new FormControl("",[Validators.required, validatePhone])
  });

  savedValue:string;

  displayNoSales:boolean = false;
  displayFetchSalesError:boolean = false;
  loadingSales:boolean = false;

  /* subscription for when user clicks away from focused input */
  clickSubscription:Subscription;
  formatPhoneSubscription:Subscription;

  displayError:(str)=>string|void = _getError(this.userInfo);

  constructor(
    private db:DBService,
    private _snackbar:MatSnackBar,
    private user:UserService,
    private dialog:MatDialog,
    private router:Router,
    private auth:AuthService
  ) { 
    this.userInfo.disable();
    const curUserRef:User = this.user.currentUser$.getValue();

    this.userInfo.setValue({
      fullName:curUserRef.fullName,
      email: curUserRef.email,
      password: "foobarbaz",
      profileImg: curUserRef.profileImg,
      phone: curUserRef.phone
    }); 
  }


  //When the user clicks the edit button, enable input
  //and make the input into focus.
  onEdit(event:any,controlName:string):void{
    const currentControl = this.userInfo.get(controlName);
    //user clicks same control
    if(currentControl.enabled){
      this._focusElement(controlName);
      return
    };
    
    //user clicks different control
    if(this._clickedAnotherEdit(controlName)) 
      return;

    //Set selected input as the current input.
    this.userInfo.get(controlName).enable();
    this.savedValue = currentControl.value;
    this._focusElement(controlName);
  }


  
  ngOnInit(): void {
    /* Autoformat the users phone input */
    this.formatPhoneSubscription = formatPhoneInput(this.userInfo);
    /* Fetch user's sales */
    this._fetchMySales();
    /* Detect when user clicks away from editing field or edit icon. */
    this.clickSubscription = fromEvent(document,'click').subscribe((event:any)=> {
      const classes:string[] = Array.from(event.path[0].classList);
      if(!classes.includes('edit-icon')&& !classes.includes('info-input')){
        this._detectClickElseWhere();
      }
    });
  }


  onNavigate(path:string[]):void{this.router.navigate(path);}


  ngOnDestroy(){
    this.clickSubscription.unsubscribe();
    this.formatPhoneSubscription.unsubscribe();
  }


  //Call API service and update the current user credentials
  //Catch any error that arises and display success or error to screen.
  private async _saveField(controlName:string):Promise<any> {
    const updatedValue:string = this.userInfo.get(controlName).value;
    try {
      await this.user.updateMyInfo({[controlName]:updatedValue});
      this.auth.refreshToken();
      this._snackbar.open("successfully saved",null,{
        duration:1000,
      });
    }catch(error){
      this._snackbar.open("Unable to save field",null,{
        duration:1000
      });
    }
  }

  /* put an input into focus */
  private _focusElement(controlName:string):void{
    switch(controlName){
      case "fullName":
          this.fullName.nativeElement.focus(); break;
      case "email":
          this.email.nativeElement.focus(); break;
      case "password":
          this.password.nativeElement.focus(); break;
      case "profileImg":
          this.profileImage.nativeElement.focus(); break;
      case "phone":
          console.log('clicked the phone')
          this.phone.nativeElement.focus(); break;
    }
  }

  /* ask the user to either save modified field or display error
  if field is incorrect. */
  private _detectClickElseWhere():void{
      for(const controlField of Object.keys(this.userInfo.value)){//prompt user to save previous modifications if any
        const control = this.userInfo.get(controlField);
        if(control.enabled && control.valid ){
          control.disable();
           if(control.value !== this.savedValue)
              this._openSaveDialog(
                controlField,
                `Save modified field?`,
                `Previous field will be overwritten with "${control.value}". Is that ok?`
              );
        }
        else if(control.enabled && !control.valid){
          this.dialog.open(PopupMenuComponent,{
            data: {
              title:"Invalid field value", 
              content: this.displayError(controlField),
              type:"error"
            }
          });
          control.disable();
          control.setValue(this.savedValue);
        }
      }
  }


  /* Return true when user clicks edit on another field
  when the current one is still active. */
private _clickedAnotherEdit(controlName:string):boolean {
  for(const otherControlName of Object.keys(this.userInfo.value)){
    const otherControl = this.userInfo.get(otherControlName);
    if(
        otherControlName !== controlName && 
        otherControl.enabled && 
        otherControl.valid
      ){
        if(otherControl.value !== this.savedValue)
        this._openSaveDialog(
          otherControlName,
          `Save modified field?`,
          `Previous field will be overwritten with "${otherControl.value}". Is that ok?`
        );
        otherControl.disable();
        return true;
    }
    else if(!otherControl.valid && otherControl.enabled){
      this.dialog.open(PopupMenuComponent,{
        data: {
          title:"Invalid field value", 
          content: this.displayError(otherControlName),
          type:"error"
        }
      });
      otherControl.disable();
      otherControl.setValue(this.savedValue);
      return true;
    }
  }
  return false;
}


  /* 
    Prompt the user if they want to update their credentials.
    If they don't, make sure that input field reverts back to the previously
    saved value. Otherwise, make a PUT request and update the user credentials.
  */
  private _openSaveDialog(controlName:string,title:string, content:string):void{
    const dialogRef = this.dialog.open(PopupMenuComponent,{
      data:{title,content, type:'message'}
    });

    dialogRef.afterClosed().subscribe((saveData:boolean)=>{
      if(saveData){
        console.log("saving data");
        this._saveField(controlName);
      } else{
        this.userInfo.get(controlName).setValue(this.savedValue);
      }
    });
  }

  private _fetchMySales(): void {
    this.loadingSales = true;
    this.db.getMySales().pipe(map((res:any)=> res.data))
    .subscribe({
      next:(data:any)=> {
        if(data.length === 0)
          this.displayNoSales = true;
        this.mySales$.next(data);
        this.loadingSales = false;
        this.displayFetchSalesError = false;
      },
      error:(err)=> {
        this._snackbar.open("Cannot connect to server","OK",{ duration: 5000});
        this.displayNoSales = false;
        this.displayFetchSalesError = true;
        this.loadingSales = false;
      }
    })
  }


}
