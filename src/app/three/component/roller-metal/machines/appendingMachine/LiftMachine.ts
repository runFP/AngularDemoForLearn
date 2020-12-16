import {AnimationManager, BaseMachine} from '../baseMachine';
import {AnimationMixer, Group, LoadingManager} from 'three';
import {createAnimation, fixedObjLocalOrigin, fixedObjSingle, loadMtlObj, MtlObjInf} from '../utils';
import {Subject, zip} from 'rxjs';

const SHRINK = 100;
const PATH = [
  {
    name: 'base',
    mtlPath: '/assets/modal/roller/升降机.mtl',
    objPath: '/assets/modal/roller/升降机.obj'
  }
];

const LIFT_BOARD_NAME = 'F34E493086C0720F1D151A9A21C536C13437DF19___E23C37B0E2012A3D0037F3D0B00FBE070210E639';

export class LiftMachine extends BaseMachine {
  name = 'liftMachine';
  base: MtlObjInf = null;

  group = new Group();
  liftBoardGroup = new Group();

  liftBoardMoveUpStart = new Subject();
  liftBoardMoveUpEnd = new Subject();
  liftBoardMoveDownStart = new Subject();
  liftBoardMoveDownEnd = new Subject();
  // 已经进行了位置修复的组，组内包含了最原始的模型对象
  animationManagers: AnimationManager[] = [
    {name: 'liftBoardMoveUp', track: null, action: null, clip: null, mixer: null},
    {name: 'liftBoardMoveDown', track: null, action: null, clip: null, mixer: null},
  ];

  constructor(manager?: LoadingManager) {
    super(manager);
  }

  init(): Promise<any> {
    this.initAnimation();
    return new Promise<any>(resolve => {
      const allPathLoad = PATH.map(machinePath => loadMtlObj(machinePath.mtlPath, machinePath.objPath, this.manager, SHRINK));
      zip(...allPathLoad).subscribe(([base]) => {
        this.base = base;

        const listBoard = base.obj.getObjectByName(LIFT_BOARD_NAME);
        const listBoardG = fixedObjSingle(base, listBoard);
        const [baseG] = fixedObjLocalOrigin([base]);

        this.liftBoardGroup.add(listBoardG);
        this.group.add(baseG, this.liftBoardGroup);
        // this.group.add(baseG);
      }, () => {
      }, () => {
        resolve(this);
      });
    });
  }

  private initAnimation() {
    this.initLiftBoardAnimation();
  }

  private initLiftBoardAnimation() {
    const times = [];
    const valuesUp = [];
    const valuesDown = [];
    const mixer = new AnimationMixer(this.liftBoardGroup);
    const verticalDuration = 1.5;
    const verticalDistance = 24;
    const verticalRate = verticalDistance / verticalDuration / 10;
    for (let i = 0, j = verticalDuration * 10; i <= verticalDuration * 10; i++, j--) {
      times.push(i / 10);
      valuesUp.push(verticalRate * i);
      valuesDown.push(verticalRate * j);
    }
    console.log(valuesUp);
    console.log(valuesDown);
    const upAnimation = createAnimation('.position[y]', 'liftBoardMoveUp', times, valuesUp, mixer, verticalDuration);
    const downAnimation = createAnimation('.position[y]', 'liftBoardMoveDown', times, valuesDown, mixer, verticalDuration);

    mixer.addEventListener('finished', () => {
      if (this.activeAction.name === 'liftBoardMoveUp') {
        this.liftBoardMoveUpEnd.next(this.liftBoardGroup);
      } else {
        this.liftBoardMoveDownEnd.next(this.liftBoardGroup);
      }
    });

    Object.assign(this.getAnimationManager('liftBoardMoveUp'), {...upAnimation, mixer});
    Object.assign(this.getAnimationManager('liftBoardMoveDown'), {...downAnimation, mixer});


  }

  playLiftBoardMoveUp(duration = 0.2) {
    this.isPlay = true;
    this.liftBoardMoveUpStart.next(this.liftBoardGroup);
    this.fadeToAction('liftBoardMoveUp', duration);
  }

  playLiftBoardMoveDown(duration = 0.2) {
    this.isPlay = true;
    this.liftBoardMoveUpStart.next(this.liftBoardGroup);
    this.fadeToAction('liftBoardMoveDown', duration);
  }
}
