import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

// route
import {LayoutDemoRoutingModule} from './layout-demo-routing.module';

// CDK Module
import {CdkStepperModule} from '@angular/cdk/stepper';
import {OverlayModule} from '@angular/cdk/overlay';

// material Module
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material';

import {HomeComponent} from './home/home.component';
import {LeftFixRightDynamicComponent} from './component/left-fix-right-dynamic/left-fix-right-dynamic.component';
import {CDKStepperDemoComponent} from './component/cdkstepper-demo/cdkstepper-demo.component';
import {CustomStepperComponent} from './component/cdkstepper-demo/custom-stepper/custom-stepper.component';
import {OverlayDemoComponent} from './component/overlay-demo/overlay-demo.component';
import {CustomOverlayComponent} from './component/overlay-demo/custom-overlay/custom-overlay.component';


@NgModule({
  declarations: [
    HomeComponent,
    LeftFixRightDynamicComponent,
    CDKStepperDemoComponent,
    CustomStepperComponent,
    OverlayDemoComponent,
    CustomOverlayComponent
  ],
  imports: [
    CommonModule,
    CdkStepperModule,
    OverlayModule,
    MatButtonModule,
    MatCheckboxModule,
    LayoutDemoRoutingModule
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule,
  ]
})
export class LayoutDemoModule {
}
