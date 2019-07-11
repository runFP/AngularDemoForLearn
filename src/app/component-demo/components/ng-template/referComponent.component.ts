import {Component} from '@angular/core';

@Component({
  selector: 'test-refer-template',
  template: '<div>templateRef to component</div>',
})
export class ReferTemplateVariableComponent {
  accessedProperty = 'I\' be accessed';
}
