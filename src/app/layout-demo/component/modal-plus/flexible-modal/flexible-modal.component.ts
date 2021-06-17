import {AfterViewInit, Component, HostBinding, Inject, OnInit, ViewChild} from '@angular/core';
import {PORTAL_DATA} from '../portal-data';
import {FlexibleSizeDirective} from '../flexible-size.directive';

@Component({
  selector: 'app-flexible-modal',
  templateUrl: './flexible-modal.component.html',
  styleUrls: ['./flexible-modal.component.scss']
})
export class FlexibleModalComponent implements OnInit, AfterViewInit {
  @ViewChild(FlexibleSizeDirective, {static: false}) flexibleSizeDirective: FlexibleSizeDirective;
  @ViewChild('titleHandle', {static: false}) titleHandle: HTMLElement;

  constructor(
    @Inject(PORTAL_DATA) public data,
  ) {
  }

  ngOnInit() {
  }

  close() {
    this.data.close();
  }

  ngAfterViewInit(): void {
    this.flexibleSizeDirective.setDragHandle([this.titleHandle]);
  }

}
