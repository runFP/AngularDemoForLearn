import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OverlayModule} from '@angular/cdk/overlay';
import { ModalPlusComponent } from './modal-plus.component';
import {ModalPlusService} from './modal-plus.service';



@NgModule({
  declarations: [ModalPlusComponent],
  imports: [
    CommonModule,
    OverlayModule,
  ],
  providers: [ModalPlusService]
})
export class ModalPlusModule { }
