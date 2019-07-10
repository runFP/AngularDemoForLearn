import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSnackBarModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';

const materialModule = [
  MatSnackBarModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  FlexLayoutModule,
];


@NgModule({
  imports: [
    CommonModule,
    ...materialModule
  ],
  exports: [...materialModule]
})
export class ShareModule {
}
