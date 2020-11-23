import {RouterModule, Routes} from '@angular/router';
import {ThreeFirstDemoComponent} from './component/three-first-demo/three-first-demo.component';
import {ThreeHomeComponent} from './home/three-home/three-home.component';
import {NgModule} from '@angular/core';

export const childRoutes: Routes = [
  {path: 'first', component: ThreeFirstDemoComponent}
];

export const routes: Routes = [
  {path: 'three', component: ThreeHomeComponent, children: childRoutes}
];

export const names = [
  {
    name: 'three', children: [
      {name: '第一个threeDemo'},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThreeRoutingModule {
}