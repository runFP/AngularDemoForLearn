import {Injectable} from '@angular/core';
import {MatHeaderCell} from '@angular/material';

const DOWN = 0;
const UP = 240;
const RANG = UP - DOWN;
const COLOR_NAME = {0: 'r', 1: 'g', 2: 'b'};
/** 最大阶梯数 */
const MAX_STEP = 16;

@Injectable()
export class PickerColorService {
  constructor() {
  }

  getStepColor(color: string, step?: number): string[] {
    const d6 = this.d32D6(color);
    const baseIdx = this.getBaseIndex(d6);
    return this.processStep(d6, baseIdx, step).reverse();
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

    return [c.slice(0, 2), c.slice(2, 4), c.slice(4, 6)];
  }


  /**
   * 返回色值最大的索引
   * @param {string[]} c
   * @return {number}
   */
  private getBaseIndex(c: string[]): ColorIndex {
    const h2d = c.map(h => parseInt(h, 16));
    const max = h2d.indexOf(Math.max(...h2d));
    const min = h2d.indexOf(Math.min(...h2d));
    let mid = 0;
    if (max !== min) {
      mid = [0, 1, 2].find(n => n !== max && n !== min);
    }

    return {max, mid, min, equal: max === mid && max === min};
  }

  /**
   * 返回颜色的阶梯色数组
   * @param {string[]} color 颜色,为rgb格式,eg: [ff,ff,ff]
   * @param {number} idx 主色
   * @param {number} step 阶梯数
   * @return {string[]}
   */
  private processStep(color: string[], idx: ColorIndex, step: number = 5): string[] {
    const colorData: ColorData[] = this.getColorData(color, idx, step);
    return this.getColors(colorData, step);
  }

  /**
   * 处理颜色数据，计算RGB对应增量
   * @param {string[]} color
   * @param {ColorIndex} idx
   * @param {number} step
   * @return {ColorData[]}
   */
  private getColorData(color: string[], idx: ColorIndex, step: number): ColorData[] {
    const max = parseInt(color[idx.max], 16);
    let increment = 0;
    /** 灰度处理 */
    if (idx.equal) {
      /** 黑色默认增量为22 */
      increment = max === 0 ? 22 : Math.floor(RANG * max / (step * UP));
    } else {
      increment = Math.floor(RANG / step);
    }
    const data = [];
    /** 确保增量不小于1 */
    const minIncrement = Math.floor(MAX_STEP / step);

    /** 处理颜色数据,计算其余色值和最大色值的比例，来计算对应增量 */
    for (let c = 0; c < color.length; c++) {
      const o = {n: COLOR_NAME[c], v: parseInt(color[c], 16), increment: 0, start: parseInt(color[c], 16)};
      if (c !== idx.max && !idx.equal) {
        o.increment = Math.floor(increment * o.v / max) < minIncrement ? minIncrement : Math.floor(increment * o.v / max);
        if (isNaN(o.increment)) {
          o.increment = minIncrement;
        }
      } else {
        o.increment = increment;
      }
      if (o.v + o.increment * step > UP) {
        o.start = UP - o.increment * step;
      }
      data.push(o);
    }

    /** 确保原来色相，防止原色值低的变成色相 */
    if (!idx.equal) {
      const starts = data.map(o => o.start);
      if (data[idx.max].start !== Math.max(...starts)) {
        data[idx.max].start = Math.max(...starts) + 10;
      }

      if (data[idx.mid].start <= data[idx.min].start) {
        data[idx.mid].start = data[idx.min].start + 5;
      }
    }


    return data;
  }

  /**
   * 返回阶梯颜色
   * @param {ColorData[]} cd
   * @param {number} step
   * @return {string[]}
   */
  private getColors(cd: ColorData[], step: number): string[] {
    const colors = [];
    /** 生成阶梯颜色 */
    for (let s = 1; s <= step; s++) {
      let color = '';
      for (let c = 0; c < cd.length; c++) {
        let value = cd[c].start + cd[c].increment * s;
        if (value > 255) {
          value = 255;
        } else if (value < 0) {
          value = 0;
        }
        color += (value).toString(16).length === 1 ? `0${(value).toString(16)}` : (value).toString(16);
      }
      colors.push(`#${color}`);
    }
    return colors;
  }
}

/**
 * RGB色值大小
 * equal，是否灰度
 */
interface ColorIndex {
  max: number;
  mid: number;
  min: number;
  equal: boolean;
}

/**
 * n 颜色名字 r,g,b
 * v 色值
 * increment 增量，阶梯色的增量
 * start 起始值，若值+增量大于上限要重新计算起始值
 */
interface ColorData {
  n: 'r' | 'g' | 'b';
  v: number;
  increment: number;
  start: number;
}
