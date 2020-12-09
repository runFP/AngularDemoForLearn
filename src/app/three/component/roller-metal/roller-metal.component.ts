import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {RollerMetalService} from './roller-metal.service';
import * as THREE from 'three';
import {createOrbitControls, createTransFormControl} from './machines/utils';
import {Camera, Clock, LoadingManager, Scene, WebGLRenderer} from 'three';
import {AppendingMachine} from './machines/appendingMachine/AppendingMachine';
import {BaseMachine} from './machines/baseMachine';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {factoryMachine} from './machines/factoryMachine';

@Component({
  selector: 'app-roller-metal',
  templateUrl: './roller-metal.component.html',
  styleUrls: ['./roller-metal.component.scss']
})
export class RollerMetalComponent implements OnInit {
  @ViewChild('container', {static: true}) container: ElementRef;

  scene: Scene;
  camera: Camera;
  renderer: WebGLRenderer;
  orbitControls: OrbitControls;
  clock = new Clock();
  loadManager = new LoadingManager();

  /** 机器相关 */
  machineNames = ['append']; // 需要加载的机器名，需和机器的name属性对应,加载后可通过该名字从machine中获取机器实例
  machines: BaseMachine[] = []; // 所有机器的实例
  machinePromise: Promise<any>[] = []; // 加载初始化的所有回调，用于启动程序
  appendMachine: AppendingMachine | null = null;


  constructor(private rmService: RollerMetalService) {
    this.loadManager.onLoad = () => {
      console.log('load!!!!');
    };
  }

  ngOnInit() {
    this.renderer = this.rmService.createRenderer(this.container);
    this.scene = this.rmService.createScene();
    this.camera = this.rmService.createCamera();

    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(0, 20, 20);
    dirLight.castShadow = true;
    this.scene.add(this.camera, dirLight);
    // 阴影
    const shadowMaterial = new THREE.ShadowMaterial();
    shadowMaterial.opacity = 0.5;
    const groundMesh = new THREE.Mesh(
      new THREE.BoxGeometry(100, .1, 100),
      shadowMaterial
    );
    groundMesh.receiveShadow = true;
    this.scene.add(groundMesh);

    this.instantiateMachines();
    this.initMachines();
    this.startUp();
    this.animation();

    this.orbitControls = createOrbitControls(this.camera, this.scene, this.renderer);
    this.render();
  }

  /**
   * 实例化所有机器
   * @private
   */
  private instantiateMachines(): void {
    this.machineNames.forEach(name => {
      this.machines.push(factoryMachine(name, this.loadManager));
    });
  }

  /**
   * 所有机器进行初始化
   * @private
   */
  private initMachines(): void {
    this.machines.forEach(machine => {
      this.machinePromise.push(machine.init(this.camera, this.renderer, this.scene));
    });
  }

  /**
   * 机器初始化完成后，启动
   */
  startUp(): void {
    Promise.all(this.machinePromise).then(machines => {
      const groups = [];
      machines.forEach(machine => {
        console.log(machine.group);
        groups.push(...machine.group.children);
        this.scene.add(machine.group);
      });
      this.render();
      createTransFormControl(this.camera, this.scene, this.renderer, groups, this.orbitControls);
    });
  }

  getMachine<T extends BaseMachine>(name): T | null {
    const instance = this.machines.find(machine => machine.name === name);
    return instance ? instance as T : null;
  }

  playHorizontal() {
    this.getMachine<AppendingMachine>('append')!.playHorizontal();
  }

  playVertical() {
    this.getMachine<AppendingMachine>('append')!.playVertical();
  }

  moveVertical() {
    this.appendMachine.moveVertical();
  }

  animation() {
    requestAnimationFrame(() => this.animation());
    /**
     * 当有多个mixer时，他们的所处的时间应一致
     * 如果在遍历里这么写：am.mixer.update(mixerUpdateDelta);
     * 那么每个mixer的时间将不相同，只会有第一个动画执行，原因是：
     * 1.首先要知道update方法是推进全局混合器时间
     * 2.当第一个mixer.update后时间已经被推进，这时后续的mixer.update再执行，混合器的时间继续被推进，
     * 就对不上mixer对应动画了
     * import:动画中有一条全局混合器时间线，和我们平时看电影一样，同一个时刻，所有的元素的位置都已经是固定的
     */
    const mixerUpdateDelta = this.clock.getDelta();
    this.machines.forEach(machine => {
      machine.animationManagers.forEach(am => {
        if (am.mixer) {
          am.mixer.update(mixerUpdateDelta);
        }
      });
      this.render();
    });
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }


}
