import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSnackBarModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ReactDndDirective} from './directives/react-dnd/react-dnd.directive';

const materialModule = [
  MatSnackBarModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  FlexLayoutModule,
];

const myComponents = [ReactDndDirective];


@NgModule({
  declarations: [...myComponents],
  imports: [
    CommonModule,
    ...materialModule,
  ],
  exports: [...materialModule, ...myComponents],
})
export class ShareModule {
}
