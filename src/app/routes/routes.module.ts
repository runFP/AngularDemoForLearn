import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouteRoutingModule} from './route-routing.module';

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
