import {Component, ViewContainerRef, ViewEncapsulation} from '@angular/core';
import {Overlay, OverlayConfig} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-cdk-overlay',
  templateUrl: './cdk-overlay.component.html',
  styleUrls: ['./cdk-overlay.component.scss']
})
export class CdkOverlayComponent {

  constructor(public overlay: Overlay
    , public viewContainerRef: ViewContainerRef) {
  }

  /**
   * overlay 在整个屏幕的中间显示
   */
  showOverlayGlobalPanelCenter() {
    // config: OverlayConfig overlay的配置，配置显示位置，和滑动策略
    const config = new OverlayConfig();
    config.positionStrategy = this.overlay.position()
      .global() // 全局显示
      .centerHorizontally() // 水平居中
      .centerVertically(); // 垂直居中
    config.hasBackdrop = true; // 设置overlay后面有一层背景, 当然你也可以设置backdropClass 来设置这层背景的class
    const overlayRef = this.overlay.create(config); // OverlayRef, overlay层
    overlayRef.backdropClick().subscribe(() => {
      // 点击了backdrop背景
      overlayRef.dispose();
    });
    // OverlayPanelComponent是动态组件
    // 创建一个ComponentPortal，attach到OverlayRef，这个时候我们这个overlay层就显示出来了。
    // overlayRef.attach(new ComponentPortal(OverlayPanelComponent, this.viewContainerRef));
    // 监听overlayRef上的键盘按键事件
    overlayRef.keydownEvents().subscribe((event: KeyboardEvent) => {
      console.log(overlayRef._keydownEventSubscriptions + ' times');
      console.log(event);
    });
  }
}
