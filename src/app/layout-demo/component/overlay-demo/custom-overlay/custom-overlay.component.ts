import {Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {Overlay} from '@angular/cdk/overlay';
import {ComponentPortal, TemplatePortal} from '@angular/cdk/portal';

@Component({
  selector: 'app-custom-overlay',
  templateUrl: './custom-overlay.component.html',
  styleUrls: ['./custom-overlay.component.scss']
})
export class CustomOverlayComponent implements OnInit {
  overlay: Overlay;

  @ViewChild('abc', {read: TemplateRef})
  abc: TemplateRef;

  constructor(private overlay: Overlay, private viewContainer: ViewContainerRef) {
  }

  ngOnInit() {
    const overlayRef = this.overlay.create();
    const userProfilePortal = new TemplatePortal(this.abc, this.viewContainer);
    overlayRef.attach(userProfilePortal);
  }

}
