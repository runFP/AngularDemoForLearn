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
import {ReferTemplateVariableComponent} from './components/ng-template/referComponent.component';
import {ReferTemplateVariableDirective} from './components/ng-template/referDirective.directive';
import { FormValidatorDemoComponent } from './components/form-validator-demo/form-validator-demo.component';

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
    StyleDemoComponent,
    ReferTemplateVariableComponent,
    ReferTemplateVariableDirective,
    FormValidatorDemoComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DemoComponentRoutingModule,
    ShareModule
  ],
  providers: [PopupService],
  entryComponents: [MyPopupComponent],
})
export class ComponentDemoModule {
}
