import {Routes, RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';

import {HomeComponent} from './home/home.component';
import {ChangeAfterItWasChangeComponent} from './change-after-it-was-change/change-after-it-was-change.component';

export const childRoutes: Routes = [
  {path: 'changeAfterItWasChange', component: ChangeAfterItWasChangeComponent},
];

export const routes: Routes = [
  {path: 'error', component: HomeComponent, children: childRoutes}
];

export const names = [
  {
    name: '错误解析', children: [
      {name: 'changeAfterItWasChange'},
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrorRoutingModule {

}
