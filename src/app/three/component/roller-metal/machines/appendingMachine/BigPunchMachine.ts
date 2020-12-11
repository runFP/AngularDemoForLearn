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
  {
    name: 'alertLight',
    mtlPath: '/assets/modal/roller/报警灯.mtl',
    objPath: '/assets/modal/roller/报警灯.obj'
  },
];

export class BigPunchMachine extends BaseMachine {
  name = 'bigPunch';

  group = new Group();

  base: MtlObjInf = null;
  vertical: MtlObjInf = null;
  alertLight: MtlObjInf = null;
  alertLightGroup = new Group();
  constructor(manager?: LoadingManager) {
    super(manager);
  }

  init(): Promise<any> {
    return new Promise<any>(resolve => {
      const allPathLoad = PATH.map(machinePath => loadMtlObj(machinePath.mtlPath, machinePath.objPath, this.manager, SHRINK));
      zip(...allPathLoad).subscribe(([base, vertical, alertLight]) => {
        this.base = base;
        this.vertical = vertical;
        this.alertLight = alertLight;

        const [baseG, verticalG, alertLightG] = fixedObjLocalOrigin([base, vertical, alertLight]);

        alertLightG.position.set(23, 70, 25);
        this.alertLightGroup.add(alertLightG);
        this.group.add(baseG, verticalG, this.alertLightGroup);
      }, () => {
      }, () => {
        resolve(this);
      });
    });
  }
}
