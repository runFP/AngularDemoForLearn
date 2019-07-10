import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-text-span',
  template: `<span>{{value}}</span>`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TextSpanComponent),
    }
  ]
})
export class TextSpanComponent implements ControlValueAccessor {
  @Input()
  value: any;

  registerOnChange(fn: any): void {
    console.log(fn);
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(value: any): void {
    this.value = value;
  }

}
