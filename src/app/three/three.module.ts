import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThreeFirstDemoComponent } from './component/three-first-demo/three-first-demo.component';
import { ThreeHomeComponent } from './home/three-home/three-home.component';
import {ThreeRoutingModule} from './three-routing.module';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [ThreeFirstDemoComponent, ThreeHomeComponent],
  imports: [
    CommonModule,
    FormsModule,
    ThreeRoutingModule,
  ]
})
export class ThreeModule { }
