import {BaseMachine} from './baseMachine';
import {AppendingMachine} from './appendingMachine/AppendingMachine';
import {MoveCutMachine} from './appendingMachine/MoveCutMachine';
import {BigPunchMachine} from './appendingMachine/BigPunchMachine';
import {No2} from './appendingMachine/No2';
import {No3} from './appendingMachine/No3';
import {No4} from './appendingMachine/No4';
import {RivetingMachine} from './appendingMachine/RivetingMachine';
import {SmallCutMachine} from './appendingMachine/SmallCutMachine';
import {CarMachine} from './appendingMachine/CarMachine';
import {ClampMachine} from './appendingMachine/ClampMachine';
import {MoveBeltMachine} from './appendingMachine/MoveBeltMachine';
import {LiftMachine} from './appendingMachine/LiftMachine';
import {LineSpeedMachine} from './appendingMachine/LineSpeedMachine';
import {RobotMachine} from './appendingMachine/RobotMachine';

export function factoryMachine(name, ...args): BaseMachine {
  if (name === 'Append') {
    return new AppendingMachine(...args);
  } else if (name === 'MoveCut') {
    return new MoveCutMachine(...args);
  } else if (name === 'BigPunch') {
    return new BigPunchMachine(...args);
  } else if (name === 'No2') {
    return new No2(...args);
  } else if (name === 'No3') {
    return new No3(...args);
  } else if (name === 'No4') {
    return new No4(...args);
  } else if (name === 'Riveting') {
    return new RivetingMachine(...args);
  } else if (name === 'SmallCut') {
    return new SmallCutMachine(...args);
  } else if (name === 'Car') {
    return new CarMachine(...args);
  } else if (name === 'Clamp') {
    return new ClampMachine(...args);
  } else if (name === 'MoveBelt') {
    return new MoveBeltMachine(...args);
  } else if (name === 'LiftMachine') {
    return new LiftMachine(...args);
  } else if (name === 'LineSpeedMachine') {
    return new LineSpeedMachine(...args);
  } else if (name === 'RobotMachine') {
    return new RobotMachine(...args);
  }
  console.error(`没有匹配的机器名[${name}]`);
}
