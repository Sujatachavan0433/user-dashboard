import { Component, OnInit,Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit,OnChanges {
@Input() transparent;
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes)
  {
    console.log('changes : ',changes,this.transparent);
  }
}
