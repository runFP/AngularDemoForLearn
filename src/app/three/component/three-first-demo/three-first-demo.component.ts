import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-three-first-demo',
  templateUrl: './three-first-demo.component.html',
  styleUrls: ['./three-first-demo.component.scss']
})
export class ThreeFirstDemoComponent implements OnInit {
  @ViewChild('scene', {static: true}) htmlScene: ElementRef;

  x = 0;
  y = 0;
  z = 5;
  fov = 75;

  cameraInf: CameraInf = null;

  scene = null;
  camera = null;
  renderer = null;
  geometry = null;
  material = null;
  cube = null;


  constructor(
    private renderer2: Renderer2,
  ) {
  }

  ngOnInit() {
    this.refreshOctahedronGeometry();
    // this.scene = new Scene();
    // this.camera = new PerspectiveCamera(this.fov, window.innerWidth / window.innerHeight, 0.1, 1000);
    // this.renderer = new WebGLRenderer({antialias: true});
    // this.renderer.shadowMap.enabled = true;
    // this.renderer.shadowMap.type = PCFSoftShadowMap;
    //
    //
    // this.geometry = new BoxGeometry();
    // this.material = new MeshBasicMaterial({color: 0x00ff00, wireframe: true});
    // this.cube = new Mesh(this.geometry, this.material);
    // this.cube.rotation.x = 10;
    // this.cube.rotation.y = 10;
    //
    // const ambientLight = new AmbientLight(0xffffff, 0.2);
    // this.scene.add(ambientLight);
    //
    // const pointLight = new PointLight(0xffffff, 1);
    // pointLight.position.set(25, 50, 25);
    // pointLight.castShadow = true;
    // pointLight.shadow.mapSize.width = 1024;
    // pointLight.shadow.mapSize.height = 1024;
    // this.scene.add(pointLight);
    //
    // this.scene.add(this.cube);
    //
    // // A simple geometric shape with a flat material
    // const shapeOne = new Mesh(
    //   new OctahedronGeometry(10, 1),
    //   new MeshStandardMaterial({
    //     color: 0xff0051,
    //     metalness: 0,
    //     roughness: 0.8
    //   })
    // );
    // shapeOne.position.y += 10;
    // shapeOne.rotateZ(Math.PI / 3);
    // shapeOne.castShadow = true;
    // this.scene.add(shapeOne);
    //
    //
    // const shadowMaterial = new ShadowMaterial({opacity: 0.2});
    // const groundMesh = new Mesh(
    //   new BoxGeometry(100, .1, 100),
    //   shadowMaterial
    // );
    // groundMesh.receiveShadow = true;
    // this.scene.add(groundMesh);
    //
    //
    // const helper = new GridHelper(2000, 100);
    // const helpMaterial = new Material();
    // // helper.position.y = - 199;
    // helpMaterial.opacity = 0.25;
    // helpMaterial.transparent = true;
    // // helper.material = helpMaterial;
    // this.scene.add( helper );
    //
    // this.renderer.setSize(this.htmlScene.nativeElement.offsetWidth, this.htmlScene.nativeElement.offsetHeight);
    // this.renderer2.appendChild(this.htmlScene.nativeElement, this.renderer.domElement);
    //
    // this.camera.lookAt(new Vector3(0, 0, 0));
    // // this.render();
    // this.renderer.setClearColor(0xfff6e6);
    // this.render2();
    //
    // const controls = new OrbitControls(this.camera, this.renderer.domElement);
    // controls.addEventListener('change', (event) => {
    //   this.cameraInf = event.target.object;
    //   console.log('event: ', event);
    //   console.log('camera: ', this.camera);
    //   this.renderer.render(this.scene, this.camera);
    // });


  }

  // render() {
  //   requestAnimationFrame(() => this.render());
  //   this.cube.rotation.x += 0.01;
  //   this.cube.rotation.y += 0.01;
  //   this.renderer.render(this.scene, this.camera);
  // }

