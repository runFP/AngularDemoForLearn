import {BaseMachine} from './baseMachine';
import {AppendingMachine} from './appendingMachine/AppendingMachine';
import {MoveCutMachine} from './appendingMachine/MoveCutMachine';
import {BigPunchMachine} from './appendingMachine/BigPunchMachine';
import {No2} from './appendingMachine/No2';

export function factoryMachine(name, ...args): BaseMachine {
  if (name === 'append') {
    return new AppendingMachine(...args);
  } else if (name === 'moveCut') {
    return new MoveCutMachine(...args);
  } else if (name === 'bigPunch') {
    return new BigPunchMachine(...args);
  } else if (name === 'no2') {
    return new No2(...args);
  }
  console.error(`没有匹配的机器名[${name}]`);
}
