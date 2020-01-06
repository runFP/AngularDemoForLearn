import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-unvarnished-transmission',
  templateUrl: './unvarnished-transmission.component.html',
  styleUrls: ['./unvarnished-transmission.component.scss']
})
export class UnvarnishedTransmissionComponent implements OnInit {
  @Input() contentTemplate;

  constructor() { }

  ngOnInit() {
  }

}
