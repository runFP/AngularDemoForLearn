import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';


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
import {DomSanitizerDemoComponent} from './components/dom-sanitizer-demo/dom-sanitizer-demo.component';
import {CreateDynamicModuleAndComponentComponent} from './components/create-dynamic-module-and-component/create-dynamic-module-and-component.component';
import {TextdynamicComponent} from './components/create-dynamic-module-and-component/textdynamic/textdynamic.component';
import {TlistDemoComponent} from './components/create-dynamic-module-and-component/tlist-demo/tlist-demo.component';
import {AddViewComponent, DataCreateViewComponent} from './components/data-create-view/data-create-view.component';
import {WillBeCreateComponent} from './components/data-create-view/will-be-create/will-be-create.component';
import {NameMapComponent, RegisterNMC} from './NameMapComponent';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatDialogModule} from '@angular/material/dialog';
import { AComponentComponent } from './components/data-create-view/acomponent/acomponent.component';
import { BComponentComponent } from './components/data-create-view/bcomponent/bcomponent.component';
import { CComponentComponent } from './components/data-create-view/ccomponent/ccomponent.component';

/**
 *  组件视图互转demo的记录组件操作
 */
const registerComponents = [
  WillBeCreateComponent,
  AComponentComponent,
  BComponentComponent,
  CComponentComponent,
];
const nmc = new NameMapComponent(registerComponents);
RegisterNMC.setNmc('component-demo', nmc);

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
    WillBeCreateComponent,
    AddViewComponent,
    AComponentComponent,
    BComponentComponent,
    CComponentComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DemoComponentRoutingModule,
    ShareModule,
    MatGridListModule,
    MatDialogModule,
  ],
  providers: [PopupService, AdService],
  entryComponents: [MyPopupComponent, HeroJobAdComponent, HeroProfileComponent, AddViewComponent, ...registerComponents],
})
export class ComponentDemoModule {
}
