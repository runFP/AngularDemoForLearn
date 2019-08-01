import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LeftFixRightDynamicComponent} from './component/left-fix-right-dynamic/left-fix-right-dynamic.component';
import {HomeComponent} from './home/home.component';
import {LayoutDemoRoutingModule} from './layout-demo-routing.module';
import {CdkStepperModule} from '@angular/cdk/stepper';

import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material';
import {CDKStepperDemoComponent} from './component/cdkstepper-demo/cdkstepper-demo.component';
import {CustomStepperComponent} from './component/cdkstepper-demo/custom-stepper/custom-stepper.component';


@NgModule({
  declarations: [HomeComponent, LeftFixRightDynamicComponent, CDKStepperDemoComponent, CustomStepperComponent],
  imports: [
    CommonModule,
    CdkStepperModule,
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
