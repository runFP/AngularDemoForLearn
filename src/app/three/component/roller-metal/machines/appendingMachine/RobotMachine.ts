import {AnimationManager, BaseMachine} from '../baseMachine';
import {AnimationMixer, Group, LoadingManager} from 'three';
import {createAnimation, fixedObjLocalOrigin, fixedObjSingle, getObjectByProperty, loadMtlObj, MtlObjInf} from '../utils';
import {of, Subject, zip} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

const SHRINK = 100;
const PATH = [
  {
    name: 'base',
    mtlPath: '/assets/modal/roller/robot1.mtl',
    objPath: '/assets/modal/roller/robot1.obj'
  }
];

export class RobotMachine extends BaseMachine {
  name = 'robot';
  base: MtlObjInf = null;

  group = new Group();
  tongG = new Group();
  arm2G = new Group();
  swivelG = new Group();
  arm1G = new Group();
  pedestalG = new Group();
  // 已经进行了位置修复的组，组内包含了最原始的模型对象

  tongRotation;

  tongRotationStart = new Subject();
  tongRotationEnd = new Subject();
  tongRotationRevertStart = new Subject();
  tongRotationRevertEnd = new Subject();

  swivelRotationStart = new Subject();
  swivelRotationEnd = new Subject();
  swivelRotationRevertStart = new Subject();
  swivelRotationRevertEnd = new Subject();

  arm2DownStart = new Subject();
  arm2DownEnd = new Subject();
  arm2DownRevertStart = new Subject();
  arm2DownRevertEnd = new Subject();
  arm2Down2Start = new Subject();
  arm2Down2End = new Subject();
  arm2Down2RevertStart = new Subject();
  arm2Down2RevertEnd = new Subject();
  arm2UpStart = new Subject();
  arm2UpEnd = new Subject();
  arm2UpRevertStart = new Subject();
  arm2UpRevertEnd = new Subject();

  arm1BackStart = new Subject();
  arm1BackEnd = new Subject();
  arm1BackRevertStart = new Subject();
  arm1BackRevertEnd = new Subject();
  arm1FrontStart = new Subject();
  arm1FrontEnd = new Subject();
  arm1FrontRevertStart = new Subject();
  arm1FrontRevertEnd = new Subject();
  arm1Front2Start = new Subject();
  arm1Front2End = new Subject();
  arm1Front2RevertStart = new Subject();
  arm1Front2RevertEnd = new Subject();

  workStart = new Subject();
  workEnd = new Subject();
  workBackStart = new Subject();
  workBackEnd = new Subject();

  pedestalRotationStart = new Subject();
  pedestalRotationEnd = new Subject();
  pedestalRotationRevertStart = new Subject();
  pedestalRotationRevertEnd = new Subject();

  previousActionsType = {tong: null, swivel: null, arm2: null, arm1: null, pedestal: null};
  animationManagers: AnimationManager[] = [
    {name: 'tongRotation', track: null, action: null, clip: null, mixer: null},
    {name: 'tongRotationRevert', track: null, action: null, clip: null, mixer: null},
    {name: 'swivelRotation', track: null, action: null, clip: null, mixer: null},
    {name: 'swivelRotationRevert', track: null, action: null, clip: null, mixer: null},
    {name: 'arm2Down', track: null, action: null, clip: null, mixer: null},
    {name: 'arm2DownRevert', track: null, action: null, clip: null, mixer: null},
    {name: 'arm2Down2', track: null, action: null, clip: null, mixer: null},
    {name: 'arm2Down2Revert', track: null, action: null, clip: null, mixer: null},
    {name: 'arm2Up', track: null, action: null, clip: null, mixer: null},
    {name: 'arm2UpRevert', track: null, action: null, clip: null, mixer: null},
    {name: 'arm1Back', track: null, action: null, clip: null, mixer: null},
    {name: 'arm1BackRevert', track: null, action: null, clip: null, mixer: null},
    {name: 'arm1Front', track: null, action: null, clip: null, mixer: null},
    {name: 'arm1FrontRevert', track: null, action: null, clip: null, mixer: null},
    {name: 'arm1Front2', track: null, action: null, clip: null, mixer: null},
    {name: 'arm1Front2Revert', track: null, action: null, clip: null, mixer: null},
    {name: 'pedestalRotation', track: null, action: null, clip: null, mixer: null},
    {name: 'pedestalRotationRevert', track: null, action: null, clip: null, mixer: null},
  ];

