import {Component, ElementRef, HostBinding, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';

@Component({
  selector: 'app-container-cell',
  templateUrl: './container-cell.component.html',
  styleUrls: ['./container-cell.component.scss']
})
export class ContainerCellComponent implements OnInit {


  @ViewChild('embeddedContainer', {static: true, read: ViewContainerRef}) embeddedVcr: ViewContainerRef;

  @Input()
  @HostBinding('style.flex-direction')
  flexDirection: string;

  @Input()
  @HostBinding('style.flex')
  flex: number;

  isCell = false;

  baseBoundingClientRect: DOMRect;

  constructor(
    private el: ElementRef,
  ) {
  }

  ngOnInit() {
  }

  getDomRect() {
    const {x, y} = this.baseBoundingClientRect;
    const rect: DOMRect = this.el.nativeElement.getBoundingClientRect();
    rect.x -= x;
    rect.y -= y;
    return rect;
  }

}
