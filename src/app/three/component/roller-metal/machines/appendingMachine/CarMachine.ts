import {AnimationManager, BaseMachine} from '../baseMachine';
import {AnimationMixer, Group, LoadingManager} from 'three';
import {createAnimation, fixedObjLocalOrigin, loadMtlObj, MtlObjInf} from '../utils';
import {Subject, zip} from 'rxjs';

const SHRINK = 100;
const PATH = [
  {
    name: 'base',
    mtlPath: '/assets/modal/roller/小车.mtl',
    objPath: '/assets/modal/roller/小车.obj'
  }
];

export class CarMachine extends BaseMachine {
  name = 'car';
  base: MtlObjInf = null;

  group = new Group();
  carGroup = new Group();
  // 已经进行了位置修复的组，组内包含了最原始的模型对象

  animationManagers: AnimationManager[] = [
    {name: 'carMove1', track: null, action: null, clip: null, mixer: null},
    {name: 'carMove2', track: null, action: null, clip: null, mixer: null},
    {name: 'carMoveBack', track: null, action: null, clip: null, mixer: null},
  ];

  move1EndPoint;

  mixer = null;

  move1Start = new Subject();
  move1End = new Subject();
  move2Start = new Subject();
  move2End = new Subject();
  moveBackStart = new Subject();
  moveBackEnd = new Subject();

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
        this.carGroup.add(baseG);
        this.group.add(this.carGroup);
      }, () => {
      }, () => {
        resolve(this);
      });
    });
  }

  private initAnimation(): void {
    this.mixer = new AnimationMixer(this.carGroup);
    this.mixer.addEventListener('finished', () => {
      if (this.activeAction) {
        if (this.activeAction.name === 'carMove1') {
          this.move1End.next(this.carGroup);
        } else if (this.activeAction.name === 'carMove2') {
          this.move2End.next(this.carGroup);
        } else if (this.activeAction.name === 'carMoveBack') {
          this.moveBackEnd.next(this.carGroup);
        }
      }
    });
    this.initMove1Animation();
    this.initMove2Animation();
    this.initMoveBackAnimation();
  }

  private initMove1Animation(duration = 1) {
    const times = [];
    const values = [];
    const distance = 4;
    const rate = distance / duration / 10;
    let end = 0;
    for (let i = 0; i <= duration * 10; i++) {
      times.push(i / 10);
      values.push(rate * i);
      end = i;
    }
    this.move1EndPoint = rate * end;

    const animation = createAnimation('.position[x]', 'carMove1', times, values, this.mixer, duration);
    Object.assign(this.getAnimationManager('carMove1'), {...animation, mixer: this.mixer});
  }

  private initMove2Animation(duration = 2.4) {
    const times = [];
    const values = [];
    const distance = 14;
    const rate = distance / duration / 10;
    for (let i = 0; i <= duration * 10; i++) {
      times.push(i / 10);
      values.push(rate * i + this.move1EndPoint);
    }

    const animation = createAnimation('.position[x]', 'carMove2', times, values, this.mixer, duration);
    Object.assign(this.getAnimationManager('carMove2'), {...animation, mixer: this.mixer});
  }

  private initMoveBackAnimation(duration = 2.6) {
    const times = [];
    const values = [];
    const distance = 18;
    const rate = distance / duration / 10;
    for (let i = 0, j = duration * 10; i <= duration * 10; i++, j--) {
      times.push(i / 10);
      values.push(rate * j);
    }

    const animation = createAnimation('.position[x]', 'carMoveBack', times, values, this.mixer, duration);
    Object.assign(this.getAnimationManager('carMoveBack'), {...animation, mixer: this.mixer});
  }

  playMove1(duration = 0.2) {
    this.isPlay = true;
    this.move1Start.next(this.carGroup);
    this.fadeToAction('carMove1', duration);
  }

  playMove2(duration = 0.2) {
    this.isPlay = true;
    this.move2Start.next(this.carGroup);
    this.fadeToAction('carMove2', duration);
  }

  playMoveBack(duration = 0.2) {
    this.isPlay = true;
    this.moveBackStart.next(this.carGroup);
    this.fadeToAction('carMoveBack', duration);
  }


}