  constructor(manager?: LoadingManager) {
    super(manager);
  }

  init(): Promise<any> {
    this.initAnimation();
    return new Promise<any>(resolve => {
      const allPathLoad = PATH.map(machinePath => loadMtlObj(machinePath.mtlPath, machinePath.objPath, this.manager, SHRINK));
      zip(...allPathLoad).subscribe(([base]) => {
        this.base = base;
        const [baseG] = fixedObjLocalOrigin([base], true);
        // 本地坐标和世界坐标修复
        // 底座
        const pedestal = getObjectByProperty(base.obj, 'material.name', value => value === 'Material_A1');
        const pedestalInf = fixedObjSingle(base, pedestal, {x: 0.6, y: 0, z: 0});

        // 臂1
        const arm1 = getObjectByProperty(base.obj, 'material.name', value => ['Material_A2', 'Material_A21'].indexOf(value) !== -1);
        const arm1Inf = fixedObjSingle(base, arm1, {x: 0, y: 0, z: 5});

        // 臂2
        const arm2 = getObjectByProperty(base.obj, 'material.name', value => ['Material_A3'].indexOf(value) !== -1);
        const arm2Inf = fixedObjSingle(base, arm2, {x: 6, y: 0, z: 0});

        // 转头
        const swivel = getObjectByProperty(base.obj, 'material.name', value => ['Material_A4', 'Material_A5', 'Material_A6'].indexOf(value) !== -1);
        const swivelInf = fixedObjSingle(base, swivel, {x: 0.5, y: 0, z: 0});

        // 抓手
        const tong = getObjectByProperty(base.obj, 'material.name', value => ['Material_A7', 'Material_A8', 'Material_A9'].indexOf(value) !== -1);
        const tongInf = fixedObjSingle(base, tong, {x: 3, y: 0, z: 0});
        const tongTmpG = new Group();
        tongTmpG.add(tongInf.group, this.tongG);
        tongTmpG.rotateX(Math.PI / 2);
        this.tongG.add(tongTmpG);
        this.tongG.position.copy(tongInf.fixedPosition.sub(swivelInf.fixedPosition));

        const swivelTmpG = new Group();
        swivelTmpG.add(swivelInf.group, this.tongG);
        swivelTmpG.rotateY(Math.PI / 2);
        this.swivelG.add(swivelTmpG);
        this.swivelG.position.copy(swivelInf.fixedPosition.sub(arm2Inf.fixedPosition));

        this.arm2G.add(arm2Inf.group, this.swivelG);
        this.arm2G.position.copy(arm2Inf.fixedPosition.sub(arm1Inf.fixedPosition));

        this.arm1G.add(arm1Inf.group, this.arm2G);
        this.arm1G.position.copy(arm1Inf.fixedPosition.sub(pedestalInf.fixedPosition));

        const pedestalTmpG = new Group();
        pedestalTmpG.add(pedestalInf.group, this.arm1G);
        pedestalTmpG.rotateZ(Math.PI / 2);
        this.pedestalG.add(pedestalTmpG);
        this.pedestalG.position.copy(pedestalInf.fixedPosition);

        this.group.add(baseG, this.pedestalG);
        this.group.rotation.set(-Math.PI / 2, 0, 0);
      }, () => {
      }, () => {
        resolve(this);
      });
    });
  }

  private initAnimation() {
    this.initTongAnimation();
    this.initSwivelAnimation();
    this.initArm2Animation();
    this.initArm1Animation();
    this.initPedestalAnimation();
  }

