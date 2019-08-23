import {Component, Directive, ElementRef, Input, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Directive({selector: 'pane'})
export class Pane {
  // TODO(issue/24571): remove '!'.
  @Input() id !: string;
}

@Component({
  selector: 'app-view-child-demo',
  templateUrl: './view-child-demo.component.html',
  styleUrls: ['./view-child-demo.component.scss']
})
export class ViewChildDemoComponent {

  /** 通过read替换解析令牌，返回一个ElementRef元素 */
  @ViewChild(Pane, {read: ElementRef, static: false})
  set pane1(v) {
    console.log('pane1 is mark as ElementRef', v);
  }

  /** 由于Pane是一个指令，默认查找解析返回一个指令 */
  @ViewChild(Pane, {static: false})
  set pane(v: Pane) {
    console.log('pane is mark as default', v);
    setTimeout(() => {
      this.selectedPane = v.id;
    }, 0);
  }

  selectedPane: string = '';
  shouldShow = true;

  toggle() {
    this.shouldShow = !this.shouldShow;
  }

}
