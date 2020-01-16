import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {AgGridAngular} from 'ag-grid-angular';

import {IClientSideRowModel, FilterChangedEvent, FilterModifiedEvent, GridOptions, RowNode, SortChangedEvent} from 'ag-grid-community';
import {CellRenderComponent} from './cellRender.component';
import {CellEditComponent} from './cellEditerPopup';
import {AngularFilterComponent} from './angular-filter/angular-filter.component';
import {Router} from '@angular/router';
import {RichSelectCellEditorComponent} from './rich-select-cell-editor/rich-select-cell-editor.component';
import {ViewportScroller} from '@angular/common';
import {UpdateColorCellDirective} from '../lift-cycle-hook/update-color-cell/update-color-cell.directive';
import {ColorPickerDirective} from 'ngx-color-picker/dist/lib/color-picker.directive';

interface ObjectType {
  [key: string]: any;
}

@Component({
  selector: 'app-simple-ag-grid',
  templateUrl: './simple-ag-grid.component.html',
  styleUrls: ['./simple-ag-grid.component.scss']
})
export class SimpleAgGridComponent implements OnInit, AfterViewInit {
  @ViewChild('agGrid', {static: false}) agGrid: AgGridAngular;
  @ViewChild('cp', {static: false}) cp: ColorPickerDirective;

  /** 获取列变更颜色指令实例 */
  @ViewChild(UpdateColorCellDirective, {static: false}) ucc;

  private gridApi;
  private columnApi;

  color = '#fff';

  // 列定义
  columnDefs: any[] = [
    {
      headerName: 'Make',
      field: 'make',
      /** 单元格条件渲染 */
      cellStyle: function (params) {
        if (params.value === 'Toyota') {
          return {color: 'black', backgroundColor: 'red'};
        } else {
          return null;
        }
      }
    }, // 排序
    {headerName: 'Model', field: 'model', filter: 'filterTest', cellStyle: {'text-align': 'center'}}, // 过滤
    {headerName: 'Price', field: 'price', checkboxSelection: true},
    {
      headerName: 'A',
      field: 'a',
      cellRendererParams: {color: 'red'}, /** 为渲染器提供参数 */
      type: 'cellRenderColumn' /** 为该列标记类型，可以批量设置列的配置 */
    },
    {headerName: 'B', field: 'b', editable: true, type: 'cellEditorColumnSelect', cellEditorParams: {abc: 123}},
    {headerName: 'C', field: 'c', editable: true, type: 'cellEditorColumn'},
    {field: 'cc', headerName: 'cc', hide: true},
  ];

  /** 右键菜单字符映射 */
  // localeText: { [key: string]: any } = {
  //   copy: 'laCopy',
  //   copyWithHeaders: 'laCopy Wit hHeaders',
  // };

  /** 右键菜单字符映射函数 */
  // localeTextFunc(key, defaultValue) {
  //   console.log(key, defaultValue);
  // }

  /** 注册组件
   * 这种方式比直接引用组件更容易批量修改，通过可以让gird配置项保持为一个简单的JSON
   *  key-value key代表映射表内的组件名字，value为组件
   * */
  frameworkComponents = {
    'test': CellRenderComponent, /** 由于这种形式是动态渲染，因此动态组件需要在entryComponents定义，否则angular会报错*/
    'datePicker': CellEditComponent,
    'filterTest': AngularFilterComponent,
    'richSelect': RichSelectCellEditorComponent,
  };

  /** 定义类类型
   * key-value key代表类型的名字，用于在columnDefs中的列定义的type字段，value表示改类型需要设置的列配置,eg:单元格渲染组件，单元格编辑组件
   * */
  columnTypes = {
    cellRenderColumn: {cellRenderer: 'test'},
    cellEditorColumn: {cellEditor: 'datePicker'},
    cellEditorColumnSelect: {cellEditor: 'richSelect'},
  };


