import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OverlayModule} from '@angular/cdk/overlay';
import {ModalPlusService} from './modal-plus.service';
import {PortalModule} from '@angular/cdk/portal';
import {FlexibleSizeDirective} from './flexible-size.directive';
import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    FlexibleSizeDirective,
  ],
  imports: [
    CommonModule,
    OverlayModule,
    PortalModule,
    DragDropModule,
  ],
  exports: [
    FlexibleSizeDirective
  ],
  providers: [ModalPlusService],

})
export class ModalPlusModule {
}
