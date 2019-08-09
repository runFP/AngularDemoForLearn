import {Component, OnInit} from '@angular/core';
import {GridOptions} from 'ag-grid';

@Component({
  selector: 'app-lift-cycle-hook',
  templateUrl: './lift-cycle-hook.component.html',
  styleUrls: ['./lift-cycle-hook.component.scss']
})
export class LiftCycleHookComponent implements OnInit {
  // gridOptions: GridOptions;
  gridOptions: any;

  constructor() {
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
      onCellFocused: (event) => {
        console.log('onCellFocused');
        console.log(event);
      },
      onCellMouseOver: (event) => {
        console.log('onCellMouseOver');
        console.log(event);
      },
      onCellMouseOut: (event) => {
        console.log('onCellMouseOut');
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
