import {Directive, Input, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appUnless]'
})
export class UnlessDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>, // 由于指令带了*号，因此注入了TemplateRef，*号会把模板分解为外嵌模板（ng-template）和内嵌模板(内部元素)
    private viewContainer: ViewContainerRef // 当前上下文的viewContainer，每一个元素都有自己的视图容器，理解这一点非常重要
  ) {
    console.log(this.templateRef);
    const abc = this.templateRef.createEmbeddedView(this);
  }

  @Input() set appUnless(condition: boolean) {
    if (!condition && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef); // createEmbeddedView方法默认插入在容器最后面
      this.hasView = true;
    } else if (condition && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
