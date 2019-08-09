import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home/home.component';

import {ErrorRoutingModule} from './error-routing.module';
import {ChangeAfterItWasChangeComponent} from './change-after-it-was-change/change-after-it-was-change.component';

/** material */
import {MatCardModule} from '@angular/material/card';

@NgModule({
  declarations: [HomeComponent, ChangeAfterItWasChangeComponent],
  imports: [
    CommonModule,
    ErrorRoutingModule,
    MatCardModule,
  ]
})

export class ErrorModule {
}
