import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThreeFirstDemoComponent } from './component/three-first-demo/three-first-demo.component';
import { ThreeHomeComponent } from './home/three-home/three-home.component';
import {ThreeRoutingModule} from './three-routing.module';


@NgModule({
  declarations: [ThreeFirstDemoComponent, ThreeHomeComponent],
  imports: [
    CommonModule,
    ThreeRoutingModule,
  ]
})
export class ThreeModule { }
