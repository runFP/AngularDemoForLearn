import {Injectable} from '@angular/core';
import {Camera, PCFSoftShadowMap, PerspectiveCamera, Scene, WebGLRenderer} from 'three';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class RollerMetalService {

  constructor() {
  }

  createRenderer(): WebGLRenderer {
    const renderer = new WebGLRenderer({antialias: true});
    renderer.setClearColor('#fff6e6');
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);
    return renderer;
  }

  createScene(): Scene {
    return new Scene();
  }

  createCamera(): Camera {
    const camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 30000);
    camera.position.set(0, 500, 1000);

    return camera;
  }

  createLight() {
    const ambientLight = new THREE.AmbientLight();
  }

}
