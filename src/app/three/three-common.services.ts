import {Injectable} from '@angular/core';
import {Color, DefaultLoadingManager, Group, LoadingManager, PerspectiveCamera, Scene, WebGLRenderer} from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import {MaterialCreator, MTLLoader} from 'three/examples/jsm/loaders/MTLLoader';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';

@Injectable()
export class ThreeCommonServices {
  container: HTMLElement;
  width;
  height;

  constructor() {
  }

  setContainer(container: HTMLElement) {
    this.container = container;
    this.width = container.clientWidth;
    this.height = container.clientHeight;
  }

  getRenderer(): WebGLRenderer {
    const renderer = new WebGLRenderer({antialias: true});
    renderer.setSize(this.width, this.height);
    return renderer;
  }

  getScene(): Scene {
    const scene = new Scene();
    scene.background = new Color('#13528b');
    return scene;
  }

  getCamera(): PerspectiveCamera {
    const camera = new PerspectiveCamera(60, this.width / this.height, 1, 2000);
    camera.position.set(200, 0, 0);
    return camera;
  }

  /**
   * 帧数检测
   * @param container
   */
  addStates(container: HTMLElement): Stats {
    const states = new Stats();
    container.appendChild(states.dom);
    return states;
  }

  /**
   * 摄像机控制
   * @param camera
   * @param scene
   * @param renderer
   */
  addOrbitControls(camera, scene, renderer) {
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.update();
    // ***** 添加下面事件会影响性能
    // 如果有animation，并在里面执行了renderer.render(scene, camera)方法，
    // 那这个无需在写
    // orbitControls.addEventListener('change', (event) => {
    //   renderer.render(scene, camera);
    // });

  }

  addGrid(scene) {
    const helper = new THREE.GridHelper(2000, 100);
    scene.add(helper);
  }

  loadMtlObj(mtlPath: string, objPath: string, scene: Scene, manager: LoadingManager = DefaultLoadingManager) {
    const mtl = new MTLLoader(manager);
    const obj = new OBJLoader(manager);
    mtl.load(mtlPath, (m: MaterialCreator) => {
      obj.setMaterials(m).load(objPath, (o: Group) => {
        scene.add(o);
      });
    });
  }
}
