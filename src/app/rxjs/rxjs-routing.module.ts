import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {ObservableDemoComponent} from './components/observable-demo/observable-demo.component';

export const childRoutes: Routes = [
  {path: 'observable', component: ObservableDemoComponent}
];
export const routes: Routes = [
  {path: 'rxjs', component: HomeComponent, children: childRoutes}
];
export const names = [
  {
    name: 'rxjs', children: [
      {name: 'observable'},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RxjsRoutingModule {
}
