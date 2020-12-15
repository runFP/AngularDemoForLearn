import {AnimationAction, AnimationClip, AnimationMixer, Group, KeyframeTrack, LoadingManager} from 'three';

export class BaseMachine {
  group: Group;
  name: string;
  manager: LoadingManager | null;
  animationManagers: AnimationManager[] = [];
  // 是否已初始化
  isInit = false;

  // 当一个mixe有多个动画时，避免彼此干扰
  previousAction; // 上次激活动画（单类型动画）
  previousActionsType: { [type: string]: null | AnimationManager }; // 上次激活动画（多类型动画）
  activeAction; // 当前激活动画

  isPlay = false; // 当前动画播放状态
  loop = false; // 动画循环状态

  constructor(manager?: LoadingManager) {
    this.manager = manager;
  }

  init(...args): Promise<any> {
    return new Promise<any>(() => {
    });
  }

  // 根据名字获取对应动画
  protected getAnimationManager(name: string): AnimationManager {
    const matchAm = this.animationManagers.find(am => am.name === name);
    if (!matchAm) {
      throw new Error('动画管理器名字不匹配');
    }
    return matchAm;
  }

  /**
   * 单类型动画控制
   * @param name
   * @param duration
   * @protected
   */
  protected fadeToAction(name, duration) {
    this.previousAction = this.activeAction;
    this.activeAction = this.getAnimationManager(name);

    if (this.previousAction && this.previousAction.name !== this.activeAction.name) {
      this.previousAction.mixer.stopAllAction();
    }

    this.activeAction.action
      .reset()
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(1)
      .fadeIn(duration)
      .play();
  }

  /**
   * 多类型动画控制
   * @param name
   * @param duration
   * @param type
   */
  protected multipleFadeToAction(name, duration, type) {
    const previousAction = this.previousActionsType[type];
    const activeAction = this.getAnimationManager(name);
    this.activeAction = activeAction;
    this.previousActionsType[type] = activeAction;

    if (previousAction) {
      previousAction.action.fadeOut(duration);
    }

    activeAction.action.reset()
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(1)
      .fadeIn(duration)
      .play();
  }

}

export interface AnimationManager {
  name: string;
  track: KeyframeTrack;
  mixer: AnimationMixer;
  clip: AnimationClip;
  action: AnimationAction;
}
