import { FormGroup } from "@angular/forms";
import { stringify } from "querystring";
import { of } from "rxjs";

export class GlobalGenericValidators{

  constructor(private validatorMessage:{ [key:string]:{[key:string]:string} }){}
  public createErrorMessage(container:FormGroup,onSubmitted:boolean):{[key:string]:string}{

    const errorMessage = {};
    for(const controlName in container.controls){

      if(container.controls.hasOwnProperty(controlName)){
        const selectedControl = container.controls[controlName]

        if(this.validatorMessage[controlName]){
          errorMessage[controlName]='';

          if((selectedControl.dirty || selectedControl.touched || onSubmitted) && selectedControl.errors){
            //we get errors from selectedControl
            Object.keys(selectedControl.errors).map((errorMessageKey:string)=>{

              if(this.validatorMessage[controlName][errorMessageKey]){
                errorMessage[controlName]+=this.validatorMessage[controlName][errorMessageKey];
                //console.log(errorMessage);
              }
            })
          }
        }
      }
    }
    return errorMessage;
  }
}
