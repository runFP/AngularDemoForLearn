import {AnimationManager, BaseMachine} from '../baseMachine';
import {AnimationClip, AnimationMixer, Group, LoadingManager, LoopOnce, Vector3, VectorKeyframeTrack} from 'three';
import {createAnimation, fixedObjLocalOrigin, loadMtlObj} from '../utils';
import {Subject, zip} from 'rxjs';

const SHRINK = 100;
const PATH = [
  {
    name: 'base',
    mtlPath: '/assets/modal/roller/移栽机-底座.mtl',
    objPath: '/assets/modal/roller/移栽机-底座.obj'
  },
  {
    name: 'vertical',
    mtlPath: '/assets/modal/roller/移栽机-上下.mtl',
    objPath: '/assets/modal/roller/移栽机-上下.obj'
  },
  {
    name: 'clamp',
    mtlPath: '/assets/modal/roller/移栽机-夹具.mtl',
    objPath: '/assets/modal/roller/移栽机-夹具.obj'
  },
  {
    name: 'translation',
    mtlPath: '/assets/modal/roller/移栽机-平移杆.mtl',
    objPath: '/assets/modal/roller/移栽机-平移杆.obj'
  },
];

export class MoveCutMachine extends BaseMachine {
  name = 'moveCut';
  // 导入的最原始的模型对象（object3D)
  base = null;
  vertical = null;
  clamp = null;
  translation = null;

  group = new Group();
  translationGroup = new Group();
  verticalGroup = new Group();
  clampG = new Group();
  clamp2G = new Group();

  translationRightStart = new Subject();
  translationRightEnd = new Subject();
  translationLeftStart = new Subject();
  translationLeftEnd = new Subject();
  translationRestoreRightStart = new Subject();
  translationRestoreRightEnd = new Subject();
  translationRestoreLeftStart = new Subject();
  translationRestoreLeftEnd = new Subject();
  downStart = new Subject();
  downEnd = new Subject();
  upStart = new Subject();
  upEnd = new Subject();


  // 混合/动画控制控制
  previousActionsType = {translation: null, vertical: null};
  animationManagers: AnimationManager[] = [
    {name: 'translationRight', track: null, action: null, clip: null, mixer: null},
    {name: 'translationLeft', track: null, action: null, clip: null, mixer: null},
    {name: 'translationRestoreRight', track: null, action: null, clip: null, mixer: null},
    {name: 'translationRestoreLeft', track: null, action: null, clip: null, mixer: null},
    {name: 'down', track: null, action: null, clip: null, mixer: null},
    {name: 'up', track: null, action: null, clip: null, mixer: null},
  ];


  constructor(manager?: LoadingManager, loop = false) {
    super(manager);
    this.loop = loop;
  }

  init(): Promise<any> {
    this.initAnimation();
    return new Promise<any>(resolve => {
      const allPathLoad = PATH.map(machinePath => loadMtlObj(machinePath.mtlPath, machinePath.objPath, this.manager, SHRINK));
      zip(...allPathLoad).subscribe(([base, vertical, clamp, translation]) => {
        this.base = base;
        this.vertical = vertical;
        this.clamp = clamp;
        this.translation = translation;

        const [baseG, verticalG, clampG, translationG] = fixedObjLocalOrigin([base, vertical, clamp, translation]);
        const clamp2G = clampG.clone();
        clampG.position.setX(12.5);
        clamp2G.position.setX(-12.5);
        this.clampG.add(clampG);
        this.clamp2G.add(clamp2G);
        this.translationGroup.add(translationG, this.clampG, this.clamp2G);
        this.verticalGroup.add(verticalG, this.translationGroup);
        this.group.add(baseG, this.verticalGroup);
      }, () => {
      }, () => {
        resolve(this);
      });
    });
  }

  private initAnimation() {
    this.initTranslationMoveAnimation();
    this.initVerticalMoveAnimation();
  }

