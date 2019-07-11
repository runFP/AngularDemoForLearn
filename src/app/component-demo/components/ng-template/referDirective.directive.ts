import {Directive} from '@angular/core';

@Directive({
  selector: '[testReferTemplateAsDirective]',
  exportAs: 'directiveVariable' // 指令作为分配给模板引用变量的名称
})
export class ReferTemplateVariableDirective {
  accessedDirectiveProperty = 'I\' be accessed in directive';
}
