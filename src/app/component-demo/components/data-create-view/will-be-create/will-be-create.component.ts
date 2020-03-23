import {Component, ComponentRef, ElementRef, HostBinding, Input, Renderer2, ViewContainerRef, ViewRef} from '@angular/core';
import {getPosition} from '../../../../share/directives/react-dnd/dnd-utils';
import {ReactDndDirective} from '../../../../share/directives/react-dnd/react-dnd.directive';

@Component({
  selector: 'app-will-be-create',
  templateUrl: './will-be-create.component.html',
  styleUrls: ['./will-be-create.component.scss']
})
export class WillBeCreateComponent {
  /**
   * 配置数据，组件内部需要使用的
   */
  @Input() options: any;
  /**
   * 组件名，根据该名字查找NameMapComponent映射的组件
   */
  @Input() name = 'componentName';
  /**
   * 指标名，标识该组件对应的指标
   */
  @Input() form = '';

  @Input() cmpRef: ComponentRef<any>;

  @HostBinding('style.transform')
  transform: string;

  delBtn: HTMLElement | null;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) {
  }

  /**
   * 获取视图转数据信息
   * @return {{name: string; form: string; transform: {x: number; y: number}}}
   */
  getView2DataInf() {
    return {
      name: this.name,
      form: this.form,
      transform: getPosition(this.elementRef.nativeElement),
    };
  }

  /**
   * 添加删除按钮并绑定删除逻辑
   * @param {ViewContainerRef} viewContainerRef
   * @param {ReactDndDirective} dnd
   */
  addDelBtn(viewContainerRef: ViewContainerRef, dnd: ReactDndDirective): void {
    this.delBtn = this.renderer.createElement('a');
    const aText = this.renderer.createText('删除');

    /**
     * 删除按钮逻辑
     */
    this.renderer.listen(this.delBtn, 'click', e => {
      const index = viewContainerRef.indexOf(this.cmpRef.hostView);
      viewContainerRef.remove(index);
      dnd.removeElement(this.cmpRef.location.nativeElement);
    });

    this.renderer.appendChild(this.delBtn, aText);
    this.renderer.appendChild(this.elementRef.nativeElement, this.delBtn);
  }

  /**
   * 移除删除按钮
   */
  removeDelBtn(): void {
    if (this.delBtn) {
      this.delBtn.remove();
    }
  }

}
