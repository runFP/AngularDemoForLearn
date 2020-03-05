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
  return transformArray.map(str => str.match(numberType ? pixelNumReg : pixelReg).map(i => numberType ? Number(i) : i));
}
