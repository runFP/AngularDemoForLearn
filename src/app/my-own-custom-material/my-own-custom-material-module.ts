import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule, MatCheckboxModule} from '@angular/material';


/**
 * 该模块用于引入material模块，再被其他模块引入，这样其他模块无需在引入material相关模块
 * */

@NgModule({
  declarations: [],
  imports: [CommonModule, MatButtonModule, MatCheckboxModule],
  exports: [MatButtonModule, MatCheckboxModule],
})
export class MyOwnCustomMaterialModule { }
