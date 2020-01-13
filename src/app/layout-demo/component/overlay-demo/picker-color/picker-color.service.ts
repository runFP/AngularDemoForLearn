import {Injectable} from '@angular/core';

@Injectable()
export class PickerColorService {


  constructor() {
  }

  getStepColor(color: string, step?: number): string[] {
    const d6 = this.d32D6(color);
    const baseIdx = this.getBaseIndex(d6);
    return this.processStep(d6, baseIdx, step);
  }

  /**
   * 颜色统一转换为6位RGB格式
   * @param {string} color 传入颜色
   * @return {stringl[]} 返回RGB格式数组
   */
  private d32D6(color: string): string[] {
    const reg = /(.)/g;
    let c = color.replace('#', '');
    const l = c.length;

    /** 3位颜色替换为6位, ccc => cccccc*/
    if (l === 3) {
      c = c.replace(reg, '$1$1');
    }

    const r = c.slice(0, 2);
    const g = c.slice(2, 4);
    const b = c.slice(4, 6);

    return [r, g, b];
  }


  /**
   * 返回色值最大的索引
   * @param {string[]} c
   * @return {number}
   */
  private getBaseIndex(c: string[]): number {
    const h2d = c.map(h => parseInt(h, 16));
    const max = Math.max(...h2d);
    return h2d.indexOf(max);
  }

  /**
   * 返回颜色的阶梯色数组
   * @param {string[]} color 颜色,为rgb格式,eg: [ff,ff,ff]
   * @param {number} idx 主色
   * @param {number} step 阶梯数
   * @return {string[]}
   */
  private processStep(color: string[], idx: number, step: number = 5): string[] {
    const start = 15;
    const end = 235;
    const rang = end - start;
    const incrment = Math.floor(rang / step);



    const stepColors: string[];
  }


}
