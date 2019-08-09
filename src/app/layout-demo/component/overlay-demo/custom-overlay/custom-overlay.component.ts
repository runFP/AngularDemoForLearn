import {Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {Overlay, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal, TemplatePortal} from '@angular/cdk/portal';

@Component({
  selector: 'app-custom-overlay',
  templateUrl: './custom-overlay.component.html',
  styleUrls: ['./custom-overlay.component.scss']
})
export class CustomOverlayComponent implements OnInit {

  @ViewChild('abc', {read: TemplateRef})
  abc: TemplateRef<any>;

  constructor(private overlay: Overlay, private viewContainer: ViewContainerRef) {
    this.overlay = overlay;
  }

  ngOnInit() {
    const overlayRef = this.overlay.create();
    const userProfilePortal = new TemplatePortal(this.abc, this.viewContainer);

    overlayRef.attach(userProfilePortal);
  }

}
