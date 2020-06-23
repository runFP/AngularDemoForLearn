import {Component, HostBinding, OnInit} from '@angular/core';
import {Point} from '../flex-merge-dynamic.directive';

@Component({
  selector: 'app-selected-range',
  templateUrl: './selected-range.component.html',
  styleUrls: ['./selected-range.component.css']
})
export class SelectedRangeComponent implements OnInit {

  @HostBinding('style.left') left: string;
  @HostBinding('style.top') top: string;
  @HostBinding('style.width') width: string;
  @HostBinding('style.height') height: string;

  constructor() {
  }

  ngOnInit(): void {
  }

  /**
   * 更新位置
   * @param {Point} p
   */
  updatePosition(p: Point) {
    this.left = `${p.x}px`;
    this.top = `${p.y}px`;
  }

  /**
   *
   * @param {Point} p1 鼠标按下位置
   * @param {Point} p2 鼠标当前位置
   */
  updateSize(p1: Point, p2: Point) {
    const width = p2.x - p1.x;
    const height = p2.y - p1.y;
    this.width = `${Math.abs(width)}px`;
    this.height = `${Math.abs(height)}px`;
    /**
     * 选择反向要偏移位置
     */
    if (width < 0) {
      this.left = `${p2.x}px`;
    } else {
      this.left = `${p1.x}px`;
    }

    if (height < 0) {
      this.top = `${p2.y}px`;
    } else {
      this.top = `${p1.y}px`;
    }
  }

  /**
   * 获取选择框的4个角坐标
   * @param {Point} p1 鼠标按下位置
   * @param {Point} p2 鼠标当前位置
   * @param {x:1|-1,y:1|-1} delta 决定选择框4个点的位置顺序
   * @return {BoundaryPoint}
   */
  public getBoundaryPoint(p1: Point, p2: Point, delta): BoundaryPoint {
    if (delta.x === -1) {
      if (delta.y === -1) {
        return {
          p1: {x: p2.x, y: p2.y},
          p2: {x: p1.x, y: p2.y},
          p3: {x: p1.x, y: p1.y},
          p4: {x: p2.x, y: p1.y},
        };
      } else {
        return {
          p1: {x: p2.x, y: p1.y},
          p2: {x: p1.x, y: p1.y},
          p3: {x: p1.x, y: p2.y},
          p4: {x: p2.x, y: p2.y},
        };
      }
    } else {
      if (delta.y === -1) {
        return {
          p1: {x: p1.x, y: p2.y},
          p2: {x: p2.x, y: p2.y},
          p3: {x: p2.x, y: p1.y},
          p4: {x: p1.x, y: p1.y},
        };
      } else {
        return {
          p1: {x: p1.x, y: p1.y},
          p2: {x: p2.x, y: p1.y},
          p3: {x: p2.x, y: p2.y},
          p4: {x: p1.x, y: p2.y},
        };
      }
    }
  }

}

export interface BoundaryPoint {
  p1: Point;
  p2: Point;
  p3: Point;
  p4: Point;
}
