import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {HomeComponent} from './home/home.component';
import {LeftFixRightDynamicComponent} from './component/left-fix-right-dynamic/left-fix-right-dynamic.component';
import {CDKStepperDemoComponent} from './component/cdkstepper-demo/cdkstepper-demo.component';
import {OverlayDemoComponent} from './component/overlay-demo/overlay-demo.component';
import {DragAngDropDemoComponent} from './component/drag-ang-drop-demo/drag-ang-drop-demo.component';
import {PortalDemoComponent} from './component/portal-demo/portal-demo.component';
import {NgDragAndDropComponent} from './component/ng-drag-and-drop/ng-drag-and-drop.component';
import {FlexMergeDynamicComponent} from './component/flex-merge-dynamic/flex-merge-dynamic.component';
import {ModalPlusDemoComponent} from './component/modal-plus-demo/modal-plus-demo.component';

export const childRoutes: Routes = [
  {path: 'lfrd', component: LeftFixRightDynamicComponent},
  {path: 'cdkstepper', component: CDKStepperDemoComponent},
  {path: 'overlay', component: OverlayDemoComponent},
  {path: 'dragdrop', component: DragAngDropDemoComponent},
  {path: 'portal', component: PortalDemoComponent},
  {path: 'dragAndDrop', component: NgDragAndDropComponent},
  {path: 'flexMergeDynamic', component: FlexMergeDynamicComponent},
  {path: 'modalPlusDemo', component: ModalPlusDemoComponent}
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
      {name: '自定义拖动层'},
      {name: '动态合并flex布局'},
      {name: 'modalPlus'},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutDemoRoutingModule {
}
