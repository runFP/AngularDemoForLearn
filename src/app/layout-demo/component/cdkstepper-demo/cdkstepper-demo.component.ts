import {Component} from '@angular/core';

@Component({
  selector: 'app-cdkstepper-demo',
  templateUrl: './cdkstepper-demo.component.html',
  styleUrls: ['./cdkstepper-demo.component.scss'],
})
export class CDKStepperDemoComponent {
  firstComplete = false;

  fisrtComplete() {
    this.firstComplete = true;
  }

  fisrtUnfinished() {
    this.firstComplete = false;
  }
}
