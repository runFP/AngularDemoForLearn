import {ComponentFactory, ComponentFactoryResolver, ComponentRef, Injectable, ViewContainerRef} from '@angular/core';
import {TreeManagerService, TreeNode} from './tree-manager.service';
import {ContainerCellComponent} from './container-cell/container-cell.component';
import {CellComponent} from './cell/cell.component';
import {RootCellComponent} from './root-cell/root-cell.component';

@Injectable()
export class FlexMergeDynamicService {

  private tree: TreeNode | null = null;

  constructor(
    private resolve: ComponentFactoryResolver,
    private treeManager: TreeManagerService,
  ) {
  }

  create(row: number, col: number, rootVcr: ViewContainerRef, baseBCR: DOMRect): TreeNode {
    rootVcr.clear();

    this.tree = this.treeManager.createTree(row, col);
    console.log('tree:', this.tree);

    this.tree.traverseNLR((node: TreeNode) => {
      let nodeRef;
      if (node.children && node.children.length) {
        nodeRef = this.renderComp<ContainerCellComponent>(
          node.id === 'root' ? RootCellComponent : ContainerCellComponent,
          node.id === 'root' ? rootVcr : node.pNode.nodeRef.instance.embeddedVcr);
      } else {
        nodeRef = this.renderComp<CellComponent>(CellComponent, node.pNode.nodeRef.instance.embeddedVcr);
      }

      nodeRef.instance.flex = node.flex;
      nodeRef.instance.flexDirection = node.flexDirection;
      nodeRef.instance.baseBoundingClientRect = baseBCR;

      node.nodeRef = nodeRef;
    });


    return this.tree;
  }

  /**
   * 添加组件渲染
   * @param comp 渲染组件
   * @param {ViewContainerRef} vcr 被插入渲染组件视图
   * @return {ComponentRef<T>} 渲染组件的组件引用
   */
  private renderComp<T>(comp, vcr: ViewContainerRef): ComponentRef<T> {
    const compFactory: ComponentFactory<T> = this.resolve.resolveComponentFactory(comp);
    const compRef: ComponentRef<T> = vcr.createComponent(compFactory);
    return compRef;
  }

  /**
   * 合并指定节点，在树结构发生变化后调用(合并操作后)
   * @param {TreeNode[]} nodes
   */
  merger(nodes: TreeNode[]): void {
    // 是否跨节点
    let multiLine = false;

    // 按照相同的父容器分组node
    const groupNode = this.groupSelectNodeByParent(nodes);


    groupNode.forEach((children, pNode) => {
      // pNode
    });

    // 除去每个父容器中被选择中的剩余的node
    const otherNode = this.otherNodeByParent(groupNode);

    // 可通过父节点数量来判断是否跨节点
    if (groupNode.size > 1) {
      multiLine = true;
    }

    // 判断合并节点的位置,是处于父节点的2边还是中间位置，2边可以把合并节点以外的所有剩余节点纳入1个父节点，中间需要把隔开的2边剩余节点独立分别纳入独立的父节点
    const groupNodePositionInParent = this.processGroupNodePositionInParent(groupNode);

    this.createObjForNodes(otherNode, groupNode, multiLine);
    console.log('groupNode:', groupNode);
    console.log('otherNode:', otherNode);
    console.log('groupNodePositionInParent:', groupNodePositionInParent);
  }

  private processGroupNodePositionInParent(groupNode: Map<TreeNode, TreeNode[]>): Map<TreeNode, GroupNodePositionInParent> {
    const processData: Map<TreeNode, GroupNodePositionInParent> = new Map<TreeNode, GroupNodePositionInParent>();

    groupNode.forEach((childNode: TreeNode[], pNode: TreeNode) => {
      let isAll = false;
      let isBorder = false;
      let isMiddle = false;
      let min = 0;
      let max = 0;
      if (pNode.children.length === childNode.length) {
        isAll = true;
      } else {
        const sortId = childNode.map(node => Number(String(node.id).split('-').splice(-1)[0]));
        min = Math.min.apply(null, sortId);
        max = Math.max.apply(null, sortId);
        if (min === 0 || max === pNode.children.length - 1) {
          isBorder = true;
        } else {
          isMiddle = true;
        }

      }
      const data = {children: childNode, isAll, isBorder, isMiddle, min, max};
      processData.set(pNode, data);
    });

    return processData;
  }

