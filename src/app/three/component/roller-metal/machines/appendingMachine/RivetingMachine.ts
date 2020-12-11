import {BaseMachine} from '../baseMachine';
import {Group, LoadingManager} from 'three';
import {fixedObjLocalOrigin, loadMtlObj, MtlObjInf} from '../utils';
import {zip} from 'rxjs';

const SHRINK = 100;
const PATH = [
  {
    name: 'base',
    mtlPath: '/assets/modal/roller/铆接线-贴字.mtl',
    objPath: '/assets/modal/roller/铆接线-贴字.obj'
  }, {
    name: 'vertical',
    mtlPath: '/assets/modal/roller/整体夹具.mtl',
    objPath: '/assets/modal/roller/整体夹具.obj'
  },
];

export class RivetingMachine extends BaseMachine {
  name = 'riveting';

  group = new Group();

  base: MtlObjInf = null;
  clamp: MtlObjInf = null;

  constructor(manager?: LoadingManager) {
    super(manager);
  }

  init(): Promise<any> {
    return new Promise<any>(resolve => {
      const allPathLoad = PATH.map(machinePath => loadMtlObj(machinePath.mtlPath, machinePath.objPath, this.manager, SHRINK));
      zip(...allPathLoad).subscribe(([base, clamp]) => {
        this.base = base;
        this.clamp = clamp;

        const [baseG, clampG] = fixedObjLocalOrigin([base, clamp]);

        this.group.add(baseG, clampG);
      }, () => {
      }, () => {
        resolve(this);
      });
    });
  }
}
