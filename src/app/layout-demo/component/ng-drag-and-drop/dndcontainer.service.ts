import {Injectable} from '@angular/core';
import {getTransform} from './dnd-utils';

@Injectable({
  providedIn: 'root'
})
export class DNDContainerService {
  private containerHeight: number;

  constructor() {
  }

  /**
   * 收集容器内子元素信息
   * @param {HTMLCollection} children 容器内的子元素集合
   * @return {ElementInf[]}
   */
  collectElementPosition(children: HTMLCollection): ElementInf[] {
    const elementPosition: ElementInf[] = [];
    for (let i = 0, ii = children.length; i < ii; i++) {
      const ele: HTMLElement = <HTMLElement>children[i];
      const transformArray = getTransform(ele, true);
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
          x: Math.round(position[0] + width / 2),
          y: Math.round(position[1] + height / 2)
        },
        element: ele,
      });
    }

    this.calculateContainerHeight(elementPosition);
    return elementPosition;
  }

  refreshElementsPosition(dragElement) {


  }

  private preceptionAboveElement() {

  }

  /**
   * 计算容器高度
   * @param {ElementInf[]} eleInf
   */
  calculateContainerHeight(eleInf: ElementInf[]) {
    let max = eleInf[0].rang.y.end;
    eleInf.forEach(inf => {
      if (inf.rang.y.end > max) max = inf.rang.y.end;
    });
    this.containerHeight = max;
  }

  getContainerHeight(): number {
    return this.containerHeight;
  }
}

export interface ElementInf {
  // 位置
  position: { x: number, y: number };
  // 原始位置
  originPosition: { x: number, y: number };
  width: number;
  height: number;
  // 元素的范围，4个点位置
  rang: { x: { start: number, end: number }, y: { start: number, end: number } };
  // 元素中点位置
  middlePoint: { x: number; y: number };
  element: HTMLElement;
}
