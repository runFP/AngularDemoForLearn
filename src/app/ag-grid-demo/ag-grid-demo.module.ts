import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {AgGridModule} from 'ag-grid-angular';
import {AgGridDemoRoutingModule} from './ag-grid-demo-routing.module';

import {HomeComponent} from './home/home.component';
import {SimpleAgGridComponent} from './components/simple-ag-grid/simple-ag-grid.component';

/* Material Modules*/
import {AggridWorkWithFormComponent} from './components/aggrid-work-with-form/aggrid-work-with-form.component';
import {GridComponent} from './components/aggrid-work-with-form/grid/grid.component';
import {FormCellComponent} from './components/aggrid-work-with-form/grid/form-cell/form-cell.component';
import {BranchService} from './components/aggrid-work-with-form/grid/branch.service';
import {TextSpanComponent} from './components/aggrid-work-with-form/grid/form-cell/textSpan.component';
import {ShareModule} from '../share/share.module';
import {CellRenderComponent} from './components/simple-ag-grid/cellRender.component';
import {AgFormCellComponent} from './components/aggrid-work-with-form/ag-form-cell/ag-form-cell.component';
import {AgSpanComponent} from './components/aggrid-work-with-form/ag-form-cell/ag-span.component';
import { LiftCycleHookComponent } from './components/lift-cycle-hook/lift-cycle-hook.component';

const agGridWorkWithForm = [
  AgGridModule.withComponents([FormCellComponent]),
];

@NgModule({
  declarations: [
    HomeComponent,
    SimpleAgGridComponent,
    AggridWorkWithFormComponent,
    GridComponent,
    FormCellComponent,
    TextSpanComponent,
    CellRenderComponent,
    AgFormCellComponent,
    AgSpanComponent,
    LiftCycleHookComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AgGridDemoRoutingModule,
    ShareModule,
    agGridWorkWithForm,
  ],
  providers: [BranchService],
  entryComponents: [
    CellRenderComponent,
    AgFormCellComponent
  ]
})
export class AgGridDemoModule {
}
