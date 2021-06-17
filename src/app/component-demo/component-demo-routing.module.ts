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
import {DynamicComponentComponent} from './components/dynamic-component/dynamic-component.component';
import {DomSanitizerDemoComponent} from './components/dom-sanitizer-demo/dom-sanitizer-demo.component';
import {CreateDynamicModuleAndComponentComponent} from './components/create-dynamic-module-and-component/create-dynamic-module-and-component.component';
import {DataCreateViewComponent} from './components/data-create-view/data-create-view.component';

export const childRoutes: Routes = [
  {path: 'dataCrateView', component: DataCreateViewComponent}, // 数据创建视图，根据后台传过来的组件名字和配置更进阶的动态创建组件
  {path: 'template', component: NgTemplateComponent},
  {path: 'content', component: NgContentComponent},
  {path: 'viewChild', component: ViewChildDemoComponent},
  {path: 'form', component: FormDemoComponent},
  {path: 'dcAce', component: DynamicComponentAndCustomizeElementComponent}, // 动态组件和自定义元素比较
  {path: 'style', component: StyleDemoComponent}, // 动态组件和自定义元素比较
  {path: 'formValidator', component: FormValidatorDemoComponent}, // 动态组件和自定义元素比较
  {path: 'dynamicComponentLoad', component: DynamicComponentComponent}, // 动态组件和自定义元素比较
  {path: 'sanitizer', component: DomSanitizerDemoComponent}, // 插入templateRef
  {path: 'createModuleComponentDynamic', component: CreateDynamicModuleAndComponentComponent}, // 动态创建组件和模块
  // {path: 'text', component: TlistDemoComponent}, // 动态创建组件和模块
];

export const routes: Routes = [
  {
    path: 'components', component: HomeComponent,
    children: childRoutes,
  }
];

export const names = [
  {
    name: '组件', children: [
      {name: '数据创建视图'},
      {name: 'template'},
      {name: 'content'},
      {name: 'viewChild'},
      {name: 'form'},
      {name: '动态组件/自定义元素'},
      {name: 'style'},
      {name: 'formValidator'},
      {name: '动态加载组件'},
      {name: '动态加载模板'},
      {name: '动态创建模块组件'},
      // {name: 'text'},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DemoComponentRoutingModule {
}
