import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { from, Observable, of } from 'rxjs';
import { filter, map, mergeMap, tap, toArray } from 'rxjs/operators';
import { IHotel } from 'src/app/shared/models/Hotel';
import { HotelService } from 'src/app/shared/services/hotel.service';

@Component({
  selector: 'app-hotel-detail',
  templateUrl: './hotel-detail.component.html',
  styleUrls: ['./hotel-detail.component.css']
})
export class HotelDetailComponent implements OnInit {
  idHotel!:number;
  // test = of("ali"); for test async pipe d'observable in html {{test | async}}
  public hotel$:Observable<IHotel> = of(<IHotel>{});
  ;
  constructor(private _routerActivate:ActivatedRoute,private _servHotel:HotelService,private _route:Router, public http:HttpClient) { }
  ngOnInit(): void {

      const id:number|any = +this._routerActivate.snapshot.paramMap.get("id");
      this.hotel$ = this._servHotel.newHotelInserted$.pipe(
          map((hotel:IHotel[])=>{
            return hotel.find((hotel:IHotel)=>hotel.id === +id);
      }),
      )
      // Pour par exemple get automatiquement les menu de l'hotel via http using mergeMap
      this.hotel$.pipe(
        mergeMap(hotel=>from(hotel.menu).pipe(
        filter(menu=>!!menu),
        mergeMap((menu:number)=>this.http.get<IHotel>("http://localhost:3000/Hotels/"+menu)),
        toArray()
      ))
    ).subscribe(console.log)


  }
  retour(){
    this._route.navigate(["/hotels"])
  }
}
