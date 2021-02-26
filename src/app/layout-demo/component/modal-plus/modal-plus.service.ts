import {ComponentRef, Injectable, Injector, OnInit} from '@angular/core';
import {Overlay, OverlayPositionBuilder, OverlayRef} from '@angular/cdk/overlay';
import {PORTAL_DATA} from './portal-data';
import {ComponentPortal} from '@angular/cdk/portal';

@Injectable()
export class ModalPlusService {
  activeResize = false; // 当前是否有弹框处于重设尺寸，一次只能一个
  modalPlusContainer: ModalPlusRef[] = []; // 弹框容器，用于匹配鼠标事件点击划过时的弹框
  targetMapId = new Map();
  isAddDocumentListener = false; // document是否添加了鼠标事件

  private _downHandler = this._mouseDown.bind(this);
  private _moveHandler = this._mouseMove.bind(this);
  private _upHandler = this._mouseUp.bind(this);

  constructor(
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilder,
  ) {
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
    document.addEventListener('mousedown', this._downHandler);
    document.addEventListener('mousemove', this._moveHandler);
    document.addEventListener('mouseup', this._upHandler);
  }

  disableDocumentMouseListener() {
    document.removeEventListener('mousedown', this._downHandler);
    document.removeEventListener('mousemove', this._moveHandler);
    document.removeEventListener('mouseup', this._upHandler);
  }

  private _mouseMove(e: MouseEvent) {

  }

  private _mouseDown(e: MouseEvent) {
  }

  private _mouseUp(e: MouseEvent) {

  }


}

export interface ModalPlusRef {
  id: string;
  overlayRef: OverlayRef;
  componentRef: ComponentRef<any>;
  target: HTMLElement;
}
