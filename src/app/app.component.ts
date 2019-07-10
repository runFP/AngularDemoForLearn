import {Component, Injector} from '@angular/core';
import {MyPopupComponent} from './component-demo/components/dynamic-component-and-customize-element/my-popup/my-popup.component';
import {createCustomElement} from '@angular/elements';
import {PopupService} from './component-demo/components/dynamic-component-and-customize-element/my-popup/my-popup.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Demo集合';
}
