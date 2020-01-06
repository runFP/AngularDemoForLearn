/**
 * 为ag-grid单元格着色
 */
import {AfterViewInit, Directive, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UpdateColorCellService} from './update-color-cell.service';
import {AgGridAngular} from 'ag-grid-angular';
import {RowNode} from 'ag-grid-community';
import {Observable} from 'rxjs';

@Directive({
  selector: '[updateColorCell]',
  providers: [UpdateColorCellService],
})
export class UpdateColorCellDirective implements AfterViewInit {
  /** 后台标记颜色记录的字段，默认cc*/
  @Input() recordCol = 'cc';

  private gridApi = null;
  /** 临时变量行 */
  private _tmpRow: RowNode;

  /** 列 */
  private col: string;

  /** 所有变更记录 */
  private allRecords: AllRecord = {};

  set row(val) {
    this._tmpRow = this.gridApi.getDisplayedRowAtIndex(val);
  }

  get row() {
    return this._tmpRow;
  }

  /** cellFocused事件参数 */
  params;

  constructor(private grid: AgGridAngular, private uccService: UpdateColorCellService) {
  }

  ngAfterViewInit(): void {
    this.gridApi = this.grid.api;
    this.grid.cellFocused.subscribe(event => {
      if (event.column) {
        this.row = event.rowIndex;
        this.col = event.column.colId;
        this.params = event;
      }
    });
  }

  /**
   * 改变临时选中的单元格背景色
   */
  changeCellColor(color: string = '#ff0000'): Observable<SuccessInf> | Observable<null> {
    return new Observable(subscriber => {
      if (this.row) {
        const record = this.updateCC(color);
        this.gridApi.refreshCells({rowNodes: [this.row], columns: [this.col], force: true});
        this.saveRecord(color);
        subscriber.next({data: this.row.data, col: this.col, record});
        subscriber.complete();
      }
      subscriber.next(null);
      subscriber.error('no Row');
    });
  }

  /**更新对应存储记录
   */
  private updateCC(color: string): { [key: string]: string[] } {
    const oldValue: { [key: string]: string[] } | null | undefined = this.gridApi.getValue(this.recordCol, this.row);
    const newValue = this.uccService.getRecordValue(oldValue, this.col, color);
    this.row.setDataValue(this.recordCol, newValue);
    return newValue;
  }

  private saveRecord(color) {
    if (this.allRecords[color]) {
      this.allRecords[color].push({rowId: this.row.getRowIndexString(), column: this.col});
    } else {
      this.allRecords[color] = [{rowId: this.row.getRowIndexString(), column: this.col}];
    }
  }

  getAllRecord(): {} {
    return this.allRecords;
  }

}

interface AllRecord {
  color?: { rowId: string, column: string }[];
}

interface SuccessInf {
  data: { [key: string]: any };
  col: string;
  record: { [key: string]: string[] };
}
