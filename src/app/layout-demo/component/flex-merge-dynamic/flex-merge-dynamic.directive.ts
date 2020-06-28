import {ComponentFactoryResolver, ComponentRef, Directive, ElementRef, HostBinding, ViewChild, ViewContainerRef} from '@angular/core';
import {FlexMergeDynamicService} from './flex-merge-dynamic.service';
import {TreeManagerService, TreeNode} from './tree-manager.service';
import {SelectedRangeComponent} from './selected-range/selected-range.component';

@Directive({
  selector: '[flexMergeDynamic]',
  providers: [FlexMergeDynamicService, TreeManagerService],
})
export class FlexMergeDynamicDirective {
  vcr: ViewContainerRef;
  tree: TreeNode;

  private oldPosition: Point;
  /** 当前元素的相对屏幕的位置 */
  private boundingClientRect: DOMRect;
  /** 鼠标按下的坐标 */
  private downPosition: Point;

  /** 选择框元素 */
  private selectedRangeRef: ComponentRef<SelectedRangeComponent>;
  /** 选中的节点 */
  private selectNodes: TreeNode[] = [];

  /** 开始鼠标拖动合并事件 */
  private _isDrag = false;


  private _downHandler = this._mouseDown.bind(this);
  private _moveHandler = this._mouseMove.bind(this);
  private _upHandler = this._mouseUp.bind(this);

  constructor(
    private el: ElementRef,
    private resolve: ComponentFactoryResolver,
    private FMDService: FlexMergeDynamicService,
  ) {
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.boundingClientRect = this.el.nativeElement.getBoundingClientRect());
    this._dragHandle();
  }

  /**
   * 绑定鼠标事件
   */
  private _dragHandle(): void {
    this.el.nativeElement.addEventListener('mousedown', this._downHandler);
    this.el.nativeElement.addEventListener('mousemove', this._moveHandler);
    this.el.nativeElement.addEventListener('mouseup', this._upHandler);
  }

  private _removeDragHandle(): void {
    this.el.nativeElement.removeEventListener('mousedown', this._downHandler);
    this.el.nativeElement.removeEventListener('mousemove', this._moveHandler);
    this.el.nativeElement.removeEventListener('mouseup', this._upHandler);
  }

  setVcr(vcr: ViewContainerRef): void {
    this.vcr = vcr;
  }

  create(row: number, col: number): void {
    this.tree = this.FMDService.create(row, col, this.vcr, this.boundingClientRect);

    // this.container.createComponent()
  }

  showTreeNode() {
    this.tree.traverseNLR((node: TreeNode) => {
      console.log(node.nodeRef.instance.getDomRect && node.nodeRef.instance.getDomRect());
    });
  }

  private _mouseDown(event: MouseEvent): void {
    event.preventDefault();

    this.oldPosition = {x: event.x - this.boundingClientRect.left, y: event.y - this.boundingClientRect.top};
    this.downPosition = this.oldPosition;

    this._isDrag = true;

    const selectRangeFactory = this.resolve.resolveComponentFactory(SelectedRangeComponent);
    this.selectedRangeRef = this.vcr.createComponent(selectRangeFactory);
    this.selectedRangeRef.instance.updatePosition(this.downPosition);
  }

  private _mouseMove(event: MouseEvent): void {
    if (!this._isDrag) {
      return;
    }

    const newPosition = {x: event.x - this.boundingClientRect.left, y: event.y - this.boundingClientRect.top};
    const distance = {x: newPosition.x - this.oldPosition.x, y: newPosition.y - this.oldPosition.y};
    /**
     * 当前鼠标相对起始坐标的位置
     * 1：右，下
     * -1:左，上
     */
    const delta = {x: event.x > this.downPosition.x ? 1 : -1, y: event.y > this.downPosition.y ? 1 : -1};
    /**
     * 更新选择框尺寸
     */
    this.selectedRangeRef.instance.updateSize({x: this.downPosition.x, y: this.downPosition.y}, newPosition);

    /**
     * 获取选择框范围的单元格
     */
    const selectRangBoundaryPoint = this.selectedRangeRef.instance.getBoundaryPoint({
      x: this.downPosition.x,
      y: this.downPosition.y
    }, newPosition, delta);

    this.FMDService.removeSelectStatus(this.selectNodes);
    this.selectNodes = this.FMDService.getSelectTreeNode(selectRangBoundaryPoint);
    this.FMDService.getSelectTreeNodePosition(selectRangBoundaryPoint);
    this.FMDService.setSelectStatus(this.selectNodes, '#eaeaea');

    this.oldPosition = newPosition;
  }

  private _mouseUp(event: MouseEvent): void {
    if (!this._isDrag) {
      return;
    }

    this._isDrag = false;

    /**
     * 删除选择范围
     */
    const index = this.vcr.indexOf(this.selectedRangeRef.hostView);
    if (~index) {
      this.vcr.remove(index);
    }

    this.FMDService.removeSelectStatus(this.selectNodes);

    /**
     * 合并操作
     */
    this.FMDService.merger(this.selectNodes);
  }

}

export interface Point {
  x: number;
  y: number;
}
