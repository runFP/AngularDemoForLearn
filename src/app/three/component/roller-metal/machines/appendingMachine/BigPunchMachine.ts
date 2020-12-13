import {AnimationManager, BaseMachine} from '../baseMachine';
import {createAnimation, fixedObjLocalOrigin, loadMtlObj, MtlObjInf} from '../utils';
import {Subject, zip} from 'rxjs';
import {AnimationMixer, Group, LoadingManager} from 'three';

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
  verticalGroup = new Group();

  verticalStart = new Subject();
  verticalEnd = new Subject();

  // 混合/动画控制控制
  animationManagers: AnimationManager[] = [
    {name: 'vertical', track: null, action: null, clip: null, mixer: null},
  ];

  constructor(manager?: LoadingManager) {
    super(manager);
  }

  init(): Promise<any> {
    this.initAnimation();
    return new Promise<any>(resolve => {
      const allPathLoad = PATH.map(machinePath => loadMtlObj(machinePath.mtlPath, machinePath.objPath, this.manager, SHRINK));
      zip(...allPathLoad).subscribe(([base, vertical, alertLight]) => {
        this.base = base;
        this.vertical = vertical;
        this.alertLight = alertLight;

        const [baseG, verticalG, alertLightG] = fixedObjLocalOrigin([base, vertical, alertLight]);

        alertLightG.position.set(23, 70, 13);
        this.alertLightGroup.add(alertLightG);
        this.verticalGroup.add(verticalG);

        this.group.add(baseG, this.verticalGroup, this.alertLightGroup);
      }, () => {
      }, () => {
        resolve(this);
      });
    });
  }

  private initAnimation() {
    this.initVerticalMoveAnimation();
  }

  initVerticalMoveAnimation(duration = 1.2) {
    const times = [];
    const values = [];
    const distance = 30;
    const rate = distance / duration / 10;

    for (let i = 0, j = duration * 10; i <= duration * 10; i++, j--) {
      times.push(i / 10);
      if (i < duration * 10 / 2) {
        values.push(-rate * i);
      } else {
        values.push(-rate * j);
      }
    }

    const mixer = new AnimationMixer(this.verticalGroup);
    const animation = createAnimation('.position[y]', 'vertical', times, values, mixer, duration);

    mixer.addEventListener('finished', (e) => {
      this.verticalEnd.next(this.verticalGroup);
    });

    Object.assign(this.getAnimationManager('vertical'), {...animation, mixer});
  }

  playVertical(duration = 1.2) {
    this.isPlay = true;
    this.verticalStart.next(this.verticalGroup);
    this.getAnimationManager('vertical').action.reset()
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(1)
      .fadeIn(duration)
      .play();
  }

}
