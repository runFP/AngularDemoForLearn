import {
  AfterViewInit,
  Component,
  ComponentRef, ElementRef,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {
  CdkConnectedOverlay,
  ConnectedPosition,
  ConnectionPositionPair,
  FlexibleConnectedPositionStrategy,
  Overlay, OverlayPositionBuilder,
  OverlayRef
} from '@angular/cdk/overlay';
import {ComponentPortal, TemplatePortal} from '@angular/cdk/portal';

@Component({
  selector: 'app-custom-overlay',
  templateUrl: './custom-overlay.component.html',
  styleUrls: ['./custom-overlay.component.scss']
})
export class CustomOverlayComponent implements AfterViewInit {
  @ViewChild('abc', {static: false})
  abc: TemplateRef<any>;

  @ViewChild('origin', {static: false})
  origin: TemplateRef<any>;

  @ViewChild(CdkConnectedOverlay, {static: false}) cdkConnectedOverlay: CdkConnectedOverlay;

  isOpen = false;

  overlayPositions: ConnectedPosition[] = [
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'top'
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'top'
    },
    /*   {
         originX: 'end',
         originY: 'bottom',
         overlayX: 'start',
         overlayY: 'bottom'
       },
       {
         originX: 'start',
         originY: 'bottom',
         overlayX: 'end',
         overlayY: 'bottom'
       }*/
  ] as ConnectedPosition[];


  constructor(private overlay: Overlay, private viewContainer: ViewContainerRef, private  overlayPositionBuilder: OverlayPositionBuilder) {
  }

  changePosition() {
    const positions: ConnectedPosition[] = [
      {
        originX: 'end',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'top'
      },
      {
        originX: 'start',
        originY: 'top',
        overlayX: 'end',
        overlayY: 'top'
      },
      {
        originX: 'end',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'bottom'
      },
      {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'bottom'
      }
    ] as ConnectedPosition[];

    /**
     * 可以直接改变cdkConnectedOverlay.position属性来添加位置策略
     * */
    this.cdkConnectedOverlay.positions = positions;

    /**
     * 直接改变策略
     * */
    // const strategy = this.overlayPositionBuilder.flexibleConnectedTo(this.origin.elementRef.nativeElement).withPositions(positions);
    // this.cdkConnectedOverlay.overlayRef.updatePositionStrategy(strategy);
  }

  ngAfterViewInit() {
    const overlayRef: OverlayRef = this.overlay.create();
    console.log('overlayRef', overlayRef);
    console.log('CdkConnectedOverlay', this.cdkConnectedOverlay);


    const userProfilePortal = new TemplatePortal(this.abc, this.viewContainer);
    const modalComponent = new ComponentPortal(ModalComponent);
    /**
     * 绑定模板
     * */
    // const templateRef: EmbeddedViewRef<any> = overlayRef.attach(userProfilePortal);

    /**
     * 绑定组件
     * */
    const componentRef: ComponentRef<ModalComponent> = overlayRef.attach(modalComponent);

    /**
     * !
     * 这一输出比modalComponent内部的ngOnInit,ngAfterViewInit快，
     * 但在modalComponent构造函数之前
     * 说明 overlayRef.attach（方法不是立即渲染绑定的portal，
     * */
    console.log(componentRef);
    /**
     * !
     * 手动为组件实例赋值
     * 该值只在ngInit事件之后才能获得，
     * 因此我们初始化的时候，
     * 尽量不要在构造函数做一些围绕赋值属性展开的操作工作，
     * 尽量放在ngInit初始化
     * */
    componentRef.instance.modalVariable = 'manual set ModalVariable after overlayRef.attch()';
  }
}


/**
 * 除了留意Portal的组件类型，
 * 还要注意下面几个生命周期的执行时间
 * */
@Component({
  selector: 'app-mc',
  template: `modalComponent is render`
})
export class ModalComponent implements OnInit, AfterViewInit {
  @Input() modalVariable;

  constructor() {
    console.log('modalComponent constructor');
    console.log('modalVariable: ', this.modalVariable, 'constructor');
    this.methodCallByConstructor('---------constructor----------');
  }

  methodCallByConstructor(str) {
    console.log('method_modalVariable: ', this.modalVariable);
    console.log(str);
  }

  ngOnInit() {
    console.log('modalComponent ngOnInit');
    console.log('modalVariable: ', this.modalVariable, 'ngOnInit');
    this.methodCallByConstructor('---------ngOnInit----------');
  }

  ngAfterViewInit(): void {
    console.log('modalComponent ngAfterViewInit');
    console.log('modalVariable: ', this.modalVariable, 'ngAfterViewInit');
    this.methodCallByConstructor('---------ngAfterViewInit----------');
  }
}
