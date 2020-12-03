import {Component, OnInit,} from '@angular/core';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {Box3, FontLoader, Group, Mesh, MeshPhongMaterial, TextGeometry, Vector3} from 'three';
import {MaterialCreator, MTLLoader} from 'three/examples/jsm/loaders/MTLLoader';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';

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

  manager = new THREE.LoadingManager(() => {
    console.log('load all');
  });

  x = 0;
  z = 0;
  font = null;

  shrink = 100;

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

    this.manager.onProgress = (item, loaded, total) => {
      console.log(item);
      console.log(loaded);
      console.log(total);
    };

    // const shape1 = this.createShape(10, 1, 'blue');
    // const shape2 = this.createShape(5, 3, 'red', 10, 10);
    // const shape3 = this.createShape(8, 2, 'pink', 25, 10);
    // this.scene.add(shape1);
    // this.scene.add(shape2);
    // this.scene.add(shape3);
    // this.shapes.push(...[shape1, shape2, shape3]);
    // this.mtlLoader.load('/assets/modal/temperatureControl/temperatureControl.mtl', (mtl) => {
    //   console.log(mtl);
    //   this.objLoader.load('/assets/modal/temperatureControl/temperatureControl.obj', (object3d) => {
    //     console.log(object3d);
    //     object3d.scale.set(10, 10, 10);
    //     this.scene.add(object3d);
    //   });
    // });


    const paths = [{
      'mtlPath': '/assets/modal/roller/2号-400T.mtl',
      'objPath': '/assets/modal/roller/2号-400T.obj'
    }, {
      'mtlPath': '/assets/modal/roller/3号-300T.mtl',
      'objPath': '/assets/modal/roller/3号-300T.obj'
    }, {
      'mtlPath': '/assets/modal/roller/4号-300T.mtl',
      'objPath': '/assets/modal/roller/4号-300T.obj'
    }, {
      'mtlPath': '/assets/modal/roller/robot1.mtl',
      'objPath': '/assets/modal/roller/robot1.obj'
    }, {
      'mtlPath': '/assets/modal/roller/上料机-上下移动.mtl',
      'objPath': '/assets/modal/roller/上料机-上下移动.obj'
    }, {
      'mtlPath': '/assets/modal/roller/上料机-左右平移.mtl',
      'objPath': '/assets/modal/roller/上料机-左右平移.obj'
    }, {
      'mtlPath': '/assets/modal/roller/上料机-静态.mtl',
      'objPath': '/assets/modal/roller/上料机-静态.obj'
    }, {
      'mtlPath': '/assets/modal/roller/倍速线.mtl',
      'objPath': '/assets/modal/roller/倍速线.obj'
    }, {
      'mtlPath': '/assets/modal/roller/升降机.mtl',
      'objPath': '/assets/modal/roller/升降机.obj'
    }, {
      'mtlPath': '/assets/modal/roller/大冲床-动态.mtl',
      'objPath': '/assets/modal/roller/大冲床-动态.obj'
    }, {
      'mtlPath': '/assets/modal/roller/大冲床.mtl',
      'objPath': '/assets/modal/roller/大冲床.obj'
    }, {
      'mtlPath': '/assets/modal/roller/小冲床-动.mtl',
      'objPath': '/assets/modal/roller/小冲床-动.obj'
    }, {
      'mtlPath': '/assets/modal/roller/小移栽机-上下.mtl',
      'objPath': '/assets/modal/roller/小移栽机-上下.obj'
    }, {
      'mtlPath': '/assets/modal/roller/小移栽机-夹具.mtl',
      'objPath': '/assets/modal/roller/小移栽机-夹具.obj'
    }, {
      'mtlPath': '/assets/modal/roller/小移栽机-杆子.mtl',
      'objPath': '/assets/modal/roller/小移栽机-杆子.obj'
    }, {
      'mtlPath': '/assets/modal/roller/小移栽机-横梁.mtl',
      'objPath': '/assets/modal/roller/小移栽机-横梁.obj'
    }, {
      'mtlPath': '/assets/modal/roller/小车.mtl',
      'objPath': '/assets/modal/roller/小车.obj'
    }, {
      'mtlPath': '/assets/modal/roller/抓手.mtl',
      'objPath': '/assets/modal/roller/抓手.obj'
    }, {
      'mtlPath': '/assets/modal/roller/报警灯.mtl',
      'objPath': '/assets/modal/roller/报警灯.obj'
    }, {
      'mtlPath': '/assets/modal/roller/整体围栏.mtl',
      'objPath': '/assets/modal/roller/整体围栏.obj'
    }, {
      'mtlPath': '/assets/modal/roller/整体夹具.mtl',
      'objPath': '/assets/modal/roller/整体夹具.obj'
    }, {
      'mtlPath': '/assets/modal/roller/移栽机-上下.mtl',
      'objPath': '/assets/modal/roller/移栽机-上下.obj'
    }, {
      'mtlPath': '/assets/modal/roller/移栽机-夹具.mtl',
      'objPath': '/assets/modal/roller/移栽机-夹具.obj'
    }, {
      'mtlPath': '/assets/modal/roller/移栽机-平移杆.mtl',
      'objPath': '/assets/modal/roller/移栽机-平移杆.obj'
    }, {
      'mtlPath': '/assets/modal/roller/移栽机-底座.mtl',
      'objPath': '/assets/modal/roller/移栽机-底座.obj'
    }, {
      'mtlPath': '/assets/modal/roller/输送带-上下动.mtl',
      'objPath': '/assets/modal/roller/输送带-上下动.obj'
    }, {
      'mtlPath': '/assets/modal/roller/输送带-底座.mtl',
      'objPath': '/assets/modal/roller/输送带-底座.obj'
    },
      {
        'mtlPath': '/assets/modal/roller/铆接线-贴字.mtl',
        'objPath': '/assets/modal/roller/铆接线-贴字.obj'
      }];

    new Promise(resolve => {
      const loader = new FontLoader();
      loader.load('/assets/fonts/Microsoft YaHei_Regular.json', font => {
        this.font = font;
        resolve(null);
      });
    }).then(() => {
      paths.forEach(item => this.loadMtlObj(item.objPath, item.mtlPath));
    });


    // 阴影
    // const shadowMaterial = new THREE.ShadowMaterial();
    // shadowMaterial.opacity = 0.5;
    // const groundMesh = new THREE.Mesh(
    //   new THREE.BoxGeometry(100, .1, 100),
    //   shadowMaterial
    // );
    // groundMesh.receiveShadow = true;
    // this.scene.add(groundMesh);
    this.helper();

    this.renderer.render(this.scene, this.camera);

    // this.updatePosition();
  }

  updatePosition() {
    this.controls.update();
    this.shapes.forEach(shape => {
      const rotationSpeed = Math.random() * 0.02 + 0.005;
      const rotationPosition = rotationSpeed + shape.rotation.y;
      shape.rotation.y = rotationPosition;
    });
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.updatePosition());
  }

  loadMtlObj(objPath, mtlPath) {
    const text = objPath.split('.')[0].replace(/\/assets\/modal\/roller\//g, '');
    const mtl = new MTLLoader();
    const obj = new OBJLoader();
    mtl.load(mtlPath, (m: MaterialCreator) => {
      obj.setMaterials(m).load(objPath, (o: Group) => {
        this.z += 10;

        // 计算obj的宽高深，为text提供坐标值
        const box = new Box3();
        const expand = box.expandByObject(o);
        const min = expand.min;
        const max = expand.max;
        const centerX = Math.abs(Math.floor((max.x - min.x) / 2 / this.shrink));
        const centerY = Math.abs(Math.floor((max.y - min.y) / 2 / this.shrink));
        const centerZ = Math.abs(Math.floor((max.z - min.z) / 2 / this.shrink));
        console.log(expand);
        // 添加obj对应的文字，并在obj上方居中对齐
        const textVector = new Vector3(0, 0, 0);
        const textGeometry = new TextGeometry(text, {
          font: this.font, size: 3, height: 1,
        });
        const textMaterial = new MeshPhongMaterial({color: '#000', flatShading: true});
        const textMesh = new Mesh(textGeometry, textMaterial);

        const textBox = new Box3().setFromObject(textMesh);
        textBox.getCenter(textVector);
        textMesh.position.set(centerX + this.x - textVector.x + min.x / this.shrink, centerY + max.y / this.shrink, centerZ + this.z + min.z / this.shrink);
        this.scene.add(textMesh);

        o.position.setX(this.x);
        o.position.setZ(this.z);
        this.x += centerX * 2 + 10;
        o.scale.set(1 / this.shrink, 1 / this.shrink, 1 / this.shrink);
        this.scene.add(o);
      });
    });

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
    controls.addEventListener('change', () => {
      this.renderer.render(this.scene, this.camera);
    }); // add this only if there is no animation loop (requestAnimationFrame)
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
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 30000);
    camera.position.set(110, 500, 500);
    camera.lookAt(new THREE.Vector3(0, 15, 0));
    return camera;
  }

}

interface CameraInf {
  fov;
  near;
  far;
}
