import {Component} from '@angular/core';
import {FormArray, AbstractControl} from '@angular/forms';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid-community';

@Component({
  selector: 'ag-form-cell',
  template: `
    <div *ngIf="formGroup" [formGroup]="formGroup">
      <!--<input type="text" [formControlName]="formControlName" [(ngModel)]="value">-->
      <ag-span [formControlName]="formControlName" *ngIf="formControl.valid;else tipsBlock"></ag-span>
      <ng-template #tipsBlock><span class="invalidClass">{{tips}}</span></ng-template>
    </div>`,
  styles: [`
    .invalidClass {
      color: red;
    }
  `],
})
export class AgFormCellComponent implements ICellRendererAngularComp {
  formGroup: FormArray;
  formControlName: number;
  formControl: AbstractControl;
  tips: string;

  agInit(params: ICellRendererParams): void {

    /**
     * 不能在此获取当前行的formGroup，
     * 因为agInit比gridReady事件先行
     * 这时formGroup还没创建出来
     * 因此跟formGroup有关操作要放在refresh事件执行
     */

    // this.formGroup = params.context.controls[params.rowIndex]; // error, formGroup is undefined
    this.formGroup = params.context.agFormGroup.controls[params.rowIndex];

    /**
     * ag-Grid有虚拟dom技术，当滚动条滚动到范围内会触发agInit方法，而不会触发refresh方法
     * 因此，需要在这里再一次赋值，触发渲染。
     * */
    this.formControlName = params.columnApi.getAllColumns().indexOf(params.column);
    if (this.formGroup) {
      this.formControl = this.formGroup.at(this.formControlName);
      this.formControl.patchValue(params.value);
    }
  }

  refresh(params: any): boolean {

    /** 获取当前行的formGroup*/
    this.formGroup = params.context.agFormGroup.controls[params.rowIndex];
    this.tips = params.context.validatedRule[params.column.colId] && params.context.validatedRule[params.column.colId].tips;
    /**
     * 这里用以激活控件访问器的registerOnChange和writeValue事件
     * 以及值变更的订阅事件更改form的整体校验值，不能直接触发，否则就变子组件修改父组件的值了，会报错
     * */
    this.formControl = this.formGroup.at(this.formControlName);
    this.formControl.patchValue(params.value);

    return true;
  }

}
