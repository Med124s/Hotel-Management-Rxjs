import {  AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, fromEvent, merge, Observable, timer } from 'rxjs';
import { debounce, debounceTime } from 'rxjs/operators';
import { IHotel } from 'src/app/shared/models/Hotel';
import { HotelService } from 'src/app/shared/services/hotel.service';
import { GlobalGenericValidators } from 'src/app/shared/validators/global.genéric.validators';
import { NumberValidators } from 'src/app/shared/validators/numbers.validator';

@Component({
  selector: 'app-hotel-edit',
  templateUrl: './hotel-edit.component.html',
  styleUrls: ['./hotel-edit.component.css']
})
export class HotelEditComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName,{read:ElementRef}) inputElements:ElementRef[];

  public Hotel!:IHotel
  public titleHotel:string="";
  public errorMessage:string ="";
  public myForm!: FormGroup;
  public onSubmitted:boolean;

  private validationMessage:{ [key:string]:{[key:string]:string} } = {
      hotelName:{
        required:`le nom de l\'hotel est obligatoire`,
        maxlength:`le max  de l\'hotel est 14`,
        minlength:`l\'hotel doit avoir minimum 4 caractére`,
      },
      price:{
        required:`le prix de l\'hotel est obligatoire`,
        pattern:`le prix de l\'hotel doit etre de type numérique`
      },
      rating:{
        range:`l'évaluation de l'\hotel doit etre entre 1 et 5`
      },
      description:{
        required:`la description de l'\hotel est obligatoire`,
        maxlength:`le max  de l\'hotel est 40`,
        minlength:`l\'hotel doit avoir minimum 4 caractére`,
      }
  }

  constructor(private _fb:FormBuilder,private _serviceHotel:HotelService,
              private _activateRoute:ActivatedRoute,
              private _route:Router) {}

  public formErrors:{ [key:string]:string} = {};
  public globalValidators!:GlobalGenericValidators

  ngOnInit(): void {
    this.globalValidators = new GlobalGenericValidators(this.validationMessage);
    this.myForm = this._fb.group({
      hotelName:['',[Validators.required,Validators.maxLength(14),Validators.minLength(4)]],
      rating:['',[NumberValidators.range(1,5)]],
      description:['',[Validators.required,Validators.maxLength(40),Validators.minLength(4)]],
      price:['',[Validators.required,Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]],
      tags:this._fb.array([])
    })
    this._activateRoute.paramMap.subscribe((params:any)=>{
      const id = +params.get('id');
      this.getAboutHotel(id);
    });
  }

  ngAfterViewInit() {
    const fromControlBlur:Observable<unknown>[]=this.inputElements.map((formControlElementRef:ElementRef)=>
     fromEvent(formControlElementRef.nativeElement,"blur"));

     merge(this.myForm.valueChanges,...fromControlBlur)
     .pipe(
       //debounceTime(800)
        debounce(()=>this.onSubmitted?EMPTY:timer(800)) //EMPTY va créer un obervable vide
      )
      .subscribe(()=>{

        this.formErrors = this.globalValidators.createErrorMessage(this.myForm,this.onSubmitted);
        console.log(this.formErrors);
      })
  }
  public getAboutHotel(id:number):void{
    this._serviceHotel.getHotelById(id).subscribe((Hotel:IHotel)=>{
      this.displayHotel(Hotel);
    },err=>console.log(err));
  }

  public displayHotel(Hotel:IHotel):void{
    this.Hotel = Hotel;

    if(this.Hotel.id ===0){
      this.titleHotel ="Créer un hotel"
    }
    else{
      this.titleHotel =`Modifier l\'hotel ${this.Hotel.hotelName}`
    }
    this.myForm.patchValue({
      hotelName:Hotel.hotelName,
      rating:Hotel.rating,
      description:Hotel.description,
      price:Hotel.price,
    });
    this.myForm.setControl("tags",this._fb.array(this.Hotel.tags))
  }

    public saveHotel():void{
      this.onSubmitted = true;
      //Recalculates the value and validation status of the control.
      this.myForm.updateValueAndValidity({
        onlySelf:true,
        emitEvent:true
      })
      if(this.myForm.valid){
          if(this.myForm.dirty){
            const hotel:IHotel = {
              ...this.Hotel, //id!=0 formulaire pour modifier
              ...this.myForm.value //id=0 formulaire pour ajoute nouveau
          };
          if(hotel.id ===0){
            //add hotel
            this._serviceHotel.addHotel(hotel).subscribe({
              next:(hotel)=>{this.submitForm(hotel)},
              error:(error)=>{
                this.intervalErrorMessage(error)
              }
            })
          }
          else{
            this._serviceHotel.updateHotel(hotel).subscribe({
              next:(hotel)=>{this.submitForm(hotel)},
              error:(error)=>{
                this.intervalErrorMessage(error)
              }
            });
            this._serviceHotel.addOrUpdateHotel(hotel);
          }
        }
      }
      else{
        this.intervalErrorMessage("Les champs ne doivent pas etre vide!!");
      }
    }
    intervalErrorMessage(error:string){
        this.errorMessage = error;
        setTimeout(() => {
          this.close();
          }, 9000);
    }
    public submitForm(hotel?:IHotel):void{
      this._serviceHotel.addOrUpdateHotel(hotel);
      this.myForm.reset();
      this._route.navigate(['/hotels'])
    }
     public deleteHotel():void{
      if(confirm(`Voullez vous supprimer l\'hotel ${this.Hotel.hotelName}?`)){
          this._serviceHotel.deleteHotel(this.Hotel.id).subscribe({
          next:(hotel)=>{this.submitForm()}
        })
      }
     }

     public get tags():FormArray{
      return this.myForm.get('tags') as FormArray;
     }
     public addTags():void{
      this.tags.push(new FormControl());
     }

     public deleteTag(index:number):void{
      this.tags.removeAt(index);
      this.tags.markAsDirty();
     }
     public close():void{
      this.errorMessage = "";
     }
  //  getImageData(data:any){

  //   // console.log(data.target.value);
  //   if (data.target.files[0]) {
  //     const file = data.target.files[0];
  //     console.log(file);

  //     const reader: any = new FileReader();
  //     reader.readAsDataURL(file);

  //     reader.onload = (e: any) => {

  //        this.base64Data = reader.result.split(',').pop();

  //        const image = new Image();
  //        image.src = e.target.result;
  //        console.log(file.size);
  //       const size = +(Math.floor(file.size/1024));
  //       console.log(size);

  //       image.onload = (rs:any) => {
  //       const width = rs.currentTarget['width'];
  //       const height = rs.currentTarget['height'];
  //       console.log(width);
  //       console.log(height);

  //       if(size <= 517)
  //       {
  //         console.log("correct");
  //       }
  //       else{
  //         this.myForm.reset();
  //         this.myForm.controls["imageUrl"].setValidators([Validators.required]);
  //         this.myForm.get('imageUrl')?.updateValueAndValidity();
  //         this.submitted = true
  //       };
  //     };
  //   }}}
  }
