import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LeftFixRightDynamicComponent} from './component/left-fix-right-dynamic/left-fix-right-dynamic.component';
import {HomeComponent} from './home/home.component';
import {LayoutDemoRoutingModule} from './layout-demo-routing.module';

@NgModule({
  declarations: [HomeComponent, LeftFixRightDynamicComponent],
  imports: [
    CommonModule,
    LayoutDemoRoutingModule
  ]
})
export class LayoutDemoModule {
}
