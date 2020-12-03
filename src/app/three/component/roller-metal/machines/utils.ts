import {MaterialCreator, MTLLoader} from 'three/examples/jsm/loaders/MTLLoader';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';
import {Box3, DefaultLoadingManager, GridHelper, Group, LoadingManager, Material} from 'three';
import {Observable} from 'rxjs';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';

/**
 * 加载MTLOBJ文件
 * @param objPath
 * @param mtlPath
 * @param manager
 */
export function loadMtlObj(mtlPath: string, objPath: string, manager: LoadingManager = DefaultLoadingManager): Observable<MtlObjInf> {
  const mtl = new MTLLoader(manager);
  const obj = new OBJLoader(manager);
  const box3 = new Box3();
  const inf: MtlObjInf = {mtl: null, obj: null, box3: null};

  return new Observable(subscriber => {
    mtl.load(mtlPath, (m: MaterialCreator) => {
      inf.mtl = m;
      obj.setMaterials(m).load(objPath, (o: Group) => {
        inf.obj = o;
        inf.box3 = box3.expandByObject(o);
        subscriber.next(inf);
        subscriber.complete();
      });
    });
  });
}

export function createHelper(camera, scene, renderer) {
  const helper = new GridHelper(1000, 10);
  scene.add(helper);

  // 按住ctrl才执行轨道变更
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target = new THREE.Vector3(0, 10, 10);
  controls.maxPolarAngle = Math.PI / 2;
  // controls.addEventListener('change', (event) => {
  //     renderer.render(scene, camera);
  // });
}

interface MtlObjInf {
  mtl: MaterialCreator | null;
  obj: Group | null;
  /** object3d的边界信息*/
  box3: Box3 | null;
}
