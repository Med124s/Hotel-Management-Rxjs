import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { combineLatest, merge, Observable, of, Subject, Subscription, throwError } from "rxjs";
import { catchError, map, scan, shareReplay, tap } from "rxjs/operators";
import { Categories } from "../models/Categories";
import { IHotel } from "../models/Hotel";

@Injectable({
  providedIn:'root'
})
export class HotelService implements OnInit{
  public hotels:IHotel[] = [];
  public subscription:Subscription = new Subscription();
  private errorMessage:string = "";

  public readonly API_JSON_HOTELS = 'http://localhost:3000/Hotels';

  constructor(private _httpClient:HttpClient,private _router:Router){}
  ngOnInit(): void {
  }
      // pour combiner 2 observable hotel and category
      public combineHotelCategorie$ = combineLatest([this.getApiHotel(),this.getCategories()]).pipe(
        map(([hotel,category])=>{
          return hotel.map(hotel=>
            // Transformer un Array arrivant d'une séquence d'Observable
            ({...hotel, ancienPrice:hotel.price, price:hotel.price*=3.5,
              categoryName:category.find(cat=>cat.id === hotel.categoryId)?.name}) as IHotel)
        }),
      )
    public getApiHotel():Observable<IHotel[]>{
      return this._httpClient.get<IHotel[]>(`${this.API_JSON_HOTELS}`).pipe(
        tap(console.log),
        catchError(this.handleError)
      )
      };
    // For perfermance caching Api :  Modifier les éléments du cache grâce à scan() et merge()
    public newHotelSubject:Subject<IHotel> = new Subject();
    public newHotel$ = this.newHotelSubject.asObservable();

    public newHotelInserted$ = merge(this.newHotel$,this.combineHotelCategorie$).pipe(
      scan((hotels:IHotel[],hotel:IHotel)=>{
       hotel = this.transformImageUrl(hotel);
        //check if hotel déja exist, if déja exist then we want to update combineHotelCategorie
       const index = hotels.findIndex(h=>h.id === hotel.id);
       if(index !=-1){
          hotels[index] = hotel;
          return hotels;
       }
        return [...hotels,hotel]
      }),
      shareReplay(1) //give data une seul fois, il ne recharge pas
    )

  public getCategories():Observable<Categories[]>{
    return of([{
      id:1,
      name:"Argana",
      description:"this is top category Argana"
    },
    {
      id:2,
      name:"Milf",
      description:"this is top category Milf"
    },
    {
      id:3,
      name:"Hwuey",
      description:"this is top category Hwuey"
    },
  ])
  }
  public getHotelById(id:number):Observable<IHotel|any>{
    if(id===0){
      return of(this.defaultHotel());
    }
    if(isNaN(id)){
      this._router.navigate(['/hotels']);
      return of(this.defaultHotel());
    }
    return this._httpClient.get<IHotel>(`${this.API_JSON_HOTELS}/${id}`);
    };
    public defaultHotel():IHotel{
      const hotel:IHotel = {
        id:0,
        description:'',
        hotelName:'',
        imageUrl:'',
        rating:1,
        price:0.0,
        tags:[],
        categoryId:0,
        categoryName:''
      }
      return hotel;
    }
    public addOrUpdateHotel(hotel:IHotel):void{
        this.newHotelSubject.next(hotel)
    }
    public addHotel(hotel:IHotel){
      hotel = this.transformImageUrl(hotel);
      return this._httpClient.post<IHotel>(this.API_JSON_HOTELS,hotel).pipe(
        catchError(this.handleError)
      )
    }

    public updateHotel(hotel:IHotel){
      return this._httpClient.patch<IHotel>(`${this.API_JSON_HOTELS}/${hotel.id}`,hotel).pipe(
        catchError(this.handleError)
      )
    }
    public deleteHotel(id:number){
      return this._httpClient.delete<IHotel>(`${this.API_JSON_HOTELS}/${id}`).pipe(
        catchError(this.handleError)
      )
    }

    private transformImageUrl(hotel:IHotel):IHotel{
      return hotel={
        ...hotel,
        imageUrl:"assets/images/Hot3.jpg"
      }
    }

  private handleError(error: HttpErrorResponse) {

    if (error.status === 0) {
      this.errorMessage = "An error occurred :"+error.error;
      // A client-side or network error occurred. Handle it accordingly.
      return throwError(this.errorMessage);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      this.errorMessage = "The backend returned an unsuccessful response :"+error.message;
      return throwError(this.errorMessage);
    }

    // // Return an observable with a user-facing error message.
    // return throwError(
    //   'Something bad happened; please try again later.');
  }
  // public getHotelById(id:number):IHotel[]{
  //    const hotel= this.hotels.filter(elem=>{return elem.hotelId == id});
  //    localStorage.setItem("hoteById",JSON.stringify(hotel));
  //    return hotel;
  // }
}
