import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DefaultComponent} from '../layout/default/default.component';
import {RXjsModule} from '../rxjs/rxjs.module';

/**
 * 路由加载的几种方法
 * ANGULAR采用优先匹配原则,前面匹配到了，后面的就不会匹配到，因此路径越详细的应放越后面  /a 和 /a/b ,/a一定要放前面
 *
 * 根据模块来划分路由，每个模块都应该有自己的独立的routing文件
 * 这样的好处是清晰和可以拔插式的伸缩应用程序，具有良好的扩展性
 *
 *
 * 1.直接引入模块
 * 例子参考route-routing.module.ts
 * 直接import进RoutesModule中
 * 这种方法无法在其外层在加任何父路由，因为children无法引入模块
 * 好处是当你只需在根<router-outlet>的条件下呈现不同的模块时，直接在route-routing.module.ts配置即可,模块的各种依赖可
 *
 * 2.懒加载引入
 * 在route-routing.module.ts
 * 使用loadChildren字段，通过回调返回模块
 * 该方法可以在外层在嵌套父路由，同时
 *
 * */


const routes: Routes = [
  /** 匹配空路径，通常在启动的时候引导进入启动页*/
  {
    path: '', component: DefaultComponent,
    children: [
      {path: '', redirectTo: '/components/template', pathMatch: 'full'},

      /** 该模块即采用模块引入，又采用懒加载，因此2种路由都能加载到该模块
       * http://localhost:4200/AgGridDemoModule/agGrid/simple
       * http://localhost:4200/agGrid/simple
       * 以上2个路径都能匹配到，第一个包含了DefaultComponent，第二个没有
       *
       * 当把path: 'AgGridDemoModule'改为path:'',则可以http://localhost:4200/agGrid/simple访问
       * */
      {
        path: '', loadChildren: () => import('../ag-grid-demo/ag-grid-demo.module').then(m => m.AgGridDemoModule),
      },
      /**
       * angular 8.0 AOT编译模式需使用import(path).then(m=>m.module) 形式懒加载模块
       * 7.0使用的是字符串形式modulePath#module
       * */
      {
        path: '', loadChildren: () => import('../component-demo/component-demo.module').then(m => m.ComponentDemoModule),
      },
      {path: '', loadChildren: () => import('../directive-demo/directive-demo.module').then(m => m.DirectiveDemoModule)},
      {path: '', loadChildren: () => import('../rxjs/rxjs.module').then(m => m.RXjsModule)},
      {path: '', loadChildren: () => import('../layout-demo/layout-demo.module').then(m => m.LayoutDemoModule)},
      {path: '', loadChildren: () => import('../error/error.module').then(m => m.ErrorModule)},
    ],
  },
  /** 通配符要放在最后面*/
  {path: '**', redirectTo: '/components/template'}, /** 匹配任何路径，因此需要放在最后*/
];

@NgModule({
  // imports: [RouterModule.forRoot(routes, {enableTracing: true, scrollPositionRestoration: 'enabled'})],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class RouteRoutingModule {
}
