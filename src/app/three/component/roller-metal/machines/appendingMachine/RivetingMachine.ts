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

  overallJigDownStart = new Subject();
  overallJigDownEnd = new Subject();
  overallJigUpStart = new Subject();
  overallJigUpEnd = new Subject();
  overallJigRightStart = new Subject();
  overallJigRightEnd = new Subject();
  overallJigLeftStart = new Subject();
  overallJigLeftEnd = new Subject();

  // 混合/动画控制控制
  animationManagers: AnimationManager[] = [
    {name: 'overallJigMoveDown', track: null, action: null, clip: null, mixer: null},
    {name: 'overallJigMoveUp', track: null, action: null, clip: null, mixer: null},
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
        overallJigG.position.setX(4.5);
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
    const verticalTimes = [];
    const values = [];
    const downValues = [];
    const upValues = [];
    const mixer = new AnimationMixer(this.overallJigGroup);
    const verticalDuration = 3;
    const horizontalDuration = 3;
    const verticalDistance = 8;
    const verticalRate = verticalDistance / verticalDuration / 10;
    const horizontalDistance = 20;
    const horizontalRate = horizontalDistance / horizontalDuration / 10;

    // move vertical
    for (let i = 0, j = verticalDuration * 10; i <= verticalDuration * 10; i++, j--) {
      verticalTimes.push(i / 10);
      downValues.push(-i * verticalRate);
      upValues.push(-j * verticalRate);
    }


    const downAnimation = createAnimation('.position[y]', 'overallJigMoveDown', verticalTimes, downValues, mixer, verticalDuration);
    const upAnimation = createAnimation('.position[y]', 'overallJigMoveUp', verticalTimes, upValues, mixer, verticalDuration);
    Object.assign(this.getAnimationManager('overallJigMoveDown'), {...downAnimation, mixer});
    Object.assign(this.getAnimationManager('overallJigMoveUp'), {...upAnimation, mixer});


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
      if (this.activeAction.name === 'overallJigMoveDown') {
        this.overallJigDownEnd.next(this);
        this.playOverallJigUp();
      } else if (this.activeAction.name === 'overallJigMoveUp') {
        this.overallJigUpEnd.next(this);
      } else if (this.activeAction.name === 'overallJigMoveRight') {
        this.overallJigRightEnd.next(this);
      } else if (this.activeAction.name === 'overallJigMoveLeft') {
        this.overallJigLeftEnd.next(this);
      }
    });

  }

  playOverallJigDown(duration = 0.2) {
    this.isPlay = true;
    this.overallJigDownStart.next(this);
    this.fadeToAction('overallJigMoveDown', duration);
  }

  playOverallJigUp(duration = 0.2) {
    this.isPlay = true;
    this.overallJigUpStart.next(this);
    this.fadeToAction('overallJigMoveUp', duration);
  }

  playOverallJigRight(duration = 0.2) {
    this.isPlay = true;
    this.overallJigRightStart.next(this);
    this.direction =  1;
    this.fadeToAction('overallJigMoveRight', duration);
  }

  playOverallJigLeft(duration = 0.2) {
    this.isPlay = true;
    this.overallJigLeftStart.next(this);
    this.direction =  -1;
    this.fadeToAction('overallJigMoveLeft', duration);
  }
}
