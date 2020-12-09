import {AnimationAction, AnimationClip, AnimationMixer, KeyframeTrack, LoadingManager} from 'three';

export class BaseMachine {
  name: string;
  manager: LoadingManager | null;
  animationManagers: AnimationManager[];

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
