import {AnimationManager, BaseMachine} from '../baseMachine';
import {AnimationMixer, Group, LoadingManager} from 'three';
import {createAnimation, fixedObjLocalOrigin, fixedObjSingle, getObjectByProperty, loadMtlObj, MtlObjInf} from '../utils';
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
  name = 'robot';
  base: MtlObjInf = null;

  group = new Group();
  tongG = new Group();
  arm2G = new Group();
  arm1G = new Group();
  pedestalG = new Group();
  // 已经进行了位置修复的组，组内包含了最原始的模型对象

  tongRotation;
  animationManagers: AnimationManager[] = [
    {name: 'tongRotation', track: null, action: null, clip: null, mixer: null},
  ];

  constructor(manager?: LoadingManager) {
    super(manager);
  }

  init(): Promise<any> {
    this.initAnimation();
    return new Promise<any>(resolve => {
      const allPathLoad = PATH.map(machinePath => loadMtlObj(machinePath.mtlPath, machinePath.objPath, this.manager, SHRINK));
      zip(...allPathLoad).subscribe(([base]) => {
        this.base = base;
        // 抓手
            const tong = getObjectByProperty(base.obj, 'material.name', value => ['Material_A7', 'Material_A8', 'Material_A9'].indexOf(value) !== -1);
            const tongG = fixedObjSingle(base, tong);
            this.tongG.add(tongG);
        /*    // 臂1
            const arm2 = getObjectByProperty(base.obj, 'material.name', value => ['Material_A3', 'Material_A4', 'Material_A5', 'Material_A6'].indexOf(value) !== -1);
            const arm2G = fixedObjSingle(base, arm2);
            this.arm2G.add(arm2G);
            // 臂2
            const arm1 = getObjectByProperty(base.obj, 'material.name', value => ['Material_A2', 'Material_A21'].indexOf(value) !== -1);
            const arm1G = fixedObjSingle(base, arm1);
            this.arm1G.add(arm1G);
            // 底座
            const pedestal = getObjectByProperty(base.obj, 'material.name', value => value === 'Material_A1');
            const pedestalG = fixedObjSingle(base, pedestal);
            this.pedestalG.add(pedestalG);*/

        const [baseG] = fixedObjLocalOrigin([base], true);
        baseG.rotation.set(-Math.PI / 2, 0, 0);
        // this.group.add(baseG, this.pedestalG, this.arm1G, this.arm2G, tong);
        this.group.add(baseG, this.tongG);
      }, () => {
      }, () => {
        resolve(this);
      });
    });
  }

  i = 0;

  playRotation() {
    this.i += 0.25;
    if (this.i > 2) {
      this.i = 0;
    }
    this.group.children[0].rotation.set(Math.PI * this.i, 0, 0);
  }

  private initAnimation() {
    this.initTongAnimation();
    this.initArm2Animation();
    this.initArm1Animation();
    this.initPedestalAnimation();
  }

  private initTongAnimation() {
    const times = [];
    const values = [];
    const mixer = new AnimationMixer(this.tongG);
    const rotationDuration = 2;
    const rotationRate = Math.PI / 2 / 10;

    for (let i = 0; i < rotationDuration * 10; i++) {
      times.push(i / 10);
      values.push(rotationRate * i);
    }

    mixer.addEventListener('finished', () => {

    });
    const rotationAnimation = createAnimation('.rotation[x]', 'tongRotation', times, values, mixer, rotationDuration);
    Object.assign(this.getAnimationManager('tongRotation'), {...rotationAnimation, mixer});
  }

  private initArm2Animation() {
  }

  private initArm1Animation() {
  }

  private initPedestalAnimation() {
  }

  playTongRotation(duration = 0.2) {
    this.isPlay = true;
    this.fadeToAction('tongRotation', duration);
  }

}
