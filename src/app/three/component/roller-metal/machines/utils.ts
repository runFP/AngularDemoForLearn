import {MaterialCreator, MTLLoader} from 'three/examples/jsm/loaders/MTLLoader';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';
import {
  AnimationAction,
  AnimationClip,
  Box3,
  DefaultLoadingManager,
  GridHelper,
  Group, KeyframeTrack,
  LoadingManager, LoopOnce,
  Material, NumberKeyframeTrack,
  Raycaster,
  Vector3,
  VectorKeyframeTrack
} from 'three';
import {Observable} from 'rxjs';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';
import {TransformControls} from 'three/examples/jsm/controls/TransformControls';
import {isArray} from 'util';
import {AppendingMachine} from './appendingMachine/AppendingMachine';
import {BaseMachine} from './baseMachine';

/**
 * 加载MTLOBJ文件
 * @param objPath
 * @param mtlPath
 * @param manager
 */
export function loadMtlObj(mtlPath: string, objPath: string, manager: LoadingManager = DefaultLoadingManager, shrink: number = 1): Observable<MtlObjInf> {
  const mtl = new MTLLoader(manager);
  const obj = new OBJLoader(manager);
  const box3 = new Box3();
  const inf: MtlObjInf = {mtl: null, obj: null, box3: null};

  return new Observable(subscriber => {
    mtl.load(mtlPath, (m: MaterialCreator) => {
      inf.mtl = m;
      obj.setMaterials(m).load(objPath, (o: Group) => {
        o.scale.set(1 / shrink, 1 / shrink, 1 / shrink);
        inf.obj = o;
        inf.box3 = box3.expandByObject(o);
        subscriber.next(inf);
        subscriber.complete();
      });
    });
  });
}

export function createOrbitControls(camera, scene, renderer, object3d?: any[]): OrbitControls {
  // const helper = new GridHelper(1000, 100);
  // scene.add(helper);

  const orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.update();
  orbitControls.addEventListener('change', (event) => {
    renderer.render(scene, camera);
  });
  return orbitControls;
}

export function createTransFormControl(camera, scene, renderer, object3d, orbitControls, container) {
  const raycaster = new Raycaster();
  const mouse = new THREE.Vector2();
  const transformControl = new TransformControls(camera, renderer.domElement);
  const getBoundingClientRect = container.getBoundingClientRect();
  document.addEventListener('click', ev => {
    ev.preventDefault();
    /**
     * 若非全屏，则鼠标的位置要减去渲染容器的起始点再除于容器的正常宽高
     */
    mouse.x = ((ev.clientX - getBoundingClientRect.left) / container.clientWidth) * 2 - 1;
    mouse.y = -((ev.clientY - getBoundingClientRect.top) / container.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersections = raycaster.intersectObjects(object3d, true);
    if (intersections.length > 0) {
      const object = intersections[0].object;

      function groupInclude(group, isInclude = false): boolean {
        group.children.forEach(item => {
          if (item.isGroup) {
            isInclude = groupInclude(item, isInclude);
          } else {
            if (item === object) {
              isInclude = true;
            }
          }
        });
        return isInclude;
      }

      object3d.forEach(group => {
        if (groupInclude(group)) {
          transformControl.attach(group);
        }
      });
    }
  });

  transformControl.addEventListener('change', (event) => {
    console.log('transformControl change', event);
    console.log('transformControl change', event.target.children[0].worldPosition);
    renderer.render(scene, camera);
  });

  transformControl.addEventListener('dragging-changed', function (event) {
    orbitControls.enabled = !event.value;
    console.log('transformControl dragging-change', event);
  });

  scene.add(transformControl);
}

/**
 * 缘起：因为obj导入有部门模型的实际位置与自身原点有较大编译，导致拖动，选转无发找到正确的对应
 * 修复原理：先把模型的位置通过position归为到世界坐标原点(x:0,y:0,z:0),
 *          再在外面包一层group，而外层group的本地坐标为(x:0,y:0,z:0)恰好与世界坐标一直，通过操作该group来操作原有模型
 * @param inf
 */
export function fixedObjLocalOrigin(inf: MtlObjInf | MtlObjInf[]): Group[] {
  if (!(inf instanceof Array)) {
    inf = [inf];
  }

  return inf.map(item => {
    const vector = new Vector3();
    item.box3.getCenter(vector);
    item.obj.position.set(-vector.x, 0, -vector.z);

    // 导入的obj文件有本地坐标原点偏移，使用一个group包着，操作该group来做各种位移，旋转操作
    const group = new Group();
    group.add(item.obj);

    return group;
  });

}

export function createAnimation(trackName, clipName, times, values, mixer, duration, trackType = 'Number'): { track: KeyframeTrack, clip: AnimationClip, action: AnimationAction } {
  let track = null;
  switch (trackType) {
    case 'Vector':
      track = new VectorKeyframeTrack(trackName, times, values);
      break;
    case 'Number':
      track = new NumberKeyframeTrack(trackName, times, values);
      break;
  }

  const clip = new AnimationClip(clipName, duration, [track]);
  const action = mixer.clipAction(clip);
  action.clampWhenFinished = true;
  action.loop = LoopOnce;
  return {track, clip, action};
}


export interface MtlObjInf {
  mtl: MaterialCreator | null;
  obj: Group | null;
  /** object3d的边界信息*/
  box3: Box3 | null;
}
