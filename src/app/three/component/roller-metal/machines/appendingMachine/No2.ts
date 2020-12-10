import {AnimationManager, BaseMachine} from '../baseMachine';
import {Group, LoadingManager} from 'three';
import {fixedObjLocalOrigin, loadMtlObj} from '../utils';
import {zip} from 'rxjs';

const SHRINK = 100;
const PATH = [
  {
    name: 'base',
    mtlPath: '/assets/modal/roller/2号-400T.mtl',
    objPath: '/assets/modal/roller/2号-400T.obj'
  }, {
    name: 'vertical',
    mtlPath: '/assets/modal/roller/小冲床-动.mtl',
    objPath: '/assets/modal/roller/小冲床-动.obj'
  },
];

export class No2 extends BaseMachine {
  name: 'no2';
  base = null;
  vertical = null;
  group: Group;

  // 已经进行了位置修复的组，组内包含了最原始的模型对象
  verticalGroup: Group;

  animationManagers: AnimationManager[] = [];

  constructor(manager?: LoadingManager) {
    super(manager);
    this.group = new Group();
    this.verticalGroup = new Group();
    this.group.name = 'group';
    this.verticalGroup.name = 'verticalGroup';
  }

  init(): Promise<any> {
    return new Promise<any>(resolve => {
      const allPathLoad = PATH.map(machinePath => loadMtlObj(machinePath.mtlPath, machinePath.objPath, this.manager, SHRINK));
      zip(...allPathLoad).subscribe(([base, vertical]) => {
        this.base = base;
        this.vertical = vertical;

        const [baseG, verticalG] = fixedObjLocalOrigin([base, vertical]);

        verticalG.position.set(-1.5, 0, 10);
        this.verticalGroup.add(verticalG);
        this.group.add(baseG, this.verticalGroup);
      }, () => {
      }, () => {
        resolve(this);
      });
    });
  }
}
