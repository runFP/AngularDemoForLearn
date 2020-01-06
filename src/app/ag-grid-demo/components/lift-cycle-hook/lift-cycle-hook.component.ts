import {Component, OnInit, ViewChild} from '@angular/core';
import {UpdateColorCellDirective} from './update-color-cell/update-color-cell.directive';

const LEVEL = ['A', 'B', 'C', 'D', 'S'];

@Component({
  selector: 'app-lift-cycle-hook',
  templateUrl: './lift-cycle-hook.component.html',
  styleUrls: ['./lift-cycle-hook.component.scss']
})
export class LiftCycleHookComponent implements OnInit {
  @ViewChild(UpdateColorCellDirective, {static: false}) ucc;

  gridOptions: any;

  gridApi;

  color = '#fff';

  columnDefs: any[] = [
    {field: 'name', headerName: 'Name', resizable: true, width: 50},
    {
      field: 'age', headerName: 'Age',
    },
    {field: 'sex', headerName: 'Sex'},
    {field: 'class', headerName: 'Class'},
    {field: 'a', headerName: 'A'},
    {field: 'b', headerName: 'B'},
    {field: 'c', headerName: 'C'},
    {field: 'd', headerName: 'd'},
    {field: 's', headerName: 'S'},
  ];

  defaultColDef = {
    tooltip: param => param.value,
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

  rowData: any[] = [
    {
      name: 'xiaoming',
      age: 1,
      sex: 'nan',
      a: LEVEL[Math.floor(Math.random() * 6)],
      b: LEVEL[Math.floor(Math.random() * 6)],
      c: LEVEL[Math.floor(Math.random() * 6)],
      d: LEVEL[Math.floor(Math.random() * 6)],
      s: LEVEL[Math.floor(Math.random() * 6)],
      cc: {'#ff0000': ['a', 'c']},
    },
    {
      name: 'xiaoming',
      age: 2,
      sex: 'nan',
      a: LEVEL[Math.floor(Math.random() * 6)],
      b: LEVEL[Math.floor(Math.random() * 6)],
      c: LEVEL[Math.floor(Math.random() * 6)],
      d: LEVEL[Math.floor(Math.random() * 6)],
      s: LEVEL[Math.floor(Math.random() * 6)],
      cc: {'#ffff00': ['b', 'c'], '#ff0000': ['sex', 'age']},
    },
    {
      name: 'xiaoming',
      age: 3,
      sex: 'nan',
      a: LEVEL[Math.floor(Math.random() * 6)],
      b: LEVEL[Math.floor(Math.random() * 6)],
      c: LEVEL[Math.floor(Math.random() * 6)],
      d: LEVEL[Math.floor(Math.random() * 6)],
      s: LEVEL[Math.floor(Math.random() * 6)],
      cc: null,
    },
    {
      name: 'xiaoming',
      age: 4,
      sex: 'nan',
      a: LEVEL[Math.floor(Math.random() * 6)],
      b: LEVEL[Math.floor(Math.random() * 6)],
      c: LEVEL[Math.floor(Math.random() * 6)],
      d: LEVEL[Math.floor(Math.random() * 6)],
      s: LEVEL[Math.floor(Math.random() * 6)],
      cc: null,
    },
    {
      name: 'xiaoming',
      age: 5,
      sex: 'nan',
      a: LEVEL[Math.floor(Math.random() * 6)],
      b: LEVEL[Math.floor(Math.random() * 6)],
      c: LEVEL[Math.floor(Math.random() * 6)],
      d: LEVEL[Math.floor(Math.random() * 6)],
      s: LEVEL[Math.floor(Math.random() * 6)],
      cc: null,
    },
    {
      name: 'xiaoming',
      age: 6,
      sex: 'nan',
      a: LEVEL[Math.floor(Math.random() * 6)],
      b: LEVEL[Math.floor(Math.random() * 6)],
      c: LEVEL[Math.floor(Math.random() * 6)],
      d: LEVEL[Math.floor(Math.random() * 6)],
      s: LEVEL[Math.floor(Math.random() * 6)],
      cc: null,
    },
    {
      name: 'xiaoming',
      age: 7,
      sex: 'nan',
      a: LEVEL[Math.floor(Math.random() * 6)],
      b: LEVEL[Math.floor(Math.random() * 6)],
      c: LEVEL[Math.floor(Math.random() * 6)],
      d: LEVEL[Math.floor(Math.random() * 6)],
      s: LEVEL[Math.floor(Math.random() * 6)],
      cc: null,
    },
    {
      name: 'xiaoming',
      age: 8,
      sex: 'nan',
      a: LEVEL[Math.floor(Math.random() * 6)],
      b: LEVEL[Math.floor(Math.random() * 6)],
      c: LEVEL[Math.floor(Math.random() * 6)],
      d: LEVEL[Math.floor(Math.random() * 6)],
      s: LEVEL[Math.floor(Math.random() * 6)],
      cc: null,
    },
    {
      name: 'xiaoming',
      age: 9,
      sex: 'nan',
      a: LEVEL[Math.floor(Math.random() * 6)],
      b: LEVEL[Math.floor(Math.random() * 6)],
      c: LEVEL[Math.floor(Math.random() * 6)],
      d: LEVEL[Math.floor(Math.random() * 6)],
      s: LEVEL[Math.floor(Math.random() * 6)],
      cc: null,
    },
    {
      name: 'xiaoming',
      age: 10,
      sex: 'nan',
      a: LEVEL[Math.floor(Math.random() * 6)],
      b: LEVEL[Math.floor(Math.random() * 6)],
      c: LEVEL[Math.floor(Math.random() * 6)],
      d: LEVEL[Math.floor(Math.random() * 6)],
      s: LEVEL[Math.floor(Math.random() * 6)],
      cc: null,
    },
    {
      name: 'xiaoming',
      age: 11,
      sex: 'nan',
      a: LEVEL[Math.floor(Math.random() * 6)],
      b: LEVEL[Math.floor(Math.random() * 6)],
      c: LEVEL[Math.floor(Math.random() * 6)],
      d: LEVEL[Math.floor(Math.random() * 6)],
      s: LEVEL[Math.floor(Math.random() * 6)],
      cc: null,
    },
    {
      name: 'xiaoming',
      age: 12,
      sex: 'nan',
      a: LEVEL[Math.floor(Math.random() * 6)],
      b: LEVEL[Math.floor(Math.random() * 6)],
      c: LEVEL[Math.floor(Math.random() * 6)],
      d: LEVEL[Math.floor(Math.random() * 6)],
      s: LEVEL[Math.floor(Math.random() * 6)],
      cc: null,
    },
    {
      name: 'xiaoming',
      age: 13,
      sex: 'nan',
      a: LEVEL[Math.floor(Math.random() * 6)],
      b: LEVEL[Math.floor(Math.random() * 6)],
      c: LEVEL[Math.floor(Math.random() * 6)],
      d: LEVEL[Math.floor(Math.random() * 6)],
      s: LEVEL[Math.floor(Math.random() * 6)],
      cc: null,
    },

  ];

  constructor() {
    console.log('lch constructor');
  }

  /**
   * 当列内容宽度小于列宽度时，动态设置columnDefs 添加tooltipFile属性，但会有性能问题
   * 因为api.setColumnDefs会重绘表格，一般不建议使用
   * */
  originColumnDefs = {index: null, colDef: null, columnState: null};

  /** 添加内容提示（tooltip） */
  autoSetTooltip(event) {
    const node = event.event.path[0];
    const cloneNode = node.cloneNode(true);
    cloneNode.style.width = 'auto';
    event.api.gridPanel.getCenterContainer().appendChild(cloneNode);
    const cloneNodeWidth = cloneNode.offsetWidth;
    const actualWidth = event.column.actualWidth;
    cloneNode.remove();

    if ((cloneNodeWidth > actualWidth) && !('tooltipField' in event.colDef)) {
      this.setColDefs(event);
    }
  }

  /** 设置grid的columnDefs */
  setColDefs(event) {
    const columnDefs = event.api.columnController.columnDefs;
    const field = event.colDef.field;
    const colDefIndex = columnDefs.findIndex(c => c.field === field);
    if (colDefIndex !== -1) {
      const coldef = columnDefs[colDefIndex];
      this.originColumnDefs.index = colDefIndex;
      this.originColumnDefs.colDef = Object.assign({}, coldef);
      this.originColumnDefs.columnState = event.columnApi.getColumnState();
      coldef.tooltipField = field;
      event.api.setColumnDefs(columnDefs);
    }
  }

  /** 删除内容提示(tooltip) */
  recoveColDefs(event) {
    if (this.originColumnDefs.index !== null) {
      const columnDefs = event.api.columnController.columnDefs;
      const index = this.originColumnDefs.index;
      const columnState = this.originColumnDefs.columnState;
      columnDefs[index] = this.originColumnDefs.colDef;
      event.api.setColumnDefs([]);
      event.api.setColumnDefs(columnDefs);
      event.columnApi.setColumnState(columnState);
      this.originColumnDefs = {index: null, colDef: null, columnState: null};
    }
  }

  ngOnInit() {
    this.gridOptions = {
      /** Selection */
      onCellClicked: (event) => {
        console.log('onCellClicked');
        console.log(event);
      },
      onCellDoubleClicked: (event) => {
        console.log('onCellDoubleClicked');
        console.log(event);
      },
      // onCellFocused: (event) => {
      //   console.log('onCellFocused');
      //   console.log(event);
      // },
      onCellMouseOver: (event) => {
        console.log('onCellMouseOver');
        /** 表格内容宽度小于列宽度时添加内容提示 */
        // this.autoSetTooltip(event);
        console.log(event);
      },
      onCellMouseOut: (event) => {
        console.log('onCellMouseOut');
        // this.recoveColDefs(event);
        console.log(event);
      },
      onCellMouseDown: (event) => {
        console.log('onCellMouseDown');
        console.log(event);
      },
      onRowClicked: (event) => {
        console.log('onRowClicked');
        console.log(event);
      },
      onRowDoubleClicked: (event) => {
        console.log('onRowDoubleClicked');
        console.log(event);
      },
      onRowSelected: (event) => {
        console.log('onRowSelected');
        console.log(event);
      },
      onSelectionChanged: (event) => {
        console.log('onSelectionChanged');
        console.log(event);
      },
      onCellContextMenu: (event) => {
        console.log('onCellContextMenu');
        console.log(event);
      },
      onRangeSelectionChanged: (event) => {
        console.log('onRangeSelectionChanged');
        console.log(event);
      },

      /** Editing */

      onCellValueChanged: (event) => {
        console.log('onCellValueChanged');
        console.log(event);
      },
      onRowValueChanged: (event) => {
        console.log('onRowValueChanged');
        console.log(event);
      },
      onCellEditingStarted: (event) => {
        console.log('onCellEditingStarted');
        console.log(event);
      },
      onCellEditingStopped: (event) => {
        console.log('onCellEditingStopped');
        console.log(event);
      },
      onRowEditingStarted: (event) => {
        console.log('onRowEditingStarted');
        console.log(event);
      },
      onRowEditingStopped: (event) => {
        console.log('onRowEditingStopped');
        console.log(event);
      },
      onPasteStart: (event) => {
        console.log('onPasteStart');
        console.log(event);
      },
      onPasteEnd: (event) => {
        console.log('onPasteEnd');
        console.log(event);
      },

      /** Sort & Filter */

      onSortChanged: (event) => {
        console.log('onSortChanged');
        console.log(event);
      },
      onFilterChanged: (event) => {
        console.log('onFilterChanged');
        console.log(event);
      },
      onFilterModified: (event) => {
        console.log('onFilterModified');
        console.log(event);
      },

      /** Row Drag & Drop */

      onRowDragEnter: (event) => {
        console.log('onRowDragEnter');
        console.log(event);
      },
      onRowDragMove: (event) => {
        console.log('onRowDragMove');
        console.log(event);
      },
      onRowDragLeave: (event) => {
        console.log('onRowDragLeave');
        console.log(event);
      },
      onRowDragEnd: (event) => {
        console.log('onRowDragEnd');
        console.log(event);
      },

      /** Columns */

      onColumnVisible: (event) => {
        console.log('onColumnVisible');
        console.log(event);
      },
      onColumnPinned: (event) => {
        console.log('onColumnPinned');
        console.log(event);
      },
      onColumnResized: (event) => {
        console.log('onColumnResized');
        console.log(event);
      },
      onColumnMoved: (event) => {
        console.log('onColumnMoved');
        console.log(event);
      },
      onColumnRowGroupChanged: (event) => {
        console.log('onColumnRowGroupChanged');
        console.log(event);
      },
      onColumnValueChanged: (event) => {
        console.log('onColumnValueChanged');
        console.log(event);
      },
      onColumnPivotModeChanged: (event) => {
        console.log('onColumnPivotModeChanged');
        console.log(event);
      },
      onColumnPivotChanged: (event) => {
        console.log('onColumnPivotChanged');
        console.log(event);
      },
      onColumnGroupOpened: (event) => {
        console.log('onColumnGroupOpened');
        console.log(event);
      },
      onNewColumnsLoaded: (event) => {
        console.log('onNewColumnsLoaded');
        console.log(event);
      },
      onGridColumnsChanged: (event) => {
        console.log('onGridColumnsChanged');
        console.log(event);
      },
      onDisplayedColumnsChanged: (event) => {
        console.log('onDisplayedColumnsChanged');
        console.log(event);
      },
      onVirtualColumnsChanged: (event) => {
        console.log('onVirtualColumnsChanged');
        console.log(event);
      },
      onColumnEverythingChanged: (event) => {
        console.log('onColumnEverythingChanged');
        console.log(event);
      },

      /** Miscellaneous */

      onGridReady: (event) => {
        console.log('onGridReady');
        console.log(event);
        this.gridApi = event.api;
      },
      onGridSizeChanged: (event) => {
        console.log('onGridSizeChanged');
        console.log(event);
      },
      onModelUpdated: (event) => {
        console.log('onModelUpdated');
        console.log(event);
      },
      onFirstDataRendered: (event) => {
        console.log('onFirstDataRendered');
        console.log(event);
      },
      onRowGroupOpened: (event) => {
        console.log('onRowGroupOpened');
        console.log(event);
      },
      onExpandOrCollapseAll: (event) => {
        console.log('onExpandOrCollapseAll');
        console.log(event);
      },
      onPaginationChanged: (event) => {
        console.log('onPaginationChanged');
        console.log(event);
      },
      onPinnedRowDataChanged: (event) => {
        console.log('onPinnedRowDataChanged');
        console.log(event);
      },
      onVirtualRowRemoved: (event) => {
        console.log('onVirtualRowRemoved');
        console.log(event);
      },
      onViewportChanged: (event) => {
        console.log('onViewportChanged');
        console.log(event);
      },
      onBodyScroll: (event) => {
        console.log('onBodyScroll');
        console.log(event);
      },
      onDragStarted: (event) => {
        console.log('onDragStarted');
        console.log(event);
      },
      onDragStopped: (event) => {
        console.log('onDragStopped');
        console.log(event);
      },
      onRowDataChanged: (event) => {
        console.log('onRowDataChanged');
        console.log(event);
      },
      onRowDataUpdated: (event) => {
        console.log('onRowDataUpdated');
        console.log(event);
      },
      onToolPanelVisibleChanged: (event) => {
        console.log('onToolPanelVisibleChanged');
        console.log(event);
      },
      onComponentStateChanged: (event) => {
        console.log('onComponentStateChanged');
        console.log(event);
      },
      onAnimationQueueEmpty: (event) => {
        console.log('onAnimationQueueEmpty');
        console.log(event);
      },
      onCellKeyDown: (event) => {
        console.log('onCellKeyDown');
        console.log(event);
      },
      onCellKeyPress: (event) => {
        console.log('onCellKeyPress');
        console.log(event);
      },
    };
  }

}