  /*render2() {
    const xGeometry = new Geometry();
    const yGeometry = new Geometry();
    const zGeometry = new Geometry();
    const materialX = new LineBasicMaterial({color: 'blue'});
    const materialY = new LineBasicMaterial({color: 'red'});
    const materialZ = new LineBasicMaterial({color: 'yellow'});
    xGeometry.vertices.push(new Vector3(-100, 0, 0));
    xGeometry.vertices.push(new Vector3(100, 0, 0));
    yGeometry.vertices.push(new Vector3(0, -100, 0));
    yGeometry.vertices.push(new Vector3(0, 100, 0));
    zGeometry.vertices.push(new Vector3(0, 0, -100));
    zGeometry.vertices.push(new Vector3(0, 0, 100));
    // geometry.vertices.push(new Vector3(10, 0, 0));
    const lineX = new Line(xGeometry, materialX);
    const lineY = new Line(yGeometry, materialY);
    const lineZ = new Line(zGeometry, materialZ);
    this.scene.add(lineX);
    this.scene.add(lineY);
    this.scene.add(lineZ);
    this.camera.position.set(this.x, this.y, this.z);
    this.renderer.render(this.scene, this.camera);
  }*/

/*  refresh() {
    // this.camera.fov = this.fov;
    this.camera.position.set(this.x, this.y, this.z);
    this.renderer.render(this.scene, this.camera);
    this.camera.lookAt(new Vector3(0, 0, 0));
  }*/

  refreshOctahedronGeometry() {

// Create a scene which will hold all our meshes to be rendered
    const scene = new THREE.Scene();

// Create and position a camera
    const camera = new THREE.PerspectiveCamera(
      60,                                   // Field of view
      window.innerWidth / window.innerHeight, // Aspect ratio
      0.1,                                  // Near clipping pane
      1000                                  // Far clipping pane
    );

// Reposition the camera
    camera.position.set(0, 30, 50);

// Point the camera at a given coordinate
    camera.lookAt(new THREE.Vector3(0, 15, 0));

// Create a renderer
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

// Add an ambient lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

// Add a point light that will cast shadows
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(25, 50, 25);
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 1024;
    pointLight.shadow.mapSize.height = 1024;
    scene.add(pointLight);

// A basic material that shows the geometry wireframe.
    const shadowMaterial = new THREE.ShadowMaterial();
    shadowMaterial.opacity = 0.5;
    const groundMesh = new THREE.Mesh(
      new THREE.BoxGeometry(100, .1, 100),
      shadowMaterial
    );
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

// A simple geometric shape with a flat material
    const shapeOne = new THREE.Mesh(
      new THREE.OctahedronGeometry(10, 1),
      new THREE.MeshStandardMaterial({
        color: 0xff0051,
        metalness: 0,
        roughness: 0.8
      })
    );
    shapeOne.position.y += 10;
    shapeOne.rotateZ(Math.PI / 3);
    shapeOne.castShadow = true;
    scene.add(shapeOne);

// Add a second shape
    const shapeTwo = new THREE.Mesh(
      new THREE.OctahedronGeometry(5, 1),
      new THREE.MeshStandardMaterial({
        color: 0x47689b,
        metalness: 0,
        roughness: 0.8
      })
    );
    shapeTwo.position.y += 5;
    shapeTwo.position.x += 15;
    shapeTwo.rotateZ(Math.PI / 5);
    shapeTwo.castShadow = true;
    scene.add(shapeTwo);

// Render the scene/camera combnation
    renderer.render(scene, camera);

// Add an orbit control which allows us to move around the scene. See the three.js example for more details
// https://github.com/mrdoob/three.js/blob/dev/examples/js/controls/OrbitControls.
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target = new THREE.Vector3(0, 15, 0);
    controls.maxPolarAngle = Math.PI / 2;
    controls.addEventListener('change', function () {
      renderer.render(scene, camera);
    }); // add this only if there is no animation loop (requestAnimationFrame)

  }

}

interface CameraInf {
  fov;
  near;
  far;
}
