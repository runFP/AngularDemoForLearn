import {Component, Inject, OnInit} from '@angular/core';
import {PORTAL_DATA} from '../portal-data';

@Component({
  selector: 'app-flexible-modal',
  templateUrl: './flexible-modal.component.html',
  styleUrls: ['./flexible-modal.component.scss']
})
export class FlexibleModalComponent implements OnInit {

  constructor(
    @Inject(PORTAL_DATA) public data
  ) {
  }

  ngOnInit() {
  }

  close() {
    this.data.overlayRef.detach();
  }

}
