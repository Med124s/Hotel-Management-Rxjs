import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Hotels/home/home.component';
import { HotelModule } from './Hotels/hotel.module';

const routes: Routes = [
  {path:'home',component:HomeComponent,pathMatch:'full'},
  {path:'',redirectTo:'home',pathMatch:'full'},
  {path:'**',redirectTo:'home',pathMatch:'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes),HotelModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