  /*  autoGroupColumnDef = {
      headerName: 'Make',
      field: 'make',
      cellRenderer: 'agGroupCellRenderer',
      cellRendererParams: {
        checkbox: true
      }
    };*/


  // 数据1
  /** cc 为列变更颜色标识字段 */
  rowData: any[] = [
    {make: 'Toyota', model: 'CeBVlica', price: 35000, a: 'aa', b: 'bb', c: '', cc: null},
    {make: 'Ford', model: 'MonBdeo', price: 32000, a: 'aaa', b: 'bbb', c: '', cc: null},
    {make: 'Porsche1', model: 'Moxter', price: 72000, a: 'aaaa', b: 'bbbb', c: '', cc: null},
    {make: 'Porsche2', model: 'Boxter', price: 72000, a: 'aaaa', b: 'bbbb', c: '', cc: null},
    {make: 'Porsche3', model: 'Boxter', price: 72000, a: 'aaaa', b: 'bbbb', c: '', cc: null},
    {make: 'Porsche4', model: 'BBoxter', price: 72000, a: 'aaaa', b: 'bbbb', c: '', cc: null},
    {make: 'Porsche5', model: 'Boxter', price: 72000, a: 'aaaa', b: 'bbbb', c: '', cc: null},
    {make: 'Porsche6', model: 'BBoxter', price: 72000, a: 'aaaa', b: 'bbbb', c: '', cc: null},
    {make: 'Porsche7', model: 'AAxter', price: 72000, a: 'aaaa', b: 'bbbb', c: '', cc: null},
    {make: 'Porsche8', model: 'AAxter', price: 72000, a: 'aaaa', b: 'bbbb', c: '', cc: null},
    {make: 'Porsche9', model: 'MAoxter', price: 72000, a: 'aaaa', b: 'bbbb', c: '', cc: null},
    {make: 'porsche9', model: 'MAoxter', price: 72000, a: 'aaaa', b: 'bbbb', c: '', cc: null},
  ];

  // 数据2
  rowData2: any[] = [
    {make: 'Toyota2', model: 'CeBlica', price: 35000, a: 'aa', b: 'bb', c: 'cc'},
    {make: 'Ford2', model: 'MoBndeo', price: 32000, a: 'aaa', b: 'bbb', c: 'ccc'},
    {make: 'Porsche2', model: 'Boxter', price: 72000, a: 'aaaa', b: 'bbbb', c: 'cccc'},
    {make: 'Porsche2', model: 'Boxter', price: 72000, a: 'aaaa', b: 'bbbb', c: 'cccc'},
    {make: 'Porsche2', model: 'Boxter', price: 72000, a: 'aaaa', b: 'bbbb', c: 'cccc'},
    {make: 'Porsche2', model: 'Boxter', price: 72000, a: 'aaaa', b: 'bbbb', c: 'cccc'},
    {make: 'Porsche2', model: 'Boxter', price: 72000, a: 'aaaa', b: 'bbbb', c: 'cccc'},
    {make: 'Porsche2', model: 'Boxter', price: 72000, a: 'aaaa', b: 'bbbb', c: 'cccc'},
    {make: 'Porsche2', model: 'Boxter', price: 72000, a: 'aaaa', b: 'bbbb', c: 'cccc'},
    {make: 'Porsche2', model: 'Boxter', price: 72000, a: 'aaaa', b: 'bbbb', c: 'cccc'},
    {make: 'Porsche2', model: 'Boxter', price: 72000, a: 'aaaa', b: 'bbbb', c: 'cccc'},
  ];


  pinnedTopRowData: any[] = [{
    make: 'pindMake',
    price: this.rowData.reduce((acc, cur) => acc + cur.price, 0)
  }];


