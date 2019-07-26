import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'ag-span',
  template: `<span>{{value}}</span>`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => AgSpanComponent),
    }
  ]
})
export class AgSpanComponent implements ControlValueAccessor {
  value: any;

  /** view to the model */
  registerOnChange(fn: any): void {
    console.log('registerOnChange');
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

  /** model to view */
  writeValue(value: any): void {
    console.log('writeValue');
    this.value = value;
  }
}
