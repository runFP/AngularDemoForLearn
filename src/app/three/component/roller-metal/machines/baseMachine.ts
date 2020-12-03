import {LoadingManager} from 'three';

export class BaseMachine {
  manager: LoadingManager | null;

  constructor(manager?: LoadingManager) {
    this.manager = manager;
  }
}
