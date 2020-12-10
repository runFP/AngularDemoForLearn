import {AnimationManager, BaseMachine} from '../baseMachine';
import {Group, LoadingManager} from 'three';
import {fixedObjLocalOrigin, loadMtlObj} from '../utils';
import {zip} from 'rxjs';

const SHRINK = 100;
const PATH = [
  {
    name: 'base',
    mtlPath: '/assets/modal/roller/移栽机-底座.mtl',
    objPath: '/assets/modal/roller/移栽机-底座.obj'
  },
  {
    name: 'vertical',
    mtlPath: '/assets/modal/roller/移栽机-上下.mtl',
    objPath: '/assets/modal/roller/移栽机-上下.obj'
  },
  {
    name: 'clamp',
    mtlPath: '/assets/modal/roller/移栽机-夹具.mtl',
    objPath: '/assets/modal/roller/移栽机-夹具.obj'
  },
  {
    name: 'translation',
    mtlPath: '/assets/modal/roller/移栽机-平移杆.mtl',
    objPath: '/assets/modal/roller/移栽机-平移杆.obj'
  },
];

export class MoveCutMachine extends BaseMachine {
  name: 'moveCut';
  // 导入的最原始的模型对象（object3D)
  base = null;
  vertical = null;
  clamp = null;
  translation = null;

  group: Group;
  // 混合/动画控制控制
  animationManagers: AnimationManager[] = [
    {name: 'vertical', track: null, action: null, clip: null, mixer: null},
  ];



  constructor(manager?: LoadingManager) {
    super(manager);
    this.group = new Group();
  }

  init(): Promise<any> {
    return new Promise<any>(resolve => {
      const allPathLoad = PATH.map(machinePath => loadMtlObj(machinePath.mtlPath, machinePath.objPath, this.manager, SHRINK));
      zip(...allPathLoad).subscribe(([base, vertical, clamp, translation]) => {
        this.base = base;
        this.vertical = vertical;
        this.clamp = clamp;
        this.translation = translation;

        const [baseG, verticalG, clampG, translationG] = fixedObjLocalOrigin([base, vertical, clamp, translation]);

        this.group.add(...fixedObjLocalOrigin([base, vertical, clamp, translation]));
      }, () => {
      }, () => {
        resolve(this);
      });
    });
  }
}
