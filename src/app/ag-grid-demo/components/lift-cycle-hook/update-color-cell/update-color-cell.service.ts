import {Injectable} from '@angular/core';

@Injectable()
export class UpdateColorCellService {

  constructor() {
  }

  getRecordValue(oldRecord: { [key: string]: string[] } | null | undefined, col: string, color: string): { [key: string]: string[] } {
    let record = {};
    if (oldRecord !== undefined && oldRecord !== null) {
      record = this.filterLastRecord(oldRecord, col);
    }
    return this.setRecord(record, col, color);
  }

  /**
   * 重复变更同一个列时，把上次的列记录去掉
   */
  private filterLastRecord(record: { [key: string]: string[] }, col: string): { [key: string]: string[] } {
    const keys = Object.keys(record);
    for (const c of keys) {
      /** 已记录存在*/
      const idx = record[c].indexOf(col);
      if (idx !== -1) {
        if (keys.length === 1 && record[c].length === 1) {
          return {};
        } else if (record[c].length === 1) {
          delete record[c];
          return {...record};
        } else {
          record[c].splice(idx, 1);
          return {...record};
        }
      }
    }
    return record;
  }

  private setRecord(record: { [key: string]: string[] }, col: string, color: string): { [key: string]: string[] } {
    let newValue;
    /** 已存在记录 */
    if (record) {
      /** 已存在对应颜色记录 */
      if (record[color]) {
        /** 列不存在对应颜色数组中*/
        if (record[color].indexOf(col) === -1) {
          record[color].push(col);
        }
      } else {
        record[color] = [col];
      }
      newValue = {...record};
    } else {
      newValue = {[color]: [col]};
    }
    return {...newValue};
  }
}