  private initTongAnimation() {
    const times = [];
    const values = [];
    const valuesRevert = [];
    const mixer = new AnimationMixer(this.tongG);
    const rotationDuration = 2;
    const rotationRate = Math.PI / rotationDuration / 10;

    for (let i = 0, j = rotationDuration * 10; i <= rotationDuration * 10; i++, j--) {
      times.push(i / 10);
      values.push(rotationRate * i);
      valuesRevert.push(rotationRate * j);
    }

    mixer.addEventListener('finished', () => {
      if (this.previousActionsType['tong'].name === 'tongRotation') {
        this.tongRotationEnd.next(this.tongG);
      } else if (this.previousActionsType['tong'].name === 'tongRotationRevert') {
        this.tongRotationRevertEnd.next(this.tongG);
      }
    });
    const rotationAnimation = createAnimation('.rotation[x]', 'tongRotation', times, values, mixer, rotationDuration);
    const rotationRevertAnimation = createAnimation('.rotation[x]', 'tongRotationRevert', times, valuesRevert, mixer, rotationDuration);
    Object.assign(this.getAnimationManager('tongRotation'), {...rotationAnimation, mixer});
    Object.assign(this.getAnimationManager('tongRotationRevert'), {...rotationRevertAnimation, mixer});
  }

  private initSwivelAnimation() {
    const times = [];
    const values = [];
    const valuesRevert = [];
    const mixer = new AnimationMixer(this.swivelG);
    const rotationDuration = 2;
    const rotationRate = -Math.PI / 2 / rotationDuration / 10;

    for (let i = 0, j = rotationDuration * 10; i <= rotationDuration * 10; i++, j--) {
      times.push(i / 10);
      values.push(rotationRate * i);
      valuesRevert.push(rotationRate * j);
    }

    mixer.addEventListener('finished', () => {
      if (this.previousActionsType['swivel'].name === 'swivelRotation') {
        this.swivelRotationEnd.next(this.swivelG);
      } else if (this.previousActionsType['swivel'].name === 'swivelRotationRevert') {
        this.swivelRotationRevertEnd.next(this.swivelG);
      }
    });
    const rotationAnimation = createAnimation('.rotation[y]', 'swivelRotation', times, values, mixer, rotationDuration);
    const rotationRevertAnimation = createAnimation('.rotation[y]', 'swivelRotationRevert', times, valuesRevert, mixer, rotationDuration);
    Object.assign(this.getAnimationManager('swivelRotation'), {...rotationAnimation, mixer});
    Object.assign(this.getAnimationManager('swivelRotationRevert'), {...rotationRevertAnimation, mixer});
  }

