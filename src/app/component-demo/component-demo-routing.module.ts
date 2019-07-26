import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {HomeComponent} from './home/home.component';
import {NgTemplateComponent} from './components/ng-template/ng-template.component';
import {NgContentComponent} from './components/ng-content/ng-content.component';
import {ViewChildDemoComponent} from './components/view-child-demo/view-child-demo.component';
import {FormDemoComponent} from './components/form-demo/form-demo.component';
import {DynamicComponentAndCustomizeElementComponent} from './components/dynamic-component-and-customize-element/dynamic-component-and-customize-element.component';
import {StyleDemoComponent} from './components/style-demo/style-demo.component';
import {FormValidatorDemoComponent} from './components/form-validator-demo/form-validator-demo.component';

const childRoutes: Routes = [
  {path: 'template', component: NgTemplateComponent},
  {path: 'content', component: NgContentComponent},
  {path: 'viewChild', component: ViewChildDemoComponent},
  {path: 'form', component: FormDemoComponent},
  {path: 'dcAce', component: DynamicComponentAndCustomizeElementComponent}, // 动态组件和自定义元素比较
  {path: 'style', component: StyleDemoComponent}, // 动态组件和自定义元素比较
  {path: 'formValidator', component: FormValidatorDemoComponent}, // 动态组件和自定义元素比较
];

const routes: Routes = [
  {
    path: 'components', component: HomeComponent,
    children: childRoutes,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DemoComponentRoutingModule {
}
