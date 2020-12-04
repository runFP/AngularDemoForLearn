import {Component, OnInit} from '@angular/core';
import {RollerMetalService} from './roller-metal.service';
import * as THREE from 'three';
import {createOrbitControls, createTransFormControl} from './machines/utils';
import {Camera, Scene, WebGLRenderer} from 'three';
import {AppendingMachine} from './machines/appendingMachine/AppendingMachine';

@Component({
  selector: 'app-roller-metal',
  templateUrl: './roller-metal.component.html',
  styleUrls: ['./roller-metal.component.scss']
})
export class RollerMetalComponent implements OnInit {
  scene: Scene;
  camera: Camera;
  renderer: WebGLRenderer;
  orbitControls;

  // machine
  appendMachine = null;

  constructor(private rmService: RollerMetalService) {
  }

  ngOnInit() {
    this.renderer = this.rmService.createRenderer();
    this.scene = this.rmService.createScene();
    this.camera = this.rmService.createCamera();
    const ambientLight = new THREE.AmbientLight();

    this.appendMachine = new AppendingMachine();
    this.appendMachine.init(this.camera, this.renderer, this.scene).then(() => {
      this.scene.add(this.appendMachine.group);
      console.log(this.appendMachine.group);
      createTransFormControl(this.camera, this.scene, this.renderer, this.appendMachine.group, this.orbitControls);
      this.renderer.render(this.scene, this.camera);
    });

    this.scene.add(this.camera, ambientLight);


    this.orbitControls = createOrbitControls(this.camera, this.scene, this.renderer);
    this.renderer.render(this.scene, this.camera);
  }

}
