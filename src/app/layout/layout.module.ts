import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DefaultComponent} from './default/default.component';
import {SidebarComponent} from './default/sidebar/sidebar.component';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [DefaultComponent, SidebarComponent],
  imports: [
    CommonModule,
    RouterModule,
  ]
})
export class LayoutModule {
}
