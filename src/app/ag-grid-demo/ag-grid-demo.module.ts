import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

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
import {LiftCycleHookComponent} from './components/lift-cycle-hook/lift-cycle-hook.component';
import {CellEditComponent} from './components/simple-ag-grid/cellEditerPopup';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {OverlayModule} from '@angular/cdk/overlay';
import {AngularFilterComponent} from './components/simple-ag-grid/angular-filter/angular-filter.component';
import {RichSelectCellEditorComponent} from './components/simple-ag-grid/rich-select-cell-editor/rich-select-cell-editor.component';
import {RestoreScrollDirective} from './components/lift-cycle-hook/restore-scroll.directive';
import {UpdateColorCellDirective} from './components/lift-cycle-hook/update-color-cell/update-color-cell.directive';
import {ColorPickerModule} from 'ngx-color-picker';
import {PickerColorComponent} from './components/simple-ag-grid/picker-color/picker-color.component';

const agGridWorkWithForm = [
  AgGridModule.withComponents([FormCellComponent, CellEditComponent, AngularFilterComponent]),
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
    CellEditComponent,
    AgFormCellComponent,
    AgSpanComponent,
    LiftCycleHookComponent,
    AngularFilterComponent,
    RichSelectCellEditorComponent,
    RestoreScrollDirective,
    UpdateColorCellDirective,
    PickerColorComponent,
  ],
  imports: [
    OverlayModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    AgGridDemoRoutingModule,
    ShareModule,
    agGridWorkWithForm,
    NgZorroAntdModule,
    ColorPickerModule
  ],
  providers: [BranchService],
  entryComponents: [
    CellRenderComponent,
    CellEditComponent,
    AgFormCellComponent,
    RichSelectCellEditorComponent,
  ]
})
export class AgGridDemoModule {
}
