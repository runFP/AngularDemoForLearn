import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {RollerMetalService} from './roller-metal.service';
import * as THREE from 'three';
import {createOrbitControls, createTransFormControl} from './machines/utils';
import {Camera, Clock, LoadingManager, Scene, WebGLRenderer} from 'three';
import {AppendingMachine} from './machines/appendingMachine/AppendingMachine';
import {BaseMachine} from './machines/baseMachine';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {factoryMachine} from './machines/factoryMachine';
import {BigPunchMachine} from './machines/appendingMachine/BigPunchMachine';
import {MoveCutMachine} from './machines/appendingMachine/MoveCutMachine';
import {Rail} from './machines/other/Rail';
import {SmallCutMachine} from './machines/appendingMachine/SmallCutMachine';
import {No4} from './machines/appendingMachine/No4';
import {CarMachine} from './machines/appendingMachine/CarMachine';
import {ClampMachine} from './machines/appendingMachine/ClampMachine';
import {RivetingMachine} from './machines/appendingMachine/RivetingMachine';
import {MoveBeltMachine} from './machines/appendingMachine/MoveBeltMachine';
import {LiftMachine} from './machines/appendingMachine/LiftMachine';
import {RobotMachine} from './machines/appendingMachine/RobotMachine';

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
  isLoadComplete = false; // 是否完全加载

  // rail = new Rail(this.loadManager);

  /** 机器相关 */
    // loadMachine = ['append', 'moveCut', 'bigPunch', 'moveCut2'];
    // 需要加载的机器名，需和机器的name属性对应,加载后可通过该名字从machine中获取机器实例
  loadMachines: { name: string, type: string }[] = [
    {name: 'append', type: 'Append'},
    // {name: 'moveCut1', type: 'MoveCut'},
    // {name: 'bigPunch', type: 'BigPunch'},
    // {name: 'moveCut2', type: 'MoveCut'},
    // {name: 'no2', type: 'No2'},
    // {name: 'moveCut3', type: 'MoveCut'},
    // {name: 'no3', type: 'No3'},
    {name: 'moveCut4', type: 'MoveCut'},
    {name: 'no4', type: 'No4'},
    {name: 'smallCut', type: 'SmallCut'},
    {name: 'car', type: 'Car'},
    {name: 'clamp', type: 'Clamp'},
    {name: 'riveting', type: 'Riveting'},
    {name: 'moveBelt', type: 'MoveBelt'},
    {name: 'liftMachine', type: 'LiftMachine'},
    {name: 'lineSpeedMachine', type: 'LineSpeedMachine'},
    {name: 'robotMachine', type: 'RobotMachine'},
  ];

  machines: { name: string, machine: BaseMachine }[] = []; // 所有机器的实例
  machinePromise: Promise<BaseMachine>[] = []; // 加载初始化的所有回调
  otherPromise: Promise<any>[] = []; // 加载其他模型的回调
  appendMachine: AppendingMachine | null = null;


  constructor(private rmService: RollerMetalService) {
    this.loadManager.onLoad = () => {
      console.log('isLoadComplete!!!!');
      this.isLoadComplete = true;
      // this.animation();
    };
  }

  ngOnInit() {
    this.renderer = this.rmService.createRenderer(this.container);
    this.scene = this.rmService.createScene();
    this.camera = this.rmService.createCamera();

    const ambientLight = new THREE.AmbientLight();
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight();
    pointLight.position.set(60, 100, 0);
    pointLight.shadow.mapSize.width = 1024;
    pointLight.shadow.mapSize.height = 1024;
    this.scene.add(pointLight);

    this.instantiateMachines();
    this.init();
    this.startUp();

    this.orbitControls = createOrbitControls(this.camera, this.scene, this.renderer);
    this.render();
  }

  /**
   * 实例化所有机器
   * @private
   */
  private instantiateMachines(): void {
    this.loadMachines.forEach(loadMachine => {
      this.machines.push({name: loadMachine.name, machine: factoryMachine(loadMachine.type, this.loadManager)});
    });
  }

  private init() {
    // this.otherPromise.push(this.rail.init());
    this.initMachines();
  }

  /**
   * 所有机器进行初始化
   * @private
   */
  private initMachines(): void {
    this.machines.forEach(machineInf => {
      this.machinePromise.push(machineInf.machine.init(this.camera, this.renderer, this.scene));
    });
  }

  /**
   * 机器初始化完成后，启动
   */
  startUp(): Promise<string> {
    return Promise.all([...this.machinePromise, ...this.otherPromise]).then(elements => {
      const groups = [];

      this.positionInit();

      elements.forEach(element => {
        groups.push(...element.group.children);
        this.scene.add(element.group);
      });

      this.render();

      createTransFormControl(this.camera, this.scene, this.renderer, groups, this.orbitControls, this.container.nativeElement);

      return 'started';
    });
  }

  /**
   * 初始化各种机器的位置
   */
  positionInit() {
    // this.rail.group.position.set(242.6, 0, 10.6);
    this.getMachine<AppendingMachine>('append').group.position.set(-4.5, 0, -2.4);
    // this.getMachine<MoveCutMachine>('moveCut1').group.position.set(28, 0, 9);
    // this.getMachine<BigPunchMachine>('bigPunch').group.position.set(54, 0, 12);
    // this.getMachine<BigPunchMachine>('moveCut2').group.position.set(82, 0, 9);
    // this.getMachine<BigPunchMachine>('no2').group.position.setX(108);
    // this.getMachine<BigPunchMachine>('moveCut3').group.position.set(135, 0, 9);
    // this.getMachine<BigPunchMachine>('no3').group.position.setX(162.5);
    this.getMachine<BigPunchMachine>('moveCut4').group.position.set(190, 0, 9);
    this.getMachine<BigPunchMachine>('no4').group.position.setX(217);
    this.getMachine<BigPunchMachine>('smallCut').group.position.set(228, 0, 7);
    this.getMachine<BigPunchMachine>('car').group.position.set(238, 0, 7);
    this.getMachine<BigPunchMachine>('clamp').group.position.set(246, -7, 6);
    this.getMachine<BigPunchMachine>('riveting').group.position.set(312, 0, 7);
    this.getMachine<BigPunchMachine>('moveBelt').group.position.set(386.3, 0, 5.28);
    this.getMachine<BigPunchMachine>('liftMachine').group.position.set(448, 0, 8.73);
    this.getMachine<BigPunchMachine>('liftMachine').group.rotation.set(0, -Math.PI / 2, 0);
    // this.getMachine<BigPunchMachine>('robotMachine').group.position.set(505, 32, 77);
    this.getMachine<BigPunchMachine>('robotMachine').group.position.set(505, 0, 0);
    // this.getMachine<BigPunchMachine>('robotMachine').group.rotation.set(-Math.PI / 2, 0, 0);
    this.getMachine<BigPunchMachine>('lineSpeedMachine').group.position.set(505, 0, -6);

    // 动画衔接
    this.getMachine<AppendingMachine>('append').horizontalEnd.subscribe(() => {
      // this.getMachine<MoveCutMachine>('moveCut1')!.playTranslationLeft();
      // this.getMachine<MoveCutMachine>('moveCut2')!.playTranslationLeft();
      // this.getMachine<MoveCutMachine>('moveCut3')!.playTranslationLeft();
      this.getMachine<MoveCutMachine>('moveCut4')!.playTranslationLeft();
    });

    // this.getMachine<MoveCutMachine>('moveCut1').translationRestoreRightEnd.subscribe(() => {
    //   this.getMachine<MoveCutMachine>('bigPunch').playVertical();
    // });
    //
    // this.getMachine<MoveCutMachine>('moveCut2').translationRestoreRightEnd.subscribe(() => {
    //   this.getMachine<MoveCutMachine>('no2').playVertical();
    // });
    //
    // this.getMachine<MoveCutMachine>('moveCut3').translationRestoreRightEnd.subscribe(() => {
    //   this.getMachine<MoveCutMachine>('no3').playVertical();
    // });

    this.getMachine<MoveCutMachine>('moveCut4').translationRestoreRightEnd.subscribe(() => {
      this.getMachine<MoveCutMachine>('no4').playVertical();
    });

    this.getMachine<No4>('no4').verticalEnd.subscribe(() => {
      this.getMachine<MoveCutMachine>('smallCut').playTranslationLeft();
    });

    this.getMachine<SmallCutMachine>('smallCut').translationRestoreRightEnd.subscribe(() => {
      this.getMachine<CarMachine>('car').playMove1();
    });

    this.getMachine<CarMachine>('car').move1End.subscribe(() => {
      this.getMachine<ClampMachine>('clamp').playClampMove();
    });

    this.getMachine<ClampMachine>('clamp').moveVerticalEnd.subscribe(() => {
      this.getMachine<CarMachine>('car').playMove2();
    });

    this.getMachine<CarMachine>('car').move2End.subscribe(() => {
      this.getMachine<RivetingMachine>('riveting').playOverallJigVertical();
    });

    this.getMachine<RivetingMachine>('riveting').overallJigVerticalEnd.subscribe((inf) => {
      if (inf.direction === -1) {
        this.getMachine<RivetingMachine>('riveting').playOverallJigRight();
        this.getMachine<CarMachine>('car').playMoveBack();
      } else {
        this.getMachine<RivetingMachine>('riveting').playOverallJigLeft();
      }
    });

    this.getMachine<RivetingMachine>('riveting').overallJigRightEnd.subscribe(() => {
      this.getMachine<RivetingMachine>('riveting').playOverallJigVertical();
    });

  }

  /**
   * 根据名字返回对用的机器实例
   * @param name
   */
  getMachine<T extends BaseMachine>(name): T | null {
    const instanceInf = this.machines.find(machineInf => machineInf.name === name);
    return instanceInf ? instanceInf.machine as T : null;
  }

  playHorizontal() {
    this.getMachine<AppendingMachine>('append')!.playHorizontal();
  }

  playMove1() {
    this.getMachine<CarMachine>('car')!.playMove1();
  }

  playMoveBeltVertical() {
    this.getMachine<MoveBeltMachine>('moveBelt')!.playMoveBeltVertical();
  }

  playMoveBel() {
    this.getMachine<MoveBeltMachine>('moveBelt')!.playMoveBeltVerticalContinue();
  }

  playLiftBoardMoveUp() {
    this.getMachine<LiftMachine>('liftMachine')!.playLiftBoardMoveUp();
  }

  playLiftBoardMoveDown() {
    this.getMachine<LiftMachine>('liftMachine')!.playLiftBoardMoveDown();
  }

  playTongRotation() {
    this.getMachine<RobotMachine>('robotMachine')!.playTongRotation();
  }

  playRotation() {
    this.getMachine<RobotMachine>('robotMachine')!.playRotation();
    this.render();
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
    this.machines.forEach(machineInf => {

      machineInf.machine.animationManagers.forEach(am => {
        if (am.mixer) {
          am.mixer.update(mixerUpdateDelta);
        }
        if (machineInf.machine.name === 'moveBelt') {
          (<MoveBeltMachine>machineInf.machine).checkMoveBeltVerticalHalfState();
        }
      });
      this.render();
    });
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }


}
