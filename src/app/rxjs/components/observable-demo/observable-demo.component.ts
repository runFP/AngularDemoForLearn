import {Component, OnInit} from '@angular/core';
import {fromEvent, interval, merge, Observable, of, pipe, range, Subject} from 'rxjs';
import {map, filter, scan} from 'rxjs/operators';
import {concatAll, defaultIfEmpty, delay, mergeAll, take, takeUntil, takeWhile, timeInterval} from 'rxjs/internal/operators';

@Component({
  selector: 'app-observable-demo',
  templateUrl: './observable-demo.component.html',
  styleUrls: ['./observable-demo.component.scss']
})
export class ObservableDemoComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

  // 高阶
  // concatAll等价于 concurrency 参数(最大并发数)为1的 mergeAll
  concatAll(): void {
    console.log('---------------------concatAll begin-------------------');
    console.log('concatAll把subscribe订阅后还是Observable打平，直接变成值');
    pipe(map(x => x))(of(of(1), of(2))).subscribe(x => {
      console.log('没使用concatAll之前，emit的是observable');
      console.log(x);
    });
    pipe(map(x => x), concatAll())(of(of(1), of(2))).subscribe(x => {
      console.log('使用concatAll之后，他把每一个emit的observable订阅后(subscribe)再next它的值');
      console.log(x);
    });
    console.log('------------------concatAll begin-----------------------');

    // 感受对比一下mergeAll
    /*fromEvent(document, 'click').pipe(map(x => {
      console.log('!!!');
      return interval(1000);
    }), concatAll()).subscribe(x => console.log(x));*/
  }

  // mergeAll会把每一个observable合并后打平，！！！即使是新增的observable,但concatAll不会加入新增observable，只是把第一次流进来的observable打平
  mergeAll(): void {
    fromEvent(document, 'click').pipe(map(x => {
      console.log('!!!');
      return interval(1000);
    }), mergeAll()).subscribe(x => console.log(x));
  }

  // subject
  subject(): void {
    const subject = new Subject<number>();

    subject.subscribe({
      next: (v) => console.log(`observerA: ${v}`)
    });
    subject.subscribe({
      next: (v) => console.log(`observerB: ${v}`)
    });

    subject.next(1);
    subject.next(2);

    const s1 = subject.pipe(map(x => x * 2));
    s1.subscribe({
      next: v => console.log(`after1 pipe(): ${v}`)
    });
    s1.subscribe({
      next: v => console.log(`after2 pipe(): ${v}`)
    });

    (<Subject<number>>s1).next(3);
  }

  // 创建
  rang(): void {
    // 把rang生成的每个数都往后推迟1秒
    // range(10, 10).pipe(map(x => of(x).pipe(delay(1000))), concatAll()).subscribe(x => console.log(x));
    // // 把range推迟1秒
    // range(10, 10).pipe(delay(1000)).subscribe(x => console.log(x));
    //
    // // range(10, 10).pipe(timeinterval()).subscribe(x => console.log(x));
    // const seconds = interval(1000);

    of(1).pipe(map(x => of(x * 2))).subscribe(x => console.log(x));
  }

}
