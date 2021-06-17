import {RouterModule, Routes} from '@angular/router';
import {ThreeFirstDemoComponent} from './component/three-first-demo/three-first-demo.component';
import {ThreeHomeComponent} from './home/three-home/three-home.component';
import {NgModule} from '@angular/core';
import {RollerMetalComponent} from './component/roller-metal/roller-metal.component';
import {ThreeCommonServices} from './three-common.services';
import {ThreeDemoComponent} from './component/three-demo/three-demo.component';

export const childRoutes: Routes = [
  // {path: 'first', component: ThreeFirstDemoComponent},
  {path: 'roller-metal', component: RollerMetalComponent},
  // {path: 'three-demo', component: ThreeDemoComponent},
];

export const routes: Routes = [
  {path: 'three', component: ThreeHomeComponent, children: childRoutes}
];

export const names = [
  {
    name: 'three', children: [
      // {name: '第一个threeDemo'},
      {name: '滚筒钣金'},
      // {name: 'three探索'},
    ]
  }
];


const threeCommonFactory = () => new ThreeCommonServices();

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [{provide: ThreeCommonServices, useFactory: threeCommonFactory}]
})
export class ThreeRoutingModule {
}
