import {BaseMachine} from './baseMachine';
import {AppendingMachine} from './appendingMachine/AppendingMachine';
import {MoveCutMachine} from './appendingMachine/MoveCutMachine';
import {BigPunchMachine} from './appendingMachine/BigPunchMachine';
import {No2} from './appendingMachine/No2';
import {No3} from './appendingMachine/No3';
import {No4} from './appendingMachine/No4';
import {Rail} from './other/Rail';
import {RivetingMachine} from './appendingMachine/RivetingMachine';
import {SmallCutMachine} from './appendingMachine/SmallCutMachine';
import {CarMachine} from './appendingMachine/CarMachine';
import {ClampMachine} from './appendingMachine/ClampMachine';
import {MoveBeltMachine} from './appendingMachine/MoveBeltMachine';

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
  } else if (name === 'riveting') {
    return new RivetingMachine(...args);
  } else if (name === 'smallCut') {
    return new SmallCutMachine(...args);
  } else if (name === 'car') {
    return new CarMachine(...args);
  } else if (name === 'clamp') {
    return new ClampMachine(...args);
  } else if (name === 'moveBelt') {
    return new MoveBeltMachine(...args);
  }
  console.error(`没有匹配的机器名[${name}]`);
}
