import {Component, Injector, OnInit} from '@angular/core';
import {MyPopupComponent} from './my-popup/my-popup.component';
import {PopupService} from './my-popup/my-popup.service';
import {createCustomElement} from '@angular/elements';

@Component({
  selector: 'app-dynamic-component-and-customize-element',
  templateUrl: './dynamic-component-and-customize-element.component.html',
  styleUrls: ['./dynamic-component-and-customize-element.component.scss']
})
export class DynamicComponentAndCustomizeElementComponent implements OnInit {

  constructor(injector: Injector, public popup: PopupService) {
    // Convert `PopupComponent` to a custom element.
    const PopupElement = <Function>createCustomElement(MyPopupComponent, {injector});
    // Register the custom element with the browser.
    customElements.define('popup-element', PopupElement);
  }

  ngOnInit() {
  }

}
