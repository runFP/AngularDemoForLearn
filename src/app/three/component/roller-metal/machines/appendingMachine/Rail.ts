import {AnimationManager, BaseMachine} from '../baseMachine';
import {Group, LoadingManager} from 'three';
import {fixedObjLocalOrigin, loadMtlObj} from '../utils';
import {zip} from 'rxjs';

const SHRINK = 100;
const PATH = [
  {
    name: 'base',
    mtlPath: '/assets/modal/roller/整体围栏.mtl',
    objPath: '/assets/modal/roller/整体围栏.obj'
  }
];

export class Rail {
  name: 'rail';
  base = null;
  group = new Group();
  manager: LoadingManager;


  constructor(manager?: LoadingManager) {
    this.manager = manager;
  }

  init(): Promise<any> {
    return new Promise<any>(resolve => {
      const allPathLoad = PATH.map(machinePath => loadMtlObj(machinePath.mtlPath, machinePath.objPath, this.manager, SHRINK));
      zip(...allPathLoad).subscribe(([base, vertical]) => {
        this.base = base;

        const [baseG] = fixedObjLocalOrigin([base]);

        this.group.add(baseG);
      }, () => {
      }, () => {
        resolve(this);
      });
    });
  }
}
