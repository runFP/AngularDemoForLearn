import {AnimationManager, BaseMachine} from '../baseMachine';
import {Group, LoadingManager} from 'three';
import {fixedObjLocalOrigin, loadMtlObj} from '../utils';
import {zip} from 'rxjs';

const SHRINK = 100;
const PATH = [
  {
    name: 'base',
    mtlPath: '/assets/modal/roller/4号-300T.mtl',
    objPath: '/assets/modal/roller/4号-300T.obj'
  }, {
    name: 'vertical',
    mtlPath: '/assets/modal/roller/小冲床-动.mtl',
    objPath: '/assets/modal/roller/小冲床-动.obj'
  },
];

export class No4 extends BaseMachine {
  name: 'no4';
  base = null;
  vertical = null;
  group: Group;

  animationManagers: AnimationManager[] = [];

  constructor(manager?: LoadingManager) {
    super(manager);
    this.group = new Group();
  }

  init(): Promise<any> {
    return new Promise<any>(resolve => {
      const allPathLoad = PATH.map(machinePath => loadMtlObj(machinePath.mtlPath, machinePath.objPath, this.manager, SHRINK));
      zip(...allPathLoad).subscribe(([base, vertical]) => {
        this.base = base;
        this.vertical = vertical;

        const [baseG, verticalG] = fixedObjLocalOrigin([base]);

        this.group.add(baseG, verticalG);
      }, () => {
      }, () => {
        resolve(this);
      });
    });
  }
}
