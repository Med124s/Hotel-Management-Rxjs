import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HotelDetailGuard implements CanActivate {
  constructor(private _route:Router){}
  canActivate(route: ActivatedRouteSnapshot): boolean{
    const urlId = +route.url[1].path;
    if(isNaN(urlId) || urlId<=0){
      this._route.navigate(['/hotels']);
      return false;
    }
    return true;
  }

}
