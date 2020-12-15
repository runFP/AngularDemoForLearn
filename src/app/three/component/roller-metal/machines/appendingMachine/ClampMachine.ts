import {AnimationManager, BaseMachine} from '../baseMachine';
import {AnimationMixer, Group, LoadingManager} from 'three';
import {createAnimation, fixedObjLocalOrigin, loadMtlObj, MtlObjInf} from '../utils';
import {Subject, zip} from 'rxjs';

const SHRINK = 100;
const PATH = [
  {
    name: 'base',
    mtlPath: '/assets/modal/roller/抓手.mtl',
    objPath: '/assets/modal/roller/抓手.obj'
  }
];

export class ClampMachine extends BaseMachine {
  name: 'clamp';
  base: MtlObjInf = null;

  group = new Group();
  clampGroup = new Group();
  // 已经进行了位置修复的组，组内包含了最原始的模型对象

  animationManagers: AnimationManager[] = [
    {name: 'vertical', track: null, action: null, clip: null, mixer: null},
  ];

  moveVerticalStart = new Subject();
  moveVerticalEnd = new Subject();

  constructor(manager?: LoadingManager) {
    super(manager);
  }

  init(): Promise<any> {
    this.initAnimation();
    return new Promise<any>(resolve => {
      const allPathLoad = PATH.map(machinePath => loadMtlObj(machinePath.mtlPath, machinePath.objPath, this.manager, SHRINK));
      zip(...allPathLoad).subscribe(([base]) => {
        this.base = base;

        const [baseG] = fixedObjLocalOrigin([base]);
        this.clampGroup.add(baseG);
        this.group.add(this.clampGroup);
      }, () => {
      }, () => {
        resolve(this);
      });
    });
  }

  private initAnimation() {
    this.initAnimationVertical();
  }

  private initAnimationVertical(duration = 1) {
    const times = [];
    const values = [];

    for (let i = 0, j = duration * 10; i <= duration * 10; i++, j--) {
      times.push(i / 10);
      if (i <= Math.floor(duration * 10 / 2)) {
        values.push(-i);
      } else {
        values.push(-j);
      }
    }

    const mixer = new AnimationMixer(this.clampGroup);
    const animation = createAnimation('.position[y]', 'clampMove', times, values, mixer, duration);
    mixer.addEventListener('finished', () => {
      this.moveVerticalEnd.next(this.clampGroup);
    });

    Object.assign(this.getAnimationManager('vertical'), {...animation, mixer});
  }

  playClampMove() {
    this.isPlay = true;
    this.moveVerticalStart.next(this.clampGroup);
    this.getAnimationManager('vertical').action.reset().play();
  }

}
