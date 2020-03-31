import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {DynamicAddRouteToLazyModuleComponent} from './components/dynamic-add-route-to-lazy-module/dynamic-add-route-to-lazy-module.component';
import {HomeComponent} from './home/home.component';

export const childRoutes: Routes = [
  {path: 'dynamicAddRoute', component: DynamicAddRouteToLazyModuleComponent}
];

export const routes: Routes = [
  {
    path: 'router', component: HomeComponent,
    children: childRoutes,
  }
];

export const names = [
  {
    name: '路由', children: [
      {name: '动态加载路由'},
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ],
  exports: [RouterModule]
})
export class RouterRoutingModule {
}
