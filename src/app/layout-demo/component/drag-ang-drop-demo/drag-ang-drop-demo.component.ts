import {Component, ElementRef, EventEmitter, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DragDrop, DragRef} from '@angular/cdk/drag-drop';
import {NzModalComponent, NzModalRef, NzModalService} from 'ng-zorro-antd';
import {ConnectionPositionPair} from '@angular/cdk/overlay';

@Component({
  selector: 'app-drag-ang-drop-demo',
  templateUrl: './drag-ang-drop-demo.component.html',
  styleUrls: ['./drag-ang-drop-demo.component.scss']
})
export class DragAngDropDemoComponent implements OnInit {
  @ViewChild('dynamicallyDrag', {static: false})
  dynamicallyDrag: ElementRef;

  @ViewChild('connectButton', {static: false})
  connectButton: ElementRef;

  dragDisable = true;
  dragRef: DragRef;

  isVisible = false;
  tplModal: any;
  tplModalButtonLoading = false;

  constructor(private dragDrop: DragDrop, private modalService: NzModalService) {
    console.log(this.dragDrop);
    console.log(this.modalService);
  }

  ngOnInit() {
  }

  /** ---------------动态变更为可拖动层------------------*/
  /**
   * 动态设置图层可拖动
   * */
  setCdkDragDynamically() {
    this.dragRef = this.dragDrop.createDrag(this.dynamicallyDrag);

    /** 注意这2步，可以设置handles(设置启用拖动的范围) */
    const titleElementRef = this.dragRef.getRootElement().querySelector('.title');
    this.dragRef.withHandles([<HTMLElement>titleElementRef]);
    /** end */

    this.dragDisable = false;
    /**
     * 订阅拖动事件
     * */
    this.dragRef.moved.subscribe(() => {
    });
  }

  /**
   * 恢复初始定位
   * */
  resetDrag() {
    this.dragRef.reset();
  }

  /**
   * 启动/禁用拖动
   * */
  toggleDrag() {
    const html = this.dragRef.getRootElement();
    console.log(this.dragRef.disabled);
    if (this.dragRef.disabled) {
      this.dragRef.enableHandle(html);
      this.dragDisable = this.dragRef.disabled = false;

    } else {
      this.dragRef.disableHandle(html);
      this.dragDisable = this.dragRef.disabled = true;
    }
  }


  /** ---------------为Nz-modal添加拖动------------------*/
  showModal(): void {
    this.isVisible = true;
  }

  handleOpen(): void {
    console.log('is open!');
    const ms = this.modalService;
    console.log(ms);
    Promise.resolve(null).then(() => {
      this.handleModalDrag(ms);
    });
  }

  handleModalDrag(ms: NzModalService) {
    console.log('1', ms.openModals);
    const modal: HTMLElement = (<NzModalComponent>ms.openModals[0]).getElement();
    const dragRef = this.dragDrop.createDrag(modal);
    /** 设置只有头部可以拖动 */
    const title: HTMLElement = <HTMLElement>ms.openModals[0].getElement().querySelector('.ant-modal-header');
    dragRef.withHandles([title]);
  }

  handleOk(): void {
    const ms = this.modalService;
    console.log('Button ok clicked!');
    console.log(ms.openModals);
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }


  createTplModal(tplTitle: TemplateRef<{}>, tplContent: TemplateRef<{}>, tplFooter: TemplateRef<{}>): void {
    this.tplModal = this.modalService.create({
      nzTitle: tplTitle,
      nzContent: tplContent,
      nzFooter: tplFooter,
      nzClosable: false,
      nzWrapClassName: 'abc',
      nzClassName: 'cdb',
      nzMask: false,
      nzStyle: {top: 0},
      nzOnOk: () => console.log('Click ok'),
    });

    this.tplModal.afterOpen.subscribe(() => {
      /**创建全局策略模式*/
      // const strategy = this.tplModal.overlay.position().global().centerHorizontally().centerVertically();
      /**创建flexconnectto模式*/
      const strategy = this.tplModal.overlay.position().flexibleConnectedTo((<any>this.connectButton).el).withPositions([{
        originX: 'end',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'bottom',
        offsetX: 0,
        offsetY: 0
      }]);
      /**创建connectto模式*/
    /*  const strategy = this.tplModal.overlay.position().connectedTo((<any>this.connectButton).el, {
          originX: 'start',
          originY: 'bottom',
        },
        {overlayX: 'end', overlayY: 'bottom'}
      );*/

      this.tplModal.overlayRef.updatePositionStrategy(strategy);
      const modal: HTMLElement = this.tplModal.getElement().parentElement;
      this.dragDrop.createDrag(modal);
      console.log('2', this.modalService.openModals);
      console.log(' this.tplModal', this.tplModal);
      console.log(' this.tplModal.overlay', this.tplModal.overlay);
    });
  }

  destroyTplModal(): void {
    this.tplModalButtonLoading = true;
    setTimeout(() => {
      this.tplModalButtonLoading = false;
      this.tplModal.destroy();
    }, 1000);
  }

}
