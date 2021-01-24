import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ThreeCommonServices} from '../../three-common.services';
import * as THREE from 'three';

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

  constructor(private threeCommonService: ThreeCommonServices) {
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
    this.threeCommonService.addOrbitControls(this.camera, this.scene, this.renderer);

    this.container.nativeElement.append(this.renderer.domElement);
    this.threeCommonService.loadMtlObj(
      '/assets/modal/roller/上料机-静态.mtl',
      '/assets/modal/roller/上料机-静态.obj',
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