  private initArm2Animation() {
    const times = [];
    const valuesDown = [];
    const valuesDownRevert = [];

    const mixer = new AnimationMixer(this.arm2G);
    const rotationDuration = 2;
    const rotationRate = Math.PI / 12 / rotationDuration / 10;

    for (let i = 0, j = rotationDuration * 10; i <= rotationDuration * 10; i++, j--) {
      times.push(i / 10);
      valuesDown.push(rotationRate * i);
      valuesDownRevert.push(rotationRate * j);
    }

    const valuesUp = valuesDown.map(v => -v);
    const valuesUpRevert = valuesDownRevert.map(v => -v);
    const valuesDown2 = valuesDown.map(v => v * 2);
    const valuesDown2Revert = valuesDownRevert.map(v => v * 2);

    mixer.addEventListener('finished', () => {
      if (this.previousActionsType['arm2'].name === 'arm2Down') {
        this.arm2DownEnd.next(this.arm2G);
      } else if (this.previousActionsType['arm2'].name === 'arm2DownRevert') {
        this.arm2DownRevertEnd.next(this.arm2G);
      } else if (this.previousActionsType['arm2'].name === 'arm2Down2') {
        this.arm2Down2End.next(this.arm2G);
      } else if (this.previousActionsType['arm2'].name === 'arm2Down2Revert') {
        this.arm2Down2RevertEnd.next(this.arm2G);
      } else if (this.previousActionsType['arm2'].name === 'arm2Up') {
        this.arm2UpEnd.next(this.arm2G);
      } else if (this.previousActionsType['arm2'].name === 'arm2UpRevert') {
        this.arm2UpRevertEnd.next(this.arm2G);
      }
    });
    const downAnimation = createAnimation('.rotation[y]', 'arm2Down', times, valuesDown, mixer, rotationDuration);
    const downRevertAnimation = createAnimation('.rotation[y]', 'arm2DownRevert', times, valuesDownRevert, mixer, rotationDuration);
    const down2Animation = createAnimation('.rotation[y]', 'arm2Down2', times, valuesDown2, mixer, rotationDuration);
    const down2RevertAnimation = createAnimation('.rotation[y]', 'arm2Down2Revert', times, valuesDown2Revert, mixer, rotationDuration);
    const upAnimation = createAnimation('.rotation[y]', 'arm2Down', times, valuesUp, mixer, rotationDuration);
    const upRevertAnimation = createAnimation('.rotation[y]', 'arm2DownRevert', times, valuesUpRevert, mixer, rotationDuration);
    Object.assign(this.getAnimationManager('arm2Down'), {...downAnimation, mixer});
    Object.assign(this.getAnimationManager('arm2DownRevert'), {...downRevertAnimation, mixer});
    Object.assign(this.getAnimationManager('arm2Down2'), {...down2Animation, mixer});
    Object.assign(this.getAnimationManager('arm2Down2Revert'), {...down2RevertAnimation, mixer});
    Object.assign(this.getAnimationManager('arm2Up'), {...upAnimation, mixer});
    Object.assign(this.getAnimationManager('arm2UpRevert'), {...upRevertAnimation, mixer});
  }

  private initArm1Animation() {
    const times = [];
    const times2 = [];
    const values = [];
    const valuesRevert = [];
    const valuesFront2 = [];
    const valuesFront2Revert = [];

    const mixer = new AnimationMixer(this.arm1G);
    const rotationDuration = 2;
    const rotationFront2Duration = 4;
    const rotationRate = -Math.PI / 12 / rotationDuration / 10;
    const rotationFrontRate = Math.PI / 3 / rotationFront2Duration / 10;

    for (let i = 0, j = rotationDuration * 10; i <= rotationDuration * 10; i++, j--) {
      times.push(i / 10);
      values.push(rotationRate * i);
      valuesRevert.push(rotationRate * j);
    }

    for (let i = 0, j = rotationFront2Duration * 10; i <= rotationFront2Duration * 10; i++, j--) {
      times2.push(i / 10);
      valuesFront2.push(rotationFrontRate * i);
      valuesFront2Revert.push(rotationFrontRate * j);
    }

    const valuesFront = values.map(v => -v);
    const valuesFrontRevert = valuesRevert.map(v => -v);

    mixer.addEventListener('finished', () => {
      if (this.previousActionsType['arm1'].name === 'arm1Back') {
        this.arm1BackEnd.next(this.arm1G);
      } else if (this.previousActionsType['arm1'].name === 'arm1BackRevert') {
        this.arm1BackRevertEnd.next(this.arm1G);
      } else if (this.previousActionsType['arm1'].name === 'arm1Front') {
        this.arm1FrontEnd.next(this.arm1G);
      } else if (this.previousActionsType['arm1'].name === 'arm1FrontRevert') {
        this.arm1FrontRevertEnd.next(this.arm1G);
      } else if (this.previousActionsType['arm1'].name === 'arm1Front2') {
        this.arm1Front2End.next(this.arm1G);
      } else if (this.previousActionsType['arm1'].name === 'arm1Front2Revert') {
        this.arm1Front2RevertEnd.next(this.arm1G);
      }
    });
    const backAnimation = createAnimation('.rotation[y]', 'arm1Back', times, values, mixer, rotationDuration);
    const backRevertAnimation = createAnimation('.rotation[y]', 'arm1BackRevert', times, valuesRevert, mixer, rotationDuration);
    const frontAnimation = createAnimation('.rotation[y]', 'arm1Front', times, valuesFront, mixer, rotationDuration);
    const frontRevertAnimation = createAnimation('.rotation[y]', 'arm1FrontRevert', times, valuesFrontRevert, mixer, rotationDuration);
    const front2Animation = createAnimation('.rotation[y]', 'arm1Front', times2, valuesFront2, mixer, rotationFront2Duration);
    const front2RevertAnimation = createAnimation('.rotation[y]', 'arm1FrontRevert', times2, valuesFront2Revert, mixer, rotationFront2Duration);
    Object.assign(this.getAnimationManager('arm1Back'), {...backAnimation, mixer});
    Object.assign(this.getAnimationManager('arm1BackRevert'), {...backRevertAnimation, mixer});
    Object.assign(this.getAnimationManager('arm1Front'), {...frontAnimation, mixer});
    Object.assign(this.getAnimationManager('arm1FrontRevert'), {...frontRevertAnimation, mixer});
    Object.assign(this.getAnimationManager('arm1Front2'), {...front2Animation, mixer});
    Object.assign(this.getAnimationManager('arm1Front2Revert'), {...front2RevertAnimation, mixer});

  }

