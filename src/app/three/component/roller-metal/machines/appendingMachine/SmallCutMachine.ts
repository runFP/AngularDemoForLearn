import {AnimationManager, BaseMachine} from '../baseMachine';
import {Group, LoadingManager} from 'three';
import {fixedObjLocalOrigin, loadMtlObj, MtlObjInf} from '../utils';
import {zip} from 'rxjs';

const SHRINK = 100;
const PATH = [
  {
    name: 'base',
    mtlPath: '/assets/modal/roller/小移栽机-上下.mtl',
    objPath: '/assets/modal/roller/小移栽机-上下.obj'
  }, {
    name: 'girder',
    mtlPath: '/assets/modal/roller/小移栽机-横梁.mtl',
    objPath: '/assets/modal/roller/小移栽机-横梁.obj'
  }, {
    name: 'pole',
    mtlPath: '/assets/modal/roller/小移栽机-杆子.mtl',
    objPath: '/assets/modal/roller/小移栽机-杆子.obj'
  }, {
    name: 'clamp',
    mtlPath: '/assets/modal/roller/小移栽机-夹具.mtl',
    objPath: '/assets/modal/roller/小移栽机-夹具.obj'
  }
];

export class SmallCutMachine extends BaseMachine {
  name: 'smallCut';
  // 导入的最原始的模型对象（object3D)
  base: MtlObjInf = null;
  girder: MtlObjInf = null;
  pole: MtlObjInf = null;
  clamp: MtlObjInf = null;

  group: Group;
  // 混合/动画控制控制
  animationManagers: AnimationManager[] = [];


  constructor(manager?: LoadingManager) {
    super(manager);
    this.group = new Group();
  }

  init(): Promise<any> {
    return new Promise<any>(resolve => {
      const allPathLoad = PATH.map(machinePath => loadMtlObj(machinePath.mtlPath, machinePath.objPath, this.manager, SHRINK));
      zip(...allPathLoad).subscribe(([base, girder, pole, clamp]) => {
        this.base = base;
        this.girder = girder;
        this.pole = pole;
        this.clamp = clamp;

        this.group.add(...fixedObjLocalOrigin([base, girder, pole, clamp]));
      }, () => {
      }, () => {
        resolve(this);
      });
    });
  }
}
