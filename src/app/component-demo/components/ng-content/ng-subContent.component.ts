import {Component} from '@angular/core';

@Component({
  selector: 'app-sub-conponent',
  template: `
    <h3>below NgContent</h3>
    <ng-content context:innerContentVariables></ng-content>
  `
})
export class NgSubContentComponent {
  innerContentVariables: {} = {name: 'innerName'};

  constructor() {
  }
}
