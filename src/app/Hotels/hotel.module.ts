import { NgModule } from '@angular/core';
import { HotelListComponent } from 'src/app/Hotels/hotel-list/hotel-list.component';
import { HotelDetailComponent } from 'src/app/Hotels/hotel-detail/hotel-detail.component';
import { SharedModule } from '../shared/module/shared.module';
import { HotelRoutingModule } from '../shared/module/Hotel-routing.module';
import { HotelEditComponent } from './hotel-edit/hotel-edit.component';
import { ChildHotelComponent } from '../components/child-hotel/child-hotel.component';

@NgModule({
  declarations: [
    HotelListComponent,
    HotelDetailComponent,
    HotelEditComponent,
    ChildHotelComponent
  ],
  imports: [
    //Les modules
    SharedModule,
    HotelRoutingModule
    ]
})
export class HotelModule { }
