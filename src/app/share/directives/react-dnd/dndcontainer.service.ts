import {Injectable, Input} from '@angular/core';
import {createPlaceElement, getMinFromObject, getPosition, getTransformByPosition} from './dnd-utils';
import {Point} from './ng-drag-and-drop.service';
import {Padding} from './react-dnd.directive';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DNDContainerService {
  private containerHeight: number;
  private containerInf = null;
  private containerHeightUpdate = false;
  private placeElementInf: ElementInf | null = null;
  private elementNum = 4;
  private elementWidth = 0;
  private init_complete = false;
  private gutter;
  private fontSize = 0;

  xPosition = {};
  elementInfCollection: ElementInf[] = [];

  constructor() {
  }

  init(children: HTMLCollection, fontSize: number, containerInf: ContainerInf) {
    this.fontSize = fontSize;
    this.gutter = containerInf.gutter;
    if (fontSize !== 0) {
      children = this.elementTransformRem2px(children);
    }
    this.containerInf = containerInf;
    this.collectElementPosition(children);
    this.recordX(containerInf);
    this.init_complete = true;
  }

  private elementTransformRem2px(children: HTMLCollection): HTMLCollection {
    for (let i = 0, ii = children.length; i < ii; i++) {
      const ele: HTMLElement = <HTMLElement>children[i];
      const position = getPosition(ele);
      const rem2PxPosition = this.rem2px(position);
      ele.style.transform = getTransformByPosition(rem2PxPosition);
    }
    return children;
  }

  private rem2px(position: Point): Point {
    position.x = position.x * this.fontSize;
    position.y = position.y * this.fontSize;
    return position;
  }

  /**
   * 记录每列的起始x
   * @param {ContainerInf} containerInf
   */
  recordX(containerInf: ContainerInf) {
    const rate = containerInf.width / containerInf.designSize;
    const padding = containerInf.padding;
    const gutter = containerInf.gutter;
    const width = containerInf.width;
    const col = containerInf.col;
    const totalPadding = typeof padding === 'number' ? padding * 2 : padding.right + padding.left;
    const totalGutter = typeof gutter === 'number' ? gutter * 2 : gutter.right + gutter.left;
    this.elementWidth = Math.ceil((width - (totalPadding + totalGutter * col) * rate) / col);

    for (let i = 0, ii = this.elementNum; i < ii; i++) {
      const x = {start: 0, end: 0};
      if (typeof gutter === 'number') {
        x.start = gutter * rate + (this.elementWidth + gutter * 2 * rate) * i;
      } else {
        x.start = gutter.left * rate + (this.elementWidth + (gutter.left + gutter.right) * rate) * i;
      }
      x.end = x.start + this.elementWidth;
      this.xPosition[i] = x;
    }
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
      const eleInf = this.createElementInf(ele);
      elementPosition.push(eleInf);
    }
    this.elementInfCollection = elementPosition;
    this.calculateContainerHeight();
    return elementPosition;
  }

  createElementInf(element: HTMLElement, pos?): ElementInf {
    const unitReg = /(px|rem)/g;
    const position = pos || getPosition(element);
    // const originPosition = getOriginPosition(element);
    const width = element.offsetWidth || Number(element.style.width.replace(unitReg, ''));
    const height = element.offsetHeight || Number(element.style.height.replace(unitReg, ''));
    return {
      position: {x: position.x, y: position.y},
      width,
      height,
      rang: {
        x: {start: position.x, end: position.x + width},
        y: {start: position.y, end: position.y + height}
      },
      middlePoint: {
        x: Math.round(position.x + width / 2),
        y: Math.round(position.y + height / 2)
      },
      element: element,
    };
  }

  /**
   *
   * @param {HTMLElement} element
   * @return {string} 返回transform
   */
  addElement(element: HTMLElement): string {
    const pos = {x: this.xPosition[0].start, y: 0};
    const newElementInf = this.createElementInf(element, pos);
    this.placeElementInf = newElementInf;
    this.elementInfCollection.push(newElementInf);
    this.refreshElementsPositionBefore(newElementInf);
    this.refreshElementsPositionAfter(newElementInf);
    return getTransformByPosition(pos);
  }

  removeElement(element: HTMLElement) {
    const index = this.elementInfCollection.findIndex(elementInf => elementInf.element === element);
    if (index !== -1) {
      const delElementInf = this.elementInfCollection[index];
      this.elementInfCollection.splice(index, 1);
      this.refreshElementsPositionBefore(delElementInf);
    }
  }

  /**
   * 确保拖动时操作的元素是容器内部元素
   * @param {HTMLElement} element mouseEvent.target
   * @return {HTMLElement | null} 容器内部元素或者null
   */
  getParentElement(element: HTMLElement): HTMLElement | null {
    let index = this.elementInfCollection.findIndex(dndElementInf => dndElementInf.element === element);
    while (index === -1) {
      if (element === document.body) {
        index = null;
        element = null;
        break;
      }
      element = element.parentElement;
      index = this.elementInfCollection.findIndex(dndElementInf => dndElementInf.element === element);
    }
    return element;
  }

  getElementInfCollection(): ElementInf[] {
    return this.elementInfCollection;
  }

  getElementInfByElement(element: HTMLElement): ElementInf {
    return this.elementInfCollection.find(ele => ele.element === element);
  }

  /**
   * 刷新占位层的位置（通过先创建一个虚假的元素信息，来计算占位层的真实位置）
   * @param {number} x
   * @param {string} xpKey
   * @param moveTarget
   */
  refreshPlacePositionFake(x: number, xpKey: string, moveTarget) {
    const absPoint = {};
    const targetElementPosition = getPosition(moveTarget);
    const excludeDragElementInf = this.elementInfCollection.filter(inf => inf.element !== moveTarget);
    for (const key in this.xPosition) {
      if (this.xPosition.hasOwnProperty(key)) {
        absPoint[key] = (Math.abs(x - this.xPosition[key][xpKey]));
      }
    }
    const colX = this.xPosition[getMinFromObject(absPoint).index].start;
    const pp = {
      x: colX,
      y: targetElementPosition.y,
    };
    const fakeElementInf = this.createElementInf(moveTarget, pp);
    if (pp.x + fakeElementInf.width > this.containerInf.width) {
      return;
    }
    const position = this.getBelowElementMaxPosition(fakeElementInf, excludeDragElementInf);
    const newReInf = this.updateElementInf(this.placeElementInf, position);
    newReInf.element.style.transform = getTransformByPosition(newReInf.position);
    this.placeElementInf = newReInf;
  }

  /**
   * 占位层更新前执行位置更新
   * @param {ElementInf} dragElementInf
   */
  refreshElementsPositionBefore(dragElementInf: ElementInf) {
    const reInf = this.placeElementInf;
    const excludeDragElementInf = this.elementInfCollection.filter(inf => inf.element !== dragElementInf.element);
    const belowElements = excludeDragElementInf.filter(inf =>
      (
        (inf.position.x >= reInf.position.x && inf.position.x <= reInf.rang.x.end) ||
        (inf.rang.x.end >= reInf.position.x && inf.rang.x.end <= reInf.rang.x.end) ||
        (inf.position.x <= reInf.position.x && inf.rang.x.end >= reInf.rang.x.end)
      )
      && inf.position.y > reInf.position.y);
    belowElements.sort((a, b) => a.position.y - b.position.y);
    /**
     * 下层元素中如有宽度范围超过拖动元素，需要把这些元素涉及到的下层元素也添加进来
     */
    /**
     * 下层元素中如有宽度范围超过拖动元素，需要把这些元素涉及到的下层元素也添加进来
     */
    const fullBlowElements = this.getOverWidthBelowElementRelativeElement(belowElements, excludeDragElementInf, reInf);
    fullBlowElements.sort((a, b) => a.position.y - b.position.y);

    fullBlowElements.forEach(ele => {
      /**
       * 找出该元素的X范围内的所有上层元素，排除拖动元素
       * 选出上层元素rang.y.end最大的元素
       * 更新元素位置到rang.y.end的位置
       * 更新
       */
      const position = this.getBelowElementMaxPosition(ele, excludeDragElementInf);
      this.updateElementCollection(ele, position);
    });
  }

  /**
   * 占位层更新前执行位置后更新
   * @param {ElementInf} dragElementInf
   */
  refreshElementsPositionAfter(dragElementInf: ElementInf) {
    const reInf = this.placeElementInf;
    const excludeDragElementInf = this.elementInfCollection.filter(inf => inf.element !== dragElementInf.element);
    const belowElements = excludeDragElementInf.filter(inf =>
      (
        (inf.position.x >= reInf.position.x && inf.position.x <= reInf.rang.x.end) ||
        (inf.rang.x.end >= reInf.position.x && inf.rang.x.end <= reInf.rang.x.end) ||
        (inf.position.x <= reInf.position.x && inf.rang.x.end >= reInf.rang.x.end)
      )
      && inf.rang.y.end >= reInf.position.y);
    /**
     * 下层元素中如有宽度范围超过拖动元素，需要把这些元素涉及到的下层元素也添加进来
     */
    const fullBlowElements = this.getOverWidthBelowElementRelativeElement(belowElements, excludeDragElementInf, reInf);

    /**
     * 需加上占位层信息确保原来同一水平的元素也被检索到
     */
    excludeDragElementInf.push(reInf);
    fullBlowElements.sort((a, b) => a.position.y - b.position.y);


    fullBlowElements.forEach(ele => {
      const position = this.getBelowRangElementMaxPosition(ele, excludeDragElementInf);
      this.updateElementCollection(ele, position);
    });
  }

  private getOverWidthBelowElementRelativeElement(belowElements: ElementInf[], excludeDragElementInf: ElementInf[], replaceElement: ElementInf): ElementInf[] {
    const overWidthElements = belowElements.filter(inf => inf.width > replaceElement.width);
    if (overWidthElements.length > 0) {
      overWidthElements.sort((a, b) => a.position.y - b.position.y);
      overWidthElements.forEach((oeInf, i) => {
        const overWidthBelowElements = excludeDragElementInf.filter(inf =>
          belowElements.findIndex(beInf => beInf.element === inf.element) === -1
          && (
            (inf.position.x >= oeInf.position.x && inf.position.x <= oeInf.rang.x.end) ||
            (inf.rang.x.end >= oeInf.position.x && inf.rang.x.end <= oeInf.rang.x.end) ||
            (inf.position.x <= oeInf.position.x && inf.rang.x.end >= oeInf.rang.x.end)
          )
          && inf.position.y >= oeInf.position.y
          && (i + 1 >= overWidthElements.length ? true : inf.position.y < overWidthElements[i + 1].position.y)
        );

        belowElements.push(...overWidthBelowElements);
      });
    }

    return belowElements;
  }

  private updateElementInf(elementInf: ElementInf, position: { x: number, y: number }): ElementInf {
    elementInf.position = position;
    elementInf.rang.x.start = position.x;
    elementInf.rang.x.end = position.x + elementInf.width;
    elementInf.rang.y.start = position.y;
    elementInf.rang.y.end = position.y + elementInf.height;
    elementInf.middlePoint.x = position.x + Math.floor(elementInf.width / 2);
    elementInf.middlePoint.y = position.y + Math.floor(elementInf.height / 2);
    return elementInf;
  }

  updateElementCollection(elementInf: ElementInf, position: { x: number, y: number }) {
    const newElementInf = this.updateElementInf(elementInf, position);
    for (let i = 0, ii = this.elementInfCollection.length; i < ii; i++) {
      if (this.elementInfCollection[i].element === newElementInf.element) {
        newElementInf.element.style.transform = getTransformByPosition(newElementInf.position);
        this.elementInfCollection[i] = newElementInf;
        return;
      }
    }
  }

  /**
   * 计算容器高度
   * @param {ElementInf[]} eleInf
   */
  calculateContainerHeight(dragElementInf?: ElementInf) {
    let elementInfCollection = this.elementInfCollection;
    if (dragElementInf) {
      elementInfCollection = this.elementInfCollection.filter(inf => inf.element !== dragElementInf.element);
      elementInfCollection.push(this.placeElementInf);
    }

    let max = elementInfCollection[0] ? elementInfCollection[0].rang.y.end : 0;
    elementInfCollection.forEach(inf => {
      if (inf.rang.y.end > max) {
        max = inf.rang.y.end;
      }
    });
    if (this.containerHeight !== max) {
      this.containerHeightUpdate = true;
      this.containerHeight = max;
    } else {
      this.containerHeightUpdate = false;
    }
  }

  getContainerHeight(): number {
    return this.containerHeight;
  }

  getContainerHeightUpdate(): boolean {
    return this.containerHeightUpdate;
  }

  createPlaceDom(element: HTMLElement): ElementInf {
    const placeElement = createPlaceElement(element);
    this.placeElementInf = this.createElementInf(placeElement);
    return this.placeElementInf;
  }

  getPlaceElement(): ElementInf {
    return this.placeElementInf;
  }

  clear() {
    this.containerHeightUpdate = false;
    this.elementWidth = 0;
    this.xPosition = {};
    this.elementInfCollection = [];
    this.placeElementInf = null;
    this.init_complete = false;
  }

  /**
   * 获取基于给予元素，容器中所有元素中比它的坐标y小的元素
   * @param {ElementInf} ele
   * @param {ElementInf[]} collection
   * @returns {{x: number; y: number}}
   */
  private getBelowElementMaxPosition(ele: ElementInf, collection: ElementInf[]): { x: number, y: number } {
    const aboveElements = collection.filter(inf =>
      (
        (inf.position.x >= ele.position.x && inf.position.x <= ele.rang.x.end) ||
        (inf.rang.x.end >= ele.position.x && inf.rang.x.end <= ele.rang.x.end) ||
        (inf.position.x <= ele.position.x && inf.rang.x.end >= ele.rang.x.end)
      )
      && inf.position.y < ele.position.y
    );

    let position;
    if (aboveElements.length === 0) {
      position = {x: ele.position.x, y: 0};
    } else {
      aboveElements.sort((a, b) => b.rang.y.end - a.rang.y.end);
      position = {x: ele.position.x, y: aboveElements[0].rang.y.end + this.gutter * 2};
    }
    return position;
  }

  /**
   * 获取基于给予元素，容器中所有元素中比它的rang.y.end小的元素
   * @param {ElementInf} ele
   * @param {ElementInf[]} collection
   * @returns {{x: number; y: number}}
   */
  private getBelowRangElementMaxPosition(ele: ElementInf, collection: ElementInf[]): { x: number, y: number } {
    const belowElements = collection.filter(inf =>
      (
        (inf.position.x >= ele.position.x && inf.position.x <= ele.rang.x.end) ||
        (inf.rang.x.end >= ele.position.x && inf.rang.x.end <= ele.rang.x.end) ||
        (inf.position.x <= ele.position.x && inf.rang.x.end >= ele.rang.x.end)
      )
      && inf.position.y <= ele.rang.y.end
      && inf.element !== ele.element
    );

    let position;
    if (belowElements.length === 0) {
      position = {x: ele.position.x, y: 0};
    } else {
      belowElements.sort((a, b) => b.rang.y.end - a.rang.y.end);
      position = {x: ele.position.x, y: belowElements[0].rang.y.end + this.gutter * 2};
    }
    return position;
  }
}

export interface ElementInf {
  // 位置
  position: { x: number, y: number };
  // 原始位置
  // originPosition: { x: number, y: number };
  width: number;
  height: number;
  // 元素的范围，4个点位置
  rang: { x: { start: number, end: number }, y: { start: number, end: number } };
  // 元素中点位置
  middlePoint: { x: number; y: number };
  // 元素是否处于位置变更状态
  changed?: boolean;
  element: HTMLElement;
}

export interface ContainerInf {
  width: number;
  col: number;
  padding: number | Padding;
  gutter: number | Padding;
  designSize: number;
}
