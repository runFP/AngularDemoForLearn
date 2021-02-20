import {AfterViewInit, Directive, ElementRef, Renderer2} from '@angular/core';

// 鼠标离边缘位置多少时可以调整
const offsetDistance = 5;

@Directive({
  selector: '[appFlexibleSize]'
})
export class FlexibleSizeDirective implements AfterViewInit {
  currentMouseClassName: string;
  isResize = false; // 判断是否处于拖拉尺寸状态
  lastPosition = {x: 0, y: 0}; // 上一次鼠标位置

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) {
  }

  ngAfterViewInit(): void {
    document.addEventListener('mousemove', e => {
      console.log('d', e);
    });
    this.elementRef.nativeElement.addEventListener('mousemove', (e) => {
      const width = this.elementRef.nativeElement.offsetWidth;
      const height = this.elementRef.nativeElement.offsetHeight;
      if (e.layerX - offsetDistance <= 0 && e.layerY - offsetDistance <= 0) {
        this.addClass('nw-resize');
      } else if (e.layerX + offsetDistance >= width && e.layerY - offsetDistance <= 0) {
        this.addClass('ne-resize');
      } else if (e.layerY - offsetDistance <= 0) {
        this.addClass('n-resize');
        this.resize(e, width, height);
      } else if (e.layerX - offsetDistance <= 0 && e.layerY + offsetDistance >= height) {
        this.addClass('sw-resize');
      } else if (e.layerX - offsetDistance <= 0) {
        this.addClass('w-resize');
      } else if (e.layerX + offsetDistance >= width && e.layerY + offsetDistance >= height) {
        this.addClass('se-resize');
      } else if (e.layerX + offsetDistance >= width) {
        this.addClass('e-resize');
      } else if (e.layerY + offsetDistance >= height) {
        console.log('height', height);
        this.addClass('s-resize');
      } else if (this.currentMouseClassName !== '') {
        this.removeClass(this.currentMouseClassName);
      }
    });
    this.elementRef.nativeElement.addEventListener('mousedown', e => {
      if (this.currentMouseClassName !== '') {
        this.isResize = true;
        this.lastPosition.x = e.pageX;
        this.lastPosition.y = e.pageY;
      }
    });
    this.elementRef.nativeElement.addEventListener('mouseup', e => {
      if (this.currentMouseClassName !== '') {
        this.isResize = false;
      }
    });
  }

  private addClass(className: string, el = this.elementRef.nativeElement) {
    if (this.currentMouseClassName !== '') {
      this.removeClass(this.currentMouseClassName);
    }
    this.renderer.addClass(el, className);
    this.currentMouseClassName = className;
  }

  private removeClass(className: string, el = this.elementRef.nativeElement) {
    this.renderer.removeClass(el, className);
    this.currentMouseClassName = '';
  }

  private resize(e, width, height) {
    if (this.isResize) {
      const move = this.lastPosition.y - e.pageY;
      this.lastPosition.y = e.pageY;
      console.log('height', height);
      this.renderer.setStyle(this.elementRef.nativeElement, 'height', `${height + move}px`);
    }
  }


}
