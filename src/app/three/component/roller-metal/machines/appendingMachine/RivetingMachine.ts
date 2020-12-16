import {AnimationManager, BaseMachine} from '../baseMachine';
import {AnimationMixer, Group, LoadingManager} from 'three';
import {createAnimation, fixedObjLocalOrigin, loadMtlObj, MtlObjInf} from '../utils';
import {Subject, zip} from 'rxjs';

const SHRINK = 100;
const PATH = [
  {
    name: 'base',
    mtlPath: '/assets/modal/roller/铆接线-贴字.mtl',
    objPath: '/assets/modal/roller/铆接线-贴字.obj'
  }, {
    name: 'overallJig',
    mtlPath: '/assets/modal/roller/整体夹具.mtl',
    objPath: '/assets/modal/roller/整体夹具.obj'
  },
];

export class RivetingMachine extends BaseMachine {
  name = 'riveting';

  group = new Group();
  overallJigGroup = new Group();

  base: MtlObjInf = null;
  overallJig: MtlObjInf = null;

  overallJigVerticalStart = new Subject();
  overallJigVerticalEnd = new Subject<{ group: Group, direction: 1 | -1 }>();
  overallJigRightStart = new Subject();
  overallJigRightEnd = new Subject();
  overallJigLeftStart = new Subject();
  overallJigLeftEnd = new Subject();

  // 混合/动画控制控制
  animationManagers: AnimationManager[] = [
    {name: 'overallJigMoveVertical', track: null, action: null, clip: null, mixer: null},
    {name: 'overallJigMoveRight', track: null, action: null, clip: null, mixer: null},
    {name: 'overallJigMoveLeft', track: null, action: null, clip: null, mixer: null},
  ];

  direction: 1 | -1 = -1;

  constructor(manager?: LoadingManager) {
    super(manager);
  }

  init(): Promise<any> {
    this.initAnimation();
    return new Promise<any>(resolve => {
      const allPathLoad = PATH.map(machinePath => loadMtlObj(machinePath.mtlPath, machinePath.objPath, this.manager, SHRINK));
      zip(...allPathLoad).subscribe(([base, overallJig]) => {
        this.base = base;
        this.overallJig = overallJig;

        const [baseG, overallJigG] = fixedObjLocalOrigin([base, overallJig]);
        this.overallJigGroup.add(overallJigG);
        this.group.add(baseG, this.overallJigGroup);
      }, () => {
      }, () => {
        resolve(this);
      });
    });
  }

  initAnimation() {
    this.initOverallJigAnimation();
  }

  initOverallJigAnimation() {
    const times = [];
    const values = [];
    const mixer = new AnimationMixer(this.overallJigGroup);
    const verticalDuration = 1.5;
    const horizontalDuration = 1.5;
    const verticalDistance = 16;
    const verticalRate = verticalDistance / verticalDuration / 10;
    const horizontalDistance = 24;
    const horizontalRate = horizontalDistance / horizontalDuration / 10;

    // move vertical
    for (let i = 0, j = verticalDuration * 10; i <= verticalDuration * 10; i++, j--) {
      times.push(i / 10);
      if (i < verticalDuration * 10 / 2) {
        values.push(-i * verticalRate);
      } else {
        values.push(-j * verticalRate);
      }
    }

    const verticalAnimation = createAnimation('.position[y]', 'overallJigMoveVertical', times.slice(), values.slice(), mixer, verticalDuration);
    Object.assign(this.getAnimationManager('overallJigMoveVertical'), {...verticalAnimation, mixer});


    // move right
    times.length = 0;
    values.length = 0;
    for (let i = 0; i <= horizontalDuration * 10; i++) {
      times.push(i / 10);
      values.push(i * horizontalRate);
    }

    const rightAnimation = createAnimation('.position[x]', 'overallJigMoveRight', times, values.slice(), mixer, horizontalDuration);
    Object.assign(this.getAnimationManager('overallJigMoveRight'), {...rightAnimation, mixer});

    // move left
    values.length = 0;
    for (let i = horizontalDuration * 10; i >= 0; i--) {
      values.push(i * horizontalRate);
    }

    const leftAnimation = createAnimation('.position[x]', 'overallJigMoveLeft', times, values.slice(), mixer, horizontalDuration);
    Object.assign(this.getAnimationManager('overallJigMoveLeft'), {...leftAnimation, mixer});

    mixer.addEventListener('finished', () => {
      if (this.activeAction.name === 'overallJigMoveVertical') {
        this.overallJigVerticalEnd.next({group: this.overallJigGroup, direction: this.direction});
      } else if (this.activeAction.name === 'overallJigMoveRight') {
        this.overallJigRightEnd.next(this.overallJigGroup);
      } else if (this.activeAction.name === 'overallJigMoveLeft') {
        this.overallJigLeftEnd.next(this.overallJigGroup);
      }
    });

  }

  playOverallJigVertical(duration = 0.2) {
    this.isPlay = true;
    this.overallJigVerticalStart.next();
    this.direction = this.activeAction && this.activeAction.name === 'overallJigMoveRight' ? 1 : -1;
    this.fadeToAction('overallJigMoveVertical', duration);
  }

  playOverallJigRight(duration = 0.2) {
    this.isPlay = true;
    this.overallJigRightStart.next(this.overallJigGroup);
    this.fadeToAction('overallJigMoveRight', duration);
  }

  playOverallJigLeft(duration = 0.2) {
    this.isPlay = true;
    this.overallJigLeftStart.next(this.overallJigGroup);
    this.fadeToAction('overallJigMoveLeft', duration);
  }
}
