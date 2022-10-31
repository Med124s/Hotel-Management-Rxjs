import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HotelDetailComponent } from 'src/app/Hotels/hotel-detail/hotel-detail.component';
import { HotelEditComponent } from 'src/app/Hotels/hotel-edit/hotel-edit.component';
import { HotelListComponent } from 'src/app/Hotels/hotel-list/hotel-list.component';
import { HotelDetailGuard } from '../guards/hotel-detail.guard';
import { HotelEditGuard } from '../guards/hotel-edit.guard';

const routes:Routes = [
  {path:'hotels',component:HotelListComponent},
  {path:'detail-hotel/:id',component:HotelDetailComponent,canActivate:[HotelDetailGuard]},
  {path:'hotels/:id/edit',component:HotelEditComponent,canDeactivate:[HotelEditGuard]},
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports:[RouterModule]
})
export class HotelRoutingModule { }
