import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {HomeComponent} from './home/home.component';
import {SimpleDirectiveComponent} from './simple-directive/simple-directive.component';

const childRoutes: Routes = [
  {path: 'simple', component: SimpleDirectiveComponent}
];

const routes: Routes = [
  {path: 'directive', component: HomeComponent, children: childRoutes}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DirectiveDemoRoutingModule {
}
