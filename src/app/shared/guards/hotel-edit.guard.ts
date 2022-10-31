import { Injectable } from '@angular/core';
import {  CanDeactivate} from '@angular/router';
import { HotelEditComponent } from 'src/app/Hotels/hotel-edit/hotel-edit.component';

@Injectable({
  providedIn: 'root'
})
export class HotelEditGuard implements CanDeactivate<HotelEditComponent> {
  canDeactivate(component: HotelEditComponent | any):boolean{
    if(component.myForm.dirty){
      //si un champ est rempli de formulaire
      const hotelName = component.myForm.get('hotelName').value || 'Nouveau hotel'
      return confirm(`Voullez vous annulez les changments effectués sur ${hotelName}`)
    }
    return true;
  }

}
