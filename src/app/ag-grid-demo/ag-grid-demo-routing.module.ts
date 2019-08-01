import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {SimpleAgGridComponent} from './components/simple-ag-grid/simple-ag-grid.component';
import {AggridWorkWithFormComponent} from './components/aggrid-work-with-form/aggrid-work-with-form.component';

export const childRoutes: Routes = [
  {path: 'simple', component: SimpleAgGridComponent},
  {path: 'work-with-form', component: AggridWorkWithFormComponent},
];
export const routes: Routes = [
  {path: 'agGrid', component: HomeComponent, children: childRoutes}
];

export const names = [
  {
    name: 'agGrid', children: [
      {name: '简单示例'},
      {name: '结合AngularFrom'},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgGridDemoRoutingModule {
}
