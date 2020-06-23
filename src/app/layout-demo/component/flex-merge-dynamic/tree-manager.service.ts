import {ComponentRef, Injectable} from '@angular/core';

@Injectable()
export class TreeManagerService {

  constructor() {
  }

  createTree(row: number, column: number): TreeNode {
    const tree = new TreeNode('root', null);

    for (let r = 0; r < row; r++) {
      const rNode = new TreeNode(r, tree);
      rNode.flex = 1;

      for (let c = 0; c < column; c++) {
        const cNode = new TreeNode(`${r}-${c}`, rNode);
        cNode.flex = 1;
        rNode.children.push(cNode);
      }

      tree.children.push(rNode);
    }

    return tree;
  }

  /**
   * 被选中的cell按照父节点归类
   * @param {TreeNode[]} selectCell
   * @return {Map}
   */
  groupNodeByParent(selectNodes: TreeNode[]): Map<TreeNode, TreeNode[]> {
    const sort = new Map<TreeNode, TreeNode[]>();
    selectNodes.forEach(c => {
      const pNode = c.pNode;
      if (sort.has(pNode)) {
        sort.get(pNode).push(c);
      } else {
        sort.set(pNode, [c]);
      }
    });
    return sort;
  }

}

export class TreeNode {
  id: string | number | null = null; // 节点ID
  pNode: TreeNode | null = null; // 节点父节点
  children: TreeNode[] = []; // 节点子元素
  flex?: number; // 节点占位
  flexDirection = 'row'; // 若是容器节点，flex方向

  nodeRef: ComponentRef<any>; // 节点的组件实例引用

  constructor(id, pNode: TreeNode | null) {
    this.id = id;
    this.pNode = pNode;
  }

  /**
   * 后序遍历所有节点
   * @param {(...arg) => any} callback回调，节点为入参
   */
  traverseLRN(callback?: (...arg) => any): void {
    this.recurse(this, callback, 'LRN');
  }

  /**
   * 前序遍历所有节点
   * @param {(...arg) => any} callback回调，节点为入参
   */
  traverseNLR(callback?: (...arg) => any): void {
    this.recurse(this, callback, 'NLR');
  }

  /**
   * 递归遍历
   * @param {TreeNode} parentNode
   * @param {(...arg) => any} callback
   * @param {string} traverse 前序/后序 NLR|LRN
   */
  private recurse(parentNode: TreeNode, callback: (...arg) => any, traverse: string) {
    if (traverse === 'NLR') {
      callback(parentNode);
    }

    parentNode.children.forEach(node => {
      this.recurse(node, callback, traverse);
    });

    if (traverse === 'LRN') {
      callback(parentNode);
    }
  }

  /**
   * 节点到根的距离
   * @return {number}
   */
  levelFromRoot(): number {
    let node: TreeNode = this;
    let level = 0;

    while (node.id !== 'root') {
      level++;
      node = node.pNode;
    }

    return level;
  }

  /**
   *  指定参数获取距离该节点的对应父节点，1对应直接父节点，2对应父节点的父节点，...一次类推，但级数大于root时，直接返回距离最接近root的父级节点
   * @param {number} level
   * @return {TreeNode}
   */
  getParentNodeByLevel(level = 999): TreeNode {
    let node: TreeNode = this;
    while (node.pNode.id !== 'root') {
      level--;
      node = node.pNode;
    }
    return node;
  }

  /**
   * 节点是否被选中
   * @param point
   * @return {boolean}
   */
  isSelect(point): boolean {
    if (!this.nodeRef.instance.isCell) {
      return false;
    }
    const {x, y, width, height} = this.nodeRef.instance.getDomRect();
    if (
      (
        ((point.p1.x >= x && point.p1.x <= x + width) || (point.p2.x >= x && point.p2.x <= x + width) || (point.p1.x <= x && point.p2.x >= x + width)) &&
        ((point.p1.y >= y && point.p1.y <= y + height) || (point.p3.y >= y && point.p3.y <= y + height) || (point.p1.y <= y && point.p4.y >= y + height))
      ) ||
      (
        ((point.p1.y >= y && point.p1.y <= y + height) || (point.p4.y >= y && point.p4.y <= y + height) || (point.p1.y <= y && point.p4.y >= y + height)) &&
        ((point.p1.x >= x && point.p1.x <= x + width) || (point.p2.x >= x && point.p2.x <= x + width) || (point.p1.x <= x && point.p2.x >= x + width))
      )
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 清空子元素
   */
  removeChildren(): void {
    this.children = [];
  }

  /**
   * 获取除了选中的cell后剩余的cell
   * @param {TreeNode[]} selectCell
   * @return {TreeNode[]}
   */
  getOtherNodes(selectCell: TreeNode[]): TreeNode[] {
    return this.children.filter(c => {
      return !selectCell.some(se => c === se);
    });
  }

}

