import {ElementRef, Injectable} from '@angular/core';
import {Camera, Color, PCFSoftShadowMap, PerspectiveCamera, Scene, WebGLRenderer} from 'three';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class RollerMetalService {

  constructor() {
  }

  createRenderer(container: ElementRef): WebGLRenderer {
    const renderer = new WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    container.nativeElement.appendChild(renderer.domElement);
    return renderer;
  }

  createScene(): Scene {
    const scene = new Scene();
    scene.background = new Color(0xbfe3dd);
    return scene;
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
