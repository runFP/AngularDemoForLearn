import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-data-create-view',
  templateUrl: './data-create-view.component.html',
  styleUrls: ['./data-create-view.component.scss']
})
export class DataCreateViewComponent implements OnInit {

  remoteData = [
    {componentName: '', options: '', pos: ''},
  ];

  constructor() {
  }

  ngOnInit() {
  }

}
