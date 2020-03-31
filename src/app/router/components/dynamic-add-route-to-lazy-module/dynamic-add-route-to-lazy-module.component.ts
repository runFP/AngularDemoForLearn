import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CommonPageComponent} from '../common-page/common-page.component';

@Component({
  selector: 'app-dynamic-add-route-to-lazy-module',
  templateUrl: './dynamic-add-route-to-lazy-module.component.html',
  styleUrls: ['./dynamic-add-route-to-lazy-module.component.scss']
})
export class DynamicAddRouteToLazyModuleComponent implements OnInit {
  name: string;
  path: string;
  routes: { name: string, path: string }[] = [];

  constructor(private router: Router) {
  }

  ngOnInit() {
  }


  addDynamicRoute(targetModuleName: string) {
    const config = this.router.config;
    const children = getTargetModule(targetModuleName, config);
    if (Object.prototype.toString.call(children) === '[object Array]') {
      children.push({path: this.path, component: CommonPageComponent});
    }
    this.routes.push({name: this.name, path: this.path});
  }

}

function getTargetModule(name: string, routes: any[]): any[] {
  for (let r = 0, rr = routes.length; r < rr; r++) {
    if (routes[r].path === name) {
      if (!routes[r].children) {
        routes[r].children = [];
      }
      return routes[r].children;
    } else {
      if (routes[r].children || routes[r]._loadedConfig) {
        const children = routes[r].children || routes[r]._loadedConfig.routes;
        const value = getTargetModule(name, children);
        if (value) {
          return value;
        }
      }
    }
  }
}
