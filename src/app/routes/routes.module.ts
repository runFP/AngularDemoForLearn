import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouteRoutingModule} from './route-routing.module';

// demo
/*import {ComponentDemoModule} from '../component-demo/component-demo.module'; // 组件
import {LayoutDemoModule} from '../layout-demo/layout-demo.module'; // 样式
import {RXjsModule} from '../rxjs/rxjs.module'; // rxjs
import {DirectiveDemoModule} from '../directive-demo/directive-demo.module'; // 指令*/
import {AgGridDemoModule} from '../ag-grid-demo/ag-grid-demo.module'; // agGrid

const customModules = [];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ...customModules,
    RouteRoutingModule,
  ],
  exports: [
    RouteRoutingModule,
  ]
})
export class RoutesModule {
}