  /**
   * 生成创建节点对象，有5种创建节点对象，
   * 根节点
   *    ->未发生改变节点
   *    ->发生改变节点的通用节点
   *        ->合并节点
   *        ->余下节点
   *
   * ###### 算法 ######
   * 1.判断剩余节点数，并用数组收集
   *    节点数>1,创建新容器节点，并作为子节点赋值
   *    节点数=1,取节点
   *    节点数=0, 先获取节点的父节点的父节点调用获取剩余节点方法，以节点的父节点为参，获取剩余节点
   * 2.创建容器节点，并设置子元素为上方收集的数组
   * 3.合并节点与余下节点均属于通用节点
   *
   * @param {Map<TreeNode, TreeNode[]>} nodes
   * @param {boolean} multiLine 是否跨行
   */
  private createObjForNodes(otherNode: Map<TreeNode, TreeNode[]>, groupNode: Map<TreeNode, TreeNode[]>, multiLine: boolean) {
    const children = [];
    let tmpNode = [];
    // 收集剩余节点，将其作为剩余节点的容器的子节点
    otherNode.forEach((otherNodes: TreeNode[], pNode: TreeNode) => {
      if (otherNodes.length > 1) {
        const otherParentNodeObj = {num: 1, children: []};
        otherNodes.forEach(node => {
          const nodeObj = {num: 1};
          otherParentNodeObj.children.push(nodeObj);
        });

        children.push(otherParentNodeObj);
      } else if (otherNodes.length === 1) {
        const nodeObj = {num: 1};

        children.push(nodeObj);
      } else if (otherNodes.length === 0) {
        // const otherParent = pNode.pNode.getOtherNodes([pNode]);
        //
        // otherParent.forEach(op => {
        //   const otherParentObj = {num: 1, children: []};
        //
        //   if (op.children && op.children.length > 0) {
        //     op.children.forEach(c => {
        //       const cObj = {num: 1};
        //       otherParentObj.children.push(cObj);
        //     });
        //   }
        //   children.push(otherParentObj);
        // });
      }
    });

    // 合并节点和共同节点需要排序

    // 根创建节点对象
    const rootObj = {num: 1, name: 'rootObj', children: []};

    // 收集变更节点距离根节点最近的父节点的排序
    const sortCommonNode = [];
    groupNode.forEach((childrenNode, pNode) => {
      sortCommonNode.push(pNode.getParentNodeByLevel().id);
    });

    // 找出变更节点距离根节点最近的父节点的序号，用来在生成新节点时确定插入的位置
    const sortCommon = Math.min.apply(null, sortCommonNode.sort());

    // 剩余节点的容器节点与合并节点共同的容器节点
    const commonContainerObj = {num: 1, name: 'commonContainerObj', children: [], order: sortCommon};

    // 处理剩余节点，剩余节点的容器节点对象,大于0说明还有剩余，需要加载,仅当跨行时，才需要一个额外节点来包含这些剩余节点
    if (children.length > 0 && multiLine) {
      const otherContainerNodeObj = {num: 1, name: 'otherContainerNodeObj', children: []};
      otherContainerNodeObj.children = children;
      commonContainerObj.children.push(otherContainerNodeObj);
    } else {
      commonContainerObj.children = commonContainerObj.children.concat(children);
    }

    // 处理合并节点
    const mergeNodeObj = {num: 1, name: 'mergeNodeObj'};
    commonContainerObj.children.push(mergeNodeObj);
    tmpNode.push(commonContainerObj);

    // 处理未改动的节点
    const immutableNode = this.getImmutableNode(otherNode);

    if (immutableNode.length > 0) {
      const immutableNodeObj = this.recurseCreateObj(immutableNode, 'immutableNodeObj');
      tmpNode = tmpNode.concat(immutableNodeObj);
      console.log('immutableNodeObj:', immutableNodeObj);
    }

    tmpNode.sort((aNode, bNode) => aNode.order - bNode.order);
    rootObj.children = rootObj.children.concat(tmpNode);

    console.log('commonContainerObj:', commonContainerObj);
    console.log('rootObj:', rootObj);
    console.log('tmpNode:', tmpNode);
  }

  /**
   * 递归生成创建节点对象（创建节点对象是用来创建TreeNode对象)
   * @param {TreeNode[]} nodes
   * @return {any[]}
   */
  private recurseCreateObj(nodes: TreeNode[], name: string) {
    const createNodeObj = [];
    nodes.forEach(node => {
      const obj = {num: 1, name, children: [], order: node.id};
      this.recurseCreate(node, obj);
      createNodeObj.push(obj);
    });
    return createNodeObj;
  }

