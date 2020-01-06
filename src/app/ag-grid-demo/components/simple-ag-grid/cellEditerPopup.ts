import {Component} from '@angular/core';
import {formatDate} from '@angular/common';

@Component({
  selector: 'test-cell-edit-popup',
  template: `<nz-date-picker [nzSize]="'small'" nzShowTime [(ngModel)]="date" (ngModelChange)="onChange($event)"></nz-date-picker>`,
  styleUrls: ['cellEditor.component.scss']
})
export class CellEditComponent {
  date: Date;

  onChange(result: Date): void {
    console.log('Selected Time: ', result);
  }

  onOk(result: Date): void {
    console.log('onOk', result);
  }

  agInit(params) {
    this.date = params.value ? new Date(params.value) : new Date();
  }

  isPopup(): boolean {
    return false;
  }

  getValue(): any {
    return this.date ? formatDate(this.date, 'yyyy-MM-dd HH:mm:ss', 'zh-cn') : this.date;
  }
}
