import {Component, forwardRef} from '@angular/core';
import {ControlValueAccessor, FormArray, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-form-cell',
  template: `
    <div *ngIf="formGroup" [formGroup]="formGroup">
      <mat-form-field [floatLabel]="'never'" style="width: 100%">
      <input matInput [formControlName]="key" [id]="key" placeholder="Enter {{columnName}}">
      </mat-form-field>
      <!--<app-text-span [formControlName]="key" [id]="key" [value]="value"></app-text-span>-->
    </div>
  `,
})
export class FormCellComponent implements ControlValueAccessor {
  private _value;
  formGroup: FormArray;
  key;
  columnName: string;
  private rowId: number;
  onChange;
  onTouched;

  set value(val) {
    this._value = val;
  }

  get value() {
    return this._value;
  }

  agInit(params: any) {
    console.log(params);
    this.columnName = params.column.colDef.headerName;
    this.key = params.context.createKey(params.columnApi, params.column);
    this.value = params.value;
    this.rowId = params.node.id;
  }

  refresh(params: any): boolean {
    this.formGroup = params.context.formGroup.controls[this.rowId];

    // this could also be done in GridComponent.createFormControls, but the cell component could be doing something with
    // the value, so it feels more natural that the control value be set here
    this.formGroup.at(this.key).patchValue(this.value);
    return true;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(value: any): void {
    if (value) {
      this.value = value;
    }
  }
}
