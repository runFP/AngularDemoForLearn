import {
  AnimationClip,
  AnimationMixer, Clock,
  Group,
  LoadingManager, LoopOnce,
  LoopPingPong,
  Vector3,
  VectorKeyframeTrack
} from 'three';
import {Subject, zip} from 'rxjs';
import {createAnimation, fixedObjLocalOrigin, loadMtlObj} from '../utils';
import {AnimationManager, BaseMachine} from '../baseMachine';

const SHRINK = 100;
const PATH = [
  {
    name: 'base',
    mtlPath: '/assets/modal/roller/上料机-静态.mtl',
    objPath: '/assets/modal/roller/上料机-静态.obj'
  },
  {
    name: 'vertical',
    mtlPath: '/assets/modal/roller/上料机-上下移动.mtl',
    objPath: '/assets/modal/roller/上料机-上下移动.obj'
  },
  {
    name: 'horizontal',
    mtlPath: '/assets/modal/roller/上料机-左右平移.mtl',
    objPath: '/assets/modal/roller/上料机-左右平移.obj'
  }
];

const HORIZONTAL_MAX = 12;
const VERTICAL_MAX = 12;


/**
 * 物料机，可上下和左右移动
 */
export class AppendingMachine extends BaseMachine {
  name = 'append';
  // 导入的最原始的模型对象（object3D)
  base = null;
  vertical = null;
  horizontal = null;

  // 已经进行了位置修复的组，组内包含了最原始的模型对象
  verticalGroup = new Group();
  horizontalGroup = new Group();

  // 所有部件的组
  group = new Group();
  // 垂直和上下平移组
  vhGroup = new Group();

  // 上下移动回调
  verticalDownStart = new Subject();
  verticalDownEnd = new Subject();
  verticalUpStart = new Subject();
  verticalUpEnd = new Subject();

  // 左右移动回调
  horizontalGoStart = new Subject();
  horizontalGoEnd = new Subject();
  horizontalBackStart = new Subject();
  horizontalBackEnd = new Subject();


  // 混合/动画控制控制
  animationManagers: AnimationManager[] = [
    {name: 'verticalDown', track: null, action: null, clip: null, mixer: null},
    {name: 'verticalUp', track: null, action: null, clip: null, mixer: null},
    {name: 'horizontalGo', track: null, action: null, clip: null, mixer: null},
    {name: 'horizontalBack', track: null, action: null, clip: null, mixer: null},
  ];

  constructor(manager?: LoadingManager) {
    super(manager);
  }

  /**
   * 初始化 调用任何操作前必须先执行该方法来加载模型并做相应的初始工作
   * @param shrink 缩放比例
   */
  init(shrink: number = 100): Promise<any> {
    this.initAnimation();
    return new Promise(resolve => {
      const allPathLoad = PATH.map(machinePath => loadMtlObj(machinePath.mtlPath, machinePath.objPath, this.manager, SHRINK));
      zip(...allPathLoad).subscribe(([base, vertical, horizontal]) => {
          this.base = base;
          this.vertical = vertical;
          this.horizontal = horizontal;

          // 修复位置
          const [baseG, verticalG, horizontalG] = fixedObjLocalOrigin([base, vertical, horizontal]);

          // 处理3者相对位置，使其完美结合
          horizontalG.position.set(-5, 0, 11.1);
          verticalG.position.set(-5, 0, 11.1);

          // 偏移后再次添加到group，这样可以相对于目前在base上的位置移动
          this.horizontalGroup.add(horizontalG);
          this.verticalGroup.add(verticalG);

          this.vhGroup.add(this.horizontalGroup, this.verticalGroup);
          this.group.add(baseG, this.vhGroup);
          this.isInit = true;
        }, () => {
        }, () => {
          resolve(this);
        }
      );
    });
  }

  private initAnimation() {
    this.initHorizontalAnimation();
    this.initVerticalAnimation();
  }

  private initHorizontalAnimation() {
    const times = [];
    const valuesGo = [];
    const valuesBack = [];
    const duration = 1.5;
    const distance = 15;
    const rate = distance / duration / 10;

    for (let i = 0, j = duration * 10; i <= duration * 10; i++, j--) {
      times.push(i / 10);
      valuesGo.push(rate * i);
      valuesBack.push(rate * j);
    }

    const mixer = new AnimationMixer(this.vhGroup);
    const goAnimation = createAnimation('.position[x]', 'horizontalGo', times, valuesGo, mixer, duration);
    const backAnimation = createAnimation('.position[x]', 'horizontalBack', times, valuesBack, mixer, duration);

    Object.assign(this.getAnimationManager('horizontalGo'), {...goAnimation, mixer});
    Object.assign(this.getAnimationManager('horizontalBack'), {...backAnimation, mixer});
    mixer.addEventListener('finished', () => {
      if (this.activeAction.name === 'horizontalGo') {
        this.horizontalGoEnd.next(this);
        this.playHorizontalBack();
      } else if (this.activeAction.name === 'horizontalBack') {
        this.horizontalBackEnd.next(this);
      }
    });
  }

  private initVerticalAnimation() {
    const times = [];
    const valuesDown = [];
    const valuesUp = [];
    const duration = 0.8;
    const distance = 8;
    const rate = distance / duration / 10;

    for (let i = 0, j = duration * 10; i <= duration * 10; i++, j--) {
      times.push(i / 10);
      valuesDown.push(-i * rate);
      valuesUp.push(-j * rate);
    }

    const mixer = new AnimationMixer(this.verticalGroup);
    const downAnimation = createAnimation('.position[y]', 'verticalDown', times, valuesDown, mixer, duration);
    const upAnimation = createAnimation('.position[y]', 'verticalUp', times, valuesUp, mixer, duration);
    Object.assign(this.getAnimationManager('verticalDown'), {...downAnimation, mixer});
    Object.assign(this.getAnimationManager('verticalUp'), {...upAnimation, mixer});

    mixer.addEventListener('finished', () => {
      if (this.activeAction.name === 'verticalDown') {
        this.verticalDownEnd.next(this);
        this.playVerticalUp();
      } else if (this.activeAction.name === 'verticalUp') {
        this.verticalUpEnd.next(this);
        this.playHorizontalGo();
      }
    });
  }

  /**
   * 上下移动
   */
  moveVertical() {
    /*    this.verticalStart.next(this.verticalGroup);
        this.verticalEnd.next(this.verticalGroup);
        this.verticalGroup.position.setY(-8);*/
  }

  /** 动画相关方法开始 */

  /**
   * 左右移动
   */
  playHorizontalGo(duration = 0.2) {
    this.horizontalGoStart.next(this);
    this.fadeToAction('horizontalGo', duration);
  }

  playHorizontalBack(duration = 0.2) {
    this.horizontalBackStart.next(this);
    this.fadeToAction('horizontalBack', duration);
  }

  /**
   * 左右移动
   */
  playVerticalDown(duration = 0.2) {
    this.verticalDownStart.next(this);
    this.fadeToAction('verticalDown', duration);
  }

  playVerticalUp(duration = 0.2) {
    this.verticalUpStart.next(this);
    this.fadeToAction('verticalUp', duration);
  }

  /** 动画相关方法结束 */

  /**
   * 水平移动
   * @param distance
   */
  moveHorizontal(distance) {
    distance = distance > HORIZONTAL_MAX ? HORIZONTAL_MAX : distance;
    this.vhGroup.position.setX(distance);
  }


}

