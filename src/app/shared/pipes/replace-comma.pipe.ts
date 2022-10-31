import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name:"replaceComma"
})
export class ReplaceComma implements PipeTransform{

  transform(value: any):string{
    // !! it's mean if value ni undefined et ni null
    if(!!value){
      return value.replace(/,/g,'.')
    }
    return '';
  }

}
