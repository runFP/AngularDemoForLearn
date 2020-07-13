import {Component, ElementRef, HostBinding, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';

@Component({
  selector: 'app-root-cell',
  templateUrl: './root-cell.component.html',
  styleUrls: ['./root-cell.component.scss']
})
export class RootCellComponent implements OnInit {
  @ViewChild('embeddedContainer', {static: true, read: ViewContainerRef}) embeddedVcr: ViewContainerRef;

  @Input()
  @HostBinding('style.flex-direction')
  flexDirection: string;

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
