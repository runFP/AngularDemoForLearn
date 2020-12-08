import {AnimationClip, AnimationMixer, Clock, Group, LoadingManager, LoopOnce, LoopPingPong, Vector3, VectorKeyframeTrack} from 'three';
import {Subject, zip} from 'rxjs';
import {fixedObjLocalOrigin, loadMtlObj} from '../utils';
import {BaseMachine} from '../baseMachine';

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
const VERTICAL_MIN = -8;


/**
 * 物料机，可上下和左右移动
 */
export class AppendingMachine extends BaseMachine {
  // 导入的最原始的模型对象（object3D)
  base = null;
  vertical = null;
  horizontal = null;

  // 已经进行了位置修复的组，组内包含了最原始的模型对象
  baseGroup: Group;
  verticalGroup: Group = new Group();
  horizontalGroup: Group = new Group();

  // 所有部件的组
  group = new Group();
  // 垂直和上下平移组
  vhGroup = new Group();

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

  vhActionId = null;
  verticalActionId = null;

  // 是否已初始化
  isInit = false;

  constructor(manager?: LoadingManager) {
    super(manager);
  }

  camera;
  renderer;
  scene;

  /**
   * 初始化 调用任何操作前必须先执行该方法来加载模型并做相应的初始工作
   * @param shrink 缩放比例
   */
  init(camera, renderer, scene, shrink: number = 100): Promise<string> {
    this.camera = camera;
    this.renderer = renderer;
    this.scene = scene;
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

            this.baseGroup = baseG;
            // 偏移后再次添加到group，这样可以相对于目前在base上的位置移动
            this.horizontalGroup.add(horizontalG);
            this.verticalGroup.add(verticalG);

            this.vhGroup.add(this.horizontalGroup, this.verticalGroup);
            // this.group.add(this.baseGroup, this.horizontalGroup, this.verticalGroup);
            this.group.add(this.baseGroup, this.vhGroup);
            this.isInit = true;
          }, () => {
          }, () => {
            resolve('complete');
          }
        );
    });
  }


  /** 动画相关方法开始 */
  startVertical(duration = 0.8) {
    const times = [];
    const values = [];
    const tmp = new Vector3();

    for (let i = 0; i < duration * 10; i++) {
      times.push(i / 10);
      tmp.setY(-i).toArray(values, values.length);
    }

    const track = new VectorKeyframeTrack('.position', times, values);
    const clip = new AnimationClip('verticalMove', duration, [track]);
    const mixer = new AnimationMixer(this.verticalGroup);
    this.verticalAction = mixer.clipAction(clip);
    this.verticalAction.loop = LoopOnce;
    this.verticalAction.clampWhenFinished = true;
    this.verticalAction.play();
    const clock = new Clock();
    const animate = () => {
      this.vhActionId = requestAnimationFrame(animate);
      if (mixer) {
        mixer.update(clock.getDelta());
      }
      this.render();
    };
    animate();
  }


  /**
   * 左右移动
   */
  startHorizontal(duration = 1.2) {
    if (this.vhAction) {
      if (this.vhAction.paused === true) {
        this.vhAction.paused = false;
        return;
      } else if (this.vhActionId !== null) {
        this.vhAction.play();
        return;
      }
    }

    const times = [];
    const values = [];
    const tmp = new Vector3();

    for (let i = 0; i < duration * 10; i++) {
      times.push(i / 10);
      tmp.setX(i).toArray(values, values.length);
    }
    const track = new VectorKeyframeTrack('.position', times, values);
    const clip = new AnimationClip('horizontalMove', duration, [track]);
    const mixer = new AnimationMixer(this.vhGroup);
    this.vhAction = mixer.clipAction(clip);
    this.vhAction.loop = LoopPingPong;
    this.vhAction.play();

    // action.loop = LoopOnce;
    this.horizontalStart.next(this.horizontalGroup);
    this.horizontalEnd.next(this.horizontalGroup);

    const clock = new Clock();
    const animate = () => {
      this.vhActionId = requestAnimationFrame(animate);
      if (mixer) {
        mixer.update(clock.getDelta());
      }
      this.render();
    };
    animate();
  }

  /**
   * 停止动画，动画会重置
   */
  stopHorizontal() {
    this.vhAction.stop();
  }

  /**
   * 暂停动画，不会重置
   */
  pauseHorizontal() {
    this.vhAction.setEffectiveTimeScale(0);
    // this.vhAction.paused = true;
  }

  cancelHorizontal() {
    if (this.vhActionId !== null) {
      cancelAnimationFrame(this.vhActionId);
      this.vhAction = null;
      this.vhActionId = null;
    }
  }

  /** 动画相关方法结束 */

  /**
   * 水平移动
   * @param distance
   */
  moveHorizontal(distance) {
    if (distance < 0) {
      distance = 0;
    } else if (distance > HORIZONTAL_MAX) {
      distance = HORIZONTAL_MAX;
    }
    this.vhGroup.position.setX(distance);
    this.render();
  }

  /**
   * 上下移动
   * @param distance
   */
  moveVertical(distance = -8) {
    if (distance > 0) {
      distance = 0;
    } else if (distance < VERTICAL_MIN) {
      distance = VERTICAL_MIN;
    }
    this.verticalStart.next(this.verticalGroup);
    this.verticalEnd.next(this.verticalGroup);
    this.verticalGroup.position.setY(distance);
    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }


}
