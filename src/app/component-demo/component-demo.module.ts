import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


import {HomeComponent} from './home/home.component';
import {NgTemplateComponent} from './components/ng-template/ng-template.component';
import {DemoComponentRoutingModule} from './component-demo-routing.module';
import {NgContentComponent} from './components/ng-content/ng-content.component';
import {NgSubContentComponent} from './components/ng-content/ng-subContent.component';
import {ViewChildDemoComponent, Pane} from './components/view-child-demo/view-child-demo.component';
import {FormDemoComponent} from './components/form-demo/form-demo.component';

import {DynamicComponentAndCustomizeElementComponent} from './components/dynamic-component-and-customize-element/dynamic-component-and-customize-element.component';
import {MyPopupComponent} from './components/dynamic-component-and-customize-element/my-popup/my-popup.component';
import {PopupService} from './components/dynamic-component-and-customize-element/my-popup/my-popup.service';
import { StyleDemoComponent } from './components/style-demo/style-demo.component';
import {ShareModule} from '../share/share.module';

@NgModule({
  declarations: [
    NgTemplateComponent,
    HomeComponent,
    NgContentComponent,
    NgSubContentComponent,
    ViewChildDemoComponent,
    Pane,
    FormDemoComponent,
    DynamicComponentAndCustomizeElementComponent,
    MyPopupComponent,
    StyleDemoComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DemoComponentRoutingModule,
    BrowserAnimationsModule,
    ShareModule
  ],
  providers: [PopupService],
  entryComponents: [MyPopupComponent],
})
export class ComponentDemoModule {
}
