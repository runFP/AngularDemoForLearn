import {AnimationManager, BaseMachine} from '../baseMachine';
import {AnimationMixer, Group, LoadingManager} from 'three';
import {createAnimation, fixedObjLocalOrigin, loadMtlObj, MtlObjInf} from '../utils';
import {Subject, zip} from 'rxjs';

const SHRINK = 100;
const PATH = [
  {
    name: 'base',
    mtlPath: '/assets/modal/roller/小移栽机-上下.mtl',
    objPath: '/assets/modal/roller/小移栽机-上下.obj'
  }, {
    name: 'girder',
    mtlPath: '/assets/modal/roller/小移栽机-横梁.mtl',
    objPath: '/assets/modal/roller/小移栽机-横梁.obj'
  }, {
    name: 'pole',
    mtlPath: '/assets/modal/roller/小移栽机-杆子.mtl',
    objPath: '/assets/modal/roller/小移栽机-杆子.obj'
  }, {
    name: 'clamp',
    mtlPath: '/assets/modal/roller/小移栽机-夹具.mtl',
    objPath: '/assets/modal/roller/小移栽机-夹具.obj'
  }
];

export class SmallCutMachine extends BaseMachine {
  name = 'smallCut';
  // 导入的最原始的模型对象（object3D)
  base: MtlObjInf = null;
  girder: MtlObjInf = null;
  pole: MtlObjInf = null;
  clamp: MtlObjInf = null;

  group = new Group();
  clampGroup = new Group();
  translationGroup = new Group();
  verticalGroup = new Group();

  translationRightStart = new Subject();
  translationRightEnd = new Subject();
  translationLeftStart = new Subject();
  translationLeftEnd = new Subject();
  translationRestoreRightStart = new Subject();
  translationRestoreRightEnd = new Subject();
  translationRestoreLeftStart = new Subject();
  translationRestoreLeftEnd = new Subject();
  clampRightStart = new Subject();
  clampRightEnd = new Subject();
  clampLeftStart = new Subject();
  clampLeftEnd = new Subject();
  clampRestoreRightStart = new Subject();
  clampRestoreRightEnd = new Subject();
  clampRestoreLeftStart = new Subject();
  clampRestoreLeftEnd = new Subject();
  verticalStart = new Subject();
  verticalEnd = new Subject();

  previousActionsType = {'translation': null, 'clamp': null, 'vertical': null};


  // 混合/动画控制控制
  animationManagers: AnimationManager[] = [
    {name: 'translationRight', track: null, action: null, clip: null, mixer: null},
    {name: 'translationLeft', track: null, action: null, clip: null, mixer: null},
    {name: 'translationRestoreRight', track: null, action: null, clip: null, mixer: null},
    {name: 'translationRestoreLeft', track: null, action: null, clip: null, mixer: null},
    {name: 'clampRight', track: null, action: null, clip: null, mixer: null},
    {name: 'clampLeft', track: null, action: null, clip: null, mixer: null},
    {name: 'clampRestoreRight', track: null, action: null, clip: null, mixer: null},
    {name: 'clampRestoreLeft', track: null, action: null, clip: null, mixer: null},
    {name: 'vertical', track: null, action: null, clip: null, mixer: null},
  ];

  constructor(manager?: LoadingManager, loop = false) {
    super(manager);
    this.loop = loop;
  }

  init(): Promise<any> {
    this.initAnimation();
    return new Promise<any>(resolve => {
      const allPathLoad = PATH.map(machinePath => loadMtlObj(machinePath.mtlPath, machinePath.objPath, this.manager, SHRINK));
      zip(...allPathLoad).subscribe(([base, girder, pole, clamp]) => {
        this.base = base;
        this.girder = girder;
        this.pole = pole;
        this.clamp = clamp;

        const [baseG, girderG, poleG, clampG] = fixedObjLocalOrigin([base, girder, pole, clamp]);

        this.clampGroup.add(clampG);
        this.translationGroup.add(poleG, this.clampGroup);
        this.verticalGroup.add(baseG, this.translationGroup);
        this.group.add(girderG, this.verticalGroup, this.verticalGroup);
      }, () => {
      }, () => {
        resolve(this);
      });
    });
  }

  private initAnimation() {
    this.initTranslationMoveAnimation();
    this.initClampMoveAnimation();
    this.initVerticalMoveAnimation();
  }

