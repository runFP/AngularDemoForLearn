import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Column, ColumnApi, GridApi, GridOptions, RowNode, ColDef} from 'ag-grid-community';
import {AgFormCellComponent} from './ag-form-cell/ag-form-cell.component';


@Component({
  selector: 'app-aggrid-work-with-form',
  templateUrl: './aggrid-work-with-form.component.html',
  styleUrls: ['./aggrid-work-with-form.component.scss']
})
export class AggridWorkWithFormComponent implements OnInit {
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  agFormGroup: FormGroup;
  validatedRule: { [key: string]: { rule: any, tips: any } } = {};

  frameworkComponents: { [p: string]: { new(): any } } = {
    textRender: AgFormCellComponent,
  };

  columnTypes: { [p: string]: ColDef } = {
    rendererCol: {cellRenderer: 'textRender'}
  };

  columnDefs: ColDef[] = [
    {headerName: 'Name', field: 'name', type: ['rendererCol']},
    {headerName: 'Sex', field: 'sex', type: ['rendererCol']},
    {headerName: 'Class', field: 'class', type: ['rendererCol']},
    {headerName: 'A', field: 'a'},
    {headerName: 'B', field: 'b'},
  ];

  rowData: any[] = [
    {name: 'LiLei', sex: 'boy', class: '3-1', a: 'a', b: 'b'},
    {name: 'HanMeiMei', sex: 'girl', class: '3-1', a: 'a', b: 'b'},
    {name: 'WuTian', sex: 'girl', class: '3-2', a: 'a', b: 'b'},
  ];

  gridOptions: GridOptions = {
    frameworkComponents: this.frameworkComponents,
    columnTypes: this.columnTypes,
    defaultColDef: {editable: true},
    onRowDataUpdated: (event) => {
      this.refreshAgForm();
    }
  };

  show() {
    console.log(this.agFormGroup);
  }


  constructor(private fb: FormBuilder) {
  }

  /** 添加一行新数据 */
  addNewLine() {
    const newItem = {name: 'hansuhua', sex: 'girl', class: '3-3'};
    this.gridApi.updateRowData({
      add: [newItem],
      addIndex: 0,
    });
  }

  ngOnInit() {
    this.agFormGroup = this.fb.group({});
  }

  onGirdReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.refreshAgForm();
  }

  getContext() {
    return {
      agFormGroup: this.agFormGroup,
      validatedRule: this.validatedRule,
    };
  }


  showAgFormGroup() {
    console.log(this.agFormGroup);
  }

  /**
   * 刷新ag-Grid表单
   * */
  refreshAgForm() {
    if (this.gridApi) {
      this.createAgForm();
      this.gridApi.refreshCells({force: true});
    }
  }


  /**
   * step1: 创建ag-Grid的formGroup
   * 通过遍历行和列，
   * 设置行id为key,行formArray
   *
   * 难点在于如何确定列的formControlName
   * 因为实际生产中，并非每一列都需要校验
   *
   * 结构如下
   * gridGroup:{
   * key:formArray(row)
   * }
   * formArray:[control(column)]
   * */
  createAgForm() {
    const columns = this.gridColumnApi.getAllColumns();
    const validatedRule = {
      name: {rule: ['', Validators.required], tips: '不能为空'},
      sex: {rule: ['', Validators.required], tips: '不能为空'},
      class: {rule: ['', Validators.required], tips: '不能为空'},
    };
    this.validatedRule = validatedRule;

    /** 遍历行列*/
    this.gridApi.forEachNode((r: RowNode) => {
      /** 创建列formArray*/
      const rowFormArray = this.fb.array([]);

      /** 遍历列*/
      columns.filter((c: Column) => c.getColDef().field in validatedRule).forEach((c: Column) => {
        /** 创建每列的control*/
        const field = c.getColDef().field;
        const options: [any] = validatedRule[field].rule || [''];
        const columnControl = this.fb.control(...options);
        rowFormArray.push(columnControl);

      });

      /** 根据行id存储列formArray,实际应用中应该使用uuid来存储，因为rowID在删除增加行时，会发生变化，导致校验对应的行失败
       * 并且应该先把值先一次过对formControl赋值一次，不然aggrid出现懒加载的时候，有些行没加载完，就会导致校验失败
       * */
      this.agFormGroup.addControl(r.id, rowFormArray);
    });
  }

  /**
   * step2:创建ag-Grid渲染器
   * */

}
