import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {PickerColorService} from './picker-color.service';

@Component({
  selector: 'picker-color',
  templateUrl: './picker-color.component.html',
  styleUrls: ['./picker-color.component.scss'],
  providers: [PickerColorService],
})
export class PickerColorComponent implements OnInit {
  /** 主题颜色 */
  @Input() themeColors: string[] = ['#ffffff', '#000000', '#eeece1', '#1f497d', '#4f81bd', '#c0504d', '#9bbb59', '#8064a2', '#4bacc6', '#f79646'];

  /** 标准色 */
  @Input() standardColors: string[] = ['#c00000', '#ff0000', '#ffc000', '#ffff00', '#92d050', '#00b050', '#00b0f0', '#0070c0', '#002060', '#7030a0'];

  /** 外层样式名，用于可自定义样式 */
  @Input() wrapClass: string;

  @Input() latestColorsLen: number = 10;

  /** 渐变色阶梯数 */
  @Input() step = 5;

  @ViewChild('origin', {static: false})
  origin: TemplateRef<any>;

  gradientColors: string[][] = [];
  isOpen = false;
  color = this.standardColors[0];

  /** 记录最近颜色
   * 1.只保存latestColorsLen个数据
   * 2.若新增数据存在，将位置提到栈顶
   * */
  private _lc: string[] = [];

  set latestColors(colors: string[]) {
    colors.forEach(color => {
      const idx = this._lc.indexOf(color);
      if (idx !== -1) {
        this._lc.splice(idx, 1);
      }
      this._lc.unshift(color);

      /** 保存最新颜色的个数，默认为10个 */
      if (this._lc.length > this.latestColorsLen) {
        this._lc.pop();
      }
    });
  }

  get latestColors() {
    return this._lc;
  }


  constructor(
    private pickerColorService: PickerColorService,
  ) {
  }

  choose(color: string) {
    this.color = color;
    this.latestColors = [color];
    this.close();
  }


  close() {
    this.isOpen = false;
  }

  ngOnInit() {
    this.themeColors.forEach(c => {
      this.gradientColors.push(this.pickerColorService.getStepColor(c, this.step));
    });
  }
}
