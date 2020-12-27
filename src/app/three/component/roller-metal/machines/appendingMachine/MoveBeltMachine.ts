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

  moveDownStart = new Subject();
  moveDownEnd = new Subject();
  moveUpStart = new Subject();
  moveUpEnd = new Subject();

  animationManagers: AnimationManager[] = [
    {name: 'moveBeltMoveDown', track: null, action: null, clip: null, mixer: null},
    {name: 'moveBeltMoveUp', track: null, action: null, clip: null, mixer: null},
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
        moveBeltG.position.setY(10);
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
    const valuesDown = [];
    const valuesUp = [];
    const mixer = new AnimationMixer(this.moveBeltGroup);
    const verticalDuration = 1.5;
    const verticalDistance = 10;
    const verticalRate = verticalDistance / verticalDuration / 10;

    for (let i = 0, j = verticalDuration * 10; i <= verticalDuration * 10; i++, j--) {
      times.push(i / 10);
      valuesDown.push(-verticalRate * i);
      valuesUp.push(-verticalRate * j);
    }

    const downAnimation = createAnimation('.position[y]', 'moveBeltMoveDown', times, valuesDown, mixer, verticalDuration);
    const upAnimation = createAnimation('.position[y]', 'moveBeltMoveUp', times, valuesUp, mixer, verticalDuration);
    Object.assign(this.getAnimationManager('moveBeltMoveDown'), {...downAnimation, mixer});
    Object.assign(this.getAnimationManager('moveBeltMoveUp'), {...upAnimation, mixer});
    mixer.addEventListener('finished', () => {
      if (this.activeAction.name === 'moveBeltMoveDown') {
        this.moveDownEnd.next(this);
      } else if (this.activeAction.name === 'moveBeltMoveUp') {
        this.moveUpEnd.next(this);
      }
    });
  }


  /**
   * 不采用以往将多段动画来控制动画的循序，
   * 而是通过判断当前动画根元素位置来分拆一段动画，可以精确控制动画的位移，但比较复杂，这里的-12为上面verticalDistance的一半得出
   */
  playMoveBeltDown(duration = 0.2) {
    this.isPlay = true;
    this.moveDownStart.next(this);
    this.fadeToAction('moveBeltMoveDown', duration);
  }

  playMoveBeltUp(duration = 0.2) {
    this.isPlay = true;
    this.moveUpStart.next(this);
    this.fadeToAction('moveBeltMoveUp', duration);
  }


}
