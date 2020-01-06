import {Component, OnInit} from '@angular/core';

import {routes as agRoutes, childRoutes as agCRoutes, names as agNames} from '../../../ag-grid-demo/ag-grid-demo-routing.module';
import {
  routes as componentRoutes,
  childRoutes as componentCRoutes,
  names as componentNames
} from '../../../component-demo/component-demo-routing.module';
import {
  routes as directiveRoutes,
  childRoutes as directiveCRoutes,
  names as directiveNames
} from '../../../directive-demo/directive-demo-routing.module';
import {routes as layoutRoutes, childRoutes as layoutCRoutes, names as layoutNames} from '../../../layout-demo/layout-demo-routing.module';
import {routes as errorRoutes, childRoutes as errorCRoutes, names as errorNames} from '../../../error/error-routing.module';
import {routes as rxjsRoutes, childRoutes as rxjsCRoutes, names as rxjsNames} from '../../../rxjs/rxjs-routing.module';

let menus = [
  {path: agRoutes, children: agCRoutes, names: agNames},
  {path: componentRoutes, children: componentCRoutes, names: componentNames},
  {path: directiveRoutes, children: directiveCRoutes, names: directiveNames},
  {path: layoutRoutes, children: layoutCRoutes, names: layoutNames},
  {path: rxjsRoutes, children: rxjsCRoutes, names: rxjsNames},
  {path: errorRoutes, children: errorCRoutes, names: errorNames},
];

menus = processMenu(menus);

console.log(menus);

function processMenu(paths) {
  const processMenus = [];
  paths.forEach((menu) => {
    const m = {
      path: `/${menu.path[0].path}`,
      children: [],
      name: menu.names[0].name,
    };
    if (menu.children) {
      menu.children.forEach((childrenMenu, i) => {
        const cm = {
          path: `/${menu.path[0].path}/${childrenMenu.path}`,
          name: menu.names[0].children[i].name,
        };
        m.children.push(cm);
      });
    }
    processMenus.push(m);
  });
  return processMenus;
}


// {name:'xxx',path:'xxx', children: [{name:'xxx',path:'xxx', children: []}]}

@Component({
  selector: 'layout-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  menus: any[];

  constructor() {
  }

  ngOnInit() {
    this.menus = menus;
  }

}
