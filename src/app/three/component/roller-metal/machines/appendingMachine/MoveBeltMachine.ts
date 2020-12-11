import {AnimationManager, BaseMachine} from '../baseMachine';
import {Group, LoadingManager} from 'three';
import {fixedObjLocalOrigin, loadMtlObj, MtlObjInf} from '../utils';
import {zip} from 'rxjs';

const SHRINK = 100;
const PATH = [
  {
    name: 'base',
    mtlPath: '/assets/modal/roller/输送带-底座.mtl',
    objPath: '/assets/modal/roller/输送带-底座.obj'
  },
  {
    name: 'vertical',
    mtlPath: '/assets/modal/roller/输送带-上下动.mtl',
    objPath: '/assets/modal/roller/输送带-上下动.obj'
  }
];

export class MoveBeltMachine extends BaseMachine {
  name: 'moveBelt';
  base: MtlObjInf = null;
  vertical: MtlObjInf = null;

  group = new Group();
  // 已经进行了位置修复的组，组内包含了最原始的模型对象
  verticalGroup = new Group();

  animationManagers: AnimationManager[] = [];

  constructor(manager?: LoadingManager) {
    super(manager);
  }

  init(): Promise<any> {
    return new Promise<any>(resolve => {
      const allPathLoad = PATH.map(machinePath => loadMtlObj(machinePath.mtlPath, machinePath.objPath, this.manager, SHRINK));
      zip(...allPathLoad).subscribe(([base, vertical]) => {
        this.base = base;
        this.vertical = vertical;

        const [baseG, verticalG] = fixedObjLocalOrigin([base, vertical]);

        this.group.add(baseG, verticalG);
      }, () => {
      }, () => {
        resolve(this);
      });
    });
  }
}
