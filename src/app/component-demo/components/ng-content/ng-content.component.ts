import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ng-content',
  templateUrl: './ng-content.component.html',
  styleUrls: ['./ng-content.component.scss']
})
export class NgContentComponent implements OnInit {
  outerContentVariables: {} = {name: 'outerName'};
  constructor() { }

  ngOnInit() {
  }

}
