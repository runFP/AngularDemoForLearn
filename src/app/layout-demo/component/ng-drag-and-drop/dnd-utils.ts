export function getTransform(ele, numberType = false) {
  const reg = /translate3d[^\)]*\)/g;
  const pixelReg = /-?\d+px/g;
  const pixelNumReg = /-?\d+(?=px)/g;
  const transform = ele.style.transform;

  /**
   * 元素拖动后会包含2组translate3d信息（拖动前只有一组）
   * 分别为初始定位和拖动后定位
   */
  const transformArray = transform.match(reg);
  if (transformArray === null) return null;
  return transformArray.map(str => str.match(numberType ? pixelNumReg : pixelReg).map(i => numberType ? Number(i) : i));
}

export function getTransformByPosition(position: { x: number, y: number }): string {
  return `translate3d(${position.x}px,${position.y}px,0px)`;
}

export function getPosition(ele: HTMLElement): { x: number, y: number } {
  const transform = getTransform(ele, true);
  if (transform === null) return null;
  return {
    x: transform[0][0],
    y: transform[0][1],
  };
}

export function getOriginPosition(ele: HTMLElement): { x: number, y: number } {
  const transform = getTransform(ele, true);
  return {
    x: transform.slice(-1)[0][0],
    y: transform.slice(-1)[0][1],
  };
}

/**
 * 为元素创建占位元素
 * @param {HTMLElement} ele
 * @return {HTMLElement}
 */
export function createShadowElement(ele: HTMLElement): HTMLElement {
  const reg =  /-?\d+px/g;
  const height = ele.offsetHeight;
  const width = ele.offsetWidth;
  const transform = ele.style.transform.match(reg);
  const cssText = [
    'background:red',
    `width:${width}px`,
    `height:${height}px`,
    `transform:translate3d(${transform.join(',')})`,
    'position:absolute',
    'z-index:-1',
  ].join(';') + ';';
  const dom = document.createElement('div');
  dom.className = 'placeDom';
  dom.style.cssText = cssText;
  return dom;
}
