import {Component, OnInit,} from '@angular/core';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {Mesh} from 'three';

@Component({
  selector: 'app-three-first-demo',
  templateUrl: './three-first-demo.component.html',
  styleUrls: ['./three-first-demo.component.scss']
})
export class ThreeFirstDemoComponent implements OnInit {
  scene = null;
  renderer = null;
  camera = null;
  controls = null;
  shapes = [];

  constructor() {
  }

  ngOnInit() {
    this.scene = new THREE.Scene();
    this.renderer = this.createRenderer();
    this.camera = this.createCamera();

    const ambientLight = new THREE.AmbientLight();
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight();
    pointLight.position.set(50, 50, 50);
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 1024;
    pointLight.shadow.mapSize.height = 1024;
    this.scene.add(pointLight);

    const shape1 = this.createShape(10, 1, 'blue');
    const shape2 = this.createShape(5, 3, 'red', 10, 10);
    const shape3 = this.createShape(8, 2, 'pink', 25, 10);
    this.scene.add(shape1);
    this.scene.add(shape2);
    this.scene.add(shape3);

    this.shapes.push(...[shape1, shape2, shape3]);

    const shadowMaterial = new THREE.ShadowMaterial();
    shadowMaterial.opacity = 0.5;
    const groundMesh = new THREE.Mesh(
      new THREE.BoxGeometry(100, .1, 100),
      shadowMaterial
    );
    groundMesh.receiveShadow = true;
    this.scene.add(groundMesh);
    this.helper();

    this.renderer.render(this.scene, this.camera);

    this.updatePosition();
  }

  updatePosition() {
    this.controls.update();
    this.shapes.forEach(shape => {
      const rotationSpeed = Math.random() * 0.02 + 0.005;
      const rotationPosition = rotationSpeed + shape.rotation.y;
      console.log(rotationPosition);
      shape.rotation.y = rotationPosition;
    });
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.updatePosition());
  }

  helper(): void {
    const helper = new THREE.GridHelper(2000, 100);
    const helpMaterial = new THREE.Material();
    // helper.position.y = - 199;
    helpMaterial.opacity = 0.25;
    helpMaterial.transparent = true;
    this.scene.add(helper);

    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.target = new THREE.Vector3(0, 15, 0);
    controls.maxPolarAngle = Math.PI / 2;
    // controls.addEventListener('change', () => {
    //   this.renderer.render(this.scene, this.camera);
    // }); // add this only if there is no animation loop (requestAnimationFrame)
    this.controls = controls;
  }

  createShape(radius: number, detail = 1, color: string, x = 0, z = 0) {
    const group = new THREE.Group();

    const octahedronGeometry = new THREE.OctahedronGeometry(radius, detail);
    const octahedronStanderMaterial = new THREE.MeshStandardMaterial({color, roughness: 0.8, flatShading: true});
    const octahedronGeometryMesh = new Mesh(octahedronGeometry, octahedronStanderMaterial);
    octahedronGeometryMesh.position.y = radius;
    octahedronGeometryMesh.castShadow = true;
    octahedronGeometryMesh.receiveShadow = true;

    const cylinderGeometry = new THREE.CylinderGeometry(radius / 3, radius / 2, radius / 2, 6);
    const cylinderGeometryMaterial = new THREE.MeshStandardMaterial({color: 'gold', roughness: 0.8, flatShading: true});
    const cylinderGeometryMesh = new Mesh(cylinderGeometry, cylinderGeometryMaterial);
    cylinderGeometryMesh.position.y = radius + radius - radius / 10;
    cylinderGeometryMesh.castShadow = true;
    cylinderGeometryMesh.receiveShadow = true;

    const torusGeometry = new THREE.TorusGeometry(radius / 5, radius / 15, 10, 50, Math.PI);
    const torusGeometryMaterial = new THREE.MeshStandardMaterial({color: 'gold', roughness: 0.8, flatShading: true});
    const torusGeometryMesh = new Mesh(torusGeometry, torusGeometryMaterial);
    torusGeometryMesh.position.y = radius + radius + radius / 10;
    cylinderGeometryMesh.castShadow = true;
    cylinderGeometryMesh.receiveShadow = true;

    group.add(octahedronGeometryMesh);
    group.add(cylinderGeometryMesh);
    group.add(torusGeometryMesh);
    group.position.set(x, 0, z);

    // const flag = Math.random() * 10 > 5 ? 1 : -1;
    group.rotateZ(Math.random() / 3);

    return group;
  }

  createRenderer(): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer({antialias: true});

// Size should be the same as the window
    renderer.setSize(window.innerWidth, window.innerHeight);

// Set a near white clear color (default is black)
    renderer.setClearColor(0xfff6e6);

// Enable shadow mapping
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// Append to the document
    document.body.appendChild(renderer.domElement);
    return renderer;
  }

  createCamera(): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 30, 50);
    camera.lookAt(new THREE.Vector3(0, 15, 0));
    return camera;
  }

}

interface CameraInf {
  fov;
  near;
  far;
}
