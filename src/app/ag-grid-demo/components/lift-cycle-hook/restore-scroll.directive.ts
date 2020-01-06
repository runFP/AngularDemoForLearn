/**
 * 切回页面时恢复g-grid上一次的滚动条位置
 */
import {AfterViewInit, Directive, Input, OnInit} from '@angular/core';
import {AgGridAngular} from 'ag-grid-angular';
import {debounceTime} from 'rxjs/internal/operators';

@Directive({
  selector: '[restoreScroll]'
})
export class RestoreScrollDirective implements AfterViewInit {
  @Input() restoreScroll = null;

  constructor(private grid: AgGridAngular) {
  }

  ngAfterViewInit(): void {
    this.grid.gridSizeChanged.subscribe(p => {
      if (p.clientHeight !== 0) {
        const scrollRecord = JSON.parse(localStorage.getItem(this.restoreScroll));
        if (scrollRecord) {
          const record = scrollRecord;
          this.grid.api.ensureIndexVisible(+record.index, 'top');
        }
      }
    });
    this.grid.bodyScroll.pipe(debounceTime(300)).subscribe(scroll => {
      const st = scroll.top;
      if (st <= 0) {
        localStorage.setItem(this.restoreScroll, null);
      } else {
        scroll.api.forEachNode(r => {
          const t = r.rowTop;
          const h = r.rowHeight;
          if (st > t && t + h > st) {
            localStorage.setItem(this.restoreScroll, JSON.stringify({ top: st, index: r.getRowIndexString() }));
          }
        });
      }
    });
  }
}