  private initPedestalAnimation() {
    const times = [];
    const values = [];
    const valuesRevert = [];
    const mixer = new AnimationMixer(this.pedestalG);
    const rotationDuration = 2;
    const rotationRate = Math.PI / 2 / rotationDuration / 10;

    for (let i = 0, j = rotationDuration * 10; i <= rotationDuration * 10; i++, j--) {
      times.push(i / 10);
      values.push(rotationRate * i);
      valuesRevert.push(rotationRate * j);
    }

    mixer.addEventListener('finished', () => {
      if (this.previousActionsType['pedestal'].name === 'pedestalRotation') {
        this.pedestalRotationEnd.next(this.pedestalG);
      } else if (this.previousActionsType['pedestal'].name === 'pedestalRotationRevert') {
        this.pedestalRotationRevertEnd.next(this.pedestalG);
      }
    });
    const rotationAnimation = createAnimation('.rotation[z]', 'pedestalRotation', times, values, mixer, rotationDuration);
    const rotationRevertAnimation = createAnimation('.rotation[z]', 'pedestalRotationRevert', times, valuesRevert, mixer, rotationDuration);
    Object.assign(this.getAnimationManager('pedestalRotation'), {...rotationAnimation, mixer});
    Object.assign(this.getAnimationManager('pedestalRotationRevert'), {...rotationRevertAnimation, mixer});

  }

  playTongRotation(duration = 0.2) {
    this.isPlay = true;
    this.tongRotationStart.next(this.tongG);
    this.multipleFadeToAction('tongRotation', duration, 'tong');
  }

  playTongRotationRevert(duration = 0.2) {
    this.isPlay = true;
    this.tongRotationRevertStart.next(this.tongG);
    this.multipleFadeToAction('tongRotationRevert', duration, 'tong');
  }

  playSwivelRotation(duration = 0.2) {
    this.isPlay = true;
    this.swivelRotationStart.next(this.swivelG);
    this.multipleFadeToAction('swivelRotation', duration, 'swivel');
  }

  playSwivelRotationRevert(duration = 0.2) {
    this.isPlay = true;
    this.swivelRotationRevertStart.next(this.swivelG);
    this.multipleFadeToAction('swivelRotationRevert', duration, 'swivel');
  }

  playArm2Down(duration = 0.2) {
    this.isPlay = true;
    this.arm2DownStart.next(this.arm2G);
    this.multipleFadeToAction('arm2Down', duration, 'arm2');
  }

  playArm2DownRevert(duration = 0.2) {
    this.isPlay = true;
    this.arm2DownRevertStart.next(this.arm2G);
    this.multipleFadeToAction('arm2DownRevert', duration, 'arm2');
  }

  playArm2Down2(duration = 0.2) {
    this.isPlay = true;
    this.arm2Down2Start.next(this.arm2G);
    this.multipleFadeToAction('arm2Down2', duration, 'arm2');
  }

  playArm2Down2Revert(duration = 0.2) {
    this.isPlay = true;
    this.arm2Down2RevertStart.next(this.arm2G);
    this.multipleFadeToAction('arm2Down2Revert', duration, 'arm2');
  }

