import {Component, AfterViewInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {BasePortalOutlet, ComponentPortal, Portal, PortalOutlet, TemplatePortal} from '@angular/cdk/portal';

@Component({
  selector: 'app-portal-demo',
  templateUrl: './portal-demo.component.html',
  styleUrls: ['./portal-demo.component.scss']
})
export class PortalDemoComponent implements AfterViewInit {
  @ViewChild('templatePortalContent', {static: false}) templatePortalContent: TemplateRef<any>;
  @ViewChild('declarativeTemRef', {static: false}) declarativeTemRef: TemplatePortal;
  @ViewChild('portalOutlet', {static: false}) portalOutlet: BasePortalOutlet;

  selectedPortal: Portal<any>;
  componentPortal: ComponentPortal<ExamplePortalComponent>;
  templatePortal: TemplatePortal<any>;

  constructor(private _viewContainerRef: ViewContainerRef) {
  }

  ngAfterViewInit() {
    this.componentPortal = new ComponentPortal(ExamplePortalComponent);
    this.templatePortal = new TemplatePortal(this.templatePortalContent, this._viewContainerRef);
  }

  setHostPortalOutlet() {
    if (this.portalOutlet.hasAttached()) {
      this.portalOutlet.detach();
    }
    this.declarativeTemRef.attach(this.portalOutlet);
  }

}


@Component({
  selector: 'app-component-portal-example',
  template: 'Hello, this is a component portal'
})
export class ExamplePortalComponent {
}
