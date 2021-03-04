export function getTransform(transform: string): { x: number, y: number, z: number } {
  const reg = /^.+\((.*)\)/;
  const match = transform.match(reg);
  const transValue = {x: 0, y: 0, z: 0};
  if (match) {
    const valueArr: number | string[] = match[1].split(',');
    valueArr.forEach((v, i) => {
      valueArr[i] = v.replace('px', '');
    });
    transValue.x = Number(valueArr[0]);
    transValue.y = Number(valueArr[1]);
    transValue.z = Number(valueArr[2]);
  }
  return transValue;
}

export function getSize(ele: HTMLElement): { width: number, height: number } {
  return {
    width: ele.offsetWidth,
    height: ele.offsetHeight,
  };
}

export function getCdkGlobalOverlayWrapper(html: HTMLElement) {
  while (html.nodeName !== 'BODY') {
    if (~html.className.indexOf('cdk-global-overlay-wrapper')) {
      return html;
    }
    html = html.parentElement;
  }
  return false;
}

