import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {HomeComponent} from './home/home.component';
import {LeftFixRightDynamicComponent} from './component/left-fix-right-dynamic/left-fix-right-dynamic.component';
import {CDKStepperDemoComponent} from './component/cdkstepper-demo/cdkstepper-demo.component';
import {OverlayDemoComponent} from './component/overlay-demo/overlay-demo.component';
import {DragAngDropDemoComponent} from './component/drag-ang-drop-demo/drag-ang-drop-demo.component';
import {PortalDemoComponent} from './component/portal-demo/portal-demo.component';

export const childRoutes: Routes = [
  {path: 'lfrd', component: LeftFixRightDynamicComponent},
  {path: 'cdkstepper', component: CDKStepperDemoComponent},
  {path: 'overlay', component: OverlayDemoComponent},
  {path: 'dragdrop', component: DragAngDropDemoComponent},
  {path: 'portal', component: PortalDemoComponent}
];

export const routes: Routes = [
  {
    path: 'layout', component: HomeComponent,
    children: childRoutes,
  },
];

export const names = [
  {
    name: '布局', children: [
      {name: '外层结构布局'},
      {name: '自定义cdkStepper'},
      {name: '自定义overlay'},
      {name: '拖放(modal,div...)'},
      {name: 'portal'},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutDemoRoutingModule {
}
