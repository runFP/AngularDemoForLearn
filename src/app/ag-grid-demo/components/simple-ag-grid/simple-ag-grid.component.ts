import {Component, OnInit, ViewChild} from '@angular/core';
import {AgGridAngular} from 'ag-grid-angular';

import {ClientSideRowModel, FilterChangedEvent, FilterModifiedEvent, GridOptions, RowNode, SortChangedEvent} from 'ag-grid';

interface ObjectType {
  [key: string]: any;
}

@Component({
  selector: 'app-simple-ag-grid',
  templateUrl: './simple-ag-grid.component.html',
  styleUrls: ['./simple-ag-grid.component.scss']
})
export class SimpleAgGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;

  private gridApi;

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
    {headerName: 'Model', field: 'model', filter: true}, // 过滤
    {headerName: 'Price', field: 'price', checkboxSelection: true},
    {headerName: 'A', field: 'a'},
    {headerName: 'B', field: 'b'},
    {headerName: 'C', field: 'c'},
  ];


  /*  autoGroupColumnDef = {
      headerName: 'Make',
      field: 'make',
      cellRenderer: 'agGroupCellRenderer',
      cellRendererParams: {
        checkbox: true
      }
    };*/


  // 数据1
  rowData: any[] = [
    {make: 'Toyota', model: 'Celica', price: 35000, a: 'aa', b: 'bb', c: 'cc'},
    {make: 'Ford', model: 'Mondeo', price: 32000, a: 'aaa', b: 'bbb', c: 'ccc'},
    {make: 'Porsche1', model: 'Boxter', price: 72000, a: 'aaaa', b: 'bbbb', c: 'cccc'},
    {make: 'Porsche2', model: 'Boxter', price: 72000, a: 'aaaa', b: 'bbbb', c: 'cccc'},
    {make: 'Porsche3', model: 'Boxter', price: 72000, a: 'aaaa', b: 'bbbb', c: 'cccc'},
    {make: 'Porsche4', model: 'Boxter', price: 72000, a: 'aaaa', b: 'bbbb', c: 'cccc'},
    {make: 'Porsche5', model: 'Boxter', price: 72000, a: 'aaaa', b: 'bbbb', c: 'cccc'},
    {make: 'Porsche6', model: 'Boxter', price: 72000, a: 'aaaa', b: 'bbbb', c: 'cccc'},
    {make: 'Porsche7', model: 'Boxter', price: 72000, a: 'aaaa', b: 'bbbb', c: 'cccc'},
    {make: 'Porsche8', model: 'Boxter', price: 72000, a: 'aaaa', b: 'bbbb', c: 'cccc'},
    {make: 'Porsche9', model: 'Boxter', price: 72000, a: 'aaaa', b: 'bbbb', c: 'cccc'},
  ];

  // 数据2
  rowData2: any[] = [
    {make: 'Toyota2', model: 'Celica', price: 35000, a: 'aa', b: 'bb', c: 'cc'},
    {make: 'Ford2', model: 'Mondeo', price: 32000, a: 'aaa', b: 'bbb', c: 'ccc'},
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
    // 过滤排序事件
    onFilterModified: (event: FilterModifiedEvent) => {   // 在onFilterChanged之前执行
      console.log('*************************************');
      console.log('在onFilterChanged之前执行');
      console.log('onFilterModified');
      console.log(event);
      console.log('*************************************');
    },
    onFilterChanged: (event: FilterChangedEvent) => {
      console.log('*************************************');
      console.log('onFilterChanged');
      const rows = (<ClientSideRowModel>event.api.getModel()).getRootNode().childrenAfterFilter;
      let pinnedTopRowData;
      if (!event.api.isAnyFilterPresent()) {
        pinnedTopRowData = this.getPinnedTopRowData(123);
      } else {
        pinnedTopRowData = this.getPinnedTopRowData(rows);
      }
      this.gridApi.setPinnedTopRowData(pinnedTopRowData);
      console.log('*************************************');
    },
    onSortChanged: (event: SortChangedEvent) => {
      console.log('*************************************');
      console.log('onSortChanged');
      console.log(event);
      console.log('*************************************');
    },
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


  constructor() {
  }

  ngOnInit() {
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

  /**
   * 设置冻结行
   */
  setPinnedRow() {
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

}
