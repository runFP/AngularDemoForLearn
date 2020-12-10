import {AnimationAction, AnimationClip, AnimationMixer, Group, KeyframeTrack, LoadingManager} from 'three';

export class BaseMachine {
  group: Group;
  name: string;
  manager: LoadingManager | null;
  animationManagers: AnimationManager[] = [];
  // 是否已初始化
  isInit = false;

  constructor(manager?: LoadingManager) {
    this.manager = manager;
  }

  init(...args): Promise<any> {
    return new Promise<any>(resolve => {
    });
  }
}

export interface AnimationManager {
  name: string;
  track: KeyframeTrack;
  mixer: AnimationMixer;
  clip: AnimationClip;
  action: AnimationAction;
}
