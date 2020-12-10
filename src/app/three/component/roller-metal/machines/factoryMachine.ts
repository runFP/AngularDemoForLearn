import {BaseMachine} from './baseMachine';
import {AppendingMachine} from './appendingMachine/AppendingMachine';
import {MoveCutMachine} from './appendingMachine/MoveCutMachine';
import {BigPunchMachine} from './appendingMachine/BigPunchMachine';
import {No2} from './appendingMachine/No2';
import {No3} from './appendingMachine/No3';
import {No4} from './appendingMachine/No4';
import {Rail} from './appendingMachine/Rail';

export function factoryMachine(name, ...args): BaseMachine {
  if (name === 'append') {
    return new AppendingMachine(...args);
  } else if (name === 'moveCut') {
    return new MoveCutMachine(...args);
  } else if (name === 'bigPunch') {
    return new BigPunchMachine(...args);
  } else if (name === 'no2') {
    return new No2(...args);
  } else if (name === 'no3') {
    return new No3(...args);
  } else if (name === 'no4') {
    return new No4(...args);
  } /*else if (name === 'rail') {
    return new Rail(...args);
  }*/
  console.error(`没有匹配的机器名[${name}]`);
}
