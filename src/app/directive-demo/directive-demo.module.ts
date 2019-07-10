import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { SimpleDirectiveComponent } from './simple-directive/simple-directive.component';
import {DirectiveDemoRoutingModule} from './directive-demo-routing.module';
import { UnlessDirective } from './simple-directive/unless.directive';

@NgModule({
  declarations: [HomeComponent, SimpleDirectiveComponent, UnlessDirective],
  imports: [
    CommonModule,
    DirectiveDemoRoutingModule,
  ]
})
export class DirectiveDemoModule { }
