import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StartRatingComponent } from 'src/app/Hotels/start-rating/start-rating.component';
import { ReplaceComma } from '../pipes/replace-comma.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    StartRatingComponent,
    ReplaceComma
  ],
  imports: [
    CommonModule,
  ],
  exports:[
    StartRatingComponent,
    ReplaceComma,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class SharedModule { }
