import {Group, LoadingManager} from 'three';
import {Subject, zip} from 'rxjs';
import {loadMtlObj} from '../utils';
import {BaseMachine} from '../baseMachine';
import {DragControls} from 'three/examples/jsm/controls/DragControls';
import {TransformControls} from 'three/examples/jsm/controls/TransformControls';

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


/**
 * 物料机，可上下和左右移动
 */
export class AppendingMachine extends BaseMachine {
  base = null;
  vertical = null;
  horizontal = null;
  group = new Group();

  // 上下移动回调
  verticalStart = new Subject();
  verticalEnd = new Subject();

  // 左右移动回调
  horizontalStart = new Subject();
  horizontalEnd = new Subject();

  constructor(manager?: LoadingManager) {
    super(manager);
  }

  /**
   * 初始化
   * @param shrink 缩放比例
   */
  init(camera, renderer, scene, shrink: number = 100): Promise<string> {
    return new Promise(resolve => {
      zip(loadMtlObj(PATH.BASE.MTL_PATH, PATH.BASE.OBJ_PATH, this.manager),
        loadMtlObj(PATH.VERTICAL.MTL_PATH, PATH.VERTICAL.OBJ_PATH, this.manager),
        loadMtlObj(PATH.HORIZONTAL.MTL_PATH, PATH.HORIZONTAL.OBJ_PATH, this.manager))
        .subscribe(([base, vertical, horizontal]) => {
            this.base = base;
            this.vertical = vertical;
            this.horizontal = horizontal;
            // 缩放比例
            base.obj.scale.set(1 / shrink, 1 / shrink, 1 / shrink);
            vertical.obj.scale.set(1 / shrink, 1 / shrink, 1 / shrink);
            horizontal.obj.scale.set(1 / shrink, 1 / shrink, 1 / shrink);


            const transformControls = new TransformControls(camera, renderer.domElement);
            scene.add(transformControls);


            const dragControl = new DragControls([base.obj, vertical.obj, horizontal.obj], camera, renderer.domElement);
            dragControl.addEventListener('hoveron', function (event) {
              transformControls.attach(event.object);
              transformControls.setSize(0.4);
            });

            // 处理3者相对位置，使其完美结合

            this.group.add(base.obj, vertical.obj, horizontal.obj);
          }, () => {
          }, () => {
            resolve('complete');
          }
        );
    });
  }


  // 上下移动
  moveVertical() {
    this.verticalStart.next(this.vertical);
    this.verticalEnd.next(this.vertical);
  }

  moveHorizontal() {
  }


}
