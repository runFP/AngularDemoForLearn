import {BaseMachine} from '../baseMachine';
import {fixedObjLocalOrigin, loadMtlObj, MtlObjInf} from '../utils';
import {zip} from 'rxjs';
import {Group, LoadingManager} from 'three';

const SHRINK = 100;
const PATH = [
  {
    name: 'base',
    mtlPath: '/assets/modal/roller/大冲床.mtl',
    objPath: '/assets/modal/roller/大冲床.obj'
  },
  {
    name: 'vertical',
    mtlPath: '/assets/modal/roller/大冲床-动态.mtl',
    objPath: '/assets/modal/roller/大冲床-动态.obj'
  },
];

export class BigPunchMachine extends BaseMachine {
  name = 'bigPunch';

  group: Group;


  base: MtlObjInf = null;
  vertical: MtlObjInf = null;

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

        const [baseG, verticalG] = fixedObjLocalOrigin([base, vertical]);

        this.group.add(baseG, verticalG);
      }, () => {
      }, () => {
        resolve(this);
      });
    });
  }
}
