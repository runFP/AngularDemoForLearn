import {ComponentFactory, ComponentFactoryResolver, ComponentRef, Injectable, Type, ViewContainerRef} from '@angular/core';
import {Box3, Color, DefaultLoadingManager, Group, LoadingManager, PerspectiveCamera, Scene, WebGLRenderer} from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import {MaterialCreator, MTLLoader} from 'three/examples/jsm/loaders/MTLLoader';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

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
    const camera = new PerspectiveCamera(10, this.width / this.height, 1, 100000);
    camera.position.set(0, 100, 0);
    camera.fov = 100;
    camera.updateProjectionMatrix();
    // camera.position.set(230539.4921875, 2926.2950134277344, 17348.68408203125);
    return camera;
  }

  /**   * 帧数检测
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

  loadMtlObj(paths: ({ mtlPath: string, objPath: string } | { gltfPath: string })[], scene: Scene, manager: LoadingManager = DefaultLoadingManager) {
    const mtl = new MTLLoader(manager);
    const obj = new OBJLoader(manager);
    const gltfLoader = new GLTFLoader(manager);
    const box3 = new Box3();

    paths.forEach(path => {
      if ('gltfPath' in path) {
        gltfLoader.load(path.gltfPath, (gltf) => {
          const oobj = box3.expandByObject(gltf.scene);
          console.log(oobj);
          scene.add(gltf.scene);
          console.log(scene);
        });
      } else {
        mtl.load(path.mtlPath, (m: MaterialCreator) => {
          obj.setMaterials(m).load(path.objPath, (o: Group) => {
            const oobj = box3.expandByObject(o);
            console.log(oobj);
            scene.add(o);
          });
        });
      }
    });
  }

  addControlDom(
    resolve: ComponentFactoryResolver,
    viewContainerRef: ViewContainerRef,
    component: Type<any>,
    value: { title: string, property: any, fields: { name: string, value: any }[] },
    change = (p, v) => {
      console.log(p, v);
    }
  ) {
    const componentFactory = resolve.resolveComponentFactory(component);
    const componentRef = viewContainerRef.createComponent<any>(componentFactory);
    componentRef.instance.title = value.title;
    componentRef.instance.property = value.property;
    componentRef.instance.fields = value.fields;
    componentRef.instance.update.subscribe((p, v) => {
      change(p, v);
    });
  }
}
