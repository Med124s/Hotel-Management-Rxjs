import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-child-hotel',
  templateUrl: './child-hotel.component.html',
  styleUrls: ['./child-hotel.component.css'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ChildHotelComponent implements OnInit {

  @Input("names") names:BehaviorSubject<string | string[]>

  lists:any[] = [];
  // lists:string[] | string=[];
  constructor(private cdRef:ChangeDetectorRef) { }

  refrech(){
    // this.cdRef.detectChanges(); //to active ChangeDetectionStrategy
  }

  ngOnInit(): void {
    this.names.subscribe(n=>{
      this.lists = [this.lists,...n];
      // this.cdRef.markForCheck();
      this.cdRef.detach();

      setTimeout(()=>{
        this.cdRef.detectChanges();
      },2000)
    })
    // this.lists.push(this.names.s)
    // this.lists = [...this.lists,...this.names]
  }


}
