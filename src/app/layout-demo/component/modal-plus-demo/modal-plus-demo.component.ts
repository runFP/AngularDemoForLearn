import {Component, Injector, OnInit} from '@angular/core';
import {Overlay, OverlayPositionBuilder} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {FlexibleModalComponent} from './flexible-modal/flexible-modal.component';
import {PORTAL_DATA} from './portal-data';


@Component({
  selector: 'app-modal-plus-demo',
  templateUrl: './modal-plus-demo.component.html',
  styleUrls: ['./modal-plus-demo.component.scss']
})
export class ModalPlusDemoComponent implements OnInit {
  overlayRef;
  injector;

  constructor(
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilder,
  ) {
  }

  ngOnInit() {
    const global = this.overlayPositionBuilder.global().centerHorizontally().centerVertically();
    this.overlayRef = this.overlay.create({positionStrategy: global});
    this.injector = Injector.create([{provide: PORTAL_DATA, useValue: {overlayRef: this.overlayRef}}]);
  }

  showModal() {
    const flexibleModal = new ComponentPortal(FlexibleModalComponent, null, this.injector);
    this.overlayRef.attach(flexibleModal);
  }

  closeModal() {
    this.overlayRef.detach();
  }
}

