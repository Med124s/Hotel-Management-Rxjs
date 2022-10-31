import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, defer, EMPTY, fromEvent, Observable, of, Subject } from 'rxjs';
import {  catchError, pluck,  tap } from 'rxjs/operators';
import { IHotel } from 'src/app/shared/models/Hotel';
import { HotelService } from 'src/app/shared/services/hotel.service';

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.css'],
  changeDetection:ChangeDetectionStrategy.OnPush

})
export class HotelListComponent implements OnInit,AfterViewInit {
  public title:string = "List of Hotels"
  public hotelFilter:any = ""
  public showBadge:boolean = true;
  // public errorMessage:string="";
  public decorator:string = "line-through";
  public rateStar!:string
  public hotels$:Observable<IHotel[]> = of(<IHotel[]>[]);
  public filteredHotel$:Observable<IHotel[]> = of(<IHotel[]>[]);
  public filterString$ = new BehaviorSubject<string>('');

  public errorSubject:Subject<string> = new BehaviorSubject<string>('');
  public errorMessage$ = this.errorSubject.asObservable();

  // public obs$ = interval(1000).pipe(take(2),shareReplay()); //shareReplay: give last data returned
  @ViewChild("filter",{static:true}) inputFilter:ElementRef<HTMLInputElement>

  constructor(private _HotServ:HotelService,public _root:Router,private _http:HttpClient) { }
  ngAfterViewInit(): void {
    const filter$ = defer(()=>fromEvent(this.inputFilter.nativeElement,"keyup")).pipe(
      pluck('target','value'),
      tap((x:string)=>{
        this.filterString$.next(x);
      })
    ).subscribe()
  }

  ngOnInit(): void {

      this.hotels$ =  this._HotServ.newHotelInserted$.pipe(
        catchError((err)=> {
          this.errorSubject.next(err);
          return EMPTY
        })
      )
      // this.filteredHotel$ = this.hotels$;
      this.filteredHotel$ = this.createFilterHotels(this.filterString$,this.hotels$)
    }

    public createFilterHotels(filter$:Observable<string>,hotel$:Observable<IHotel[]>):Observable<IHotel[]>{
        return combineLatest(filter$,hotel$,(filter:string,hotels:IHotel[])=>{
          if(filter ==='') return hotels;
          return hotels.filter((h:IHotel)=>h.hotelName.toLocaleLowerCase().indexOf(filter)!=-1);
        });
    }

  cacher(){
    this.showBadge = !this.showBadge;
  }

  public alertRate(rate:string){
    this.rateStar = rate;
  }
}
