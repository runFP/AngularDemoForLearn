import {Injectable} from '@angular/core';
import {createShadowElement, getPosition, getTransformByPosition} from './dnd-utils';

@Injectable({
  providedIn: 'root'
})
export class DNDContainerService {
  private containerHeight: number;
  private placeElementInf;
  private static OFFSET_X = 8;
  private static OFFSET_Y = 10;

  elementInfCollection: ElementInf[] = [];

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
      const eleInf = this.createElementInf(ele);
      elementPosition.push(eleInf);
    }

    this.calculateContainerHeight(elementPosition);
    this.elementInfCollection = elementPosition;
    return elementPosition;
  }

  createElementInf(element: HTMLElement): ElementInf {
    const position = getPosition(element);
    // const originPosition = getOriginPosition(element);
    const width = element.offsetWidth || Number(element.style.width.replace('px', ''));
    const height = element.offsetHeight || Number(element.style.height.replace('px', ''));
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

  getElementInfCollection(): ElementInf[] {
    return this.elementInfCollection;
  }

  getElementInfByElement(element: HTMLElement): ElementInf {
    return this.elementInfCollection.find(ele => ele.element === element);
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



    belowElements.forEach(ele => {
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
     * */
    const overWidthElements = belowElements.filter(inf => inf.width > reInf.width);
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
    /** 需加上占位层信息确保原来同一水平的元素也被检索到*/
    excludeDragElementInf.push(reInf);
    belowElements.sort((a, b) => a.position.y - b.position.y);


    belowElements.forEach(ele => {
      const position = this.getBelowRangElementMaxPosition(ele, excludeDragElementInf);
      this.updateElementCollection(ele, position);
    });
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

  public updateElementCollection(elementInf: ElementInf, position: { x: number, y: number }) {
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

  createPlaceDom(element: HTMLElement): ElementInf {
    const placeElement = createShadowElement(element);
    this.placeElementInf = this.createElementInf(placeElement);
    return this.placeElementInf;
  }

  refreshPlace(elementInf: ElementInf, dragElementInf: ElementInf) {
    /**
     * 更新占位层位置
     * 遍历占位符上方元素
     * 找出rang.y.end最大元素,重新校准占位层位置
     */
    const newReInf = this.updateElementInf(this.placeElementInf, elementInf.position);
    const excludeDragElementInf = this.elementInfCollection.filter(inf => inf.element !== dragElementInf.element);
    const position = this.getBelowElementMaxPosition(newReInf, excludeDragElementInf);
    this.updateElementCollection(newReInf, position);

    newReInf.element.style.transform = getTransformByPosition(newReInf.position);
    this.placeElementInf = newReInf;
  }

  getPlaceElement(): ElementInf {
    return this.placeElementInf;
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
      position = {x: ele.position.x, y: aboveElements[0].rang.y.end + DNDContainerService.OFFSET_Y};
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
      position = {x: ele.position.x, y: belowElements[0].rang.y.end + DNDContainerService.OFFSET_Y};
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
