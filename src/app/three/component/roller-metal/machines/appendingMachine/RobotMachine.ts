import {AnimationManager, BaseMachine} from '../baseMachine';
import {AnimationMixer, Group, LoadingManager} from 'three';
import {createAnimation, fixedObjLocalOrigin, fixedObjSingle, getObjectByProperty, loadMtlObj, MtlObjInf} from '../utils';
import {of, Subject, zip} from 'rxjs';
import {switchMap} from 'rxjs/operators';

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

  arm2DownStart = new Subject();
  arm2DownEnd = new Subject();
  arm2DownRevertStart = new Subject();
  arm2DownRevertEnd = new Subject();

  arm1BackStart = new Subject();
  arm1BackEnd = new Subject();
  arm1BackRevertStart = new Subject();
  arm1BackRevertEnd = new Subject();
  arm1FrontStart = new Subject();
  arm1FrontEnd = new Subject();
  arm1FrontRevertStart = new Subject();
  arm1FrontRevertEnd = new Subject();

  pedestalRotationStart = new Subject();
  pedestalRotationEnd = new Subject();
  pedestalRotationRevertStart = new Subject();
  pedestalRotationRevertEnd = new Subject();

  previousActionsType = {tong: null, arm2: null, arm1: null, pedestal: null};
  animationManagers: AnimationManager[] = [
    {name: 'tongRotation', track: null, action: null, clip: null, mixer: null},
    {name: 'tongRotationRevert', track: null, action: null, clip: null, mixer: null},
    {name: 'arm2Down', track: null, action: null, clip: null, mixer: null},
    {name: 'arm2DownRevert', track: null, action: null, clip: null, mixer: null},
    {name: 'arm1Back', track: null, action: null, clip: null, mixer: null},
    {name: 'arm1BackRevert', track: null, action: null, clip: null, mixer: null},
    {name: 'arm1Front', track: null, action: null, clip: null, mixer: null},
    {name: 'arm1FrontRevert', track: null, action: null, clip: null, mixer: null},
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
        this.tongG.add(tongInf.group);
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
    const rotationRate = Math.PI / 2 / rotationDuration / 10;

    for (let i = 0, j = rotationDuration * 10; i <= rotationDuration * 10; i++, j--) {
      times.push(i / 10);
      values.push(rotationRate * i);
      valuesRevert.push(rotationRate * j);
    }

    mixer.addEventListener('finished', () => {
      if (this.previousActionsType['tong'].name === 'tongRotation') {
        this.tongRotationEnd.next(this.tongG);
        console.log('tongRotationEnd');
      } else if (this.previousActionsType['tong'].name === 'tongRotationRevert') {
        this.tongRotationRevertEnd.next(this.tongG);
        console.log('tongRotationRevert');
      }
    });
    const rotationAnimation = createAnimation('.rotation[x]', 'tongRotation', times, values, mixer, rotationDuration);
    const rotationRevertAnimation = createAnimation('.rotation[x]', 'tongRotationRevert', times, valuesRevert, mixer, rotationDuration);
    Object.assign(this.getAnimationManager('tongRotation'), {...rotationAnimation, mixer});
    Object.assign(this.getAnimationManager('tongRotationRevert'), {...rotationRevertAnimation, mixer});
  }

  private initArm2Animation() {
    const times = [];
    const values = [];
    const valuesRevert = [];
    const mixer = new AnimationMixer(this.arm2G);
    const rotationDuration = 2;
    const rotationRate = Math.PI / 12 / rotationDuration / 10;

    for (let i = 0, j = rotationDuration * 10; i <= rotationDuration * 10; i++, j--) {
      times.push(i / 10);
      values.push(rotationRate * i);
      valuesRevert.push(rotationRate * j);
    }

    mixer.addEventListener('finished', () => {
      if (this.previousActionsType['arm2'].name === 'arm2Down') {
        this.arm2DownEnd.next(this.arm2G);
        console.log('arm2DownEnd');
      } else if (this.previousActionsType['arm2'].name === 'arm2DownRevert') {
        this.arm2DownRevertEnd.next(this.arm2G);
        console.log('arm2DownRevertEnd');
      }
    });
    const rotationAnimation = createAnimation('.rotation[y]', 'arm2Down', times, values, mixer, rotationDuration);
    const rotationRevertAnimation = createAnimation('.rotation[y]', 'arm2DownRevert', times, valuesRevert, mixer, rotationDuration);
    Object.assign(this.getAnimationManager('arm2Down'), {...rotationAnimation, mixer});
    Object.assign(this.getAnimationManager('arm2DownRevert'), {...rotationRevertAnimation, mixer});
  }

  private initArm1Animation() {
    const times = [];
    const values = [];
    const valuesRevert = [];

    const mixer = new AnimationMixer(this.arm1G);
    const rotationDuration = 2;
    const rotationRate = -Math.PI / 12 / rotationDuration / 10;

    for (let i = 0, j = rotationDuration * 10; i <= rotationDuration * 10; i++, j--) {
      times.push(i / 10);
      values.push(rotationRate * i);
      valuesRevert.push(rotationRate * j);
    }

    const valuesFront = values.map(v => -v);
    const valuesFrontRevert = valuesRevert.map(v => -v);

    mixer.addEventListener('finished', () => {
      if (this.previousActionsType['arm1'].name === 'arm1Back') {
        this.arm1BackEnd.next(this.arm1G);
        console.log('arm1BackEnd');
      } else if (this.previousActionsType['arm1'].name === 'arm1BackRevert') {
        this.arm1BackRevertEnd.next(this.arm1G);
        console.log('arm1BackRevertEnd');
      } else if (this.previousActionsType['arm1'].name === 'arm1Front') {
        this.arm1FrontEnd.next(this.arm1G);
        console.log('arm1FrontEnd');
      } else if (this.previousActionsType['arm1'].name === 'arm1FrontRevert') {
        this.arm1FrontRevertEnd.next(this.arm1G);
        console.log('arm1FrontRevertEnd');
      }
    });
    const backAnimation = createAnimation('.rotation[y]', 'arm1Back', times, values, mixer, rotationDuration);
    const backRevertAnimation = createAnimation('.rotation[y]', 'arm1BackRevert', times, valuesRevert, mixer, rotationDuration);
    const frontAnimation = createAnimation('.rotation[y]', 'arm1Front', times, valuesFront, mixer, rotationDuration);
    const frontRevertAnimation = createAnimation('.rotation[y]', 'arm1FrontRevert', times, valuesFrontRevert, mixer, rotationDuration);
    Object.assign(this.getAnimationManager('arm1Back'), {...backAnimation, mixer});
    Object.assign(this.getAnimationManager('arm1BackRevert'), {...backRevertAnimation, mixer});
    Object.assign(this.getAnimationManager('arm1Front'), {...frontAnimation, mixer});
    Object.assign(this.getAnimationManager('arm1FrontRevert'), {...frontRevertAnimation, mixer});

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
        console.log('pedestalRotationEnd');
      } else if (this.previousActionsType['pedestal'].name === 'pedestalRotationRevert') {
        this.pedestalRotationRevertEnd.next(this.pedestalG);
        console.log('pedestalRotationRevertEnd');
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
    this.playPedestalRotation();
    this.playArm1Back();
    this.playTongRotation();
    const unSubscribe1 = zip(this.tongRotationEnd, this.pedestalRotationEnd, this.arm1BackEnd).pipe(
      switchMap(() => {
        this.playArm1BackRevert();
        return this.arm1BackRevertEnd;
      }),
      switchMap(() => {
        this.playArm1Front();
        return of('complete');
      })
    ).subscribe(() => {
      unSubscribe1.unsubscribe();
    });
  }

  playBackWork() {

  }
}