  private recurseCreate(node: TreeNode, parentObj) {
    node.children.forEach(childNode => {
      const obj = {num: 1, children: []};
      parentObj.children.push(obj);
      this.recurseCreate(childNode, obj);
    });
  }


  /**
   * 获取没发生过改变的节点
   * @param {Map<TreeNode, TreeNode[]>} groupNodes
   * @return {TreeNode[]}
   */
  private getImmutableNode(groupNodes: Map<TreeNode, TreeNode[]>): TreeNode[] {
    const immutableNodes: TreeNode[] = this.tree.children.filter(node => {
      let isMatch = true;

      for (const pn of groupNodes.keys()) {
        let n = pn;
        while (n.levelFromRoot() !== 1) {
          n = pn.pNode;
        }
        if (node === n) {
          isMatch = false;
          return;
        }
      }

      return isMatch;
    });
    return immutableNodes;
  }

  /**
   * 获取选中的节点
   * @param point
   * @return {TreeNode[]}
   */
  getSelectTreeNode(point): TreeNode[] {
    const selectNodes: TreeNode[] = [];
    this.tree.traverseNLR((node: TreeNode) => {
      if (node.isSelect(point)) {
        selectNodes.push(node);
      }
    });
    return selectNodes;
  }

  getSelectTreeNodePosition(point): { left: any[], top: any[] } {
    const position = {left: [], top: []};
    this.tree.traverseLRN((node: TreeNode) => {
      const type = node.selectPosition(point);
      if (type === 'lt') {
        position.left.push(node);
        position.top.push(node);
      } else if (type === 'l') {
        position.left.push(node);
      } else if (type === 't') {
        position.top.push(node);
      }
    });

    return position;
  }

  /**
   * 设置节点对应实例状态
   */
  setSelectStatus(nodes: TreeNode[], bgColor: string): void {
    this.updateSelectStatus(nodes, bgColor);
  }

  /**
   * 删除节点对应实例状态
   * @param {TreeNode[]} selectNodes
   */
  removeSelectStatus(nodes: TreeNode[]): void {
    this.updateSelectStatus(nodes, 'transparent');
  }

  /**
   * 更新节点对应实例状态
   * @param {TreeNode[]} nodes
   * @param {string} bgColor
   */
  private updateSelectStatus(nodes: TreeNode[], bgColor: string): void {
    nodes.forEach((node: TreeNode) => {
      node.nodeRef.instance.bgColor = bgColor;
    });
  }

  /**
   * 按照相同的父元素分组node
   * @param {TreeNode[]} selectNodes
   * @return {Map}
   */
  groupSelectNodeByParent(selectNodes: TreeNode[]): Map<TreeNode, TreeNode[]> {
    return this.treeManager.groupNodeByParent(selectNodes);
  }

  /**
   * 筛选出指定nodes，父元素中余下的nodes
   */
  otherNodeByParent(nodes: Map<TreeNode, TreeNode[]>): Map<TreeNode, TreeNode[]> {
    // nodes.forEach((gn: GroupNodePositionInParent, pNode: TreeNode) => {
    //   if (gn.isAll) {
    //
    //   } else if (gn.isBorder) {
    //     const otherNode = new Map<TreeNode, TreeNode[]>();
    //     otherNode.set(pNode, pNode.getOtherNodes(gn.children));
    //   } else if (gn.isMiddle) {
    //   }
    //
    // });

    // 递归遍历父节点，收集剩余元素
    const otherNode = new Map<TreeNode, TreeNode[]>();
    nodes.forEach((groupNodes: TreeNode[], pNode: TreeNode) => {
      otherNode.set(pNode, pNode.getOtherNodes(groupNodes));
    });
    return otherNode;
  }

  /**
   * 获取横向纵向节点
   */
  getHorizonVerticalNode() {
    const horizon = {left: [], right: []};
    const vertical = {top: [], bottom: []};
  }
}

// 合并节点的详细信息
export interface GroupNodePositionInParent {
  children: TreeNode[];
  isAll: boolean; // 合并节点的父节点的子节点是否全部被纳入合并
  isBorder: boolean; // 合并节点处于2边位置
  isMiddle: boolean; // 合并节点处于中间位置
  min: number; // 合并节点的最小id，仅当isMiddle为true时有用，用来判断前面兄弟节点的结束位置
  max: number; // 合并节点的最大id，仅当isMiddle为true时有用，用来判断后面兄弟节点的起始位置
}