  playArm2Up(duration = 0.2) {
    this.isPlay = true;
    this.arm2UpStart.next(this.arm2G);
    this.getAnimationManager('arm2Up').track.values = new Float32Array(0);
    this.multipleFadeToAction('arm2Up', duration, 'arm2');
  }

  playArm2UpRevert(duration = 0.2) {
    this.isPlay = true;
    this.arm2UpRevertStart.next(this.arm2G);
    this.multipleFadeToAction('arm2UpRevert', duration, 'arm2');
  }

  playArm1Back(duration = 0.2) {
    this.isPlay = true;
    this.arm1BackStart.next(this.arm1G);
    this.multipleFadeToAction('arm1Back', duration, 'arm1');
  }

  playArm1BackRevert(duration = 0.2) {
    this.isPlay = true;
    this.arm1BackRevertStart.next(this.arm1G);
    this.multipleFadeToAction('arm1BackRevert', duration, 'arm1');
  }

  playArm1Front(duration = 0.2) {
    this.isPlay = true;
    this.arm1FrontStart.next(this.arm1G);
    this.multipleFadeToAction('arm1Front', duration, 'arm1');
  }

  playArm1FrontRevert(duration = 0.2) {
    this.isPlay = true;
    this.arm1FrontRevertStart.next(this.arm1G);
    this.multipleFadeToAction('arm1FrontRevert', duration, 'arm1');
  }

  playArm1Front2(duration = 0.2) {
    this.isPlay = true;
    this.arm1Front2Start.next(this.arm1G);
    this.multipleFadeToAction('arm1Front2', duration, 'arm1');
  }

  playArm1Front2Revert(duration = 0.2) {
    this.isPlay = true;
    this.arm1Front2RevertStart.next(this.arm1G);
    this.multipleFadeToAction('arm1Front2Revert', duration, 'arm1');
  }

  playPedestalRotation(duration = 0.2) {
    this.isPlay = true;
    this.pedestalRotationStart.next(this.pedestalG);
    this.multipleFadeToAction('pedestalRotation', duration, 'pedestal');
  }

  playPedestalRotationRevert(duration = 0.2) {
    this.isPlay = true;
    this.pedestalRotationRevertStart.next(this.pedestalG);
    this.multipleFadeToAction('pedestalRotationRevert', duration, 'pedestal');
  }

  playWork() {
    this.workStart.next(this);
    this.playPedestalRotation();
    this.playArm1Back();
    // this.playTongRotation();
    const unSubscribe1 = zip(this.pedestalRotationEnd, this.arm1BackEnd).pipe(
      switchMap(() => {
        this.playArm1BackRevert();
        return this.arm1BackRevertEnd;
      }),
      switchMap(() => {
        this.playArm1Front();
        this.playArm2Up();
        return of('complete');
      })
    ).subscribe(() => {
      this.workEnd.next(this);
      unSubscribe1.unsubscribe();
    });
  }

  playBackWork() {
    this.workBackStart.next(this);
    this.playArm1FrontRevert();
    const unSubscribe = this.arm1FrontRevertEnd.pipe(
      switchMap(() => {
        this.playPedestalRotationRevert();
        this.playArm1Back();
        this.playArm2UpRevert();
        this.playTongRotation();
        return this.pedestalRotationRevertEnd;
      }),
      switchMap(() => {
        this.playArm1BackRevert();
        return this.arm1BackRevertEnd;
      }),
      switchMap(() => {
        this.playArm2Down2();
        this.playArm1Front2();
        this.playSwivelRotation();
        return this.swivelRotationEnd;
      }),
      switchMap(() => {
        this.playArm2Down2Revert();
        this.playArm1Front2Revert();
        this.playSwivelRotationRevert();
        this.playTongRotationRevert();
        return this.arm2Down2RevertEnd;
      })
    ).subscribe(() => {
      this.workBackEnd.next(this);
      unSubscribe.unsubscribe();
    });
  }
}
