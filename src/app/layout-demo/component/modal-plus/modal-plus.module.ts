import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OverlayModule} from '@angular/cdk/overlay';
import {ModalPlusService} from './modal-plus.service';
import {FlexibleModalComponent} from './flexible-modal/flexible-modal.component';
import {PortalModule} from '@angular/cdk/portal';
import {FlexibleSizeDirective} from './flexible-size.directive';
import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    FlexibleModalComponent,
    FlexibleSizeDirective,
  ],
  imports: [
    CommonModule,
    OverlayModule,
    PortalModule,
    DragDropModule,
  ],
  providers: [ModalPlusService],
  entryComponents: [
    FlexibleModalComponent,
  ],
})
export class ModalPlusModule {
}
