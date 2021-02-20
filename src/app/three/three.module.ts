import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ThreeFirstDemoComponent} from './component/three-first-demo/three-first-demo.component';
import {ThreeHomeComponent} from './home/three-home/three-home.component';
import {ThreeRoutingModule} from './three-routing.module';
import {FormsModule} from '@angular/forms';
import {RollerMetalComponent} from './component/roller-metal/roller-metal.component';
import {ThreeDemoComponent} from './component/three-demo/three-demo.component';
import {HelperComponent} from './component/three-demo/helper/helper.component';
import {MatFormFieldModule, MatInputModule} from '@angular/material';
import {MatSelectModule} from '@angular/material';


@NgModule({
  declarations: [ThreeFirstDemoComponent, ThreeHomeComponent, RollerMetalComponent, ThreeDemoComponent, HelperComponent],
  imports: [
    CommonModule,
    FormsModule,
    ThreeRoutingModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
  ],
  entryComponents: [HelperComponent],
})
export class ThreeModule {
}
