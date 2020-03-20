import {Component, HostBinding, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-ccomponent',
  templateUrl: './ccomponent.component.html',
  styleUrls: ['./ccomponent.component.scss']
})
export class CComponentComponent implements OnInit {
  @Input() options: any;
  @Input() name = 'componentName';

  @HostBinding('style.transform')
  transform: string;

  constructor() {
  }

  ngOnInit() {
  }

}
