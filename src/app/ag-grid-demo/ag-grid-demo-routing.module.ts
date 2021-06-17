import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {SimpleAgGridComponent} from './components/simple-ag-grid/simple-ag-grid.component';
import {AggridWorkWithFormComponent} from './components/aggrid-work-with-form/aggrid-work-with-form.component';
import {LiftCycleHookComponent} from './components/lift-cycle-hook/lift-cycle-hook.component';

export const childRoutes: Routes = [
  {path: 'simple', component: SimpleAgGridComponent},
  {path: 'work-with-form', component: AggridWorkWithFormComponent},
  {path: 'listCycle-hook', component: LiftCycleHookComponent},
];
export const routes: Routes = [
  {path: 'agGrid', component: HomeComponent, children: childRoutes}
];

export const names = [
  {
    name: 'agGrid', children: [
      {name: 'agGrid颜色变更组件'},
      {name: 'agGrid结合AngularFrom做校验'},
      {name: 'agGrid钩子函数大全'},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgGridDemoRoutingModule {
}
