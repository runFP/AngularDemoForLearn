import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PickerColorService} from './picker-color.service';

@Component({
  selector: 'picker-color',
  templateUrl: './picker-color.component.html',
  styleUrls: ['./picker-color.component.scss'],
  providers: [PickerColorService],
})
export class PickerColorComponent implements OnInit {
  /** 主题颜色 */
  @Input() themeColors: string[] = [];

  /** 标准色 */
  @Input() standardColors: string[] = [];

  /** 外层样式名，用于可自定义样式 */
  @Input() wrapClass: string;

  @Input() latestColorsLen: number = 10;

  /** 记录最近颜色
   * 1.只保存latestColorsLen个数据
   * 2.若新增数据存在，将位置提到栈顶
   * */
  _lc: string[] = [];

  set latestColors(colors: string[]) {
    colors.forEach(color => {
      const idx = this._lc.indexOf(color);
      if (idx !== -1) {
        this._lc.splice(idx, 1);
        this._lc.unshift(color);
      }
      /** 保存最新颜色的个数，默认为10个 */
      if (this._lc.length + 1 > this.latestColorsLen) {
        this._lc.pop();
      }
      this._lc.push(color);
    });
  }

  get latestColors() {
    return this._lc;
  }

  @ViewChild('origin', {static: false})
  origin: TemplateRef<any>;

  isOpen = false;

  constructor() {
  }

  ngOnInit() {
  }

}
