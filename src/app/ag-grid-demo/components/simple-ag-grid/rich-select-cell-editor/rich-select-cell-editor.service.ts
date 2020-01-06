import {Injectable} from '@angular/core';

@Injectable()
export class RichSelectCellEditorService {
  /**
   * 获取gird的所有列值(去重)
   * @param api
   * @param column
   * @return {string[]}
   */
  getColumnsList(api, column): string[] {
    const list: string[] = [];
    api.forEachNode(node => list.push(api.getValue(column, node)));
    return [...new Set(list)];
  }
}
