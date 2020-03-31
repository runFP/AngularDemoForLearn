import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DynamicAddRouteToLazyModuleComponent} from './components/dynamic-add-route-to-lazy-module/dynamic-add-route-to-lazy-module.component';
import {RouterRoutingModule} from './router-routing.module';
import {HomeComponent} from './home/home.component';
import {ShareModule} from '../share/share.module';
import {CommonPageComponent} from './components/common-page/common-page.component';


@NgModule({
  declarations: [DynamicAddRouteToLazyModuleComponent, HomeComponent, CommonPageComponent],
  imports: [
    CommonModule,
    RouterRoutingModule,
    ShareModule,
  ],
  entryComponents: [CommonPageComponent],
})
export class RouterModule {
}
