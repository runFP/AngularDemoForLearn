import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {RollerMetalService} from './roller-metal.service';
import * as THREE from 'three';
import {createOrbitControls, createTransFormControl} from './machines/utils';
import {Camera, Clock, Group, LoadingManager, Scene, Vector3, WebGLRenderer} from 'three';
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
import {Material} from './machines/other/Material';
import {No3} from './machines/appendingMachine/No3';
import {No2} from './machines/appendingMachine/No2';

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

  materials: Material[] = [];

  // rail = new Rail(this.loadManager);

  /** 机器相关 */
    // loadMachine = ['append', 'moveCut', 'bigPunch', 'moveCut2'];
    // 需要加载的机器名，需和机器的name属性对应,加载后可通过该名字从machine中获取机器实例
  loadMachines: { name: string, type: string }[] = [
    {name: 'append', type: 'Append'},
    {name: 'moveCut1', type: 'MoveCut'},
    {name: 'bigPunch', type: 'BigPunch'},
    {name: 'moveCut2', type: 'MoveCut'},
    {name: 'no2', type: 'No2'},
    {name: 'moveCut3', type: 'MoveCut'},
    {name: 'no3', type: 'No3'},
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
      this.animation();
    };
  }

  ngOnInit() {
    this.renderer = this.rmService.createRenderer(this.container);
    this.scene = this.rmService.createScene();
    this.camera = this.rmService.createCamera();

    const ambientLight = new THREE.AmbientLight();
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight();
    pointLight.position.set(200, 80, 0);
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
      this.machinePromise.push(machineInf.machine.init());
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

      const a = new Material();
      this.materials.push(a);
      this.scene.add(a.cube);
      this.render();
      createTransFormControl(this.camera, this.scene, this.renderer, [a.cube], this.orbitControls, this.container.nativeElement);
      return 'started';
    });
  }

  /**
   * 初始化各种机器的位置
   */
  positionInit() {
    // this.rail.group.position.set(242.6, 0, 10.6);
    this.getMachine<AppendingMachine>('append').group.position.set(-4.5, 0, -2.4);
    this.getMachine<MoveCutMachine>('moveCut1').group.position.set(28, 0, 9);
    this.getMachine<BigPunchMachine>('bigPunch').group.position.set(54, 0, 12);
    this.getMachine<BigPunchMachine>('moveCut2').group.position.set(82, 0, 9);
    this.getMachine<BigPunchMachine>('no2').group.position.setX(108);
    this.getMachine<BigPunchMachine>('moveCut3').group.position.set(135, 0, 9);
    this.getMachine<BigPunchMachine>('no3').group.position.setX(162.5);
    this.getMachine<BigPunchMachine>('moveCut4').group.position.set(190, 0, 9);
    this.getMachine<BigPunchMachine>('no4').group.position.setX(217);
    this.getMachine<BigPunchMachine>('smallCut').group.position.set(228, 0, 7);
    this.getMachine<BigPunchMachine>('car').group.position.set(238, 0, 7);
    this.getMachine<BigPunchMachine>('clamp').group.position.set(246, -7, 6);
    this.getMachine<BigPunchMachine>('riveting').group.position.set(312, 0, 7);
    this.getMachine<BigPunchMachine>('moveBelt').group.position.set(386.3, 0, 5.28);
    this.getMachine<BigPunchMachine>('liftMachine').group.position.set(448, 30, 8.73);
    this.getMachine<BigPunchMachine>('robotMachine').group.position.set(506, 32, 6.78);
    this.getMachine<BigPunchMachine>('lineSpeedMachine').group.position.set(505, 0, -6);

    // 动画衔接
    this.getMachine<AppendingMachine>('append').verticalDownEnd.subscribe((append: AppendingMachine) => {
      this.materials.forEach(m => {
        if (m.append_v === false) {
          m.append_v = true;
          append.verticalGroup.attach(m.cube);
        }
      });
    });

    this.getMachine<AppendingMachine>('append').horizontalGoEnd.subscribe((append: AppendingMachine) => {
      this.materials.forEach(m => {
        if (m.append_v === true && m.mc1_left === false) {
          m.append_h = true;
          this.scene.attach(m.cube);
          m.cube.position.setY(10.5);
        }
      });
      this.getMachine<MoveCutMachine>('moveCut1')!.playTranslationLeft();
      this.getMachine<MoveCutMachine>('moveCut2')!.playTranslationLeft();
      this.getMachine<MoveCutMachine>('moveCut3')!.playTranslationLeft();
      this.getMachine<MoveCutMachine>('moveCut4')!.playTranslationLeft();
    });

    // ------------------------------------ moveCut1 ----------------------------------------------------------
    this.getMachine<MoveCutMachine>('moveCut1').translationRestoreRightEnd.subscribe(() => {
      this.getMachine<BigPunchMachine>('bigPunch').playVertical();
    });
    this.getMachine<MoveCutMachine>('moveCut1')!.downEnd.subscribe((mc1: MoveCutMachine) => {
      this.materials.forEach(m => {
        if (m.append_h === true && m.mc1_left === false) {
          m.mc1_left = true;
          mc1.clampG.attach(m.cube);
          m.cube.position.setY(12);
        } else if (m.mc1_left === true && m.mc1_middle === false) {
          m.mc1_middle = true;
          this.scene.attach(m.cube);
          m.cube.position.set(mc1.group.position.x, 12, m.cube.position.z);
        } else if (m.mc1_middle === true && m.mc1_right === false) {
          m.mc1_right = true;
          mc1.clamp2G.attach(m.cube);
          m.cube.position.setY(12);
        } else if (m.mc1_right === true && m.big_punch === false) {
          this.scene.attach(m.cube);
          m.cube.position.add(new Vector3(5.9, 0, 0));
        }
      });

    });
    // ------------------------------------ bigPunch ----------------------------------------------------------
    this.getMachine<BigPunchMachine>('bigPunch').verticalEnd.subscribe(() => {
      this.playVerticalDown();
      this.materials.forEach(m => {
        if (m.mc1_right === true && m.big_punch === false) {
          m.big_punch = true;
        }
      });
    });
    // ------------------------------------ moveCut2 ----------------------------------------------------------
    this.getMachine<MoveCutMachine>('moveCut2').translationRestoreRightEnd.subscribe(() => {
      this.getMachine<No2>('no2').playVertical();
    });
    this.getMachine<MoveCutMachine>('moveCut2')!.downEnd.subscribe((mc2: MoveCutMachine) => {
      this.materials.forEach(m => {
        if (m.big_punch === true && m.mc2_left === false) {
          m.mc2_left = true;
          mc2.clampG.attach(m.cube);
          m.cube.position.setY(12);
        } else if (m.mc2_left === true && m.mc2_middle === false) {
          m.mc2_middle = true;
          this.scene.attach(m.cube);
          m.cube.position.set(mc2.group.position.x, 12, m.cube.position.z);
        } else if (m.mc2_middle === true && m.mc2_right === false) {
          m.mc2_right = true;
          mc2.clamp2G.attach(m.cube);
          m.cube.position.setY(12);
        } else if (m.mc2_right === true && m.no2_punch === false) {
          this.scene.attach(m.cube);
          m.cube.position.add(new Vector3(5.2, 0, 0));
        }
      });
    });
    // ------------------------------------ no2 ----------------------------------------------------------
    this.getMachine<No2>('no2').verticalEnd.subscribe(() => {
      this.materials.forEach(m => {
        if (m.mc2_right === true && m.no2_punch === false) {
          m.no2_punch = true;
        }
      });
    });
    // ------------------------------------ moveCut3 ----------------------------------------------------------
    this.getMachine<MoveCutMachine>('moveCut3').translationRestoreRightEnd.subscribe(() => {
      this.getMachine<No3>('no3').playVertical();
    });
    this.getMachine<MoveCutMachine>('moveCut3')!.downEnd.subscribe((mc3: MoveCutMachine) => {
      this.materials.forEach(m => {
        if (m.no2_punch === true && m.mc3_left === false) {
          m.mc3_left = true;
          mc3.clampG.attach(m.cube);
          m.cube.position.setY(12);
        } else if (m.mc3_left === true && m.mc3_middle === false) {
          m.mc3_middle = true;
          this.scene.attach(m.cube);
          m.cube.position.set(mc3.group.position.x, 12, m.cube.position.z);
        } else if (m.mc3_middle === true && m.mc3_right === false) {
          m.mc3_right = true;
          mc3.clamp2G.attach(m.cube);
          m.cube.position.setY(12);
        } else if (m.mc3_right === true && m.no3_punch === false) {
          this.scene.attach(m.cube);
          m.cube.position.add(new Vector3(6.5, 0, 0));
        }
      });
    });
    // ------------------------------------ no3 ----------------------------------------------------------
    this.getMachine<No3>('no3').verticalEnd.subscribe(() => {
      this.materials.forEach(m => {
        if (m.mc3_right === true && m.no3_punch === false) {
          m.no3_punch = true;
        }
      });
    });
    // ------------------------------------ moveCut4 ----------------------------------------------------------
    this.getMachine<MoveCutMachine>('moveCut4').translationRestoreRightEnd.subscribe(() => {
      this.getMachine<No4>('no4').playVertical();
    });
    this.getMachine<MoveCutMachine>('moveCut4')!.downEnd.subscribe((mc4: MoveCutMachine) => {
      this.materials.forEach(m => {
        if (m.no3_punch === true && m.mc4_left === false) {
          m.mc4_left = true;
          mc4.clampG.attach(m.cube);
          m.cube.position.setY(12);
        } else if (m.mc4_left === true && m.mc4_middle === false) {
          m.mc4_middle = true;
          this.scene.attach(m.cube);
          m.cube.position.set(mc4.group.position.x, 12, m.cube.position.z);
        } else if (m.mc4_middle === true && m.mc4_right === false) {
          m.mc4_right = true;
          mc4.clamp2G.attach(m.cube);
        } else if (m.mc4_right === true && m.no4_punch === false) {
          this.scene.attach(m.cube);
          m.cube.position.add(new Vector3(5.2, 2, 0));
        }
      });
    });
    // ------------------------------------ no4 ----------------------------------------------------------
    this.getMachine<No4>('no4').verticalEnd.subscribe(() => {
      this.materials.forEach(m => {
        if (m.mc4_right === true && m.no4_punch === false) {
          m.no4_punch = true;
        }
      });
      this.getMachine<SmallCutMachine>('smallCut').playTranslationLeft();
    });

    this.getMachine<SmallCutMachine>('smallCut').verticalEnd.subscribe((sm: SmallCutMachine) => {
      this.materials.forEach(m => {
        if (m.no4_punch === true && m.smallCut_left === false) {
          m.smallCut_left = true;
          sm.clampGroup.attach(m.cube);
        } else if (m.smallCut_left === true && m.smallCut_Right === false) {
          m.smallCut_Right = true;
          const car = this.getMachine<CarMachine>('car');
          // m.cube.position.set(car.carGroup.position.x, 15, car.carGroup.position.z);
          this.scene.attach(m.cube);
        }
      });
    });

    this.getMachine<SmallCutMachine>('smallCut').translationRestoreRightEnd.subscribe(() => {
      this.getMachine<CarMachine>('car').playMove1();
    });

    this.getMachine<CarMachine>('car').move1Start.subscribe((car: CarMachine) => {
      this.materials.forEach(m => {
        if (m.smallCut_Right === true && m.carMove1 === false) {
          car.carGroup.attach(m.cube);
        }
      });
    });

    this.getMachine<CarMachine>('car').move1End.subscribe(() => {
      this.getMachine<ClampMachine>('clamp').playClampMove();
      this.materials.forEach(m => {
        if (m.smallCut_Right === true && m.carMove1 === false) {
          m.carMove1 = true;
        }
      });
    });

    this.getMachine<ClampMachine>('clamp').moveVerticalEnd.subscribe(() => {
      this.materials.forEach(m => {
        if (m.carMove1 === true && m.clampModel === false) {
          m.clampModel = true;
          this.scene.attach(m.cube).remove(m.cube);
          m.createChangeModel();
        }
      });
      this.getMachine<CarMachine>('car').playMove2();
    });
    this.getMachine<CarMachine>('car').move2Start.subscribe((car: CarMachine) => {
      this.materials.forEach(m => {
        if (m.clampModel === true && m.carMove2 === false) {
          m.cube.position.add(new Vector3(0, 1, 0));
          car.carGroup.attach(m.cube);
        }
      });
    });
    this.getMachine<CarMachine>('car').move2End.subscribe((car: CarMachine) => {
      this.getMachine<RivetingMachine>('riveting').playOverallJigDown();
      this.materials.forEach(m => {
        if (m.clampModel === true && m.carMove2 === false) {
          m.carMove2 = true;
        }
      });
    });

    this.getMachine<RivetingMachine>('riveting').overallJigDownEnd.subscribe((rm: RivetingMachine) => {
      this.materials.forEach(m => {
        if (m.carMove2 === true && m.riveting_over === false && rm.direction === -1) {
          m.cube.position.setY(rm.group.position.y);
          m.cube.position.add(new Vector3(0, 16, 0));
          rm.overallJigGroup.attach(m.cube);
          console.log('m.position', m.cube.position);
        } else if (m.carMove2 === true && m.riveting_over === false && rm.direction === 1) {
          if (m.riveting_1 === false) {
            console.log('m.position1', m.cube.position);
            m.riveting_1 = true;
          } else if (m.riveting_1 === true && m.riveting_2 === false) {
            console.log('m.position2', m.cube.position);
            m.riveting_2 = true;
          } else if (m.riveting_2 === true && m.riveting_3 === false) {
            console.log('m.position3', m.cube.position);
            m.riveting_3 = true;
          } else if (m.riveting_3 === true && m.riveting_4 === false) {
            m.riveting_4 = true;
          } else if (m.riveting_4 === true && m.riveting_5 === false) {
            m.riveting_5 = true;
          } else if (m.riveting_5 === true && m.riveting_over === false) {
            m.riveting_over = true;
          }
          this.scene.attach(m.cube);
        }
      });
      this.getMachine<MoveBeltMachine>('moveBelt').playMoveBeltVertical();
    });

    this.getMachine<RivetingMachine>('riveting').overallJigUpEnd.subscribe((rm: RivetingMachine) => {
      if (rm.direction === -1) {
        this.getMachine<RivetingMachine>('riveting').playOverallJigRight();
        this.getMachine<CarMachine>('car').playMoveBack();
      } else {
        this.getMachine<RivetingMachine>('riveting').playOverallJigLeft();
      }
    });

    this.getMachine<RivetingMachine>('riveting').overallJigRightEnd.subscribe(() => {
      this.getMachine<RivetingMachine>('riveting').playOverallJigDown();
    });

    this.getMachine<MoveBeltMachine>('moveBelt').moveVerticalStart.subscribe((mb: MoveBeltMachine) => {
      this.materials.forEach(m => {
        if (m.riveting_over === true && m.moveBelt_down === false) {
          mb.moveBeltGroup.attach(m.cube);
          m.moveBelt_down = true;
        }
      });
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

  playVerticalDown() {
    const a = new Material();
    this.materials.push(a);
    this.scene.add(a.cube);
    this.getMachine<AppendingMachine>('append')!.playVerticalDown();
  }

  playOverallJigDown() {
    this.getMachine<RivetingMachine>('riveting')!.playOverallJigDown();
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

  playTongRotationRevert() {
    this.getMachine<RobotMachine>('robotMachine')!.playTongRotationRevert();
  }

  playSwivelRotation() {
    this.getMachine<RobotMachine>('robotMachine')!.playSwivelRotation();
  }

  playSwivelRotationRevert() {
    this.getMachine<RobotMachine>('robotMachine')!.playSwivelRotationRevert();
  }

  playArm2Down2() {
    this.getMachine<RobotMachine>('robotMachine')!.playArm2Down2();
  }

  playArm2Down2Revert() {
    this.getMachine<RobotMachine>('robotMachine')!.playArm2Down2Revert();
  }

  playArm2Up() {
    this.getMachine<RobotMachine>('robotMachine')!.playArm2Up();
  }

  playArm2UpRevert() {
    this.getMachine<RobotMachine>('robotMachine')!.playArm2UpRevert();
  }

  playArm1Back() {
    this.getMachine<RobotMachine>('robotMachine')!.playArm1Back();
  }

  playArm1BackRevert() {
    this.getMachine<RobotMachine>('robotMachine')!.playArm1BackRevert();
  }

  playArm1Front() {
    this.getMachine<RobotMachine>('robotMachine')!.playArm1Front();
  }

  playArm1FrontRevert() {
    this.getMachine<RobotMachine>('robotMachine')!.playArm1FrontRevert();
  }

  playArm1Front2() {
    this.getMachine<RobotMachine>('robotMachine')!.playArm1Front2();
  }

  playArm1Front2Revert() {
    this.getMachine<RobotMachine>('robotMachine')!.playArm1Front2Revert();
  }

  playPedestalRotation() {
    this.getMachine<RobotMachine>('robotMachine')!.playPedestalRotation();
  }

  playPedestalRotationRevert() {
    this.getMachine<RobotMachine>('robotMachine')!.playPedestalRotationRevert();
  }

  playWork() {
    this.getMachine<RobotMachine>('robotMachine')!.playWork();
  }

  playBackWork() {
    this.getMachine<RobotMachine>('robotMachine')!.playBackWork();
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