  // 配置
  gridOptions: GridOptions = {
    // localeTextFunc: (key, defaultValue) => {
    //   console.log(key, defaultValue);
    // },
    // 过滤排序事件
    onFilterModified: (event: FilterModifiedEvent) => {   // 在onFilterChanged之前执行
      console.log('*************************************');
      console.log('在onFilterChanged之前执行');
      console.log('onFilterModified');
      console.log(event);
      const filterInstance = event.filterInstance;
    },
    onFilterChanged: (event: FilterChangedEvent) => {
      console.log('*************************************');
      console.log('onFilterChanged');
      console.log(event);
      /*      const rows = (<ClientSideRowModel>event.api.getModel()).getRootNode().childrenAfterFilter;
            let pinnedTopRowData;
            if (!event.api.isAnyFilterPresent()) {
              pinnedTopRowData = this.getPinnedTopRowData(123);
            } else {
              pinnedTopRowData = this.getPinnedTopRowData(rows);
            }
            this.gridApi.setPinnedTopRowData(pinnedTopRowData);*/
      console.log('*************************************');
    },
    onSortChanged: (event: SortChangedEvent) => {
      console.log('*************************************');
      console.log('onSortChanged');
      console.log(event);
      console.log('*************************************');
    },
  };

  defaultColDef = {
    filter: true,
    /** 配置列变更颜色逻辑*/
    cellStyle: param => {
      let exist = false;
      let color = null;
      const cc = param.data.cc;
      if (cc) {
        for (const c in cc) {
          if (cc[c].indexOf(param.column.colId) !== -1) {
            exist = true;
            color = c;
            break;
          }
        }
        if (exist) {
          return {backgroundColor: color};
        }
      }
    }
  };

  getPinnedTopRowData(rows: RowNode[] | number): any[] {
    const pinnedTopRowData = {
      make: 'pindMake',
      price: typeof rows === 'number' ? rows : this.processRowTotalPrice(rows),
    };
    return [pinnedTopRowData];
  }

  processRowTotalPrice(rows: RowNode[]) {
    return rows.reduce((acc, cur) => acc + cur.data.price, 0);
  }

  constructor(private router: Router, private viewportScroller: ViewportScroller) {
  }

  ngOnInit() {
    console.log('Y轴滚动到300', this.viewportScroller);
    this.viewportScroller.scrollToPosition([0, 300]);
  }

  /**
   * 重设数据
   * 重设数据会导致之前所有状态丢失
   */
  resetData() {
    this.gridApi.setRowData(this.rowData2);
  }

  /**
   * 跳到第9行
   */
  goToLine() {
    this.gridApi.ensureIndexVisible(8, 'bottom');
    console.log('I\'m scroll to eighth line!!!');
  }

  /**
   * 获取选中数据
   */
  getSelectedRows() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    const selectedDataStringPresentation = selectedData.map(node => node.make + ' ' + node.model).join(', ');
    alert(`Selected nodes: ${selectedDataStringPresentation}`);
  }

  getCellRanges() {
    console.log(this.gridApi.getRangeSelections());
    console.log(this.gridApi.getSelectedRows());
  }

  /**
   * 设置冻结行
   */
  setPinnedRow() {
  }

  /**
   * 刷新第一行A列
   * */
  refreshColumn() {
    const firstRow = this.gridApi.getDisplayedRowAtIndex(0);
    firstRow.setDataValue('a', Number(Math.random().toFixed(2)));
    this.gridApi.refreshCells({columns: ['a']});
  }

  getColumnState() {
    console.log(this.columnApi.getColumnState());
    console.log(this.columnApi.getAllColumns());
  }

  getValueColumns() {
    console.log(this.columnApi.getValueColumns());
  }

  /**
   * 获取所有列颜色变更记录
   */
  getAllRecord() {
    console.log(this.ucc.getAllRecord());
  }

  /**
   * 列颜色变更
   */
  pickerClose(color) {
    this.ucc.changeCellColor(color).subscribe(data => console.log(data));
  }

  openPickColor() {
    this.cp.openDialog();
    console.log('!!!!!1');
    console.log(this.cp);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
  }

  ngAfterViewInit(): void {
  }

}
