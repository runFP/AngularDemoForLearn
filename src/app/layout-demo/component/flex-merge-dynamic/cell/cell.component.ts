import {AfterViewInit, Component, ElementRef, HostBinding, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnInit, AfterViewInit {

  @Input()
  @HostBinding('style.flex')
  flex: number;

  @Input()
  @HostBinding('style.background-color') bgColor: string;

  baseBoundingClientRect: DOMRect;

  isCell = true;

  constructor(
    private el: ElementRef,
  ) {
  }

  ngOnInit() {
  }


  ngAfterViewInit(): void {
  }

  getDomRect() {
    const {x, y} = this.baseBoundingClientRect;
    const rect: DOMRect = this.el.nativeElement.getBoundingClientRect();
    rect.x -= x;
    rect.y -= y;
    return rect;
  }


}
