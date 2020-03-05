import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {DNDContainerService, ElementInf} from './dndcontainer.service';
import {getTransform} from './dnd-utils';

@Injectable({providedIn: 'root'})
export class NgDragAndDropService {
  private _document: Document;

  constructor(
    @Inject(DOCUMENT) _document: any,
  ) {
    this._document = _document;
  }

  /**
   * 为元素创建占位元素
   * @param {HTMLElement} ele
   * @return {HTMLElement}
   */
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

  /**
   *  检测是否碰撞
   * @param {BoundaryPoint} point 移动源4个角位置信息
   * @param {HTMLElement} dragEle 移动源
   * @param {ElementInf[]} elementInf 容器元素集合
   * @return {BoundaryInf}
   */
  public boundaryHit(point: BoundaryPoint, dragEle: HTMLElement, elementInf: ElementInf[]): BoundaryInf {
    const boundaryElements = [];
    const areas = [];
    let bestBoundaryElement = null;
    elementInf.forEach((inf, i) => {
      if (dragEle === inf.element) return;
      const rang = inf.rang;
      Object.values(point).forEach((p, pi) => {
        if ((p.x > rang.x.start && p.x < rang.x.end) && (p.y > rang.y.start && p.y < rang.y.end)) {
          boundaryElements.push(inf);

          const areaInf = this.getArea(p, pi, inf);
          // 只有碰撞面积大于被碰撞源的4/1才认定此次碰撞有效
          if (areaInf.area > Math.floor(inf.width * inf.height / 4)) {
            areas.push(areaInf);
          }
        }
      });
    });


    if (areas.length > 0) {
      /** 通过计算最优碰撞元素来筛选出真正需要交互的碰撞元素*/
      const max = Math.max(...areas.map(area => area.area));
      bestBoundaryElement = areas.find(area => area.area === max).inf;
    }

    return {
      boundary: boundaryElements.length === 0 ? false : true,
      elements: boundaryElements,
      bestBoundaryElement: bestBoundaryElement,
    };
  }

  private getArea(p, i, inf) {
    let x = 0;
    let y = 0;
    switch (i + 1) {
      case 1:
        x = Math.abs(p.x - inf.rang.x.end);
        y = Math.abs(p.y - inf.rang.y.end);
        break;
      case 2:
        x = Math.abs(p.x - inf.rang.x.start);
        y = Math.abs(p.y - inf.rang.y.end);
        break;
      case 3:
        x = Math.abs(p.x - inf.rang.x.start);
        y = Math.abs(p.y - inf.rang.y.start);
        break;
      case 4:
        x = Math.abs(p.x - inf.rang.x.end);
        y = Math.abs(p.y - inf.rang.y.start);
        break;
    }
    return {area: Math.floor(x * y), inf};
  }

  public getBoundaryPoint(element: HTMLElement): BoundaryPoint {
    const transform = getTransform(element, true)[0];
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

export interface BoundaryInf {
  // 是否碰撞
  boundary: boolean;
  // 碰撞的所有元素
  elements: ElementInf[];
  // 碰撞的最优元素(与移动源碰撞面积最大的元素)
  bestBoundaryElement: ElementInf;
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

