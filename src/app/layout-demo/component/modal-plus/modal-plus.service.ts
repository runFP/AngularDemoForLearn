import {ComponentRef, ElementRef, Injectable, Injector, OnInit, Optional, Renderer2, RendererFactory2} from '@angular/core';
import {Overlay, OverlayPositionBuilder, OverlayRef} from '@angular/cdk/overlay';
import {PORTAL_DATA} from './portal-data';
import {ComponentPortal} from '@angular/cdk/portal';
import {RESIZE_TYPE} from './resize-type';
import {DragRef} from '@angular/cdk/drag-drop';

// 鼠标离边缘位置多少时可以调整
const offsetDistance = 5;

@Injectable()
export class ModalPlusService {
  /** 管理弹框，防止重复打开相同弹框功能*/
  modalPlusContainer: ModalPlusRef[] = []; // 弹框容器，弹框当前弹框数量
  targetMapId = new Map();
  renderer;

  /** 管理可以变更尺寸元素 */
  isActiveMouseListener = false;
  resizeElementContainer: ResizeElementInf[] = [];  // 重设尺寸元素容器
  activeResizeInf: { isMatchResizeType: boolean, isActiveResize: boolean, activeItem: ResizeElementInf } = {
    isMatchResizeType: false, // 是否已有元素匹配了重调尺寸类型
    isActiveResize: false, // 是否已有元素处于重调尺寸中
    activeItem: null,
  };
  private _downHandler = this._mouseDown.bind(this);
  private _moveHandler = this._mouseMove.bind(this);
  private _upHandler = this._mouseUp.bind(this);
  mouseInfo = {
    oldPosition: {x: null, y: null},
    newPosition: {x: null, y: null},
    movement: {x: null, y: null},
  };

