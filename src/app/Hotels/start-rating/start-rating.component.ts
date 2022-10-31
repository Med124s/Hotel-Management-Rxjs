import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-start-rating',
  templateUrl: './start-rating.component.html',
  styleUrls: ['./start-rating.component.css']
})
export class StartRatingComponent implements OnInit,OnChanges {
  @Input()
  public rate!:number;
  @Output()
  public rateSend:EventEmitter<string> = new EventEmitter<string>();
  public startWidth!:number;
  constructor() { }

  ngOnChanges(): void {
    this.startWidth = this.rate * 125/5; 3.5 *125/5
  }

  ngOnInit(): void {
  }

  rateStar(){
    this.rateSend.emit("Rate is: "+this.rate);
  }

}
