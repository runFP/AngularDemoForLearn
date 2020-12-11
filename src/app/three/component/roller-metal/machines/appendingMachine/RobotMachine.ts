import {AnimationManager, BaseMachine} from '../baseMachine';
import {Group, LoadingManager} from 'three';
import {fixedObjLocalOrigin, loadMtlObj, MtlObjInf} from '../utils';
import {zip} from 'rxjs';

const SHRINK = 100;
const PATH = [
  {
    name: 'base',
    mtlPath: '/assets/modal/roller/robot1.mtl',
    objPath: '/assets/modal/roller/robot1.obj'
  }
];

export class RobotMachine extends BaseMachine {
  name: 'robot';
  base: MtlObjInf = null;

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
      zip(...allPathLoad).subscribe(([base]) => {
        this.base = base;

        const [baseG] = fixedObjLocalOrigin([base]);

        this.group.add(baseG, this.verticalGroup, this.alertLightGroup);
      }, () => {
      }, () => {
        resolve(this);
      });
    });
  }
}
