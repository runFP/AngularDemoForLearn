import {ElementRef, Injectable} from '@angular/core';
import {Camera, Color, PCFSoftShadowMap, PerspectiveCamera, Scene, Vector3, WebGLRenderer} from 'three';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class RollerMetalService {

  constructor() {
  }

  createRenderer(container: ElementRef): WebGLRenderer {
    const renderer = new WebGLRenderer({antialias: true});
    console.dir(container.nativeElement);
    renderer.setSize(container.nativeElement.clientWidth, container.nativeElement.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    container.nativeElement.appendChild(renderer.domElement);
    return renderer;
  }

  createScene(): Scene {
    const scene = new Scene();
    scene.background = new Color('#0e1131');
    return scene;
  }

  createCamera(): Camera {
    const camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.set(50, 200, -300);
    return camera;
  }

  createLight() {
    const ambientLight = new THREE.AmbientLight();
  }

}
