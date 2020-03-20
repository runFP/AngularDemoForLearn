import {Component, HostBinding, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-bcomponent',
  templateUrl: './bcomponent.component.html',
  styleUrls: ['./bcomponent.component.scss']
})
export class BComponentComponent implements OnInit {
  @Input() options: any;
  @Input() name = 'componentName';

  @HostBinding('style.transform')
  transform: string;

  constructor() {
  }

  ngOnInit() {
  }

}
