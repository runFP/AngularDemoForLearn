import {AnimationManager, BaseMachine} from '../baseMachine';
import {Group, LoadingManager} from 'three';
import {fixedObjLocalOrigin, loadMtlObj, MtlObjInf} from '../utils';
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
  }, {
    name: 'alertLight',
    mtlPath: '/assets/modal/roller/报警灯.mtl',
    objPath: '/assets/modal/roller/报警灯.obj'
  },
];

export class No4 extends BaseMachine {
  name: 'no4';
  base: MtlObjInf = null;
  vertical: MtlObjInf = null;
  alertLight: MtlObjInf = null;

  group = new Group();
  // 已经进行了位置修复的组，组内包含了最原始的模型对象
  verticalGroup = new Group();
  alertLightGroup = new Group();
  animationManagers: AnimationManager[] = [];

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

        verticalG.position.set(-1.5, 0, 10);
        alertLightG.position.set(12, 50, 25);
        this.verticalGroup.add(verticalG);
        this.alertLightGroup.add(alertLightG);
        this.group.add(baseG, this.verticalGroup,  this.alertLightGroup);
      }, () => {
      }, () => {
        resolve(this);
      });
    });
  }
}
