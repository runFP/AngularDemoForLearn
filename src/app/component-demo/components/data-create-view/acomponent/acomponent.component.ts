import {Component, HostBinding, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-acomponent',
  templateUrl: './acomponent.component.html',
  styleUrls: ['./acomponent.component.scss']
})
export class AComponentComponent implements OnInit {
  @Input() options: any;
  @Input() name = 'componentName';

  @HostBinding('style.transform')
  transform: string;

  constructor() {
  }

  ngOnInit() {
  }
}
