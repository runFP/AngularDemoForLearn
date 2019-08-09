import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

@Component({
  selector: 'app-change-after-it-was-change',
  templateUrl: './change-after-it-was-change.component.html',
  styleUrls: ['./change-after-it-was-change.component.scss']
})
export class ChangeAfterItWasChangeComponent implements OnInit, AfterViewInit {
  message: string = 'loading :(';

  /** 修复第一种情况的bug，方法3 */
  // message: Subject<string> = new BehaviorSubject('loading :(');

  constructor(
    /** 修复第一种情况的bug，方法4 */
    private cdr: ChangeDetectorRef
  ) {
  }

  updateMessage() {
    this.message = 'all done loading :)';
  }

  ngOnInit() {
    /** 修复第一种情况的bug，方法1 */
    // this.updateMessage();
  }

  ngAfterViewInit() {
    /** 修复第一种情况的bug，方法2 */
    // setTimeout(() => this.updateMessage());

    /** 修复第一种情况的bug，方法3 */
    // this.message.next('all done loading :)');

    /** 错误导致原因 */
    this.updateMessage();
    /** 修复第一种情况的bug，方法4 */
    // this.cdr.detectChanges();
  }
}
