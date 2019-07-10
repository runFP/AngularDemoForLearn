import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home/home.component';
import { ObservableDemoComponent } from './components/observable-demo/observable-demo.component';
import {RxjsRoutingModule} from './rxjs-routing.module';

@NgModule({
  declarations: [HomeComponent, ObservableDemoComponent],
  imports: [
    CommonModule,
    RxjsRoutingModule
  ]
})
export class RXjsModule { }