  private initTranslationMoveAnimation(duration = 3) {
    const times = [];
    const valuesR = [];
    const valuesL = [];
    const valuesRR = [];
    const valuesRL = [];
    const distance = 12;
    const rate = distance / duration / 10;

    for (let i = 0, j = duration * 10; i <= duration * 10; i++, j--) {
      times.push(i / 10);
      // right
      valuesR.push(rate * i);
      // left
      valuesL.push(-rate * i);
      // restoreRight
      valuesRR.push(rate * j);
      // restoreLeft
      valuesRL.push(-rate * j);
    }

    const mixer = new AnimationMixer(this.translationGroup);
    const rightAnimation = createAnimation('.position[x]', 'translationRight', times, valuesR, mixer, duration);
    const leftAnimation = createAnimation('.position[x]', 'translationLeft', times, valuesL, mixer, duration);
    const restoresRightAnimation = createAnimation('.position[x]', 'translationRestoreRight', times, valuesRR, mixer, duration);
    const restoresLeftAnimation = createAnimation('.position[x]', 'translationRestoreLeft', times, valuesRL, mixer, duration);

    mixer.addEventListener('finished', (e) => {
      if (this.activeAction.name === 'translationRight') {
        this.translationRightEnd.next(this);
        this.playDown();
      } else if (this.activeAction.name === 'translationLeft') {
        this.translationLeftEnd.next(this);
        this.playDown();
      } else if (this.activeAction.name === 'translationRestoreRight') {
        this.translationRestoreRightEnd.next(this);
        // 一直循环
        if (this.loop) {
          this.playTranslationLeft();
        }
      } else if (this.activeAction.name === 'translationRestoreLeft') {
        this.translationRestoreLeftEnd.next(this);
        this.playTranslationRight();
      }
    });

    Object.assign(this.getAnimationManager('translationRight'), {...rightAnimation, mixer});
    Object.assign(this.getAnimationManager('translationLeft'), {...leftAnimation, mixer});
    Object.assign(this.getAnimationManager('translationRestoreRight'), {...restoresRightAnimation, mixer});
    Object.assign(this.getAnimationManager('translationRestoreLeft'), {...restoresLeftAnimation, mixer});
  }

  private initVerticalMoveAnimation(duration = 0.6) {
    const times = [];
    const downValues = [];
    const upValues = [];
    const distance = 1.5;
    const rate = distance / duration / 10;

    for (let i = 0, j = duration * 10; i <= duration * 10; i++, j--) {
      times.push(i / 10);
      downValues.push(-rate * i);
      upValues.push(-rate * j);
    }

    const mixer = new AnimationMixer(this.verticalGroup);
    const downAnimation = createAnimation('.position[y]', 'vertical', times, downValues, mixer, duration);
    const upAnimation = createAnimation('.position[y]', 'vertical', times, upValues, mixer, duration);

    mixer.addEventListener('finished', (e) => {
      if (this.previousActionsType['vertical'].name === 'down') {
        this.playUp();
        this.downEnd.next(this);
      } else if (this.previousActionsType['vertical'].name === 'up') {
        if (this.previousActionsType['translation'].name === 'translationRight') {
          this.playRestoresRight();
        } else if (this.previousActionsType['translation'].name === 'translationLeft') {
          this.playRestoresLeft();
        }
        this.upEnd.next(this);
      }
    });

    Object.assign(this.getAnimationManager('down'), {...downAnimation, mixer});
    Object.assign(this.getAnimationManager('up'), {...upAnimation, mixer});
  }

  playTranslationRight(duration = 0.2) {
    this.isPlay = true;
    this.translationRightStart.next(this);
    this.multipleFadeToAction('translationRight', duration, 'translation');
  }

  playTranslationLeft(duration = 0.2) {
    this.isPlay = true;
    this.translationLeftStart.next(this);
    this.multipleFadeToAction('translationLeft', duration, 'translation');
  }

  playRestoresRight(duration = 0.2) {
    this.isPlay = true;
    this.translationRestoreRightStart.next(this);
    this.multipleFadeToAction('translationRestoreRight', duration, 'translation');
  }

  playRestoresLeft(duration = 0.2) {
    this.isPlay = true;
    this.translationRestoreLeftStart.next(this);
    this.multipleFadeToAction('translationRestoreLeft', duration, 'translation');
  }

  playDown(duration = 0.2) {
    this.isPlay = true;
    this.downStart.next(this);
    this.multipleFadeToAction('down', duration, 'vertical');
  }

  playUp(duration = 0.2) {
    this.isPlay = true;
    this.upStart.next(this);
    this.multipleFadeToAction('up', duration, 'vertical');
  }
}
