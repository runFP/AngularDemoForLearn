import {Injectable} from '@angular/core';
import {DefaultLoadingManager, Group, LoadingManager, PerspectiveCamera, Scene, WebGLRenderer} from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import {MaterialCreator, MTLLoader} from 'three/examples/jsm/loaders/MTLLoader';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

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
    return scene;
  }

  getCamera(): PerspectiveCamera {
    const camera = new PerspectiveCamera(60, this.width / this.height, 1, 200);
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
    orbitControls.addEventListener('change', (event) => {
      renderer.render(scene, camera);
    });
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
