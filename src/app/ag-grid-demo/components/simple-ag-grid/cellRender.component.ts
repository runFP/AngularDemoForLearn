import {Component} from '@angular/core';
import {ICellRendererParams} from 'ag-grid';
import {ICellRendererAngularComp} from 'ag-grid-angular';


@Component({
  selector: 'test-cell-renderer',
  template: `
    <span [style.color]="color" *ngIf="show; else elseBlock">{{value}}-{{text()}}</span>
    <ng-template #elseBlock><span>hahahahahahah</span></ng-template>
  `
})
export class CellRenderComponent implements ICellRendererAngularComp {
  value;
  color;
  _text;
  show: boolean = false;


  agInit(params: any) {
    console.log('agInit');
    this.value = params.value;
    this._text = 'hahaha';
    this.color = params.color;
  }

  refresh(params: ICellRendererParams) {
    this.color = 'blue';
    this._text = 'lalala';
    this.show = true;
    return true; /** 只有返回true才会触发模板重新渲染，false只会单纯替换值*/
  }

  public text(): string {
    return this._text;
  }
}
