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
import {StyleDemoComponent} from './components/style-demo/style-demo.component';
import {ShareModule} from '../share/share.module';
import {ReferTemplateVariableComponent} from './components/ng-template/referComponent.component';
import {ReferTemplateVariableDirective} from './components/ng-template/referDirective.directive';
import {FormValidatorDemoComponent} from './components/form-validator-demo/form-validator-demo.component';
import {DynamicComponentComponent} from './components/dynamic-component/dynamic-component.component';
import {AdDirective} from './components/dynamic-component/ad-directive.directive';
import {HeroJobAdComponent} from './components/dynamic-component/hero-job-ad/hero-job-ad.component';
import {HeroProfileComponent} from './components/dynamic-component/hero-profile/hero-profile.component';
import {AdBannerComponent} from './components/dynamic-component/ad-banner/ad-banner.component';
import {AdService} from './components/dynamic-component/ad-service.service';
import { DomSanitizerDemoComponent } from './components/dom-sanitizer-demo/dom-sanitizer-demo.component';
import { CreateDynamicModuleAndComponentComponent } from './components/create-dynamic-module-and-component/create-dynamic-module-and-component.component';
import { TextdynamicComponent } from './components/create-dynamic-module-and-component/textdynamic/textdynamic.component';
import { TlistDemoComponent } from './components/create-dynamic-module-and-component/tlist-demo/tlist-demo.component';
import { DataCreateViewComponent } from './components/data-create-view/data-create-view.component';
import { InsertContainerDirective } from './components/data-create-view/insert-container.directive';

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
    FormValidatorDemoComponent,
    DynamicComponentComponent,
    AdDirective,
    HeroJobAdComponent,
    HeroProfileComponent,
    AdBannerComponent,
    DomSanitizerDemoComponent,
    CreateDynamicModuleAndComponentComponent,
    TextdynamicComponent,
    TlistDemoComponent,
    DataCreateViewComponent,
    InsertContainerDirective
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DemoComponentRoutingModule,
    ShareModule
  ],
  providers: [PopupService, AdService],
  entryComponents: [MyPopupComponent, HeroJobAdComponent, HeroProfileComponent],
})
export class ComponentDemoModule {
}