  constructor(
    private overlay: Overlay,
    private rendererFactory: RendererFactory2,
    private overlayPositionBuilder: OverlayPositionBuilder,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  /**
   * 打开弹框
   * @param component
   * @param data 传递到弹框参数
   * @param target 通过触发事件的target来判断弹框是否唯一（打开的弹框如果已经存在，不会重复创建,可以是点击的按钮，也可以是一行数据的id等等,要能唯一标识的值）
   */
  open(component, data?: { [key: string]: any }, target?: any) {
    const id = this._getId();
    if (target && this.targetMapId.has(target)) {
      return;
    } else if (target && !this.targetMapId.has(target)) {
      this.targetMapId.set(target, id);
    }

    const global = this.overlayPositionBuilder.global().centerHorizontally().centerVertically();
    const overlayRef = this.overlay.create({positionStrategy: global});
    const injector = this._createInjector(id, data);
    const flexibleModal = new ComponentPortal(component, null, injector);
    const componentRef: ComponentRef<any> = overlayRef.attach(flexibleModal);
    this._open(id, overlayRef, componentRef, target);
  }

  /**
   * 弹框唯一标识
   * @private
   */
  private _getId(): string {
    return (+new Date()).toString(16); // 弹框唯一标识
  }


  private _createInjector(id, data): Injector {
    const value = {
      close: () => {
        this._close(id);
      },
      ...data,
    };
    return Injector.create([{provide: PORTAL_DATA, useValue: value}]);
  }

  /**
   * 将弹框保存在弹框容器中
   * @param id
   * @param overlayRef
   * @param componentRef
   * @param target
   * @private
   */
  private _open(id, overlayRef: OverlayRef, componentRef: ComponentRef<any>, target = null) {
    this.modalPlusContainer.push({id, overlayRef, componentRef, target});
  }

  /**
   * 删除保存在弹框容器内对应的弹框
   * @private
   */
  private _close(id) {
    let modalIndex = -1;
    const modalItem = this.modalPlusContainer.find((modal, index) => {
      if (modal.id === id) {
        modalIndex = index;
        return true;
      }
    });
    if (modalItem) {
      if (modalItem.target) {
        if (this.targetMapId.has(modalItem.target)) {
          this.targetMapId.delete(modalItem.target);
        }
      }
      modalItem.overlayRef.dispose();
      modalItem.componentRef.destroy();
      this.modalPlusContainer.splice(modalIndex, 1);
    }
  }

  /**
   * 是否存在弹框
   */
  isModalPlusExist(): boolean {
    return this.modalPlusContainer.length !== 0;
  }

  getModalPlus(id: string) {
    return this.modalPlusContainer.find(mp => mp.id === id);
  }

  enableDocumentMouseListener() {
    if (!this.isActiveMouseListener) {
      document.addEventListener('mousedown', this._downHandler);
      document.addEventListener('mousemove', this._moveHandler);
      document.addEventListener('mouseup', this._upHandler);
      this.isActiveMouseListener = true;
    }

  }

  disableDocumentMouseListener() {
    document.removeEventListener('mousedown', this._downHandler);
    document.removeEventListener('mousemove', this._moveHandler);
    document.removeEventListener('mouseup', this._upHandler);
    this.isActiveMouseListener = false;
  }

  private _mouseMove(e: MouseEvent) {
    // 匹配变更状态
    if (!this.activeResizeInf.isActiveResize) {
      const len = this.resizeElementContainer.length;
      this.activeResizeInf.isMatchResizeType = false;
      this.activeResizeInf.activeItem = null;
      for (let i = 0; i < len; i++) {
        const containerItem = this.resizeElementContainer[i];

        // 激活回调
        containerItem.mousemoveCallback(e);
        if (!this.activeResizeInf.isMatchResizeType) {
          this.activeResizeInf.isMatchResizeType = this.matchResizeType(containerItem, e);
          if (this.activeResizeInf.isMatchResizeType) {
            this.activeResizeInf.activeItem = containerItem;
          }
        }
      }
    } else {
      // 变更尺寸
      this.resize(e);
    }

  }

  private _mouseDown(e: MouseEvent) {
    if (this.activeResizeInf.isMatchResizeType) {
      this.activeResizeInf.isActiveResize = true;
      this.mouseInfo.oldPosition = {x: e.x, y: e.y};
    }
    console.log(this.activeResizeInf);
  }

  private _mouseUp(e: MouseEvent) {
    this.activeResizeInf.isMatchResizeType = false;
    this.activeResizeInf.isActiveResize = false;
    this.activeResizeInf.activeItem = null;
  }

  addResizeElement(ele: ElementRef | HTMLElement, dragRef: DragRef | null = null, mouseupCallback: (...arg) => any = function (e) {
  }, mousemoveCallback: (...arg) => any = function (e) {
  }, mousedownCallback: (...arg) => any = function (e) {
  }) {
    this.resizeElementContainer.push({ele, dragRef, existedClassName: '', mouseupCallback, mousemoveCallback, mousedownCallback});
  }

  deleteResizeElement(ele: ElementRef | HTMLElement) {
    const index = this.resizeElementContainer.findIndex(eInf => eInf.ele === ele);
    if (~index) {
      this.resizeElementContainer.splice(index, 1);
    }
  }

  /**
   * 使可拖动元素失效/生效
   * @param dragRef
   * @param active
   * @private
   */
  private activeDragDisable(dragRef: DragRef | null, active: boolean) {
    if (dragRef !== null) {
      dragRef.disabled = active;
    }
  }

  /**
   * 匹配元素是否处于重置尺寸类型
   * @param containerItem
   * @param e
   * @private
   */
  private matchResizeType(containerItem: ResizeElementInf, e): boolean {
    const containerEle = containerItem.ele;
    const ele: HTMLElement = containerEle instanceof ElementRef ? containerEle.nativeElement : containerEle;
    const {width, height} = this.getSize(ele);
    const top = ele.getBoundingClientRect().top;
    const left = ele.getBoundingClientRect().left;
    const right = ele.getBoundingClientRect().right;
    const bottom = ele.getBoundingClientRect().bottom;
    const layerY = e.y - ele.getBoundingClientRect().top;
    const layerX = e.x - ele.getBoundingClientRect().left;

    if (e.x >= left && e.x <= right && e.y >= top && e.y <= bottom) {
      if (layerX - offsetDistance <= 0 && layerY - offsetDistance <= 0) {
        this.addClass(RESIZE_TYPE.NW, ele, containerItem);
        this.activeDragDisable(containerItem.dragRef, true);
        return true;
      } else if (layerX + offsetDistance >= width && layerY - offsetDistance <= 0) {
        this.addClass(RESIZE_TYPE.NE, ele, containerItem);
        this.activeDragDisable(containerItem.dragRef, true);
        return true;
      } else if (layerY - offsetDistance <= 0) {
        this.addClass(RESIZE_TYPE.N, ele, containerItem);
        this.activeDragDisable(containerItem.dragRef, true);
        return true;
      } else if (layerX - offsetDistance <= 0 && layerY + offsetDistance >= height) {
        this.addClass(RESIZE_TYPE.SW, ele, containerItem);
        this.activeDragDisable(containerItem.dragRef, true);
        return true;
      } else if (layerX - offsetDistance <= 0) {
        this.addClass(RESIZE_TYPE.W, ele, containerItem);
        this.activeDragDisable(containerItem.dragRef, true);
        return true;
      } else if (layerX + offsetDistance >= width && layerY + offsetDistance >= height) {
        this.addClass(RESIZE_TYPE.SE, ele, containerItem);
        this.activeDragDisable(containerItem.dragRef, true);
        return true;
      } else if (layerX + offsetDistance >= width) {
        this.addClass(RESIZE_TYPE.E, ele, containerItem);
        this.activeDragDisable(containerItem.dragRef, true);
        return true;
      } else if (layerY + offsetDistance >= height) {
        this.addClass(RESIZE_TYPE.S, ele, containerItem);
        this.activeDragDisable(containerItem.dragRef, true);
        return true;
      } else {
        if (containerItem.existedClassName) {
          this.removeClass(containerItem.existedClassName, ele, containerItem);
          this.activeDragDisable(containerItem.dragRef, false);
        }
        return false;
      }
    } else {
      if (containerItem.existedClassName) {
        this.removeClass(containerItem.existedClassName, ele, containerItem);
        this.activeDragDisable(containerItem.dragRef, false);
      }
      return false;
    }
  }

  private addClass(className: string, el: HTMLElement, item: ResizeElementInf) {
    this.removeClass(item.existedClassName, el, item);
    this.renderer.addClass(el, className);
    item.existedClassName = className;
  }

  private removeClass(className: string, el: HTMLElement, item: ResizeElementInf) {
    if (className !== '') {
      this.renderer.removeClass(el, className);
      item.existedClassName = '';
    }
  }

  private getSize(ele: HTMLElement): { width: number, height: number } {
    return {
      width: ele.offsetWidth,
      height: ele.offsetHeight,
    };
  }

  private resize(e) {
    if (this.activeResizeInf.isActiveResize) {
      const movementX = this.mouseInfo.oldPosition.x - e.x;
      const movementY = this.mouseInfo.oldPosition.y - e.y;
      this.mouseInfo.oldPosition = {x: e.x, y: e.y};
      const containerEle = this.activeResizeInf.activeItem.ele;
      const ele: HTMLElement = containerEle instanceof ElementRef ? containerEle.nativeElement : containerEle;
      const {width, height} = this.getSize(ele);
      const lastTranslate = getTransform(ele.style.transform);

      this.renderer.setStyle(ele, 'height', `${height + movementY}px`);
      this.renderer.setStyle(ele, 'transform', `translate3d(0px, ${lastTranslate.y - movementY / 2}px, 0px)`);
    }

    function getTransform(transform: string): { x: number, y: number, z: number } {
      const reg = /^.+\((.*)\)/;
      const match = transform.match(reg);
      const transValue = {x: 0, y: 0, z: 0};
      if (match) {
        const valueArr: number | string[] = match[1].split(',');
        valueArr.forEach((v, i) => {
          valueArr[i] = v.replace('px', '');
        });
        transValue.x = Number(valueArr[0]);
        transValue.y = Number(valueArr[1]);
        transValue.z = Number(valueArr[2]);
      }
      return transValue;
    }
  }

}

export interface ModalPlusRef {
  id: string;
  overlayRef: OverlayRef;
  componentRef: ComponentRef<any>;
  target: HTMLElement;
}

export interface ResizeElementInf {
  ele: ElementRef | HTMLElement;
  dragRef: DragRef | null;
  existedClassName: string;
  mouseupCallback: (...arg) => any;
  mousemoveCallback: (...arg) => any;
  mousedownCallback: (...arg) => any;
}
