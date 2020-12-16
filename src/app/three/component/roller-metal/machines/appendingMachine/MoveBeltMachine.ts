import {AnimationManager, BaseMachine} from '../baseMachine';
import {AnimationMixer, Group, LoadingManager} from 'three';
import {createAnimation, fixedObjLocalOrigin, loadMtlObj, MtlObjInf} from '../utils';
import {Subject, zip} from 'rxjs';

const SHRINK = 100;
const PATH = [
  {
    name: 'base',
    mtlPath: '/assets/modal/roller/输送带-底座.mtl',
    objPath: '/assets/modal/roller/输送带-底座.obj'
  },
  {
    name: 'vertical',
    mtlPath: '/assets/modal/roller/输送带-上下动.mtl',
    objPath: '/assets/modal/roller/输送带-上下动.obj'
  }
];

export class MoveBeltMachine extends BaseMachine {
  name = 'moveBelt';
  base: MtlObjInf = null;
  moveBelt: MtlObjInf = null;

  group = new Group();
  // 已经进行了位置修复的组，组内包含了最原始的模型对象
  moveBeltGroup = new Group();

  moveVerticalStart = new Subject();
  moveVerticaEnd = new Subject();
  moveVerticalHalfStart = new Subject();

  animationManagers: AnimationManager[] = [
    {name: 'moveBeltMoveVertical', track: null, action: null, clip: null, mixer: null},
  ];

  constructor(manager?: LoadingManager) {
    super(manager);
  }

  init(): Promise<any> {
    this.initAnimation();
    return new Promise<any>(resolve => {
      const allPathLoad = PATH.map(machinePath => loadMtlObj(machinePath.mtlPath, machinePath.objPath, this.manager, SHRINK));
      zip(...allPathLoad).subscribe(([base, moveBelt]) => {
        this.base = base;
        this.moveBelt = moveBelt;

        const [baseG, moveBeltG] = fixedObjLocalOrigin([base, moveBelt]);
        moveBeltG.position.setY(12);
        this.moveBeltGroup.add(moveBeltG);
        this.group.add(baseG, this.moveBeltGroup);
      }, () => {
      }, () => {
        resolve(this);
      });
    });
  }

  private initAnimation() {
    this.initMoveBeltAnimation();
  }

  private initMoveBeltAnimation() {
    const times = [];
    const values = [];
    const mixer = new AnimationMixer(this.moveBeltGroup);
    const verticalDuration = 1.5;
    const verticalDistance = 26;
    const verticalRate = verticalDistance / verticalDuration / 10;

    for (let i = 0, j = verticalDuration * 10; i <= verticalDuration * 10; i++, j--) {
      times.push(i / 10);
      if (i < verticalDuration * 10 / 2) {
        values.push(-verticalRate * i);
      } else {
        values.push(-verticalRate * j);
      }
    }

    const verticalAnimation = createAnimation('.position[y]', 'moveBeltMoveVertical', times, values, mixer, verticalDuration);
    console.log(verticalAnimation);
    Object.assign(this.getAnimationManager('moveBeltMoveVertical'), {...verticalAnimation, mixer});
    mixer.addEventListener('finished', () => {
      this.moveVerticaEnd.next(this.moveBeltGroup);
    });
  }

  playMoveBeltVertical(duration = 0.2) {
    this.isPlay = true;
    this.moveVerticalStart.next(this.moveBeltGroup);
    this.fadeToAction('moveBeltMoveVertical', duration);
  }

  /**
   * 不采用以往将多段动画来控制动画的循序，
   * 而是通过判断当前动画根元素位置来分拆一段动画，可以精确控制动画的位移，但比较复杂，这里的-12为上面verticalDistance的一半得出
   */
  checkMoveBeltVerticalHalfState() {
    if (this.moveBeltGroup.position.y < -12) {
      this.moveVerticalHalfStart.next(this.moveBeltGroup);
      this.getAnimationManager('moveBeltMoveVertical').action.paused = true;
    }
  }

  playMoveBeltVerticalContinue() {
    this.getAnimationManager('moveBeltMoveVertical').action.paused = false;
  }


}
