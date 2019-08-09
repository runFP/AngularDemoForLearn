import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-simple-directive',
  templateUrl: './simple-directive.component.html',
  styleUrls: ['./simple-directive.component.scss']
})
export class SimpleDirectiveComponent implements OnInit {
  condition = false;

  constructor() {
  }

  ngOnInit() {
  }

}
