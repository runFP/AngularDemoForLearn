import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {HomeComponent} from './home/home.component';
import {LeftFixRightDynamicComponent} from './component/left-fix-right-dynamic/left-fix-right-dynamic.component';

const childRoutes: Routes = [
  {path: 'lfrd', component: LeftFixRightDynamicComponent},
];

const routes: Routes = [
  {
    path: 'layout', component: HomeComponent,
    children: childRoutes,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutDemoRoutingModule {
}
