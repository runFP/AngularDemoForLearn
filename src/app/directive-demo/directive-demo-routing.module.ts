import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {HomeComponent} from './home/home.component';
import {SimpleDirectiveComponent} from './simple-directive/simple-directive.component';

export const childRoutes: Routes = [
  {path: 'simple', component: SimpleDirectiveComponent}
];

export const routes: Routes = [
  {path: 'directive', component: HomeComponent, children: childRoutes}
];

export const names = [
  {
    name: '指令', children: [
      {name: '简单示例'},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DirectiveDemoRoutingModule {
}
