import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CdkStepper} from '@angular/cdk/stepper';
import {Directionality} from '@angular/cdk/bidi';

@Component({
  selector: 'app-custom-stepper',
  templateUrl: './custom-stepper.component.html',
  styleUrls: ['./custom-stepper.component.scss'],
  providers: [{provide: CdkStepper, useExisting: CustomStepperComponent}]
})
export class CustomStepperComponent extends CdkStepper implements OnInit, AfterViewInit {
  /** linear 线性模式意味着每个步骤的completed为true时才能继续下一步*/
  linear = true;

  constructor(_dir: Directionality, _changeDetectorRef: ChangeDetectorRef) {
    super(_dir, _changeDetectorRef);
  }

  ngOnInit() {

  }

  onClick(index: number): void {
    this.selectedIndex = index;
    console.log(this.selected, '!!!!!!!');
    console.log(this.steps, 'steps');
    console.log(this, 'steps');

  }


}
