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
  name: 'smallCut';
  // 导入的最原始的模型对象（object3D)
  base: MtlObjInf = null;
  girder: MtlObjInf = null;
  pole: MtlObjInf = null;
  clamp: MtlObjInf = null;

  group = new Group();
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
  verticalStart = new Subject();
  verticalEnd = new Subject();

  // 混合/动画控制控制
  animationManagers: AnimationManager[] = [
    {name: 'translationRight', track: null, action: null, clip: null, mixer: null},
    {name: 'translationLeft', track: null, action: null, clip: null, mixer: null},
    {name: 'translationRestoreRight', track: null, action: null, clip: null, mixer: null},
    {name: 'translationRestoreLeft', track: null, action: null, clip: null, mixer: null},
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

        const [baseG, girderG, poleG, clampG] = fixedObjLocalOrigin([base, girder, pole, clamp])

        this.translationGroup.add(poleG, clampG);
        this.verticalGroup.add(girderG, this.translationGroup);
        this.group.add(baseG, this.verticalGroup, this.verticalGroup);
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
      if (this.activeAction.name === 'translationRight') {
        this.translationRightEnd.next(this.translationGroup);
        this.playVertical();
      } else if (this.activeAction.name === 'translationLeft') {
        this.translationLeftEnd.next(this.translationGroup);
        this.playVertical();
      } else if (this.activeAction.name === 'translationRestoreRight') {
        this.translationRestoreRightEnd.next(this.translationGroup);
        // 一直循环
        if (this.loop) {
          this.playTranslationLeft();
        }
      } else if (this.activeAction.name === 'translationRestoreLeft') {
        this.translationRestoreLeftEnd.next(this.translationGroup);
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
      if (this.activeAction) {
        if (this.activeAction.name === 'translationRight') {
          this.playRestoresRight();
        } else if (this.activeAction.name === 'translationLeft') {
          this.playRestoresLeft();
        }
      }
      this.verticalEnd.next(this.verticalGroup);
    });

    Object.assign(this.getAnimationManager('vertical'), {...animation, mixer});
  }

  playTranslationRight(duration = 0.2) {
    this.isPlay = true;
    this.translationRightStart.next(this.translationGroup);
    this.fadeToAction('translationRight', 0.2);
  }

  playTranslationLeft(duration = 0.2) {
    this.isPlay = true;
    this.translationLeftStart.next(this.translationGroup);
    this.fadeToAction('translationLeft', 0.2);
  }

  playRestoresRight(duration = 0.2) {
    this.isPlay = true;
    this.translationRestoreRightStart.next(this.translationGroup);
    this.fadeToAction('translationRestoreRight', 0.2);
  }

  playRestoresLeft(duration = 0.2) {
    this.isPlay = true;
    this.translationRestoreLeftStart.next(this.translationGroup);
    this.fadeToAction('translationRestoreLeft', 0.2);
  }

  /**
   * 该动画需要结合playRight或者playLeft以保证x得位置，因此不需要调用fadeToAction
   * @param duration
   */
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
