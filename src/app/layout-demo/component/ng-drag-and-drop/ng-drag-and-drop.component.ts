import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {DragDrop, DragRef, DragRefConfig} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-ng-drag-and-drop',
  templateUrl: './ng-drag-and-drop.component.html',
  styleUrls: ['./ng-drag-and-drop.component.scss']
})
export class NgDragAndDropComponent implements OnInit {

  private boundary: HTMLElement;

  constructor(
    private dr: DragDrop,
    private el: ElementRef,
    private rendener: Renderer2,
  ) {
    console.log(dr);
  }

  ngOnInit() {
  }

  activeCustom(): void {
    this.boundary = this.el.nativeElement.querySelector('.example-boundary');
    const dragBox = this.boundary.children;
    const dragRefs = this.createDrag(dragBox);
  }

  createShadowElement(ele: HTMLElement): HTMLElement {
    const reg = /\d+px/g;
    const height = ele.offsetHeight;
    const width = ele.offsetWidth;
    const transform = ele.style.transform.match(reg);
    const cssText = [
      'background:red',
      `width:${width}px`,
      `height:${height}px`,
      `transform:translate3d(${transform.join(',')})`,
      'position:absolute',
    ].join(';') + ';';
    const dom = document.createElement('div');
    dom.style.cssText = cssText;
    return dom;
  }

  createDrag(children: HTMLCollection): DragRef[] {
    const dragRefs: DragRef[] = [];
    for (let i = 0, ii = children.length; i < ii; i++) {
      const ele: HTMLElement = <HTMLElement>children[i];
      const shadowDom = this.createShadowElement(ele);

      const dragRef = this.dr.createDrag(ele);
      dragRef.moved.subscribe(e => {
        dragRefs.forEach(dr => console.log(dr));
        console.log(e);
      });

      dragRef.started.subscribe(e => {
        console.log('before:');
        console.log(e);
        shadowDom.style.transform = ele.style.transform;
        this.rendener.appendChild(this.boundary, shadowDom);
      });

      dragRef.ended.subscribe(e => {
        this.rendener.removeChild(this.boundary, shadowDom, false);
      });

      dragRefs.push(dragRef);
    }
    return dragRefs;
  }

}
