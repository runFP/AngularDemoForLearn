import {AfterViewInit, Compiler, Component, NgModule, OnInit, ViewContainerRef} from '@angular/core';

@Component({
  selector: 'app-create-dynamic-module-and-component',
  templateUrl: './create-dynamic-module-and-component.component.html',
  styleUrls: ['./create-dynamic-module-and-component.component.scss']
})
export class CreateDynamicModuleAndComponentComponent implements OnInit, AfterViewInit {

  dynamicTmp = `<div><span (click)="show()">show</span></div>`;

  constructor(private compile: Compiler, private viewContainer: ViewContainerRef) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.createDynamic();
  }

  /**
   * 这种模式仅在JIT编译环境下生效
   * 用AOT编译会提示 ERROR Error: Runtime compiler is not loaded
   * 因为代码已经提前编译了，这时不再提供编译器
   * 还有AOT编译下，会把打包好的装饰器中内容也删除掉
   */
  createDynamic() {
    @Component({
      template: `dynamic Create component!!!`
    })
    class TemporaryComponent {

    }

    @NgModule({
      declarations: [TemporaryComponent]
    })
    class TemporaryModule {
    }

    const module = this.compile.compileModuleAndAllComponentsSync(TemporaryModule);
    const factory = module.componentFactories.find(component => {console.log(component); return component.componentType.name === 'TemporaryComponent'});

    this.viewContainer.createComponent(factory);

  }


}
