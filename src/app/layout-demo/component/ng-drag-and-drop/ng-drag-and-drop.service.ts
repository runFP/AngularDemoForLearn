import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Injectable()
export class NgDragAndDropService {
  private _document: Document;

  constructor(
    @Inject(DOCUMENT) _document: any,
  ) {
    this._document = _document;
  }

  /** 收集元素的位置信息，每次拖动启发或者触发元素位置对换需要重新计算 */
  public collectElementPosition(children: HTMLCollection): ElementInf[] {
    const elementPosition: ElementInf[] = [];
    for (let i = 0, ii = children.length; i < ii; i++) {
      const ele: HTMLElement = <HTMLElement>children[i];
      const transformArray = this.getTransform(ele, true);
      const position = transformArray[0];
      const originPosition = transformArray.length === 2 ? transformArray[1] : position;
      const width = ele.offsetWidth;
      const height = ele.offsetHeight;
      elementPosition.push({
        position: {x: position[0], y: position[1]},
        originPosition: {x: originPosition[0], y: originPosition[1]},
        width,
        height,
        rang: {
          x: {start: position[0], end: position[0] + width},
          y: {start: position[1], end: position[1] + height}
        },
        middlePoint: {
          x: Math.round((position[0] + width) / 2),
          y: Math.round((position[1] + height) / 2)
        },
        element: ele,
      });
    }
    return elementPosition;
  }

  public getTransform(ele, numberType = false) {
    const reg = /translate3d[^\)]*\)/g;
    const pixelReg = /-?\d+px/g;
    const pixelNumReg = /-?\d+(?=px)/g;
    const transform = ele.style.transform;

    /**
     * 元素拖动后会包含2组translate3d信息（拖动前只有一组）
     * 分别为初始定位和拖动后定位
     */
    const transformArray = transform.match(reg);
    return transformArray.map(str => str.match(numberType ? pixelNumReg : pixelReg).map(i => numberType ? Number(i) : i));
  }

  public createShadowElement(ele: HTMLElement): HTMLElement {
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
    const dom = this._document.createElement('div');
    dom.style.cssText = cssText;
    return dom;
  }

  public boundaryHit(point: BoundaryPoint, delta, elementInf: ElementInf[]) {
    elementInf.forEach((inf, i) => {
      const rang = inf.rang;
      Object.values(point).forEach(p => {
        if ((p.x > rang.x.start && p.x < rang.x.end) && (p.y > rang.y.start && p.y < rang.y.end)) {
          console.log('in:' + i);
        }
      });
    });
    /*    if (delta.x === 1) {
          console.log('right');

        } else if (delta.x === -1) {
          console.log('left');

        }
        if (delta.y === 1) {
          console.log('down');

        } else if (delta.y === -1) {
          console.log('up');

        }*/
  }

  public getBoundaryPoint(element: HTMLElement): BoundaryPoint {
    const transform = this.getTransform(element, true)[0];
    const point = {x: transform[0], y: transform[1]};
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    return {
      p1: {x: point.x, y: point.y},
      p2: {x: point.x + width, y: point.y},
      p3: {x: point.x + width, y: point.y + height},
      p4: {x: point.x, y: point.y + height},
    };

  }

}

export interface ElementInf {
  position: { x: number, y: number };
  originPosition: { x: number, y: number };
  width: number;
  height: number;
  rang: { x: { start: number, end: number }, y: { start: number, end: number } };
  middlePoint: { x: number; y: number };
  element: HTMLElement;
}

export interface Point {
  x: number;
  y: number;
}

export interface BoundaryPoint {
  p1: Point;
  p2: Point;
  p3: Point;
  p4: Point;
}

