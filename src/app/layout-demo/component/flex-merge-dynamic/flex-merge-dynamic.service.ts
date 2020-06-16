import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FlexMergeDynamicService {

  private tree: TreeNode | null = null;

  constructor() {
  }

  create(row: number, col: number): void {
    this.tree = this.createTree(row, col);
    console.log(this.tree);
  }

  private createTree(row: number, column: number): TreeNode {
    const tree = {id: 'root', pid: null, children: []};
    for (let r = 0; r < row; r++) {
      const childRow = {
        id: r,
        pid: 'root',
        children: [],
        status: {row: 1},
      };
      for (let c = 0; c < column; c++) {
        childRow.children.push({id: `${r}${c}`, pid: r, status: {col: 1}});
      }
      tree.children.push(childRow);
    }

    return tree;
  }

}

interface TreeNode {
  pid: string | null;
  id: string;
  children: TreeNode[];
  status?: { row?: number, col?: number }; // flex
}
