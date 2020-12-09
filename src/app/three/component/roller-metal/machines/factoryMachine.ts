import {BaseMachine} from './baseMachine';
import {AppendingMachine} from './appendingMachine/AppendingMachine';

export function factoryMachine(name, ...args): BaseMachine {
  if (name === 'append') {
    return new AppendingMachine(...args);
  }
}
