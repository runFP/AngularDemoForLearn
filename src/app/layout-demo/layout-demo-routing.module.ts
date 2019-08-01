import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {HomeComponent} from './home/home.component';
import {LeftFixRightDynamicComponent} from './component/left-fix-right-dynamic/left-fix-right-dynamic.component';
import {CDKStepperDemoComponent} from './component/cdkstepper-demo/cdkstepper-demo.component';

export const childRoutes: Routes = [
  {path: 'lfrd', component: LeftFixRightDynamicComponent},
  {path: 'cdkstepper', component: CDKStepperDemoComponent},
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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutDemoRoutingModule {
}
