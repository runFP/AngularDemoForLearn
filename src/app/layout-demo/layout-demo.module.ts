import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { ColorPickerModule } from 'ngx-color-picker';
// route
import {LayoutDemoRoutingModule} from './layout-demo-routing.module';

// CDK Module
import {CdkStepperModule} from '@angular/cdk/stepper';
import {OverlayModule} from '@angular/cdk/overlay';

// dragAndDrop
import {DragDropModule} from '@angular/cdk/drag-drop';

// divider
import {MatDividerModule} from '@angular/material/divider';

// portal
import {PortalModule} from '@angular/cdk/portal';

// material Module
import {MyOwnCustomMaterialModule} from '../my-own-custom-material/my-own-custom-material-module';


import {HomeComponent} from './home/home.component';
import {LeftFixRightDynamicComponent} from './component/left-fix-right-dynamic/left-fix-right-dynamic.component';
import {CDKStepperDemoComponent} from './component/cdkstepper-demo/cdkstepper-demo.component';
import {CustomStepperComponent} from './component/cdkstepper-demo/custom-stepper/custom-stepper.component';
import {OverlayDemoComponent} from './component/overlay-demo/overlay-demo.component';
import {CustomOverlayComponent, ModalComponent} from './component/overlay-demo/custom-overlay/custom-overlay.component';
import {DragAngDropDemoComponent} from './component/drag-ang-drop-demo/drag-ang-drop-demo.component';
import {PortalDemoComponent, ExamplePortalComponent} from './component/portal-demo/portal-demo.component';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import { UnvarnishedTransmissionComponent } from './component/unvarnished-transmission/unvarnished-transmission.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PickerColorComponent } from './component/overlay-demo/picker-color/picker-color.component';
import { NgDragAndDropComponent } from './component/ng-drag-and-drop/ng-drag-and-drop.component';
import {ShareModule} from '../share/share.module';
import {MatGridListModule} from '@angular/material/grid-list';


@NgModule({
  declarations: [
    HomeComponent,
    LeftFixRightDynamicComponent,
    CDKStepperDemoComponent,
    CustomStepperComponent,
    OverlayDemoComponent,
    CustomOverlayComponent,
    ModalComponent,
    DragAngDropDemoComponent,
    PortalDemoComponent,
    ExamplePortalComponent,
    UnvarnishedTransmissionComponent,
    PickerColorComponent,
    NgDragAndDropComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CdkStepperModule,
    OverlayModule,
    LayoutDemoRoutingModule,
    DragDropModule,
    PortalModule,
    MatDividerModule,
    MyOwnCustomMaterialModule,
    NgZorroAntdModule,
    ColorPickerModule,
    ShareModule,
    MatGridListModule,
  ],
  entryComponents: [
    ExamplePortalComponent,
    ModalComponent
  ],
})
export class LayoutDemoModule {
}
