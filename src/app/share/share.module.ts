import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSnackBarModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ReactDndDirective} from './directives/react-dnd/react-dnd.directive';
import {FormsModule} from '@angular/forms';

const materialModule = [
  MatSnackBarModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  FlexLayoutModule,
];

const commonModules = [FormsModule];

const myComponents = [ReactDndDirective];


@NgModule({
  declarations: [...myComponents],
  imports: [
    CommonModule,
    ...commonModules,
    ...materialModule,
  ],
  exports: [...materialModule, ...commonModules, ...myComponents],
})
export class ShareModule {
}
