import {Component, OnInit} from '@angular/core';
import {RollerMetalService} from './roller-metal.service';

@Component({
  selector: 'app-roller-metal',
  templateUrl: './roller-metal.component.html',
  styleUrls: ['./roller-metal.component.scss']
})
export class RollerMetalComponent implements OnInit {

  constructor(rmService: RollerMetalService) {
  }

  ngOnInit() {
  }

}
