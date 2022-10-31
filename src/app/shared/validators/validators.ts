
import { FormControl } from "@angular/forms";


export function requiredFileType( type: string ) {
  return function (control: FormControl) {
    const file = control.value;
    console.log(file);

    if ( file ) {
      const extension = file.name.split('.')[1].toLowerCase();
      if ( type.toLowerCase() !== extension.toLowerCase() ) {
        return {
          requiredFileType: true
        };
      }

      return null;
    }

    return null;
  };
}
// export function dimensionValidator(control: AbstractControl):

// ReturnType| null |any
// {
//   console.log(control);

//   if (typeof control.value === 'object') {

//    if (control.value) {
//      const width = control.value.width;
//      const height = control.value.height;
//      const invalidDimension = width !== 600 && height !== 300;
//      return invalidDimension ? { invalidDimensionError: true } : null;
//     }
//    } else {
//     return null;
//    }
//  }
