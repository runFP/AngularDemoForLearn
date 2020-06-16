import {ComponentFactoryResolver, Directive, HostBinding, ViewContainerRef} from '@angular/core';
import {FlexMergeDynamicService} from './flex-merge-dynamic.service';

@Directive({
  selector: '[flexMergeDynamic]'
})
export class FlexMergeDynamicDirective {

  @HostBinding('style.display') display = 'flex';
  @HostBinding('style.flex-direction') direction = 'column';
  @HostBinding('style.width') width = '100%';
  @HostBinding('style.height') height = '100%';

  constructor(
    private vcr: ViewContainerRef,
    private resolve: ComponentFactoryResolver,
    private FMDService: FlexMergeDynamicService,
  ) {
  }

  create(row: number, col: number): void {
    this.FMDService.create(row, col);
    // this.container.createComponent()
  }

}
