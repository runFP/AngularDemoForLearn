import {Component, ComponentFactoryResolver, ElementRef, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {ThreeCommonServices} from '../../three-common.services';
import * as THREE from 'three';
import {HelperComponent} from './helper/helper.component';

@Component({
  selector: 'app-three-demo',
  templateUrl: './three-demo.component.html',
  styleUrls: ['./three-demo.component.scss']
})
export class ThreeDemoComponent implements OnInit {
  @ViewChild('container', {static: true}) container: ElementRef;

  renderer;
  scene;
  camera;
  states;

  constructor(
    private threeCommonService: ThreeCommonServices,
    public viewContainerRef: ViewContainerRef,
    private resolve: ComponentFactoryResolver,
  ) {
  }

  ngOnInit() {
    const element = this.container.nativeElement;

    this.threeCommonService.setContainer(element);
    this.renderer = this.threeCommonService.getRenderer();
    this.scene = this.threeCommonService.getScene();
    this.camera = this.threeCommonService.getCamera();

    // 设置灯光
    const pointLight = new THREE.PointLight();
    this.scene.add(pointLight);

    // 设置辅助
    this.states = this.threeCommonService.addStates(element);
    this.threeCommonService.addGrid(this.scene);
    this.threeCommonService.addOrbitControls(this.camera, this.scene, this.renderer);

    this.container.nativeElement.append(this.renderer.domElement);
    this.threeCommonService.addControlDom(this.resolve, this.viewContainerRef, HelperComponent, {
      title: 'Camera',
      property: this.camera,
      fields: [
        {name: 'fov', value: this.camera.fov}
      ],
    }, (p, v) => {
      p[v.name] = v.value;
      p.updateProjectionMatrix();
    });

    this.threeCommonService.loadMtlObj([
        {mtlPath: '/assets/modal/roller/上料机-静态.mtl', objPath: '/assets/modal/roller/上料机-静态.obj'},
        /*  {
         mtlPath: '/assets/modal/roller/大冲床.mtl',
         objPath: '/assets/modal/roller/大冲床.obj'
       },
       {
         mtlPath: '/assets/modal/roller/大冲床-动态.mtl',
         objPath: '/assets/modal/roller/大冲床-动态.obj'
       },
       {
         mtlPath: '/assets/modal/roller/报警灯.mtl',
         objPath: '/assets/modal/roller/报警灯.obj'
       },
       {
         mtlPath: '/assets/modal/roller/小车.mtl',
         objPath: '/assets/modal/roller/小车.obj'
       },
       {
         mtlPath: '/assets/modal/roller/抓手.mtl',
         objPath: '/assets/modal/roller/抓手.obj'
       },
       {
         mtlPath: '/assets/modal/roller/升降机.mtl',
         objPath: '/assets/modal/roller/升降机.obj'
       },
       {
         mtlPath: '/assets/modal/roller/倍速线.mtl',
         objPath: '/assets/modal/roller/倍速线.obj'
       },
       {
         mtlPath: '/assets/modal/roller/输送带-底座.mtl',
         objPath: '/assets/modal/roller/输送带-底座.obj'
       },
       {
         mtlPath: '/assets/modal/roller/输送带-上下动.mtl',
         objPath: '/assets/modal/roller/输送带-上下动.obj'
       },
       {
         mtlPath: '/assets/modal/roller/移栽机-底座.mtl',
         objPath: '/assets/modal/roller/移栽机-底座.obj'
       },
       {
         mtlPath: '/assets/modal/roller/移栽机-上下.mtl',
         objPath: '/assets/modal/roller/移栽机-上下.obj'
       },
       {
         mtlPath: '/assets/modal/roller/移栽机-夹具.mtl',
         objPath: '/assets/modal/roller/移栽机-夹具.obj'
       },
       {
         mtlPath: '/assets/modal/roller/移栽机-平移杆.mtl',
         objPath: '/assets/modal/roller/移栽机-平移杆.obj'
       },
       {
         mtlPath: '/assets/modal/roller/2号-400T.mtl',
         objPath: '/assets/modal/roller/2号-400T.obj'
       }, {
         mtlPath: '/assets/modal/roller/小冲床-动.mtl',
         objPath: '/assets/modal/roller/小冲床-动.obj'
       },
       {
         mtlPath: '/assets/modal/roller/报警灯.mtl',
         objPath: '/assets/modal/roller/报警灯.obj'
       },
       {
         mtlPath: '/assets/modal/roller/3号-300T.mtl',
         objPath: '/assets/modal/roller/3号-300T.obj'
       }, {
         mtlPath: '/assets/modal/roller/小冲床-动.mtl',
         objPath: '/assets/modal/roller/小冲床-动.obj'
       }, {
         mtlPath: '/assets/modal/roller/报警灯.mtl',
         objPath: '/assets/modal/roller/报警灯.obj'
       },
       {
         mtlPath: '/assets/modal/roller/4号-300T.mtl',
         objPath: '/assets/modal/roller/4号-300T.obj'
       }, {
         mtlPath: '/assets/modal/roller/小冲床-动.mtl',
         objPath: '/assets/modal/roller/小冲床-动.obj'
       }, {
         mtlPath: '/assets/modal/roller/报警灯.mtl',
         objPath: '/assets/modal/roller/报警灯.obj'
       },
       {
         mtlPath: '/assets/modal/roller/铆接线-贴字.mtl',
         objPath: '/assets/modal/roller/铆接线-贴字.obj'
       }, {
         mtlPath: '/assets/modal/roller/整体夹具.mtl',
         objPath: '/assets/modal/roller/整体夹具.obj'
       },
       {
         mtlPath: '/assets/modal/roller/robot1.mtl',
         objPath: '/assets/modal/roller/robot1.obj'
       },
       {
         mtlPath: '/assets/modal/roller/小移栽机-上下.mtl',
         objPath: '/assets/modal/roller/小移栽机-上下.obj'
       }, {
         mtlPath: '/assets/modal/roller/小移栽机-横梁.mtl',
         objPath: '/assets/modal/roller/小移栽机-横梁.obj'
       }, {
         mtlPath: '/assets/modal/roller/小移栽机-杆子.mtl',
         objPath: '/assets/modal/roller/小移栽机-杆子.obj'
       }, {
         mtlPath: '/assets/modal/roller/小移栽机-夹具.mtl',
         objPath: '/assets/modal/roller/小移栽机-夹具.obj'
       },*/
        {
          gltfPath: '/assets/modal/washingMachine/zongyi.gltf',
        }
      ],
      this.scene
    );
    this.animation();
  }

  animation() {
    requestAnimationFrame(() => this.animation());
    this.render();
    this.states.update();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

}
