import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';
import {FocusableOption, FocusOrigin} from '@angular/cdk/a11y';

@Directive({
  selector: '[colorCell]'
})
export class ColorCellDirective implements FocusableOption {
  @Input('colorCell') color = null;

  constructor(private elementRef: ElementRef) {
  }

  focus(origin?: FocusOrigin): void {
    this.elementRef.nativeElement.focus();
  }

}
