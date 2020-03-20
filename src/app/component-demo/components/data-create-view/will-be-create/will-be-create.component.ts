import {Component, HostBinding, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-will-be-create',
  templateUrl: './will-be-create.component.html',
  styleUrls: ['./will-be-create.component.scss']
})
export class WillBeCreateComponent implements OnInit {
  @Input() options: any;
  @Input() name = 'componentName';

  @HostBinding('style.transform')
  transform: string;

  constructor() {
  }

  ngOnInit() {
  }

}