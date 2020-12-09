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
import {fixedObjLocalOrigin, loadMtlObj} from '../utils';
import {AnimationManager, BaseMachine} from '../baseMachine';

const SHRINK = 100;

const PATH = {
  BASE: {
    'MTL_PATH': '/assets/modal/roller/上料机-静态.mtl',
    'OBJ_PATH': '/assets/modal/roller/上料机-静态.obj'
  },
  VERTICAL: {
    'MTL_PATH': '/assets/modal/roller/上料机-上下移动.mtl',
    'OBJ_PATH': '/assets/modal/roller/上料机-上下移动.obj'
  },
  HORIZONTAL: {
    'MTL_PATH': '/assets/modal/roller/上料机-左右平移.mtl',
    'OBJ_PATH': '/assets/modal/roller/上料机-左右平移.obj'
  }
};

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
  baseGroup: Group;
  verticalGroup: Group;
  horizontalGroup: Group;

  // 所有部件的组
  group: Group;
  // 垂直和上下平移组
  vhGroup: Group;

  // 上下移动回调
  verticalStart = new Subject();
  verticalEnd = new Subject();

  // 左右移动回调
  horizontalStart = new Subject();
  horizontalEnd = new Subject();

  // 动画控制
  horizontalAction;
  verticalAction;
  vhAction;

  // 混合/动画控制控制
  animationManagers: AnimationManager[] = [
    {name: 'vertical', track: null, action: null, clip: null, mixer: null},
    // {name: 'vertical', track: null, action: null, clip: null, mixer: new AnimationMixer(this.verticalGroup)},
    {name: 'vh', track: null, action: null, clip: null, mixer: null},
  ];

  vhActionId = null;

  // 是否已初始化
  isInit = false;

  camera;
  renderer;
  scene;

  constructor(manager?: LoadingManager) {
    super(manager);

    this.verticalGroup = new Group();
    this.horizontalGroup = new Group();
    this.group = new Group();
    this.vhGroup = new Group();
    this.baseGroup = new Group();
    this.verticalGroup.name = 'verticalGroup';
    this.horizontalGroup.name = 'horizontalGroup';
    this.group.name = 'group';
    this.vhGroup.name = 'vhGroup';
    this.baseGroup.name = 'baseGroup';
  }


  /**
   * 初始化 调用任何操作前必须先执行该方法来加载模型并做相应的初始工作
   * @param shrink 缩放比例
   */
  init(camera, renderer, scene, shrink: number = 100): Promise<any> {
    this.camera = camera;
    this.renderer = renderer;
    this.scene = scene;

    this.createAnimation();
    return new Promise(resolve => {
      zip(loadMtlObj(PATH.BASE.MTL_PATH, PATH.BASE.OBJ_PATH, this.manager, SHRINK),
        loadMtlObj(PATH.VERTICAL.MTL_PATH, PATH.VERTICAL.OBJ_PATH, this.manager, SHRINK),
        loadMtlObj(PATH.HORIZONTAL.MTL_PATH, PATH.HORIZONTAL.OBJ_PATH, this.manager, SHRINK))
        .subscribe(([base, vertical, horizontal]) => {
            this.base = base;
            this.vertical = vertical;
            this.horizontal = horizontal;

            // 修复位置
            const [baseG, verticalG, horizontalG] = fixedObjLocalOrigin([base, vertical, horizontal]);

            // 处理3者相对位置，使其完美结合
            horizontalG.position.set(-5, 6.2, 11.1);
            verticalG.position.set(-5, 10, 11.1);

            this.baseGroup.add(baseG);
            // 偏移后再次添加到group，这样可以相对于目前在base上的位置移动
            this.horizontalGroup.add(horizontalG);
            this.verticalGroup.add(verticalG);

            this.vhGroup.add(this.horizontalGroup, this.verticalGroup);
            // this.group.add(this.baseGroup, this.horizontalGroup, this.verticalGroup);
            this.group.add(this.baseGroup, this.vhGroup);
            this.isInit = true;
          }, () => {
          }, () => {
            resolve(this);
          }
        );
    });
  }

  private createAnimation() {
    this.createHorizontalAnimation();
    this.createVerticalAnimation();
  }

  private createHorizontalAnimation() {
    const times = [];
    const values = [];
    const tmp = new Vector3();
    const duration = 3;

    for (let i = 0, j = duration * 10 ; i <= duration * 10; i++, j--) {
      times.push(i / 10);
      if (i > duration * 10 / 2) {
        tmp.setX(j).toArray(values, values.length);
      } else {
        tmp.setX(i).toArray(values, values.length);
      }
    }

    const mixer = new AnimationMixer(this.vhGroup);
    const track = new VectorKeyframeTrack('.position', times, values);
    const clip = new AnimationClip('vhMove', duration, [track]);
    const action = mixer.clipAction(clip);
    action.clampWhenFinished = true;
    action.loop = LoopOnce;
    mixer.addEventListener('finished', () => {
      this.playVertical();
      this.horizontalEnd.next(this.vhGroup);
    });
    Object.assign(this.getAnimationManager('vh'), {track, clip, action, mixer});
  }

  private createVerticalAnimation() {
    const times = [];
    const values = [];
    const tmp = new Vector3();
    const duration = 1.6;

    for (let i = 0, j = duration * 10; i < duration * 10; i++, j--) {
      times.push(i / 10);
      if (i > duration * 10 / 2) {
        tmp.setY(-j).toArray(values, values.length);
      } else {
        tmp.setY(-i).toArray(values, values.length);
      }
    }

    const mixer = new AnimationMixer(this.verticalGroup);
    const track = new VectorKeyframeTrack('.position', times, values);
    const clip = new AnimationClip('verticalMove', duration, [track]);
    const action = mixer.clipAction(clip);
    action.clampWhenFinished = true;
    action.loop = LoopOnce;
    mixer.addEventListener('finished', () => {
      this.playHorizontal();
      this.horizontalEnd.next(this.horizontalGroup);
    });
    Object.assign(this.getAnimationManager('vertical'), {track, clip, action, mixer});
  }

  private getAnimationManager(name: string): AnimationManager {
    const matchAm = this.animationManagers.find(am => am.name === name);
    if (!matchAm) {
      throw new Error('动画管理器名字不匹配');
    }
    return matchAm;
  }

  /**
   * 上下移动
   */
  moveVertical() {
    this.verticalStart.next(this.verticalGroup);
    this.verticalEnd.next(this.verticalGroup);
    this.verticalGroup.position.setY(-8);
    this.render();
  }

  /** 动画相关方法开始 */

  /**
   * 左右移动
   */
  playHorizontal(duration = 1.2) {
    this.horizontalStart.next(this.horizontalGroup);
    const action = this.getAnimationManager('vh').action;
    action.reset().play();
  }


  /**
   * 左右移动
   */
  playVertical(duration = 0.8) {
    this.horizontalStart.next(this.horizontalGroup);
    const action = this.getAnimationManager('vertical').action;
    action.reset().play();
  }


  /** 动画相关方法结束 */

  /**
   * 水平移动
   * @param distance
   */
  moveHorizontal(distance) {
    distance = distance > HORIZONTAL_MAX ? HORIZONTAL_MAX : distance;
    this.vhGroup.position.setX(distance);
    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

}