  private initTranslationMoveAnimation(duration = 2.2) {
    const times = [];
    const valuesR = [];
    const valuesL = [];
    const valuesRR = [];
    const valuesRL = [];
    const distance = 6;
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
      if (this.previousActionsType['translation'].name === 'translationRight') {
        this.translationRightEnd.next(this.translationGroup);
        this.playClampRestoresLeft();
        // this.playVertical();
      } else if (this.previousActionsType['translation'].name === 'translationLeft') {
        this.translationLeftEnd.next(this.translationGroup);
        this.playClampLeft();
        // this.playVertical();
      } else if (this.previousActionsType['translation'].name === 'translationRestoreRight') {
        this.translationRestoreRightEnd.next(this.translationGroup);
        this.playClampRestoresRight();
        // 一直循环
        if (this.loop) {
          this.playTranslationLeft();
        }
      } else if (this.previousActionsType['translation'].name === 'translationRestoreLeft') {
        this.translationRestoreLeftEnd.next(this.translationGroup);
        this.playTranslationRight();
      }
    });

    Object.assign(this.getAnimationManager('translationRight'), {...rightAnimation, mixer});
    Object.assign(this.getAnimationManager('translationLeft'), {...leftAnimation, mixer});
    Object.assign(this.getAnimationManager('translationRestoreRight'), {...restoresRightAnimation, mixer});
    Object.assign(this.getAnimationManager('translationRestoreLeft'), {...restoresLeftAnimation, mixer});
  }

  private initClampMoveAnimation(duration = 1.4) {
    const times = [];
    const valuesR = [];
    const valuesL = [];
    const valuesRR = [];
    const valuesRL = [];
    const distance = 10;
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

    const mixer = new AnimationMixer(this.clampGroup);
    const rightAnimation = createAnimation('.position[x]', 'clampRight', times, valuesR, mixer, duration);
    const leftAnimation = createAnimation('.position[x]', 'clampLeft', times, valuesL, mixer, duration);
    const restoresRightAnimation = createAnimation('.position[x]', 'clampRestoreRight', times, valuesRR, mixer, duration);
    const restoresLeftAnimation = createAnimation('.position[x]', 'clampRestoreLeft', times, valuesRL, mixer, duration);

    mixer.addEventListener('finished', (e) => {
      if (this.previousActionsType['clamp'].name === 'clampRight') {
        this.clampRightEnd.next(this.translationGroup);
        this.playVertical();
      } else if (this.previousActionsType['clamp'].name === 'clampLeft') {
        this.clampLeftEnd.next(this.translationGroup);
        this.playVertical();
      } else if (this.previousActionsType['clamp'].name === 'clampRestoreRight') {
        this.clampRestoreRightEnd.next(this.translationGroup);
      } else if (this.previousActionsType['clamp'].name === 'clampRestoreLeft') {
        this.clampRestoreLeftEnd.next(this.translationGroup);
        this.playClampRight();
      }
    });

    Object.assign(this.getAnimationManager('clampRight'), {...rightAnimation, mixer});
    Object.assign(this.getAnimationManager('clampLeft'), {...leftAnimation, mixer});
    Object.assign(this.getAnimationManager('clampRestoreRight'), {...restoresRightAnimation, mixer});
    Object.assign(this.getAnimationManager('clampRestoreLeft'), {...restoresLeftAnimation, mixer});
  }

  private initVerticalMoveAnimation(duration = 0.6) {
    const times = [];
    const values = [];
    const distance = 6;
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
      if (this.previousActionsType['translation'].name === 'translationRight') {
        this.playRestoresRight();
      } else if (this.previousActionsType['translation'].name === 'translationLeft') {
        this.playRestoresLeft();
      }
      this.verticalEnd.next(this.verticalGroup);
    });

    Object.assign(this.getAnimationManager('vertical'), {...animation, mixer});
  }

  playTranslationRight(duration = 0.2) {
    this.isPlay = true;
    this.translationRightStart.next(this.translationGroup);
    this.multipleFadeToAction('translationRight', 0.2, 'translation');
  }

  playTranslationLeft(duration = 0.2) {
    this.isPlay = true;
    this.translationLeftStart.next(this.translationGroup);
    this.multipleFadeToAction('translationLeft', 0.2, 'translation');
  }

  playRestoresRight(duration = 0.2) {
    this.isPlay = true;
    this.translationRestoreRightStart.next(this.translationGroup);
    this.multipleFadeToAction('translationRestoreRight', 0.2, 'translation');
  }

  playRestoresLeft(duration = 0.2) {
    this.isPlay = true;
    this.clampRestoreLeftStart.next(this.translationGroup);
    this.multipleFadeToAction('translationRestoreLeft', 0.2, 'translation');
  }

  /** 抓手*/
  playClampRight(duration = 0.2) {
    this.isPlay = true;
    this.clampRightStart.next(this.clampGroup);
    this.multipleFadeToAction('clampRight', 0.2, 'clamp');
  }

  playClampLeft(duration = 0.2) {
    this.isPlay = true;
    this.clampLeftStart.next(this.clampGroup);
    this.multipleFadeToAction('clampLeft', 0.2, 'clamp');
  }

  playClampRestoresRight(duration = 0.2) {
    this.isPlay = true;
    this.clampRestoreRightStart.next(this.clampGroup);
    this.multipleFadeToAction('clampRestoreRight', 0.2, 'clamp');
  }

  playClampRestoresLeft(duration = 0.2) {
    this.isPlay = true;
    this.clampRestoreLeftStart.next(this.clampGroup);
    this.multipleFadeToAction('clampRestoreLeft', 0.2, 'clamp');
  }

  playVertical(duration = 1.2) {
    this.isPlay = true;
    this.verticalStart.next(this.verticalGroup);
    this.multipleFadeToAction('vertical', duration, 'vertical');
  }
}
