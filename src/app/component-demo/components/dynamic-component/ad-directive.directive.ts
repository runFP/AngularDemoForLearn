import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appHost]',
})
export class AdDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
