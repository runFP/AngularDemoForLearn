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

  constructor(_dir: Directionality, _changeDetectorRef: ChangeDetectorRef) {
    super(_dir, _changeDetectorRef);
  }

  ngOnInit() {

  }

  onClick(index: number): void {
    this.selectedIndex = index;
    console.log(this.selected, '!!!!!!!');
    console.log(this.steps, 'steps');

  }


}
